import {Link} from "react-router-dom";
import kosh from "./../Assets/kosh.jpg";

export function ShipViewerError(props:{message:string}) {
	const koshisms=["We take no interest in the affairs of others.",
			"We will meet in Red 3 at the hour of scampering.",
			"Understanding is a three-edged sword.",
			"Ah, you seek meaning. Then listen to the music, not the song.",
			"A stroke of the brush does not guarantee art from the bristles.",
			"The avalanche has already started. It is too late for the pebbles to vote.",
			"You have always been here."];
	const koshID=Math.floor(Math.random()*koshisms.length);
	return (
		<div style={{width:"100%",textAlign:"center",backgroundColor:"#EDE8D3",padding:"30px 20px",marginTop:"10px"}}>
			<div style={{display:"inline-block",position:"relative"}}>
				<img src={kosh} style={{maxWidth:"100%"}} alt="Kosh" />
				<h3 style={{position:"absolute",bottom:"10px",color:"#fff",fontSize:"0.9rem",textAlign:"center",width:"100%",textShadow:"-1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000"}}>{koshisms[koshID]}</h3>
			</div>
			<p style={{marginBottom:"10px"}}>Sorry, an error seems to have occurred.</p>
			<p style={{marginBottom:"10px"}}><i>{props.message}</i></p>
			<Link to={"/"}>Back to home page</Link>
		</div>
	)
}
