import { download } from "/src/rom_utils.tsx";
import { edit } from "/src/rom_utils.tsx";

export default function RomItem({
	title = "NO TITLE",
	romID,
	romURL = "",
	logo = "/src/assets/download.png",
	theme = "dark",
	release = "????",
	description = "No description."
	}){

	romID.toUpperCase();
	theme.toLowerCase();

	// Box yellow / red border when missing params
	let errorBorder:string = "";
	const NOTITLE:boolean = (title == "NO TITLE" || title == "" || title == null);
	const NOURL:boolean = (romURL == "" || title == null);
	if(NOTITLE && NOURL) errorBorder = " redBox";
	else if(NOTITLE || NOURL) errorBorder = " yellowBox";

	return (
		<div className={"romItem" + errorBorder} id={romID}>

			<button
			className={"romURL " + theme+"Background"}
			style={{backgroundImage:"url('" + logo + "')"}}
			onClick={() => download(romURL)}
			/>

			<button
			className="romEdit"
			style={{backgroundImage:"url('/src/assets/edit.png')"}}
			onClick={() => edit(romID)}
			/>

			<h2 className="romTitle">{title}</h2>
			<span className={"romRelease" + (release == "????" ? " greyedOut":"")}>{release}</span>
			<p className={"romDescription" + (description == "No description." ? " greyedOut":"")}>{description}</p>
		</div>
	);
}