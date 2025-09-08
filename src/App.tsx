import { useState } from 'react'
import './App.css'

import { getUrlParams } from './rom_utils.tsx'
import { getUrlConsole } from './rom_utils.tsx'
import { loadRomList } from './rom_utils.tsx'

import RomItem from './components/RomItem.tsx'
import NextButton from './components/NextButton.tsx'

const config = {
	"defaultConsole":"PS3",
	"maxItems":9,

	"styleLogos":true,
	"sitesLogos":{
		"vimm.net":"/src/assets/vimm.png",
		"archive.org":"/src/assets/archive.png"
	},
	"logoThemes":{
		"/src/assets/vimm.png":"dark",
		"/src/assets/archive.png":"light"
	},

	"consoles":{
		"PSP":"res/PSP.json",
		"PSX":"res/PSX.json",
		"PS3":"res/PS3.json",
		"NDS":"res/NDS.json"
	}
}

const test_rom = {
	"title":"Amazing Spider-Man 2, The",
	"link":"https://vimm.net/vault/85907",
	"description":"Bellissimo gioco!"
}

export default function App(){
	//loadRomList(0,getUrlConsole());

	return (<>
		<div className="gridList">
			<RomItem
				title = {test_rom.title}
				romID = {config.defaultConsole + "-1"}
				romURL = {test_rom.link}
				logo = {(config.styleLogos ? config.sitesLogos["vimm.net"] : undefined)}
				theme = {(config.styleLogos ? config.logoThemes["/public/vimm.png"] : undefined)}
				release = {test_rom.release}
				description = {test_rom.description}
			/>
			<RomItem
				title = "Testazzo diddio"
				romID = "MUCCAEPPOLLO"
				romURL = "#"
			/>
		</div>

		<div id="pagesButtons">
			<NextButton number={1} from={10} romConsole="PS3" disabled/>
			<NextButton number={2} from={20} romConsole="PS3"/>
			<NextButton number={3} from={30} romConsole="PS3"/>
		</div>
	</>);
}