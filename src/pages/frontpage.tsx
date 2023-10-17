import {Footer} from './../structure/footer';
import {Link} from "react-router-dom";

import space from "./../Assets/space.jpg";
import bannerPP from "./../Assets/banner8.jpg";
import bannerACTA from "./../Assets/banner6.jpg";
import banner2e from "./../Assets/banner1.jpg";
import bannerAR from "./../Assets/banner2.jpg";

export function FrontPage() {
	return (
		<>
			<div style={{position:"fixed",top:"0",left:"0",width:"100%",height:"100vh",backgroundColor:"#267",background:`url(${space}) no-repeat center center fixed`,zIndex:"-1"}}></div>
			<div className="container" style={{textAlign:"center"}}>
				<div style={{maxWidth:"450px",background:"linear-gradient(#C3BC90,#EDE8D3)",margin:"0 auto 10px"}}>
					<h1 style={{color:"#000"}}>Burger's Ship Viewer for ACTA</h1>
				</div>
				<div className='index-cards'>
					<div className='index-card' style={{margin:"0 3rem 20px 3rem",flexBasis:"initial",flexGrow:"initial"}}>
						<p style={{padding:"10px 5px"}} className='display-mobile'><b>Because these sheets are intended to be printed, some aspects of this site might not look their best on a mobile device. For viewing the ship sheets on a small screen I'd recommend landscape mode.</b></p>
						<p style={{padding:"10px 5px"}}>This site provides ship stat and record sheets for <b>A Call To Arms (ACTA)</b>, a tabletop mini game by Mongoose Publishing based on the '90s sci-fi show <b>Babylon 5</b>.</p>
						<p style={{padding:"10px 5px"}}>When playing, particularly in tournaments, I found the ship record sheets provided with the game weren't as useful as they could be, so I decided to make my own.</p>
						<p style={{padding:"10px 5px"}}>These sheets are intended to be printed. I recommend laminating them and using a marker pen to cross off damage, note critical hits, disabled traits, etc. Then after the game you can wipe them clean and re-use them.</p>
					</div>
				</div>
				<div className='index-cards'>
					<div className='index-card'>
						<img src={bannerPP} alt="ACTA ship sheets for Powers and Principalities" /><br />
						<p>These are the stats from the latest ruleset for A Call To Arms, &quot;Powers And Principalities&quot;.</p>
						<p style={{marginBottom:"10px"}}><small>Updates in Mongoose's newsletter Signs & Portents which are marked as &quot;Official&quot; are updated in my listings.</small></p>
						<p><Link to="/list?edition=PP">Ship record sheets</Link> are my preferred format.</p>
						<p><Link to="/fleet?edition=PP">Fleet Designer</Link> lets you put multiple ships onto one page.</p>
						<p><a href="crit-pp.html">Crit table and SA summary</a></p>
					</div>
					<div className='index-card'>
						<img src={bannerACTA} alt="ACTA ship sheets for A Call To Arms" /><br />
						<p>Some additional resources for A Call To Arms.</p>
						<p><small>Dilgar War is a supplement for A Call To Arms, set in a time before the show.</small></p>
						<p><Link to="/list?edition=DW">Ship record sheets for &quot;Dilgar War&quot;</Link></p>
						<p><small>Darkness Rising is a fan-created alternate universe.</small></p>
						<p><Link to="/list?edition=DR">Ship record sheets for &quot;Darkness Rising&quot;</Link></p>
					</div>
				</div>
				<div className='index-cards'>
					<div className='index-card' style={{width:"95%"}}>
						<img src={banner2e} alt="ACTA ship sheets for 2nd edition" /><br />
						<p>These are the stats from the standard 2nd Edition ruleset for A Call To Arms.</p>
						<p><small>Updates in Mongoose's newsletter Signs & Portents which are marked as &quot;Official&quot; are updated in my listings. Updates that are not explicitly marked official are included in the bottom section, &quot;Additionals&quot;.</small></p>
						<p><Link to="/list?edition=2e">Ship record sheets</Link></p>
						<p><a href="crit-2e.html">Crit table and SA summary</a></p>
					</div>
					<div className='index-card' style={{width:"95%"}}>
						<img src={bannerAR} alt="ACTA Ship sheets for Armageddon" /><br />
						<p>These are the stats from the older &quot;Armageddon&quot; ruleset for A Call To Arms.</p>
						<p><small>Updates in Mongoose's newsletter Signs & Portents which are marked as &quot;Official&quot; are updated in my listings. Updates that are not explicitly marked official are included in the bottom section, &quot;Additionals&quot;.</small></p>
						<p><Link to="/list?edition=AR">Ship record sheets</Link></p>
						<p><a href="crit-ar.html">Crit table and SA summary</a></p>
					</div>
				</div>
			</div>
			<Footer />
		</>
	)
}
