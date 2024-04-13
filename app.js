function exists(variable) {
	return !(variable === "" || variable === undefined || variable === null);
}

function download(url) {
	window.open(url, '_self');
}

function edit(id) {
	alert("ID: "+id);
}

function onLoad() {
	let urlParam = window.location.search.substr(1);
	loadRomList(0,urlParam);
}

function loadRomList(from, romConsole) {
	fetch('config.json')
	.then(res => res.json())
	.then(configOBJ => {

		romConsole = exists(romConsole) ? romConsole.replace("console=",'') : configOBJ.defaultConsole;

		const grid = document.getElementById('gridList');
		grid.romConsole = romConsole;
		grid.from = from;
		document.getElementById('gridTitle').textContent = romConsole.toUpperCase() + " GAMES";
		grid.textContent = '';


		const consolesList = configOBJ.consoles;
		if(!exists(consolesList[romConsole])) {
			alert("Console '" + romConsole + "' not found.");
			return;
		}

		fetch(consolesList[romConsole])
		.then(res => res.json())
		.then(consoleOBJ => {

			const consoleSize = consoleOBJ.length;
			const maxItems = exists(configOBJ.maxItems) ? configOBJ.maxItems : 0;
			const until = (maxItems < 1 || from + maxItems > consoleSize) ? consoleSize : (from + maxItems);

			const logoInfo = {
				"styleLogos": exists(configOBJ.styleLogos) ? configOBJ.styleLogos : true,
				"sitesLogos": (exists(configOBJ.sitesLogos) && exists(configOBJ.styleLogos)) ? configOBJ.sitesLogos : {},
				"logoThemes": (exists(configOBJ.logoThemes) && exists(configOBJ.styleLogos)) ? configOBJ.logoThemes : {}
			};

			for(let i = from; i < until; i++) {
				let rom = consoleOBJ[i];

				let elem = createRomItem(
					i+1,
					rom.title,
					rom.link,
					rom.description,
					rom.release,
					logoInfo
				);

				grid.appendChild(elem);
			}

			if(maxItems >= 1) {
				var buttons = document.getElementById('pagesButtons');
				buttons.textContent = '';

				const neededPages = Math.ceil(consoleSize / maxItems);

				for(let i = 0; i < neededPages; i++) {
					let nextFrom = i * maxItems;
					let thisPage = (nextFrom == from);

					let elem = createNextButton(i+1, nextFrom, romConsole, thisPage);
					buttons.appendChild(elem);
				}
			}

		})
	})
}

function createRomItem(num, romTitle, romURL, romDescription, romRelease, logoInfo) {
	const romID = document.getElementById('gridList').romConsole + "-" + num;
	var box = document.createElement('div');
	box.classList.add('romItem');
	box.id = romID;

	var element;
	element = createDownloadButton(romURL,logoInfo); box.appendChild(element);
	element = createEditButton(romID); box.appendChild(element);
	element = createTitleHeader(romTitle); box.appendChild(element);
	element = createReleaseSpan(romRelease); box.appendChild(element);
	element = createDescriptionParagraph(romDescription); box.appendChild(element);

	if(!exists(romTitle) && !exists(romURL)) box.classList.add('redBox');
	else if(!exists(romTitle) || !exists(romURL)) box.classList.add('yellowBox');

	return box;
}

function createDownloadButton(romURL, logoInfo) {
	var element = document.createElement('button');
	element.classList.add('romURL');

	if(exists(romURL)) {
		let website = new URL(romURL).hostname;

		if(logoInfo.styleLogos && website in logoInfo.sitesLogos) {
			let logo = logoInfo.sitesLogos[website];
			let theme = logoInfo.logoThemes[logo];

			element.style.backgroundImage = "url('" + logo + "')";
			element.classList.add(theme + "Background");
		}
		else {
			element.style.backgroundImage = "url('media/download.png')";
			element.classList.add('darkBackground');
		}

		element.addEventListener('click',function(){ download(romURL) },false);
	}
	else element.addEventListener('click',function(){ alert("No download links") },false);

	return element;
}

function createEditButton(romID) {
	var element = document.createElement('button');
	element.classList.add('romEdit');
	element.style.backgroundImage = "url('media/edit.png')";
	element.addEventListener('click',function(){ edit(romID) },false);

	return element;
}

function createTitleHeader(romTitle) {
	var element = document.createElement('h2');
	element.classList.add('romTitle');

	if(exists(romTitle)) element.textContent = romTitle;
	else element.textContent = "NO TITLE";

	return element;
}

function createReleaseSpan(romRelease) {
	var element = document.createElement('span');
	element.classList.add('romRelease');

	if(exists(romRelease)) element.textContent = romRelease;
	else {
		element.textContent = "????";
		element.classList.add('greyedOut');
	}

	return element;
}

function createDescriptionParagraph(romDescription) {
	var element = document.createElement('p');
	element.classList.add('romDescription');

	if(exists(romDescription)) element.textContent = romDescription;
	else {
		element.textContent = "No description.";
		element.classList.add('greyedOut');
	}

	return element;
}

function createNextButton(num, from, romConsole, disabled) {
	var element = document.createElement('button');
	element.textContent = num;
	element.classList.add('pageButton');
	element.addEventListener('click',function(){ loadRomList(from,romConsole) },false);

	element.disabled = disabled;
	if(disabled) element.classList.add('currentPageButton');

	return element;
}
