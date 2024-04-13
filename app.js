function exists(variable) {
	return !(variable === '' || variable === undefined || variable === null);
}

function download(url) {
	window.open(url, '_blank');
}

function edit(id) {
	alert('ROM-ID: ' + id);
}

function onLoad() {
	const urlParameters = window.location.search.substr(1);
	loadRomList(0, urlParameters);
}

function loadRomList(firstItem, consoleName) {
	fetch('config.json')
	.then(res => res.json())
	.then(configOBJ => {

		consoleName = exists(consoleName)
					? consoleName.replace('console=','')
					: configOBJ.defaultConsole;

		document.getElementById('gridTitle').textContent = consoleName + ' games:';
		const grid = document.getElementById('gridList');
		grid.consoleName = consoleName;
		grid.textContent = '';

		const consolesList = configOBJ.consoles;
		if(!exists(consolesList[consoleName])) {
			alert('Console \'' + consoleName + '\' not found.');
			return;
		}

		let stylingActive = exists(configOBJ.styleLogos)
							? configOBJ.styleLogos
							: true;
		const styling = {
			"styleLogos": stylingActive,
			"sitesLogos": (exists(configOBJ.sitesLogos) && stylingActive)
						? configOBJ.sitesLogos
						: {},
			"logoThemes": (exists(configOBJ.logoThemes) && stylingActive)
						? configOBJ.logoThemes
						: {}
		};

		fetch(consolesList[consoleName])
		.then(res => res.json())
		.then(consoleOBJ => {

			const consoleSize = consoleOBJ.length;
			const maxItems = exists(configOBJ.maxItems)
							? configOBJ.maxItems
							: 0;

			const singlePage = maxItems < 1;
			const penultimatePage = firstItem + maxItems > consoleSize;
			const lastItem = (singlePage || penultimatePage)
						? consoleSize
						: (firstItem + maxItems);

			for(let i = firstItem; i < lastItem; i++) {
				let rom = consoleOBJ[i];

				grid.appendChild(
					createRomItem(
						i + 1,
						rom.title,
						rom.link,
						rom.description,
						rom.release,
						styling
					)
				);
			}

			if(!singlePage) loadPageButtons(consoleName, consoleSize, firstItem, maxItems);
		})
	})
}

function createRomItem(num, title, link, description, release, styling) {
	const romID = document.getElementById('gridList').consoleName + '-' + num;

	var box = document.createElement('div');
	box.classList.add('romItem');
	box.id = romID;

	if(exists(link)) box.appendChild(createDownloadButton(link,styling));
	box.appendChild(createEditButton(romID));
	box.appendChild(createTitleHeader(title));
	box.appendChild(createReleaseSpan(release));
	box.appendChild(createDescriptionParagraph(description));

	if(!exists(title) && !exists(link)) box.classList.add('redBox');
	else if(!exists(title) || !exists(link)) box.classList.add('yellowBox');

	return box;
}

function createDownloadButton(link, styling) {
	var element = document.createElement('button');
	element.classList.add('downloadButton');

	if(!exists(link)) {
		element.addEventListener('click', function missingLinkAlert(){alert('No download links')}, false);
		return element;
	}

	element.addEventListener('click', function downloadItem(){download(link)}, false);

	let website = new URL(link).hostname;
	if(styling.styleLogos && website in styling.sitesLogos) {
		let logo = styling.sitesLogos[website];
		let theme = styling.logoThemes[logo];

		element.style.backgroundImage =' url(\'' + logo + '\')';
		element.classList.add(theme + 'Background');
	}
	else {
		element.style.backgroundImage = 'url(\'media/download.png\')';
		element.classList.add('darkBackground');
	}

	return element;
}

function createEditButton(id) {
	var element = document.createElement('button');
	element.classList.add('editButton');

	element.style.backgroundImage = 'url(\'media/edit.png\')';
	element.addEventListener('click', function editItem(){edit(id)}, false);

	return element;
}

function createTitleHeader(title) {
	var element = document.createElement('h2');
	element.classList.add('itemTitle');

	if(exists(title)) element.textContent = title;
	else element.textContent = 'NO TITLE';

	return element;
}

function createReleaseSpan(release) {
	var element = document.createElement('span');
	element.classList.add('itemRelease');

	if(exists(release)) element.textContent = release;
	else {
		element.textContent = '????';
		element.classList.add('greyedOut');
	}

	return element;
}

function createDescriptionParagraph(description) {
	var element = document.createElement('p');
	element.classList.add('itemDescription');

	if(exists(description)) element.textContent = description;
	else {
		element.textContent = 'No description.';
		element.classList.add('greyedOut');
	}

	return element;
}

function loadPageButtons(consoleName, consoleSize, activeFirstItem, maxItems) {
	const neededPages = Math.ceil(consoleSize / maxItems);

	var pages = document.getElementById('pagesButtons');
	pages.textContent = '';

	for(let i = 0; i < neededPages; i++) {
		let btnFirstItem = i * maxItems;
		let pageActive = (btnFirstItem === activeFirstItem);

		pages.appendChild(createPageButton(i + 1, btnFirstItem, consoleName, pageActive));
	}
}

function createPageButton(num, from, consoleName, disabled) {
	var element = document.createElement('button');
	element.classList.add('pageButton');

	element.addEventListener('click', function loadNewPage(){loadRomList(from,consoleName)}, false);
	element.disabled = disabled;
	element.textContent = num;

	if(disabled) element.classList.add('currentPageButton');

	return element;
}