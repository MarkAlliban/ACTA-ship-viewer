import React from 'react';
import {useSearchParams,useNavigate} from "react-router-dom";
import {typeEdition,typeShipData,typeWeapon,typeCraft,typeEditionData} from "./../types";
import {ShipViewerError} from './../structure/error';
import {LoadingBox} from './../structure/loadingbox';
import {ShipViewerContext} from './../utils/context';

function ShowCraft(props:any) {
	const [shipCraft,setShipCraft]=React.useState({loaded:false,craftList:[]});
	const [showSwapTable,setSwapTable]=React.useState(false);

	// // After rendering, submit the types of fighters in use to the fleet window
	// React.useEffect(() => {
	// 	if(props.setFighters && !shipCraft.submitted && props.shipStats.RaceName!=="Drakh") {
	// 		if(debug) console.log("ShowCraft: ",props.shipStats.RaceName);
	// 		setShipCraft({...shipCraft,submitted:true});
	// 		props.setFighters(props.id,shipCraft.craftList.filter(craft => craft.Assigned>0).map(craft => craft.ShipID));
	// 	}
	// },[props,shipCraft]);
	// Check for "Huge hangars" trait (Drakh)
	const indexHugeHangars=props.shipStats.Traits.map((trait:string) => trait.substring(0,12).toLowerCase()).indexOf("huge hangars");
	// Add to it, the list of all fighters that race has, that can be swapped in
	if(!shipCraft.loaded) {
		// Make a list of fighters the ship has
		let newShipCraft=props.shipStats.Craft ? {loaded:true,craftList:JSON.parse(JSON.stringify(props.shipStats.Craft))} : {loaded:true,craftList:[]};
		newShipCraft.craftList.forEach((craft:typeCraft) => craft.Assigned=craft.Number);
		// Add the fleet's other fighters
		props.shipStats.AllFighters.forEach((fighter:typeCraft) => {
			// Check if it's already in the list
			const i=newShipCraft.craftList.map((craft:typeCraft) => craft.Name).indexOf(fighter.Name);
			if(i>=0) {
				// Already in the list: update
				newShipCraft.craftList[i].ShipID=fighter.ShipID;
				newShipCraft.craftList[i].SwapOut=fighter.SwapOut;
				newShipCraft.craftList[i].SwapIn=fighter.SwapIn;
				newShipCraft.craftList[i].Source=fighter.Source;
				if(indexHugeHangars>-1) newShipCraft.craftList[i].Price=fighter.Price;
			} else if(fighter.SwapIn) {
				// Not in the list: add
				newShipCraft.craftList.push({ShipID:fighter.ShipID,Name:fighter.Name,Number:0,SwapOut:fighter.SwapOut,SwapIn:fighter.SwapIn,Source:fighter.Source,Assigned:0,Price:fighter.Price});
			}
		});
		setShipCraft(newShipCraft);
		if(indexHugeHangars>-1) setSwapTable(true);
	}
	if(!shipCraft.loaded) return (<></>);

	const craftSwappable=indexHugeHangars>-1 ? props.shipStats.Traits[indexHugeHangars].substring(12,20) : shipCraft.craftList.reduce((total:number,craft:typeCraft) => craft.SwapOut ? total+craft.Number : total,0);
	const craftTotal=indexHugeHangars>-1 ? props.shipStats.Traits[indexHugeHangars].substring(12,20) : shipCraft.craftList.reduce((total:number,craft:typeCraft) => total+craft.Number,0);
	const craftAssigned=shipCraft.craftList.reduce((total:number,craft:typeCraft) => indexHugeHangars>-1 && craft.Name==="Atas'da Breaching Pod" ? total : total+(craft.Assigned===undefined ? 0 : craft.Assigned)*(craft.Price || 1),0);
	const craftRemaining=craftTotal-craftAssigned;
	if(craftSwappable===0)
		return (
			<tr><td>Craft</td><td>
				{shipCraft.craftList.filter((craft:typeCraft) => craft.Assigned>0).map((craft:typeCraft,i:number) => <div key={i}>{craft.Name} ({craft.Number})</div>)}
			</td></tr>
		)
	else
		return (
			<>
				<tr>
					<td>Craft</td>
					<td className="fighter-link" onClick={() => setSwapTable(true)}>
						{shipCraft.craftList.filter((craft:typeCraft) => craft.Assigned>0).map((craft:typeCraft,i:number) => (
	 						<div key={i}>{craft.Name} ({craft.Assigned})</div>
		 				))}
		 				{!shipCraft.craftList.some((craft:typeCraft) => craft.Assigned>0) ? <div style={{textDecoration:"underline",textDecorationColor:"#f00"}}>Click here to assign {indexHugeHangars===-1 ? "fighters" : "raiders"}</div> : ""}
					</td>
				</tr>
	 			<tr>
					<td colSpan={2}>
						<div className="fighter-select noprint" style={{display:showSwapTable ? "block" : "none",textAlign:"center"}}>
							{craftRemaining===0 ? <p>All craft assigned</p> : craftRemaining>0 ? <p className="text-red">You have {craftRemaining} craft left to assign</p> : <p className="text-red">Please remove {-craftRemaining} craft</p>}
							{shipCraft.craftList.map((craft:typeCraft,i:number) =>
							<div key={i} className="fighter-select-row">
								<p style={{opacity:craft.SwapIn ? "1" : "0.75",textDecoration:craft.SwapOut && indexHugeHangars===-1 ? "underline" : "",textDecorationColor:craft.SwapOut ? "#f00" : ""}}>{craft.Name} {indexHugeHangars>-1 && craft.Price ? "("+craft.Price+")" : ""}</p>
								<input disabled={!craft.SwapIn} type="number" className="fighter-select-box" value={craft.Assigned} onChange={(e:any) => {
/* Below zero: don't allow */						if(e.target.value<0) return;
/* If it can't be swapped out, don't allow below original number */	if(!craft.SwapOut && e.target.value<craft.Number && e.target.value!=="" && craft.Assigned) return;
/* If can't be swapped in, don't allow above original number */		if(!craft.SwapIn && e.target.value>craft.Number) return;
/* If more than available fighter slots, don't allow */			if(e.target.value*(craft.Price || 1)>craftTotal-craftAssigned+craft.Assigned*(craft.Price || 1)) return;
									const newShipCraft:any={...shipCraft};
									newShipCraft.craftList[i].Assigned=parseInt(e.target.value) || 0;
									setShipCraft(newShipCraft);
		 							if(props.setFighters && props.shipStats.RaceName!=="Drakh") props.setFighters(props.id,shipCraft.craftList.filter((craft:typeCraft) => craft.Assigned>0).map((craft:typeCraft) => craft.ShipID));
								}} />
							</div>
							)}
							<button onClick={() => setSwapTable(false)}>Close</button>&nbsp;
							<button onClick={() => {
								shipCraft.craftList.forEach((craft:typeCraft) => {craft.Assigned=craft.Number});
								setShipCraft({loaded:false,craftList:[]});
							}}>Reset</button>
						</div>
					</td>
				</tr>

			</>
		)

}
function Weapon(props:any) {
 	return (
 		<tr>
 			<td>{props.weapon.Name}</td>
 			<td>{props.weapon.Range}</td>
 			<td>{props.weapon.AD}</td>
 			<td>{props.weapon.Traits.join("/")}</td>
 		</tr>
 	)
}
function WeaponMissile(props:any) {
	const [missileType,setMissileType]=React.useState(0);
	const SVC:any=React.useContext(ShipViewerContext);
	return (
		<tr>
			<td style={{cursor:"pointer"}} onClick={() => setMissileType((missileType+1)%SVC.constants.missileTypes.length)}>{props.weapon.Name} {SVC.constants.missileTypes[missileType].Name}
				<i className="fas fa-sync-alt missile-swapicon noprint" style={{paddingLeft:"0.3rem"}} />
 			</td>
			<td>{SVC.constants.missileTypes[missileType].Range}</td>
			<td>{props.weapon.AD}</td>
			<td>{SVC.constants.missileTypes[missileType].Traits}{props.weapon.Traits.filter((trait:string) => trait.startsWith("SL"))}</td>
		</tr>
	)
}
function WeaponOldStyle(props:any) {
	const SVC:any=React.useContext(ShipViewerContext);
	return (
		<tr className="online-weapon-table">
			<td>{props.weapon.Name}</td>
			<td>{props.weapon.Range}</td>
			<td>{props.arc.substring(0,1)}</td>
			<td>{props.weapon.AD}</td>
			<td>{props.weapon.Traits.map((trait:string,i:number) => (
				<div key={i}>{SVC.constants.traitNames[trait.replace('*','s')]}</div>
			))}</td>
		</tr>
	)
}
function ShipRaceLevelNameCQ(props:any) {
	const SVC:any=React.useContext(ShipViewerContext);
	return (<>
		<tr>
			<td rowSpan={2} className='heading grey'>
				{props.fleet ? <div className='ship-close' onClick={() => {SVC.fleetDelete(props.edition,props.shipID)}}><i className='fas fa-times-circle' /></div> : ''}
				{props.raceName} - {props.levelName}
			</td>
			{props.numPerSheet===0 ? '' : <td colSpan={props.numPerSheet*3} className='subheading grey'>Name / Crew Quality</td>}
		</tr>
		<tr>
		{new Array(props.numPerSheet).fill(0).map((x,i) => (
			<React.Fragment key={i}>
				<td colSpan={2} className={i>0 ? ' nomobile' : ''}>
					<div className='ship-name' contentEditable={true} />
					<div className='ship-name-underline' />
				</td>
				<td className={'heading'+(i>0 ? " nomobile" : "")}>
					<div className='ship-cq' contentEditable={true} />
					<div className='ship-name-underline' />
				</td>
			</React.Fragment>
		))}
		</tr>
	</>)
}
function ShipNameSpeedTroops(props:any) {
	return (<>
		<tr>
			<td rowSpan={2} className="heading grey">{props.shipName}</td>
			{props.numPerSheet===0 ? "" : <td colSpan={props.numPerSheet*3} className="subheading grey">{props.sheetType!==4 ? props.sheetType!==2 ? "Speed / Troops" : "Speed" : "Troops"}</td>}
		</tr>
		<tr>
		{new Array(props.numPerSheet).fill(0).map((x,i) => (
			<React.Fragment key={i}>
				{props.sheetType!==4 ? <td className={"heading"+(i>0 ? " nomobile" : "")} colSpan={props.sheetType===2 || props.raceName==="Ancients" ? 3 : 1}>{props.shipSpeed}</td> : ""}
				{props.sheetType!==2 && props.raceName!=="Ancients" ? <td className={"heading"+(i>0 ? " nomobile" : "")} colSpan={props.sheetType===4 ? 3 : 2}>{props.shipTroops}</td> : ""}
			</React.Fragment>
		))}
		</tr>
	</>)
}
function ShipTrait(props:any) {
	return (
		<tr>
			<td>{props.name}</td>
			<td dangerouslySetInnerHTML={{__html:props.value}} />
			{props.showBoxes ?
				<td style={{position:'relative'}}>
				{new Array(props.numPerSheet).fill(0).map((x,j) =>
					<div
					 key={j}
					 className={j>0 ? "nomobile" : ""}
					 style={{position:'absolute',top:'0',right:8*j+'pt',display:"inline-block",border:"1px solid black",borderRight:(j===0 ? "1px solid #000" : ""),width:"11px",height:"11px"}}
					/>
				)}
				</td>
			: null
			}
		</tr>
	)
}
function ShipShieldsAndHullHeader(props:any) {
	if(props.numPerSheet===0) return <></>;
	return props.hasShields ?
		<td colSpan={props.numPerSheet*3} className="subheading grey">Shields</td>
	:
		<td colSpan={props.numPerSheet*3} className="subheading grey">Hull damage</td>
}
function ShipShieldsBox(props:any) {
	return (<>
		<tr>
		{new Array(props.numPerSheet).fill(0).map((x,i) => 
			<React.Fragment key={i}>
				<td colSpan={3} className={"heading"+(i>0 ? " nomobile" : "")} style={{verticalAlign:"top",height:"80px"}}>
					{props.shields.replaceAll("/"," / ")}
				</td>
			</React.Fragment>
		)}
		</tr>
		{props.numPerSheet===0 ? "" : <tr><td colSpan={props.numPerSheet*3} className="subheading grey">Hull damage</td></tr>}
	</>)

}
function ShipDamageBoxes(props:any) {
	return (
		<tr>
		{props.selfRepair ?
			<>
				{new Array(props.numPerSheet).fill(0).map((x:number,i:number) => (
					<td key={i} colSpan={3} className={"heading"+(i>0 ? " nomobile" : "")} style={{verticalAlign:"top",height:"120px"}}>
						{props.boxes}
						{props.crippled>0 ? " / "+props.crippled : ""}
						{props.sheetType===4 && props.boxes>0 ? " / "+props.thirdvalue : ""}
					</td>
				))}
			</>
		:
			<>
				{new Array(props.numPerSheet).fill(0).map((x,i) => (
					<td key={i} colSpan={3} className={"heading"+(i>0 ? " nomobile" : "")} style={{padding:"0",backgroundColor:"#aaa",verticalAlign:"top",height:"20px"}}>
						<div className="ship-damage-boxes">
							{props.boxes>0 ? new Array(parseInt(props.boxes)).fill(0).map((x,j) => {
								return (
									<div key={j} className="ship-dmg" style={{backgroundColor:(j>=props.boxes-props.crippled ? props["colour"+(i%2+1)] : "#fff")}} />
								)
							}) : ""}
						</div>
					</td>
				))}
				</>
		}
		</tr>

	);
}

export function ShowShip(props:{shipID:number,edition:string,isFleet?:boolean,id:number}) {
	const [searchParams]=useSearchParams();
	const SVC:any=React.useContext(ShipViewerContext);
	const edition:string=props.edition || searchParams.get('edition') || '';
	const shipID:number=props.shipID || parseInt(searchParams.get('ShipID') || '');

	// Check we've got the required data
	if(edition==='') return <ShipViewerError message={'Please select an edition'} />
	if(shipID===0 || isNaN(shipID)) return <ShipViewerError message={'No ship selected'} />
	const shipStats=SVC.shipViewerData.Ships?.find((ship:typeShipData) => ship.ShipID===shipID && ship.Edition===edition);
	if(shipStats===undefined) return <LoadingBox />
	if(shipStats.ErrorMessage) return <ShipViewerError message={shipStats.ErrorMessage} />

	// Number of ships per sheet
	let numPerSheet=4;					// Most ships have 4 damage tracks per sheet
	if(shipStats.RaceName==="Ancients") numPerSheet=1;	// Ancients only have 1
	if(shipStats.SheetType===4) numPerSheet=1;		// Space stations only have 1
	if(shipStats.SheetType===3) numPerSheet=0;		// Fighters don't have any
	const numShipsArray=new Array(numPerSheet).fill(0);
	// Height of main stats box compared to damage tracks etc
	let numMainBoxRows=6;												// Number of rows the main box takes up; default is 6: 2 each for hull damage, crew damage and critical hits
	if(shipStats.Traits?.some((trait:string) => trait.toLowerCase().startsWith("shields"))) numMainBoxRows+=2;	// Shields adds 2 more rows
	if(shipStats.SheetType===2 || shipStats.RaceName==="Ancients") numMainBoxRows-=2;				// Shadows, Vorlons and Ancients don't have crew
	if(shipStats.SheetType===3) numMainBoxRows-=4;								// Fighters don't have crew or critical hits
	if(shipStats.SheetType===4) numMainBoxRows-=4;								// Space stations don't have crew or critical hits
	// Service date
	let serviceDate;
	if(shipStats.ISDFrom==="" && shipStats.ISDTo==="") serviceDate="-";
	if(shipStats.ISDFrom!=="" && shipStats.ISDTo==="") serviceDate=shipStats.ISDFrom+"+";
	if(shipStats.ISDFrom==="" && shipStats.ISDTo!=="") serviceDate="Until "+shipStats.ISDTo;
	if(shipStats.ISDFrom!=="" && shipStats.ISDTo!=="") serviceDate=shipStats.ISDFrom+"-"+shipStats.ISDTo;
	if(shipStats.ISDFrom!=="" && shipStats.ISDFrom===shipStats.ISDTo) serviceDate="Only "+shipStats.ISDFrom;

	if(!SVC.oldStyle) {
	 	return (
	 		<table className={(shipStats.SheetType===3 ? "fighter" : "ship")+"-main-table"} id={"ShipSheet"+shipStats.ShipID}>
	 			<colgroup className="ship-col-1" />
	 			{numPerSheet>1 ? new Array(numPerSheet).fill(0).map((x,i) => {
	 				return (
	 					<React.Fragment key={i}>
	 						<colgroup className={"ship-col-2"+(i>0 ? " nomobile" : "")} />
	 						<colgroup className={"ship-col-3"+(i>0 ? " nomobile" : "")} />
	 						<colgroup className={"ship-col-3"+(i>0 ? " nomobile" : "")} />
	 					</React.Fragment>
	 				)
	 			}) : numPerSheet===1 ?
	 				<>
	 					<colgroup className="ship-col-25" />
	 					<colgroup className="ship-col-12" />
	 					<colgroup className="ship-col-12" />
	 				</>
	 			: ""
	 			}
				<tbody>
					{/* First row: ship class, name and CQ */}
					<ShipRaceLevelNameCQ edition={edition} shipID={shipID} raceName={shipStats.RaceName} levelName={shipStats.LevelName} numPerSheet={numPerSheet} fleet={props.isFleet} />
					{/* Speed and Troops */}
					<ShipNameSpeedTroops raceName={shipStats.RaceName} shipName={shipStats.ShipName || shipStats.ShortName || shipStats.ShipID} sheetType={shipStats.SheetType} numPerSheet={numPerSheet} shipSpeed={shipStats.ShipSpeed} shipTroops={shipStats.ShipTroops} />
					{/* Main box */}
					<tr>
						<td rowSpan={numMainBoxRows} style={{verticalAlign:"top"}}>
							<table className='ship-info-table'>
								<tbody>
									<ShipTrait name={'Service date'} value={serviceDate} />
									<ShipTrait name={'Hull'} value={shipStats.Hull} />
									{shipStats.SheetType===3 ? <ShipTrait name={'Speed'} value={shipStats.ShipSpeed} /> : <ShipTrait name='Turns' value={shipStats.Turns} />}
									{/* Craft */}
									{shipStats.Craft || shipStats.Traits?.some((trait:string) => trait.toLowerCase().startsWith("huge hangars")) ? <ShowCraft id={props.id} shipStats={shipStats} /> : ""}
									{/* Traits */}
									{shipStats.Traits?.map((trait:string,i:number) => 
										<ShipTrait key={i} name={i===0 ? 'Traits' : ''} value={trait} showBoxes={true} numPerSheet={numPerSheet} />
									)}
								</tbody>
							</table>
							{/* Weapons */}
							{shipStats.Weapons && Object.keys(shipStats.Weapons).length>0 ? (
								<table className='ship-weapons-table'>
									<thead>
										<tr>
											<th>Weapon name</th>
											<th>Range</th>
											<th>AD</th>
											<th>Special</th>
										</tr>
									</thead>
									<tbody>
										{SVC.constants.weaponArcs.map((arc:string,i:number) => (
											shipStats.Weapons && shipStats.Weapons[arc] ? (
												<React.Fragment key={i}>
													<tr><td colSpan={4} className="arc">{arc}</td></tr>
													{shipStats.Weapons[arc]?.map((weapon:typeWeapon,j:number) => (weapon.Name==="Missile Rack" || weapon.Name==="Missile Racks" || weapon.Name==="Advanced Missile Rack") && (shipStats.RaceID===5 || shipStats.RaceID===6 || shipStats.RaceID===7) && !shipStats.Notes.includes("may not use missile variants") && shipStats.SheetType!==3 ? <WeaponMissile key={j} weapon={weapon} /> : <Weapon key={j} weapon={weapon} /> )}
												</React.Fragment>
											) : ""
										))}
										{shipStats.Notes==="" ? "" : <tr><td colSpan={4} style={{paddingTop:"15px"}} dangerouslySetInnerHTML={{__html:shipStats.Notes}} /></tr> }
									</tbody>
								</table>
							) : ""}
						</td>
						{/* Shields or hull header */}
						<ShipShieldsAndHullHeader numPerSheet={numPerSheet} hasShields={shipStats.Traits?.some((trait:string) => trait.startsWith("Shields"))} />
					</tr>
					{/* Shields box */}
					{shipStats.Traits?.filter((trait:string) => trait.startsWith("Shields")).map((trait:string,j:number) => {
						return (
							<React.Fragment key={j}>
								<ShipShieldsBox numPerSheet={numPerSheet} shields={trait.substring(8)} />
							</React.Fragment>
						)
					})}
					{/* Hull damage */}
					<ShipDamageBoxes numPerSheet={numPerSheet} selfRepair={shipStats.Traits?.some((trait:string) => trait.toLowerCase().startsWith("self-repair")) || shipStats.SheetType===4} boxes={shipStats.DamageValue} crippled={shipStats.Crippled} thirdvalue={shipStats.CrewValue} sheetType={shipStats.SheetType} colour1={shipStats.CrippledColour1} colour2={shipStats.CrippledColour2} />
					{/* Crew casualties */}
					{shipStats.SheetType===2 || shipStats.SheetType===3 || shipStats.SheetType===4 || shipStats.RaceName==="Ancients" ? "" :
						<>
							<tr><td colSpan={numPerSheet*3} className='subheading grey'>Crew casualties</td></tr>
							<ShipDamageBoxes numPerSheet={numPerSheet} boxes={shipStats.CrewValue} crippled={shipStats.Skeletoned} sheetType={shipStats.SheetType} colour1={shipStats.CrippledColour1} colour2={shipStats.CrippledColour2} />
						</>
					}
					{/* Critical hits */}
					{shipStats.SheetType===3 || shipStats.SheetType===4 ? "" :
						<>
							<tr><td colSpan={numPerSheet*3} className='subheading grey'>Critical hits</td></tr>
							<tr>{numShipsArray.map((x,i) => (
								<td key={i} colSpan={3} className={i>0 ? " nomobile" : ""} style={{height:"100px"}} />
							))}</tr>
						</>
					}
					{/* Copyright message */}
					{shipStats.SheetType===3 ? "" : (
						<tr>
							<td colSpan={numPerSheet*3+1} className="subheading">All Content Copyright Mongoose Publishing 2009-{new Date().getFullYear()}. Reproduced with permission.</td>
						</tr>
					)}
				</tbody>
			</table>
		)
	} else {
	 	return (
	 		<>
	 			<table className='online-main-table' style={{border:"0"}}><tbody><tr><td><b>{shipStats.ShipName}</b></td></tr></tbody></table>
				<table className='online-main-table'>
					<colgroup style={{width:"110px"}}></colgroup>
					<colgroup style={{width:"100px"}}></colgroup>
					<colgroup style={{width:"100px"}}></colgroup>
					<colgroup style={{width:"330px"}}></colgroup>
					<tbody>
						<tr>
							<td>Name:</td><td></td>
							<td>Class/PL:</td><td>{shipStats.ShipName} / {shipStats.LevelName}</td>
						</tr>
						<tr>
							<td>Crew Quality:</td><td></td>
							<td>Troops:</td><td>{shipStats.ShipTroops}</td>
						</tr>
						<tr>
							<td>{shipStats.SheetType===4 ? "" : "Speed:"}</td>
							<td style={{textAlign:"right",paddingRight:"10px"}}>{shipStats.SheetType===4 ? "" : shipStats.ShipSpeed}</td>
							<td>In Service:</td><td>{serviceDate}</td>
						</tr>
						<tr>
							<td>{shipStats.SheetType===4 ? "" : "Turns:"}</td>
							<td style={{textAlign:"right",paddingRight:"10px"}} dangerouslySetInnerHTML={{__html:shipStats.SheetType===4 ? "" : shipStats.Turns}} />
							<td>Craft:</td>
							<td>{shipStats.Craft?.map((craft:typeCraft,i:number) => <div key={i}>{craft.Name} ({craft.Number})</div>)}</td>
						</tr>
						<tr>
							<td>Hull:</td>
							<td style={{textAlign:"right",paddingRight:"10px"}}>{shipStats.Hull}</td>
							<td>Special Rules:</td>
							<td>{shipStats.Traits.map((trait:string,i:number) => <div key={i} dangerouslySetInnerHTML={{__html:trait}} />)}</td>
						</tr>
						<tr>
							{shipStats.SheetType===4 ? <>
								<td>Damage:</td>
								<td colSpan={3}>{shipStats.DamageValue} / {shipStats.Crippled} {shipStats.CrewValue ? " / "+shipStats.CrewValue : ""}</td>
							</> : <>
								<td>Damage:</td>
								<td>{shipStats.DamageValue} / {shipStats.Crippled}</td>
								<td>Crew:</td>
								<td>{shipStats.CrewValue} / {shipStats.Skeletoned}</td>
							</>}
						</tr>
					</tbody>
				</table>
				<table className='online-main-table' style={{padding:"0",borderCollapse:"collapse"}}>
					<thead>
						<tr style={{background:"#ccc"}}>
							<th style={{textAlign:"start"}}>Weapon name</th>
							<th>Range</th>
							<th>Arc</th>
							<th>AD</th>
							<th style={{textAlign:"start"}}>Special</th>
						</tr>
					</thead>
					<tbody>
						{SVC.constants.weaponArcs.map((arc:string,i:number) => (
							shipStats.Weapons[arc]?.map((weapon:typeWeapon,j:number) => (
								<WeaponOldStyle key={i+"-"+j} arc={arc} weapon={weapon} />
							))
						))}
						{shipStats.Notes==="" ? "" : <tr><td colSpan={5} style={{paddingTop:"15px"}} dangerouslySetInnerHTML={{__html:shipStats.Notes}} /></tr> }
						<tr style={{textAlign:"center"}}>
							<td colSpan={5} className='subheading' style={{paddingTop:"10px"}}><small>All Content Copyright Mongoose Publishing 2009-{new Date().getFullYear()}. Reproduced with permission.</small></td>
						</tr>
					</tbody>
				</table>
			</>
		)
	}
}

export function ShowShipMultiple(props:any) {
	const navigate=useNavigate();
	const [searchParams]=useSearchParams();
	const SVC:any=React.useContext(ShipViewerContext);
	const edition:string=props.edition || searchParams.get('edition');
	const shipIDs:number[]=props.shipID?.split(',') || searchParams.get('ShipID')?.split(',').map((i:string) => parseInt(i));
	const shipsLoaded:number=SVC.shipViewerData.Ships.filter((ship:typeShipData) => shipIDs.includes(ship.ShipID)).length;

	React.useEffect(() => {
		// If edition is not given or invalid, return
		if(edition==='' || !SVC.constants?.editions.some((e:typeEdition) => e.Name===edition)) return;
		// If edition is not loaded, return for now
		if(!SVC.shipViewerData?.Editions.some((e:typeEditionData) => e.EditionName===edition)) return;
		// If ShipID is not given or invalid, or we've already got all the ship data we need, return
		if(shipIDs===undefined || shipIDs.length===0 || isNaN(shipIDs[0]) || shipsLoaded===shipIDs.length) return;
		const nextID=shipIDs.find((shipID:number) => !SVC.shipViewerData.Ships.some((ship:typeShipData) => ship.ShipID===shipID));
		if(nextID) SVC.shipDataLoad(edition,nextID);
	},[edition,shipIDs,shipsLoaded,SVC]);

	// Make sure edition is valid
	if(edition==='' || !SVC.constants?.editions.some((e:typeEdition) => e.Name===edition)) return <ShipViewerError message={'Please select an edition'} />
	// Make sure ship list is valid
	if(shipIDs===undefined || shipIDs.length===0 || isNaN(shipIDs[0])) return <ShipViewerError message={'No ship selected'} />

	return (<>
		<div className='fleet-container'>
			{shipIDs.filter((shipID:number) => SVC.shipViewerData.Ships.some((ship:typeShipData) => ship.ShipID===shipID)).map((shipID:number,i:number) =>
				<ShowShip key={shipID} edition={edition} shipID={shipID} id={i} />
			)}
		</div>
		<div className='fleet-container'>
			<button type='button' className='noprint' style={{padding:'0.5rem 1rem',margin:'auto'}} onClick={() => {SVC.fleetAdd(edition,shipIDs); navigate('/fleet?edition='+edition)}}>{SVC.fleetGet(edition).length ? 'Add to fleet' : 'Start a fleet'}</button>
			<button type='button' className='noprint' style={{padding:'0.5rem 1rem',margin:'auto'}} onClick={() => SVC.setOldStyle(!SVC.oldStyle)}>Switch style</button>
		</div>
	</>)
}
