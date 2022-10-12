<!--#include virtual="includes/funcs.aspx"-->
<!--#include virtual="includes/header.aspx"-->
<%	string Version=Request.Params["v"]; %>
<div class='ship-list container'>
<%	if(Version!="pp" && Version!="dw" && Version!="dr") {
		Response.Write("<h2 style='padding:20px 0'>Version not specified or invalid</h2></div>");
		TheEnd();
	}
	if(Version=="pp") Response.Write("<h1>P&amp;P Printable Sheets</h1>");
	if(Version=="dr") Response.Write("<h1>Darkness Rising Printable Sheets</h1>");
	if(Version=="dw") Response.Write("<h1>Dilgar War Printable Sheets</h1>");
%>
	<h2><span style="background:#f00;color:#000; padding:0 10px">Important: read this first!</span></h2>
	<p>If your sheets print in black and white and don't display the damage tracks correctly, you need to enable background colour printing.</p>
	<p><b>Chrome:</b> When you select &quot;Print&quot;, click &quot;More settings&quot; on the right. Tick the box &quot;Background graphics&quot;.</p>
	<p><b>Edge:</b> When you select &quot;Print&quot;, click &quot;More settings&quot; on the left. Tick the box &quot;Background graphics&quot;.</p>
	<p><b>Firefox:</b> When you select &quot;Print&quot;, the settings on the right has an option &quot;Print backgrounds&quot; at the bottom. Tick it.</p>
	<div class='ship-list-table ship-levels-row'>
		<div><b>Patrol</b></div>
		<div><b>Skirmish</b></div>
		<div><b>Raid</b></div>
		<div><b>Battle</b></div>
		<div><b>War</b></div>
		<div><b>Armageddon</b></div>
	</div>
<%	string SQLStmt = "SELECT Source,RaceName,ShipID,ShipName,ShipLevel,LevelName,SheetType,ShortName,Craft,Ordering,a.RaceID ";
	if(Version=="pp") SQLStmt += "FROM PP_ShipTable a,PP_RaceTable b,PP_LevelTable c ";
	if(Version=="dw") SQLStmt += "FROM DW_ShipTable a,DW_RaceTable b,DW_LevelTable c ";
	if(Version=="dr") SQLStmt += "FROM DR_ShipTable a,DR_RaceTable b,DR_LevelTable c ";
	SQLStmt += "WHERE b.RaceID=a.RaceID AND LevelID=ShipLevel AND RaceName<>'Ancients' ";
	if(Version=="pp") SQLStmt += "AND Source IN ('2e','P&P') ";
	SQLStmt += "ORDER BY RaceName,ShipLevel,ShipName";
	SqlCommand cmd = new SqlCommand(SQLStmt,conn);
	SqlDataReader reader = cmd.ExecuteReader();
	OutputShipList(Version,0,"show",reader);
	reader.Close();

	if(Version=="pp") {
		SQLStmt = "SELECT Source,RaceName,ShipID,ShipName,ShipLevel,LevelName,SheetType,ShortName,Craft,Ordering,a.RaceID ";
		SQLStmt += "FROM PP_ShipTable a,PP_RaceTable b,PP_LevelTable c ";
		SQLStmt += "WHERE b.RaceID=a.RaceID AND LevelID=ShipLevel AND RaceName='Ancients' ";
		SQLStmt += "ORDER BY Source,RaceName,ShipLevel,ShipName";
		cmd = new SqlCommand(SQLStmt,conn);
		reader = cmd.ExecuteReader();
		OutputShipList("Ancients",0,"show",reader);
		reader.Close();

		SQLStmt = "SELECT Source,RaceName,ShipID,ShipName,ShipLevel,LevelName,SheetType,ShortName,Craft,Ordering,a.RaceID ";
		SQLStmt += "FROM PP_ShipTable a,PP_RaceTable b,PP_LevelTable c ";
		SQLStmt += "WHERE b.RaceID=a.RaceID AND LevelID=ShipLevel AND RaceName<>'Ancients' ";
		SQLStmt += "AND (Source NOT IN ('2e','P&P') OR Source IS NULL) ";
		SQLStmt += "ORDER BY Source,RaceName,ShipLevel,ShipName";
		cmd = new SqlCommand(SQLStmt,conn);
		reader = cmd.ExecuteReader();
		OutputShipList(Version,1,"show",reader);
		reader.Close();
	}

%>
</div>
<!--#include virtual="includes/footer.aspx"-->
<%	TheEnd(); %>
