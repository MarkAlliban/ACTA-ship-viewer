<!--#include virtual="includes/funcs.aspx"-->
<!--#include virtual="includes/header.aspx"-->
<script language='JavaScript'>
var ShipSheetID=1;
function showRace(RaceID) {
	document.querySelectorAll('[id*=ShipsFromRace]').forEach(s => {s.style.display='none'});
	document.getElementById('ShipsFromRace'+RaceID).style.display='block';
	document.getElementById('ShipChooseDiv').style.display='flex';
	document.getElementById('ShipAddDiv').style.display='flex';

}
function sheetAdd() {
	const ShipID=document.getElementById('ShipsFromRace'+document.getElementById('AddRaceID').value).value;
	const xHttp=new XMLHttpRequest();
	xHttp.onload=function() {
		document.getElementById('FleetArea').insertAdjacentHTML('beforeend',this.responseText);
		shipAllowNaming();
	}
	xHttp.open('GET','show-ship.aspx?v=pp&fleety=yes&ShipSheetID='+ShipSheetID+'&ShipID='+ShipID,true);
	ShipSheetID++;
	xHttp.send();
}
</script>
<div class='fleet-add-box'>
	<h3>Fleet Designer</h3>
	<p style='margin:10px 0'>This tool lets you create a custom fleet, with multiple ship types on one sheet.</p>
	<p style='margin:10px 0'>To add a ship to your fleet please select the race and ship below.</p>
	<div style='display:flex; padding-top:5px; justify-content:center'>
		<p style='width:150px; text-align:end; padding-right:10px'>Choose race:</p>
		<select id="AddRaceID" style='width:250px' onChange='showRace(this.value)'>
			<option selected disabled>Choose a race...</option>
<%	string SQLStmt = "SELECT RaceID,RaceName FROM PP_RaceTable b WHERE EXISTS (SELECT * FROM PP_ShipTable (NOLOCK) WHERE RaceID=b.RaceID AND Source IN ('2e','P&P')) ORDER BY RaceName ";
	SqlCommand cmd = new SqlCommand(SQLStmt,conn);
	SqlDataReader reader = cmd.ExecuteReader();
	while(reader.Read()) {
		Response.Write("<option value="+reader["RaceID"]+">"+reader["RaceName"]+"</option>");
	}
	reader.Close();
%>
		</select>
	</div>
	<div style='padding-top:5px; display:none; justify-content:center' id='ShipChooseDiv'>
		<p style='width:150px; text-align:end; padding-right:10px'>Choose ship:</p>
<%	SQLStmt = "SELECT RaceID,ShipID,ShortName,LevelName,SheetType FROM PP_ShipTable a,PP_LevelTable b WHERE ShipLevel=LevelID AND Source IN ('2e','P&P') AND SheetType<>3 ORDER BY RaceID,LevelID,ShortName ";
	cmd.CommandText = SQLStmt;
	reader = cmd.ExecuteReader();
	int LastRaceID=0;
	while(reader.Read()) {
		if(LastRaceID!=(int)reader["RaceID"]) {
			if(LastRaceID!=0) Response.Write("</select>");
			Response.Write("<select name='ShipID' id='ShipsFromRace"+reader["RaceID"]+"' style='width:250px");
			Response.Write("; display:none");
			Response.Write("'>");
		}
		Response.Write("<option value='"+reader["ShipID"]+"'>"+reader["LevelName"]+": "+reader["ShortName"]+"</option>");
		LastRaceID=(int)reader["RaceID"];
	}
	reader.Close();
%>
		</select>
	</div>
	<div style='padding-top:5px; display:none; justify-content:center; text-align:center' id='ShipAddDiv'>
		<button onClick="sheetAdd()">Add</button>
	</div>
</div>
<div id='FleetArea'></div>
<!--#include virtual="includes/footer.aspx"-->
<%	TheEnd(); %>
