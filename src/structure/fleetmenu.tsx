import React from 'react';
import {useNavigate} from "react-router-dom";
import {ShipViewerContext} from '../utils/context';
import {typeEdition,typeEditionData,typeLevel,typeRace,typeShipLink} from '../types';

export const FleetAddMenu=(props:{edition:string,visible:boolean,setOptsVisible:any}) => {
	const navigate=useNavigate();
	const SVC:any=React.useContext(ShipViewerContext);
	const [chosenRace,setChosenRace]=React.useState();
	const [chosenShip,setChosenShip]=React.useState();

	// Load the ship list from the API
	React.useEffect(() => {
		// If we don't know the edition, there's nothing to do
		if(props.edition==='' || !SVC.constants?.editions.some((e:typeEdition) => e.Name=props.edition)) return;
		// If the ship list already includes this edition's ships, there's nothing to do
		if(SVC.shipViewerData?.Editions.some((e:typeEditionData) => e.EditionName===props.edition)) return;
		// Load the ship data
		SVC.shipEditionLoad(props.edition);
	},[props.edition,SVC]);

	const shipData=SVC.shipViewerData.Editions.find((edition:typeEditionData) => edition.EditionName===props.edition);
	if(!shipData) return (<></>);
	if(shipData.ErrorMessage) return (<></>);

	return (
		<div className={'fleet-add-menu'+(props.visible ? ' active' : '')}>
			<div>
				<fieldset style={{marginBottom:'1rem'}}>
					<legend style={{textAlign:'left',padding:'0 0.5rem'}}>Add a ship</legend>
					<p>Choose a race:</p>
					<select value={chosenRace} onChange={(e:any) => setChosenRace(e.target.value)}>
						<option value="">Choose a race...</option>
						{shipData.Races.filter((race:typeRace) => shipData.ShipLinks.some((ship:typeShipLink) => ship.RaceID===race.RaceID && ['P&P','2e','Dilgar War','Darkness Rising'].includes(ship.Source))).map((race:typeRace,i:number) => (
							<option key={i} value={race.RaceID}>{race.RaceName}</option>
						))}
					</select>
					{chosenRace ?
						<>
							<p>Choose a ship:</p>
							<select value={chosenShip} onChange={(e:any) => setChosenShip(e.target.value)}>
								<option value=''>Choose a ship...</option>
								{shipData.ShipLinks.filter((ship:typeShipLink) => ship.RaceID===parseInt(chosenRace) && ['P&P','2e','Dilgar War','Darkness Rising'].includes(ship.Source)).sort((a:typeShipLink,b:typeShipLink) => a.ShipLevel>b.ShipLevel ? 1 : -1).map((ship:typeShipLink,i:number) => (
									<option key={i} value={ship.ShipID}>
										{shipData.Levels.filter((level:typeLevel) => level.LevelID===ship.ShipLevel).map((level:typeLevel,j:number) => <React.Fragment key={j}>{level.LevelName}</React.Fragment>)}: {ship.ShipName} {ship.SheetType===3 ? '('+ship.PerWing+')' : ''}
									</option>
								))}
							</select>
						</>
					: null}
					<div style={{display:'flex',justifyContent:'center',gap:'5px',padding:'5px 0'}}>
						{chosenRace && chosenShip ? <button onClick={() => {
							SVC.fleetAdd(props.edition,[parseInt(chosenShip)]);
							navigate('/fleet?edition='+props.edition);
							props.setOptsVisible('');
						}}>Add</button> : null}
					</div>
				</fieldset>
				<fieldset style={{marginBottom:'0.8rem'}}>
					<label htmlFor='showOldStyle'>Old style sheets?</label>
					<input id='showOldStyle' type='checkbox' value={SVC.oldStyle} onChange={e => {SVC.setOldStyle(e.target.checked)}} />
				</fieldset>
				<button onClick={() => props.setOptsVisible('')}>Close</button>
			</div>
		</div>
	)
}
