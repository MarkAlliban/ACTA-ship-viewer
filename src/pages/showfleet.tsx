import React from 'react';
import {useSearchParams,useNavigate,Link} from "react-router-dom";
import {typeEdition,typeEditionData,typeShipData} from "./../types";
import {ShipViewerError} from './../structure/error';
import {ShipViewerContext} from './../utils/context';
import {ShowShip} from './showship';

export function ShowFleet(props:any) {
	const navigate=useNavigate();
	const [searchParams]=useSearchParams();
	const SVC:any=React.useContext(ShipViewerContext);
	const edition:string=props.edition || searchParams.get('edition');
	const shipIDs:number[]=SVC.fleetGet(edition);
	const shipsLoaded:number=SVC.shipViewerData.Ships.filter((ship:typeShipData) => shipIDs.includes(ship.ShipID)).length;

	React.useEffect(() => {
		if(edition==='' || !SVC.constants?.editions.some((e:typeEdition) => e.Name===edition)) return;
		if(!SVC.shipViewerData.Editions.find((ed:typeEditionData) => ed.EditionName===edition)) return;
		if(shipIDs===undefined || shipIDs.length===0 || isNaN(shipIDs[0]) || shipsLoaded===shipIDs.length) return;
		const nextID=shipIDs.find((shipID:number) => !SVC.shipViewerData.Ships.some((ship:typeShipData) => ship.ShipID===shipID));
		if(nextID) SVC.shipDataLoad(edition,nextID);
	},[edition,shipIDs,shipsLoaded,SVC]);

	// Make sure edition is valid
	if(edition==='' || !SVC.constants?.editions.some((e:typeEdition) => e.Name===edition)) return <ShipViewerError message={'Please select an edition'} />
	// Make sure ship list is valid
	if(shipIDs===undefined || shipIDs.length===0 || isNaN(shipIDs[0])) return (
		<div className='fleet-container'>
			<h2 className='noprint' style={{padding:'15px 0 0'}}>Your fleet is empty</h2>
			<Link className='noprint' style={{padding:'15px 0 0',alignSelf:'center',flexGrow:'1',textAlign:'right'}} to={'/list?edition='+edition}>Back to ship list</Link>
		</div>
	)

	return (<>
		<div className='fleet-container noprint'>
			<h2 className='noprint' style={{padding:'15px 0 0'}}>Your fleet:</h2>
			<Link className='noprint' style={{padding:'15px 0 0',alignSelf:'center',flexGrow:'1',textAlign:'right'}} to={'/list?edition='+edition}>Back to ship list</Link>
			</div>
		<div className='fleet-container'>
			{shipIDs.filter((shipID:number) => SVC.shipViewerData.Ships.some((ship:typeShipData) => ship.ShipID===shipID)).map((shipID:number,i:number) =>
				<ShowShip key={shipID} edition={edition} shipID={shipID} id={i} isFleet={true} />
			)}
		</div>
		<div className='fleet-container noprint'>
			<button type='button' className='noprint' style={{padding:'0.5rem 1rem',margin:'auto'}} onClick={() => {SVC.fleetGet(edition).forEach((ship:number) => SVC.fleetDelete(edition,ship)); navigate('/list?edition='+edition)}}>Clear fleet</button>
			<button type='button' className='noprint' style={{padding:'0.5rem 1rem',margin:'auto'}} onClick={() => SVC.setOldStyle(!SVC.oldStyle)}>Switch style</button>
		</div>
	</>)
}
