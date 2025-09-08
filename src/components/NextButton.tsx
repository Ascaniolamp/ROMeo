import { loadRomList } from "/src/rom_utils.tsx";

export default function NextButton({
	number,
	from,
	disabled,
	romConsole
	}){

	return (
		<button
		className={"pageButton" + (disabled ? " currentPageButton":"")}
		onClick={() => loadRomList(from, romConsole)}
		disabled={disabled}
		>
			{number}
		</button>
	);
}