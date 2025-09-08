export function getUrlParams():string{
	return window.location.search.substr(1);
}

export function getUrlConsole():string{
	return (getUrlParams().match('console=[A-z]*')+'').replace('console=','').toUpperCase();
}

export function stringExists(str:string):boolean{ return !(str == "" || str == undefined || str == null); }

export function loadRomList(from:number, romConsole:string){
	// if(!stringExists(romConsole)) romConsole = config.defaultConsole;
	alert("FROM: "+from+" CONSOLE: "+romConsole);
}

export function download(romURL:string){
	window.open(romURL, '_self');
}

export function edit(romID:string){
	alert("ID: " + romID);
}