import React from 'react';
import {useSearchParams,Link} from "react-router-dom";
import {ShipViewerError} from './../structure/error';
import {ShipViewerContext,SVContext} from './../utils/context';
import {LoadingBox} from './../structure/loadingbox';
import {typeShipLink,typeLevel,typeEditionData,typeEdition,typeRace} from './../types';

function ShipLink(props:{shipLink:typeShipLink,auxCraft:number[],edition:string}) {
		let shipIDlink="";
	if(props.shipLink.SheetType===3) {
		shipIDlink=props.auxCraft.filter((c:number) => c!==props.shipLink.ShipID).join(",");
		if(shipIDlink!=="") shipIDlink=","+shipIDlink;
	}
	shipIDlink=props.shipLink.ShipID+shipIDlink;
	return (
		<>
			<Link to={'/ship?edition='+props.edition+'&ShipID='+shipIDlink} className={'ship-link-'+props.shipLink.SheetType}>
				{props.shipLink.ShipName} {props.shipLink.PerWing ? '('+props.shipLink.PerWing+')' : null}
			</Link>
			<br />
		</>
	)
}

function LevelTable(props:{shipLinks:typeShipLink[],level:typeLevel,edition:string,auxCraft:number[]}) {
	if(props.shipLinks.length===0) return (<div></div>);
	return (
		<div>
			<div className="shipindex-levelsinline"><b>{props.level.LevelName}</b></div>
			{props.shipLinks?.map((ship:typeShipLink) => <ShipLink key={ship.ShipID} edition={props.edition} shipLink={ship} auxCraft={props.auxCraft} />)}
		</div>
	)
}

function LevelTableAncients(props:{shipLinks:typeShipLink[],edition:string,auxCraft:number[]}) {
	return (
		<>
			<div></div>
			<div>
				{props.shipLinks?.map((ship:typeShipLink) => <ShipLink key={ship.ShipID} edition={props.edition} shipLink={ship} auxCraft={props.auxCraft} />)}
			</div>
			<div></div>
		</>
	)
}

function RaceTable(props:{shipLinks:typeShipLink[],edition:string,race:typeRace}) {
	const SVC:SVContext=React.useContext(ShipViewerContext);
	const shipLevels=SVC.shipViewerData?.Editions.find((ed:typeEditionData) => ed.EditionName===props.edition)?.Levels;
	const auxCraft:number[]=[];
	props.shipLinks.forEach((ship:typeShipLink) => {if(ship.SheetType===3) auxCraft.push(ship.ShipID)});
	return (
		<>
			<div className={"shipindex-levels"+(props.race.RaceName==='Ancients' ? " ancients" : "")}>
				{props.race.RaceName==='Ancients' ?
					<LevelTableAncients edition={props.edition} shipLinks={props.shipLinks} auxCraft={auxCraft} />
				: shipLevels?.filter((level:typeLevel) => level.LevelID<7).map((level:any) => (
					<LevelTable key={level.LevelID} edition={props.edition} level={level} shipLinks={props.shipLinks.filter((ship:any) => ship.ShipLevel===level.LevelID)} auxCraft={auxCraft} />
				))}
			</div>
		</>
	)
}

function SourceTable(props:{index:number,source:string|string[],showSupplemental:boolean,edition:string,shipList:any,setShowSupplemental:any}) {
	return (
		<div className={"SourceTable"+(props.index===0 ? "" : "-supplemental")} style={{textAlign:"center",display:props.index===0 ? "block" : props.showSupplemental ? "block" : "none"}}>
			{props.index!==0 ? <h1><br />{props.source}</h1> : null}
			{props.shipList.Races.map((race:any) =>
				props.shipList.ShipLinks.some((ship:typeShipLink) => ship.RaceID===race.RaceID && props.source.includes(ship.Source)) ?
					<React.Fragment key={race.RaceID}>
						<h3>{race.RaceName}</h3>
						<RaceTable edition={props.edition} race={race} shipLinks={props.shipList.ShipLinks.filter((ship:typeShipLink) => ship.RaceID===race.RaceID && props.source.includes(ship.Source))} />
					</React.Fragment>
				: <React.Fragment key={race.RaceID}></React.Fragment>

			)}
			{props.index===0 && props.edition==="PP" && !props.showSupplemental ? <button type="button" style={{margin:"1rem",padding:"0.7rem 2rem"}} onClick={() => props.setShowSupplemental(true)}>Show supplemental ships</button> : ""}
		</div>
	)
}

export function ShowList() {
	const [edition,setEdition]=React.useState<string>('');
	const [searchParams]=useSearchParams();
	const [showSupplemental,setShowSupplemental]=React.useState(false);
	const SVC:SVContext=React.useContext(ShipViewerContext);

	// Check we have an edition: if not, get it from the URL
	if(edition==='' && searchParams.get('edition')) setEdition(searchParams.get('edition') || '');
	if(edition==='' || !SVC.constants?.editions.some((e) => e.Name===edition)) return <ShipViewerError message={'Please select an edition'} />
	const shipList=SVC.shipViewerData?.Editions.find((ed:typeEditionData) => ed.EditionName===edition);
	if(!shipList) return (<LoadingBox />);
	if(shipList.ErrorMessage) return (<ShipViewerError message={shipList.ErrorMessage} />);

	return (<>
		<div className='ship-list container'>
			<div className='shipindex-races'>
				<h1>{SVC.constants.editions.find((e:typeEdition) => e.Name===edition)?.Description}</h1>
				<div style={{textAlign:"center"}}>
					<h2><span style={{backgroundColor:"#f00",padding:"0 1rem"}}>Important instructions</span></h2>
					<p>If your sheets print in black and white and don't display the damage tracks correctly, you need to enable background colour printing.</p>
					<p><b>Chrome</b>: When you select "Print", click "More settings" on the right. Tick the box "Background graphics".</p>
					<p><b>Edge</b>: When you select "Print", click "More settings" on the left. Tick the box "Background graphics".</p>
					<p><b>Firefox</b>: When you select "Print", the settings on the right has an option "Print backgrounds" at the bottom. Tick it.</p>
					<br />
				</div>
				<div className="shipindex-levels levelnames">{shipList.Levels?.filter((level:any) => level.LevelID<7).map((level:any) => <div key={level.LevelID}><b>{level.LevelName}</b></div>)}</div>
				{shipList.Sources?.map((source:string|string[],index:number) => (
					<SourceTable key={index} edition={edition} source={source} shipList={shipList} index={index} showSupplemental={showSupplemental} setShowSupplemental={setShowSupplemental} />
				))}
			</div>
		</div>
	</>)
}
