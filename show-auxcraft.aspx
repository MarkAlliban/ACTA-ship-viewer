<!--#include virtual="includes/funcs.aspx"-->
<%	if(Request.Params["fleety"]!="yes") { %>
<!--#include virtual="includes/header.aspx"-->
<%	}
	string Version=Request.Params["v"];
	if(Version!="pp" && Version!="dw" && Version!="dr" && Version!="Ancients") {
		Response.Write("<h2 style='padding:20px 0'>Version not specified or invalid</h2></div>");
		TheEnd();
	}
	int ShipID=int.Parse(Request.Params["ShipID"]);


	string SQLStmt = "DECLARE @RaceID INT SELECT @RaceID=RaceID FROM ";
	if(Version=="pp" || Version=="Ancients") SQLStmt += "PP_ShipTable ";
	if(Version=="dw") SQLStmt += "DW_ShipTable ";
	if(Version=="dr") SQLStmt += "DR_ShipTable ";
	SQLStmt += "WHERE ShipID=@ShipID ";
	SQLStmt += "SELECT a.RaceID,ShipName,RaceName,LevelName,ShipSpeed,ShipTroops,ISDFrom,ISDTo,Hull,Turns,Craft,Traits,";
	SQLStmt += "DamageValue,Crippled,CrewValue,Skeletoned,CrippledColour,SecondCrippled,";
	SQLStmt += "WeaponsBoresight,WeaponsForward,WeaponsPort,WeaponsStarboard,WeaponsAft,WeaponsBoresightAft,WeaponsTurret,Notes ";
	if(Version=="pp" || Version=="Ancients") SQLStmt += "FROM PP_ShipTable a,PP_RaceTable b,PP_LevelTable c ";
	if(Version=="dw") SQLStmt += "FROM DW_ShipTable a,DW_RaceTable b,DW_LevelTable c ";
	if(Version=="dr") SQLStmt += "FROM DR_ShipTable a,DR_RaceTable b,DR_LevelTable c ";
	SQLStmt += "WHERE a.RaceID=@RaceID AND a.RaceID=b.RaceID AND c.LevelID=a.ShipLevel AND SheetType=3 ";
	if(Version=="pp" && Request.Params["Additionals"]!="1") SQLStmt += "AND Source IN ('2e','P&P') ";
	SQLStmt += "ORDER BY ShipName";
	SqlCommand cmd = new SqlCommand(SQLStmt,conn);
	cmd.Parameters.AddWithValue("@ShipID",ShipID);
	SqlDataReader reader = cmd.ExecuteReader();
	cmd.Parameters.Clear();
	string ServiceDate="";
%>
<div style='padding-top:1px'></div>
<div class='aux-craft-container'>
<%	while(reader.Read()) {
		if(DBNull.Value.Equals(reader["ISDFrom"]) && DBNull.Value.Equals(reader["ISDTo"])) {
			ServiceDate="-";
		} else {
			if(DBNull.Value.Equals(reader["ISDFrom"])) ServiceDate="Until "+reader["ISDTo"];
			if(DBNull.Value.Equals(reader["ISDTo"])) ServiceDate=reader["ISDFrom"]+"+";
			if(!DBNull.Value.Equals(reader["ISDFrom"]) && !DBNull.Value.Equals(reader["ISDTo"])) {
				if(reader["ISDFrom"]==reader["ISDTo"]) ServiceDate="Only "+reader["ISDFrom"]; else ServiceDate=reader["ISDFrom"]+"-"+reader["ISDTo"];
			}
		}
		string[] Traits=((string)reader["Traits"]).Replace("<br>","|").Replace("<BR>","|").Split('|');
		string[] Craft=new string[0];
		if(!DBNull.Value.Equals(reader["Craft"]) && reader["Craft"]!="") Craft=((string)reader["Craft"]).Replace("<br>","|").Replace("<BR>","|").Split('|');
%>
<table class='aux-craft-table'>
	<tbody>
		<tr>
			<td class='heading grey'><%= reader["RaceName"] %> - <%= reader["LevelName"] %></td>
		</tr>
		<tr>
			<td class='heading grey'><%= reader["ShipName"] %></td>
		</tr>
		<tr>
			<td style='vertical-align:top'>
				<table class='ship-info-table'>
					<tbody>
						<tr><td>Service date</td><td><%= ServiceDate %></td></tr>
						<tr><td>Hull</td><td><%= reader["Hull"] %></td></tr>
						<tr><td>Speed</td><td><%= reader["ShipSpeed"] %></td></tr>
						<tr>
							<td>Traits</td>
							<td>
<%		foreach(string Trait in Traits) {
			if(Trait!="") {
				Response.Write(Trait);
				Response.Write("<br>");
			}
		} %>
							</td>
						</tr>
					</tbody>
				</table>
<%		if(!DBNull.Value.Equals(reader["WeaponsTurret"])) { %>
				<table class='ship-weapons-table'>
					<thead>
						<tr>
							<th>Weapon name</th>
							<th>Range</th>
							<th>AD</th>
							<th>Special</th>
						</tr>
					</thead>
					<tbody>
<%			WriteWeapon("",(string)reader["WeaponsTurret"],(int)reader["RaceID"],(string)reader["ShipName"],""); %>
					</tbody>
				</table>
<%		}
		if(!DBNull.Value.Equals(reader["Notes"]) && reader["Notes"]!="")
			Response.Write("<p style='padding-top:15px'>"+reader["Notes"]+"</p>");
%>
			</td>
		</tr>
</table>
<%	} %>
</div>
<%	reader.Close();
	if(Request.Params["fleety"]!="yes") { %>
<div style="font-family:'Babylon5'; text-align:center; font-size:6pt;">All Content Copyright Mongoose Publishing 2009-<%= DateTime.Now.Year %>. Reproduced with permission.</div>
<!--#include virtual="includes/footer.aspx"-->
<%	}
	TheEnd(); %>
