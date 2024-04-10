function exists(variable){ return !(variable == "" || variable === undefined || variable === null); }
function download(url){ window.open(url, '_self'); }
function edit(id){ alert("ID: "+id); }

function onLoad(){
	let urlParam = window.location.search.substr(1);
	loadRomList(0,urlParam);
}

function loadRomList(from, romConsole)
{
	fetch('config.json')
	.then(res => res.json())
	.then(confOBJ => {
		if(romConsole=="") romConsole = confOBJ.defaultConsole;
		romConsole = romConsole.replace("console=",'');

		const grid = document.getElementById('gridList');
		grid.romConsole = romConsole; grid.from = from;
		document.getElementById('gridTitle').textContent = romConsole.toUpperCase() + " GAMES";
		grid.textContent = '';

		let consolesList = confOBJ.consoles;
		if(consolesList[romConsole] === undefined){
			alert("Console '" + romConsole + "' not found.");
			return;
		}

		fetch(consolesList[romConsole])
		.then(res => res.json())
		.then(romOBJ => {
			let romLength = romOBJ.length;
			let maxItems = confOBJ.maxItems;
			let until = from + maxItems;

			if(maxItems < 1 || until > romLength){until = romLength;}

			for(let i = from; i < until; i++){
				let rom = romOBJ[i];
				let logoInfo = [
					confOBJ.styleLogos,
					confOBJ.sitesLogos,
					confOBJ.logoThemes
					];

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

			if(!maxItems < 1){
				var buttons = document.getElementById('pagesButtons');
				buttons.textContent = '';

				let neededPages = Math.ceil(romLength / maxItems);

				for(let i = 0; i < neededPages; i++){
					let nextFrom = i*maxItems;
					let thisPage = (nextFrom == from);
					let elem = createNextButton(i+1, nextFrom, romConsole, thisPage);
					buttons.appendChild(elem);
				}

			}

		})
	})
}

function createRomItem(num, romTitle, romURL, romDescription, romRelease, logoInfo){
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

	if(romTitle == "" && romURL == "") box.classList.add('redBox');
	else if(romTitle == "" || romURL == "") box.classList.add('yellowBox');

	return box;
}

function createDownloadButton(romURL, logoInfo){
	var element = document.createElement('button');
	element.classList.add('romURL');

	var style = logoInfo[0];
	var sitesLogos = logoInfo[1];
	var logoThemes = logoInfo[2];

	if(romURL != ""){
		let website = new URL(romURL).hostname;

		if(website in sitesLogos && style){
			let logo = sitesLogos[website];
			let theme = logoThemes[logo];
			element.style.backgroundImage = "url('" + logo + "')";
			element.classList.add(theme + "Background");
		}
		else{
			element.style.backgroundImage = "url('media/download.png')";
			element.classList.add('darkBackground')
		}

		element.addEventListener('click',function(){ download(romURL) },false);
	}
	else element.addEventListener('click',function(){ alert("No download links") },false);

	return element;
}

function createEditButton(romID){
	var element = document.createElement('button');
	element.classList.add('romEdit');
	element.style.backgroundImage = "url('media/edit.png')";
	element.addEventListener('click',function(){ edit(romID) },false);

	return element;
}

function createTitleHeader(romTitle){
	var element = document.createElement('h2');
	element.classList.add('romTitle');

	if(romTitle != "") element.textContent = romTitle;
	else element.textContent = "NO TITLE";

	return element;
}

function createReleaseSpan(romRelease){
	var element = document.createElement('span');
	element.classList.add('romRelease');

	if(romRelease != "") element.textContent = romRelease;
	else{
		element.textContent = "????";
		element.classList.add('greyedOut');
	}

	return element;
}

function createDescriptionParagraph(romDescription){
	var element = document.createElement('p');
	element.classList.add('romDescription');

	if(romDescription != "") element.textContent = romDescription;
	else{
		element.textContent = "No description.";
		element.classList.add('greyedOut');
	}

	return element;
}

function createNextButton(num, from, romConsole, disabled){
	var element = document.createElement('button');
	element.textContent = num;
	element.classList.add('pageButton');
	element.addEventListener('click',function(){ loadRomList(from,romConsole) },false);

	element.disabled = disabled;
	if(disabled) element.classList.add('currentPageButton');

	return element;
}