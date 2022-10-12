<!--#include virtual="includes/funcs.aspx"-->
<!--#include virtual="includes/header.aspx"-->
<%	string Version=Request.Params["v"];
	if(Version!="pp" && Version!="dw" && Version!="dr" && Version!="Ancients") {
		Response.Write("<h2 style='padding:20px 0'>Version not specified or invalid</h2></div>");
		TheEnd();
	}
	int ShipID=int.Parse(Request.Params["ShipID"]);
	string SQLStmt = "SELECT SheetType,ShortName,ShipName,a.RaceID,RaceName,LevelName,ShipSpeed,ShipTroops,ISDFrom,ISDTo,Hull,Turns,Craft,Traits,";
	SQLStmt += "DamageValue,Crippled,CrewValue,Skeletoned,CrippledColour,SecondCrippled,";
	SQLStmt += "WeaponsBoresight,WeaponsForward,WeaponsPort,WeaponsStarboard,WeaponsAft,WeaponsBoresightAft,WeaponsTurret,Notes ";
	if(Version=="pp" || Version=="Ancients") SQLStmt += "FROM PP_ShipTable a,PP_RaceTable b,PP_LevelTable c ";
	if(Version=="dw") SQLStmt += "FROM DW_ShipTable a,DW_RaceTable b,DW_LevelTable c ";
	if(Version=="dr") SQLStmt += "FROM DR_ShipTable a,DR_RaceTable b,DR_LevelTable c ";
	SQLStmt += " WHERE ShipID=@ShipID AND b.RaceID=a.RaceID AND LevelID=ShipLevel";
	SqlCommand cmd = new SqlCommand(SQLStmt,conn);
	cmd.Parameters.AddWithValue("@ShipID",ShipID);
	SqlDataReader reader = cmd.ExecuteReader();
	cmd.Parameters.Clear();
	string ServiceDate="";
	if(reader.Read()) {
		if(DBNull.Value.Equals(reader["ISDFrom"]) && DBNull.Value.Equals(reader["ISDTo"])) {
			ServiceDate="-";
		} else {
			if(DBNull.Value.Equals(reader["ISDFrom"])) ServiceDate="Until "+reader["ISDTo"];
			if(DBNull.Value.Equals(reader["ISDTo"])) ServiceDate=reader["ISDFrom"]+"+";
			if(!DBNull.Value.Equals(reader["ISDFrom"]) && !DBNull.Value.Equals(reader["ISDTo"])) {
				if(reader["ISDFrom"]==reader["ISDTo"]) ServiceDate="Only "+reader["ISDFrom"]; else ServiceDate=reader["ISDFrom"]+"-"+reader["ISDTo"];
			}
		}
		string[] Traits=new string[0];
		if(!DBNull.Value.Equals(reader["Traits"])) Traits=((string)reader["Traits"]).Replace("<br>","|").Replace("<BR>","|").Split('|');
		string[] Craft=new string[0];
		if(!DBNull.Value.Equals(reader["Craft"]) && reader["Craft"]!="") Craft=((string)reader["Craft"]).Replace("<br>","|").Replace("<BR>","|").Split('|');
%>
<div style='padding-top:1px'></div>
<table class='online-main-table' style='border:0;'>
<tbody><tr><td><b><%= reader["ShipName"] %></b></td></tr></tbody>
</table>
<table class='online-main-table'>
	<colgroup><col style="width:110px"></colgroup>
	<colgroup><col style="width:100px;"></colgroup>
	<colgroup><col style="width:100px"></colgroup>
	<colgroup><col style="width:330px"></colgroup>
	<tbody>
		<tr>
			<td>Name:</td><td></td>
			<td>Class/PL:</td><td><%= reader["ShipName"] %> / <%= reader["LevelName"] %></td>
		</tr>
		<tr>
			<td>Crew Quality:</td><td></td>
			<td>Troops:</td><td><%= reader["ShipTroops"] %></td>
		</tr>
			<td><% if((int)reader["SheetType"]!=4) Response.Write("Speed:"); %></td><td style='text-align:right; padding-right:10px'><% if((int)reader["SheetType"]!=4) Response.Write(reader["ShipSpeed"]); %></td>
			<td>In Service:</td><td><%= ServiceDate %></td>
		</tr>
		<tr>
			<td><% if((int)reader["SheetType"]!=4) Response.Write("Turns:"); %></td><td style='text-align:right; padding-right:10px'><% if((int)reader["SheetType"]!=4) Response.Write(reader["Turns"]); %></td>
			<td>Craft:</td><td><%= reader["Craft"] %></td>
		</tr>
		<tr>
			<td>Hull:</td><td style='text-align:right; padding-right:10px'><%= reader["Hull"] %></td>
			<td>Special Rules:</td><td><%= reader["Traits"] %></td>
		</tr>
		<tr>
<%		if((int)reader["SheetType"]==4) { %>
			<td>Damage:</td><td colspan=3><%= reader["DamageValue"] %> / <%= reader["Crippled"] %><% if((int)reader["CrewValue"]!=0) Response.Write(" / "+reader["CrewValue"]); %></td>
<%		} else { %>
			<td>Damage:</td><td><%= reader["DamageValue"] %> / <%= reader["Crippled"] %></td>
			<td>Crew:</td><td><%= reader["CrewValue"] %> / <%= reader["Skeletoned"] %></td>
<%		} %>
		</tr>
	</tbody>
</table>
<table class='online-main-table' style='padding:0; border-collapse:collapse;'>
	<thead>
		<tr style='background:#ccc'>
			<th style='text-align:start'>Weapon name</th>
			<th>Range</th>
			<th>Arc</th>
			<th>AD</th>
			<th style='text-align:start'>Special</th>
		</tr>
	</thead>
	<tbody>
<%		int m=0;
		foreach(string Arc in WeaponArcs) {
			if(!DBNull.Value.Equals(reader["Weapons"+Arc])) {
				m=WriteWeapon2(Arc,(string)reader["Weapons"+Arc],m);
			}
		}
		if(!DBNull.Value.Equals(reader["Notes"]))
			Response.Write("<tr><td colspan=4 style='padding-top:15px'>"+reader["Notes"]+"</td></tr>");
%>
		<tr style='text-align:center'>
			<td colspan=5 class='subheading' style='padding-top:10px;'><small>All Content Copyright Mongoose Publishing 2009-<%= DateTime.Now.Year %>. Reproduced with permission.</small></td>
		</tr>
	</tbody>
</table>
<%	} else {
		Response.Write("No such ship");
	}
%>
<style type="text/css">
:root {
	--ship-damage-crippled:<%= ((string)reader["CrippledColour"]).Replace("&H","#") %>;
	--ship-damage-crippled2:<%= ((string)reader["SecondCrippled"]).Replace("&H","#") %>;
}
</style>
<%	reader.Close(); %>
<!--#include virtual="includes/footer.aspx"-->
<%	TheEnd(); %>
