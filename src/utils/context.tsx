import React from 'react';
import {createContext} from 'react';
import {Outlet} from "react-router-dom";
import {typeShipViewer,typeShipLink,typeLevel,typeEdition,typeEditionData,typeShipData} from './../types';
import {Menu} from './../structure/menu';
import {Footer} from './../structure/footer';

export interface SVContext {
	constants:undefined | {editions:typeEdition[],weaponArcs:string[],missileTypes:{Name:string,Range:number,Traits:string}[],traitNames:string[]},
	shipViewerData:undefined | typeShipViewer,
	shipEditionLoad:undefined | React.FunctionComponent,
	shipDataLoad:undefined | React.FunctionComponent,
	fleetGet:undefined | React.FunctionComponent,
	fleetAdd:undefined | React.FunctionComponent,
	fleetDelete:undefined | React.FunctionComponent,
	setOldStyle:undefined | React.FunctionComponent,
	oldStyle:boolean
};

export const ShipViewerContext=createContext<SVContext>({
	constants:undefined,
	shipViewerData:undefined,
	shipEditionLoad:undefined,
	shipDataLoad:undefined,
	fleetGet:undefined,
	fleetAdd:undefined,
	fleetDelete:undefined,
	setOldStyle:undefined,
	oldStyle:false
});

export const ShipViewerLayout = () => {
	return (
		<ShipViewerProvider>
			<Menu />
			<Outlet />
			<Footer />
		</ShipViewerProvider>
	)
}

export function ShipViewerProvider({children}:any) {
	// Constants
	const constants={
		editions:[
			{Name:'PP',Description:'Powers And Principalities'},
			{Name:'2e',Description:'2nd Edition'},
			{Name:'AR',Description:'Armageddon'},
			{Name:'DW',Description:'Dilgar War'},
			{Name:'DR',Description:'Darkness Rising'}
		],
		weaponArcs:[
			'Boresight',
			'Forward',
			'Port',
			'Starboard',
			'Aft',
			'Boresight Aft',
			'Turret'
		],
		missileTypes:[
			{Name:'',Range:30,Traits:'P/SAP/'},
			{Name:'(F)',Range:20,Traits:'AP/DD/P/'},
			{Name:'(H)',Range:10,Traits:'TD/SAP/'},
			{Name:'(AF)',Range:15,Traits:''},
			{Name:'(LR)',Range:40,Traits:'AP/P/'},
			{Name:'(MW)',Range:30,Traits:'AP/P/'},
			{Name:'(HA)',Range:15,Traits:'SAP/'}
		],
		traitNames:{
			A:'Accurate',
			AP:'AP',
			B:'Beam',
			DD:'Double Damage',
			EM:'Energy Mine',
			MB:'Mini-Beam',
			MD:'Mass Driver',
			OS:'One Shot',
			OB:'Orbital Bomb',
			P:'Precise',
			QD:'Quad Damage',
			SAP:'Super AP',
			SL:'Slow-Loading',
			SLs:'Slow-Loading *',
			TD:'Triple Damage',
			TL:'Twin-Linked',
			W:'Weak',
			VB:'Virus Bomb',
			GS:'Gravitic Shifter'
		}
	};

	// Set up the ship data
	const [shipViewerData,setShipViewerData]=React.useState<typeShipViewer>({Editions:[],Ships:[]});

	// Download an edition list
	const shipEditionLoad=(EditionName:string) => {
		if(shipViewerData.Editions?.some((shipList:typeEditionData) => shipList.EditionName===EditionName)) return;
		GetApiData('GetShipList.php',{Source:EditionName},{} as HTMLFormElement,shipEditionAdd,{EditionName});
	}
	// Add edition list to the context object
	const shipEditionAdd=(body:any,params:any) => {
		if(body.error) {
			const newEdition:typeEditionData={...params,ErrorMessage:body.error,Sources:[],Levels:[],Races:[],ShipLinks:[]}
			setShipViewerData({Ships:shipViewerData.Ships,Editions:[...shipViewerData.Editions,newEdition]});
			return;
		}
		const newEdition:typeEditionData={...params,Sources:[],Levels:[],Races:[],ShipLinks:[]};
		if(body.Levels) newEdition.Levels=body.Levels;
		newEdition.Levels.sort((a:typeLevel,b:typeLevel) => a.LevelID>b.LevelID ? 1 : -1);
		if(body.Races) newEdition.Races=body.Races;
		newEdition.Races.sort((a:any,b:any) => a.RaceName==='Ancients' ? 1 : a.RaceName>b.RaceName ? 1 : -1);
		if(body.Ships) newEdition.ShipLinks=body.Ships;
		newEdition.ShipLinks.sort((a:any,b:any) => a.ShipName>b.ShipName ? 1 : -1);
		const sourceSet=new Set(body.Ships.map((ship:typeShipLink) => ship.Source));
		if(params.EditionName==="PP") {
			sourceSet.delete('2e');
		 	sourceSet.delete('P&P');
		 	sourceSet.add(['2e','P&P']);
		}
		if(params.EditionName==="AR" || params.EditionName==="2e") {
		 	let newSourcesArray=Array.from(sourceSet);
		 	sourceSet.clear();
		 	sourceSet.add(newSourcesArray);
		}
		sourceSet?.forEach((s:any) => newEdition.Sources.push(s));
		newEdition.Sources.sort((a:any,b:any) => typeof(a)==='object' ? -1 : a>b ? 1 : -1);
		setShipViewerData({Ships:shipViewerData.Ships,Editions:[...shipViewerData.Editions,newEdition]});
	}

	// Download a ship's stats
	const shipDataLoad=(Edition:string,shipID:number) => {
		if(shipViewerData.Ships?.some((shipData:typeShipData) => shipData.Edition===Edition && shipData.ShipID===shipID)) return;
		GetApiData('GetShipStats.php',{Source:Edition,ShipID:shipID},{} as HTMLFormElement,shipDataAdd,{Edition,ShipID:shipID});
	}
	// Add the ship's stats to the context object
	const shipDataAdd=(body:any,params:any) => {
		if(body.error) {
			const newShip:typeShipData={...params,ErrorMessage:body.error};
			setShipViewerData({Editions:shipViewerData.Editions,Ships:[...shipViewerData.Ships,newShip]});
			return;
		}
		const newShip:typeShipData={...body.Ship,...params};
		setShipViewerData({Editions:shipViewerData.Editions,Ships:[...shipViewerData.Ships,newShip]});
	}

	// Options
	const [oldStyle,setOldStyle]=React.useState(false);

	// Fleet data and functions
	const [currentFleet,setCurrentFleet]=React.useState('');
	const fleetGet=(edition:string) => {
		const fleet=window.localStorage.getItem('Fleet-'+edition);
		return fleet ? fleet.split(',').map((d:string) => parseInt(d)) : [];
	};
	const fleetSave=(edition:string,fleetList:number[]) => {
		window.localStorage.setItem('Fleet-'+edition,fleetList.join());
	}
	const fleetAdd=(edition:string,shipIDs:number[]) => {
		const fleetShips=fleetGet(edition);
		shipIDs.forEach((shipID:number) => {
			if(!fleetShips.some((sID:number) => sID===shipID)) fleetShips.push(shipID);
		})
		fleetSave(edition,fleetShips);
		setCurrentFleet(fleetShips.join());
	};
	const fleetDelete=(edition:string,shipID:number) => {
		let fleetShips=fleetGet(edition);
		fleetShips=fleetShips.filter((ship:number) => ship===shipID ? false : true);
		fleetSave(edition,fleetShips);
		setCurrentFleet(fleetShips.join());
	};

	// Variables to provide
	const dataShipViewer:any={constants,shipViewerData,shipEditionLoad,shipDataLoad,fleetGet,fleetAdd,fleetDelete,oldStyle,setOldStyle};
	return <ShipViewerContext.Provider value={dataShipViewer}>{children}</ShipViewerContext.Provider>;
}

export function GetApiData(endpoint:string,postData:any,form:HTMLFormElement,handleData:any,params:any) {
	const API_ROOT:string=window.location.hostname==="localhost" ? "http://127.0.0.1:83/" : window.location.hostname==="192.168.1.20" ? "http://192.168.1.20:83/" : "https://acta.great-site.net/api/";
	const controller=new AbortController();									// Create a controller to abort the fetch if it is cancelled
	let body=Object.keys(form).length>0 ? new FormData(form) : new FormData();				// Make form data if a form is provided
	postData && Object.keys(postData).forEach((key:any) => body.append(key,postData[key]));			// Add all items from the postData object
	let fetchOpts:any={method:"post",body,signal:controller.signal};					// Make an object for the fetch options
	fetch(API_ROOT+endpoint,fetchOpts)									// Make fetch request
	.then(response => response.ok ? response.json() : {error:response.status+" "+response.statusText})	// Return the JSON or error message from the fetch
	.then(data => handleData(data,params))									// If successful, handle the data
	.catch(error => {if(error.name!=="AbortError") handleData({error:error.message},params)});		// If error, only handle the data if the request wasn't aborted
	return () => controller.abort();									// Return a function to cancel the fetch
}
