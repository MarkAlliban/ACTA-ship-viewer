import React from 'react';
import {Link,useSearchParams,useLocation} from "react-router-dom";
import {FleetAddMenu} from './../structure/fleetmenu'

export function Menu() {
	const [optsVisible,setOptsVisible]=React.useState("");
	const [searchParams]=useSearchParams();
	const edition:string=searchParams.get('edition') || '';
	const location=useLocation();
	const isFleet=location.pathname==='/fleet';
	return (
		<>
			<header className='noprint'>
				<div className='ship-viewer-menu'>
					<Link to={'/'}><h1 className='ship-viewer-header'>Burger's Ship Viewer</h1></Link>
					{isFleet ?
						<>
							<button style={{background:'rgba(255,255,255,0.4)',padding:'2px 5px',margin:'0 10px 0 0',fontSize:'0.8rem',border:'1px solid #888'}} onClick={() => setOptsVisible('add')}>
								<div className='nomobile'><i className='fas fa-rocket' /><br />Add ship</div>
								<div className='display-mobile'><i className='fas fa-caret-down fa-2x' /></div>
							</button>
						</>
						: null}
				</div>
				<FleetAddMenu edition={edition} visible={optsVisible==='add'} setOptsVisible={setOptsVisible} />
			</header>
			<div className='ship-header-spacer'></div>
		</>
	)
}
