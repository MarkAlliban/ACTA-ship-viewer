<!--#include virtual="includes/funcs.aspx"-->
<%	if(Request.Params["fleety"]!="yes") { %>
<!--#include virtual="includes/header.aspx"-->
<%	}
	string Version=Request.Params["v"];
	if(Version!="pp" && Version!="dw" && Version!="dr" && Version!="Ancients") {
		Response.Write("<h2 style='padding:20px 0'>Version not specified or invalid</h2></div>");
		TheEnd();
	}
	string ShipSheetID=Request.Params["ShipSheetID"];
	int NumPerSheet=4;
	if(Version=="Ancients") NumPerSheet=1;
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
		if((int)reader["SheetType"]==4) NumPerSheet=1;
%>
<table class='ship-main-table' id='ShipSheet<%= ShipSheetID %>'>
	<colgroup class='ship-col-1'>
<%		if(NumPerSheet>1) {
			for(int i=0;i<NumPerSheet;i++) { %>
	<colgroup class='ship-col-2<% if(i>0) Response.Write(" nomobile"); %>'>
	<colgroup class='ship-col-3<% if(i>0) Response.Write(" nomobile"); %>'>
	<colgroup class='ship-col-3<% if(i>0) Response.Write(" nomobile"); %>'>
<%			}
		} else { %>
	<colgroup class='ship-col-25'>
	<colgroup class='ship-col-12'>
	<colgroup class='ship-col-12'>
<%		} %>
	<tbody>
		<tr>
			<td rowspan=2 class='heading grey'>
				<% if(ShipSheetID!=null) Response.Write("<div class='ship-close' data-shipid='"+ShipSheetID+"'>&#0215;</div>"); %>
				<%= reader["RaceName"] %> - <%= reader["LevelName"] %>
			</td>
			<td colspan=<%= NumPerSheet*3 %> class='subheading grey'>Name / Crew Quality</td>
		</tr>
		<tr>
<%		for(int x=0;x<NumPerSheet;x++) { %>
			<td colspan=2 class='heading<% if(x>0) Response.Write(" nomobile"); %>' style='position:relative; height:21px'><div class='ship-name' contenteditable='true'></div></td>
			<td class='heading<% if(x>0) Response.Write(" nomobile"); %>' style='position:relative'><div class='ship-cq' contenteditable='true'></div></td>
<%		} %>
		</tr>
		<tr>
			<td rowspan=2 class='heading grey'><%= reader["ShipName"] %></td>
			<td colspan=<%= NumPerSheet*3 %> class='subheading grey'>
<%		if((int)reader["SheetType"]!=4) Response.Write("Speed");
		if((int)reader["SheetType"]!=4 && (int)reader["SheetType"]!=2 && Version!="Ancients") Response.Write(" / ");
		if((int)reader["SheetType"]!=2 && Version!="Ancients") Response.Write("Troops");
%></td>
		</tr>
		<tr>
<%		for(int x=0;x<NumPerSheet;x++) {
			if((int)reader["SheetType"]!=4) {
				Response.Write("<td class='heading");
				if(x>0) Response.Write(" nomobile");
				Response.Write("'");
				if((int)reader["SheetType"]==2 || Version=="Ancients") Response.Write(" colspan=3");
				Response.Write(">"+reader["ShipSpeed"] +"</td>");
			}
			if((int)reader["SheetType"]!=2 && Version!="Ancients") {
				Response.Write("<td class='heading");
				if(x>0) Response.Write(" nomobile");
				Response.Write("' colspan=");
				if((int)reader["SheetType"]==4) Response.Write("3"); else Response.Write("2");
				Response.Write(">"+reader["ShipTroops"]+"</td>");
			}
		} %>
		</tr>
		<tr>
			<td rowspan=<%
		int NumRows=6;
		if(Traits.Any(tr => tr.Length>=7 && tr.Substring(0,7)=="Shields")) NumRows+=2;
		if((int)reader["SheetType"]==2) NumRows-=2;
		if((int)reader["SheetType"]==4) NumRows-=4;
		if(Version=="Ancients") NumRows-=2;
		Response.Write(NumRows); %> style='vertical-align:top'>
				<table class='ship-info-table'>
					<tbody>
						<tr><td>Service date</td><td><%= ServiceDate %></td></tr>
						<tr><td>Hull</td><td><%= reader["Hull"] %></td></tr>
						<tr><td>Turns</td><td><%= reader["Turns"] %></td></tr>
<%		if(Craft.Length>0) {
			int TotalFighters=0;
			int SwappableFighters=0,UnswappableFighters=0;
			string VeryFixed="";
			if((string)reader["RaceName"]=="Drakh") {
				foreach(string Trait in Traits) {
					if(Trait.Length>=12 && Trait.Substring(0,12).ToLower()=="huge hangars")
						SwappableFighters=Int32.Parse(Trait.Substring(13));
				}
				if((string)reader["ShipName"]=="Amu Mothership") {
					SQLStmt = "SELECT ShortName,RaceID,ShipTroops,Source FROM ";
					if(Version=="pp" || Version=="Ancients") SQLStmt += "PP_ShipTable ";
					if(Version=="dw") SQLStmt += "DW_ShipTable ";
					if(Version=="dr") SQLStmt += "DR_ShipTable ";
					SQLStmt += "WHERE RaceID=@RaceID AND SheetType=3 ORDER BY ShipSpeed,ShipName";
				} else {
					SQLStmt = "SELECT ShortName,RaceID,ShipTroops,Source FROM ";
					if(Version=="pp" || Version=="Ancients") SQLStmt += "PP_ShipTable ";
					if(Version=="dw") SQLStmt += "DW_ShipTable ";
					if(Version=="dr") SQLStmt += "DR_ShipTable ";
					SQLStmt += "WHERE RaceID=@RaceID AND SheetType=3 And ShipTroops<2 ORDER BY ShipName";
				}
			} else {
				SQLStmt = "SELECT ShortName,RaceID,ShipTroops,Source FROM ";
				if(Version=="pp" || Version=="Ancients") SQLStmt += "PP_ShipTable ";
				if(Version=="dw") SQLStmt += "DW_ShipTable ";
				if(Version=="dr") SQLStmt += "DR_ShipTable ";
				SQLStmt += "WHERE RaceID=@RaceID AND SheetType=3 ORDER BY ShipName";
			}
			SqlCommand cmd2 = new SqlCommand(SQLStmt,conn);
			cmd2.Parameters.AddWithValue("@RaceID",reader["RaceID"]);
			SqlDataReader reader2 = cmd2.ExecuteReader();
			// Count the swappable fighters, and build strings for fixed fighters
			while(reader2.Read()) {
				foreach(string cr in Craft) {
					if(cr.Length>=((string)reader2["ShortName"]).Length && cr.Substring(0,((string)reader2["ShortName"]).Length)==(string)reader2["ShortName"]) {
						if(cr.Substring(cr.IndexOf("(")+1).Replace(")","").All(c=>Char.IsNumber(c))) {
							int ThisNum=Int32.Parse(cr.Substring(cr.IndexOf("(")+1).Replace(")",""));
							if((int)reader2["ShipTroops"]==1) {
								SwappableFighters+=ThisNum;
							} else {
								if((int)reader2["ShipTroops"]==0) VeryFixed+=reader2["ShortName"]+" ("+ThisNum+")<br>"; else UnswappableFighters+=ThisNum;
							}
						}
					}
				}
			}
			reader2.Close();
			reader2 = cmd2.ExecuteReader();
			if(SwappableFighters==0) { %>
						<tr><td>Craft</td><td><%= reader["Craft"] %></td></tr>
<%			} else { %>
						<tr><td>Craft</td><td id='fighter-text-<%= ShipSheetID %>' class='fighter-swappable' onClick="document.getElementById('fighter-select-<%= ShipSheetID %>').classList.toggle('active')"><%= reader["Craft"] %></td></tr>
						<tr><td colspan=2><form class='fighter-select noprint' id='fighter-select-<%= ShipSheetID %>' onSubmit='return false;'>
<%				int FighterNum=0;
				while(reader2.Read()) {
					FighterNum++;
					int ThisNum=0;
					foreach(string cr in Craft) {
						if(cr.Length>=((string)reader2["ShortName"]).Length && cr.Substring(0,((string)reader2["ShortName"]).Length)==(string)reader2["ShortName"]) {
							if(cr.IndexOf("(")>0) {
								ThisNum=Int32.Parse(cr.Substring(cr.IndexOf("(")+1).Replace(")",""));
							}
						}
					}
					if((int)reader2["ShipTroops"]>0) {
						Response.Write("<div class='fighter-select-row'>");
						Response.Write("<p>"+reader2["ShortName"]);
						if((string)reader["RaceName"]=="Drakh") Response.Write(" ("+reader2["ShipTroops"]+")");
						if((int)reader2["ShipTroops"]==3) Response.Write(" <span style='color:#f00'>$</span>");
						if((string)reader2["Source"]!="2e" && (string)reader2["Source"]!="P&P" && (string)reader2["Source"]!="Darkness Rising" && (string)reader2["Source"]!="Dilgar War") Response.Write(" <span style='color:#f00'>&</span>");
						Response.Write("</p>");
						Response.Write("<input type='number' id='fighters-"+ShipSheetID+"-"+FighterNum+"' class='fighter-select-box' ");
						if((int)reader2["ShipTroops"]==1) Response.Write("min=0 max="+SwappableFighters+" "); else Response.Write("min="+ThisNum+" max="+(ThisNum+SwappableFighters)+" ");
						Response.Write("data-name=\""+reader2["ShortName"]+"\" ");
						Response.Write("data-cost=\"");
						if((string)reader["RaceName"]=="Drakh") Response.Write(reader2["ShipTroops"]); else Response.Write("1");
						Response.Write("\" value='"+ThisNum+"'>");
						Response.Write("</div>");
					}
				}
				reader2.Close();
%>
							<input type='hidden' id='fighter-swappable-<%= ShipSheetID %>' value='<%= SwappableFighters %>'>
							<input type='hidden' id='fighter-unswappable-<%= ShipSheetID %>' value='<%= UnswappableFighters %>'>
							<input type='hidden' id='fighter-veryfixed-<%= ShipSheetID %>' value='<%= VeryFixed %>'>
							<div style='text-align:center; padding:5px 0'>
								<button type='button' onClick="selectFighters('<%= ShipSheetID %>')">OK</button>
								<button type='reset'>Reset</button>
							</div>
						</form></td></tr>
<%			}
		} %>
						<tr>
							<td>Traits</td>
							<td>
<%		foreach(string Trait in Traits) {
			if(Trait!="") {
				Response.Write(Trait);
				if(!PermaTrait(Trait)) {
					for(int i=0;i<NumPerSheet-1;i++) {
						Response.Write("<div style='float:right;display:inline-block;border:1px solid black; border-left:0; width:10px; height:9px;'></div>");
					}
					Response.Write("<div style='float:right;display:inline-block;border:1px solid black; width:10px; height:9px;'></div>");
				}
				Response.Write("<br>");
			}
		} %>
							</td>
						</tr>
					</tbody>
				</table>
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
<%		foreach(string Arc in WeaponArcs) {
			if(!DBNull.Value.Equals(reader["Weapons"+Arc])) {
				WriteWeapon(Arc,(string)reader["Weapons"+Arc],(int)reader["RaceID"],(string)reader["ShipName"],ShipSheetID);
			}
		}
		if(!DBNull.Value.Equals(reader["Notes"]))
			Response.Write("<tr><td colspan=4 style='padding-top:15px'>"+reader["Notes"]+"</td></tr>");
%>
					</tbody>
				</table>
			</td>
<%		if(Traits.Any(tr => tr.Length>=7 && tr.Substring(0,7)=="Shields"))
			Response.Write("<td colspan="+(NumPerSheet*3)+" class='subheading grey'>Shields</td>");
		else
			Response.Write("<td colspan="+(NumPerSheet*3)+" class='subheading grey'>Hull damage</td>");
%>
		</tr>
<%		if(Traits.Any(tr => tr.Length>=7 && tr.Substring(0,7)=="Shields")) {
			Response.Write("<tr>");
			for(int i=0;i<NumPerSheet;i++) {
				Response.Write("<td colspan=3 class='heading");
				if(i>0) Response.Write(" nomobile");
				Response.Write("' style='vertical-align:top; height:80px;'>");
				foreach(string Trait in Traits) {
					if(Trait.Length>=7 && Trait.Substring(0,7)=="Shields")
						Response.Write(Trait.Substring(8).Replace("/"," / "));
				}
				Response.Write("</td>");
			}
			Response.Write("</tr>");
			Response.Write("<tr><td colspan="+(NumPerSheet*3)+" class='subheading grey'>Hull damage</td></tr>");
		} %>
		<tr>
<%		for(int i=0;i<NumPerSheet;i++) {
			if(Traits.Any(tr => tr.Length>=11 && tr.Substring(0,11).ToLower()=="self-repair") || (int)reader["SheetType"]==4) {
				Response.Write("<td colspan=3 class='heading");
				if(i>0) Response.Write(" nomobile");
				Response.Write("' style='vertical-align:top; height:120px;'>");
				Response.Write(reader["DamageValue"]);
				if((int)reader["Crippled"]!=0) Response.Write(" / "+reader["Crippled"]);
				if((int)reader["SheetType"]==4 && (int)reader["CrewValue"]>0) Response.Write(" / "+reader["CrewValue"]);
				Response.Write("</div>");
			} else {
				Response.Write("<td colspan=3 style='padding:0; vertical-align:top; background:#aaa; height:20px'");
				if(i>0) Response.Write(" class='nomobile'");
				Response.Write(">");
				Response.Write("<div class='ship-damage-boxes'>");
				for(int j=0;j<(int)reader["DamageValue"];j++) {
					Response.Write("<div class='ship-dmg'");
					if(j>=(int)reader["DamageValue"]-(int)reader["Crippled"] && i%2==0) Response.Write(" style='background:"+((string)reader["CrippledColour"]).Replace("&H","#")+"'");
					if(j>=(int)reader["DamageValue"]-(int)reader["Crippled"] && i%2==1) Response.Write(" style='background:"+((string)reader["SecondCrippled"]).Replace("&H","#")+"'");
					Response.Write("></div>");
				}
				Response.Write("</div>");
			} %>
				</td>
<%		} %>
		</tr>
<%		if((int)reader["SheetType"]!=4 && (int)reader["SheetType"]!=2 && Version!="Ancients") { %>
		<tr>
			<td colspan=<%= NumPerSheet*3 %> class='subheading grey'>Crew casualties</td>
		</tr>
		<tr style='background:#aaa; height:20px'>
<%			for(int i=0;i<NumPerSheet;i++) { %>
				<td colspan=3 style='padding:0; vertical-align:top'<% if(i>0) Response.Write(" class='nomobile'"); %>>
					<div class='ship-damage-boxes'>
<%				for(int j=0;j<(int)reader["CrewValue"];j++) {
					Response.Write("<div class='ship-dmg'");
					if(j>=(int)reader["CrewValue"]-(int)reader["Skeletoned"] && i%2==0) Response.Write(" style='background:"+((string)reader["CrippledColour"]).Replace("&H","#")+"'");
					if(j>=(int)reader["CrewValue"]-(int)reader["Skeletoned"] && i%2==1) Response.Write(" style='background:"+((string)reader["SecondCrippled"]).Replace("&H","#")+"'");
					Response.Write("></div>");
				} %>
					</div>
				</td>
<%			} %>
		</tr>
<%		}
		if((int)reader["SheetType"]!=4) { %>
		<tr>
			<td colspan=<%= NumPerSheet*3 %> class='subheading grey'>Critical hits</td>
		</tr>
		<tr>
<%			for(int i=0;i<NumPerSheet;i++) { %>
				<td colspan=3 style='height:100px'<% if(i>0) Response.Write(" class='nomobile'"); %>>
				</td>
<%			} %>
		</tr>
<%		} %>
		<tr>
			<td colspan=<%= NumPerSheet*3+1 %> class='subheading'>All Content Copyright Mongoose Publishing 2009-<%= DateTime.Now.Year %>. Reproduced with permission.</td>
		</tr>
</table>
<%	} else {
		Response.Write("No such ship");
	}
	reader.Close();
	if(Request.Params["fleety"]!="yes") { %>
<!--#include virtual="includes/footer.aspx"-->
<%	}
	TheEnd(); %>
