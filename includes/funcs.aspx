<%@ Page Language="C#" %>
<%@ Import namespace="System.Data" %>
<%@ Import namespace="System.Data.SqlClient" %>
<script runat="server" language="C#">
SqlConnection conn = new SqlConnection("Server=www.great1.com;User Id=sa;Password=n4L2HsD;Database=MarkTest;MultipleActiveResultSets=true");
List<string> WeaponArcs=new List<string>();

protected void Page_Load(Object s,EventArgs e) {
	// If this is the production server, make sure we are connected to HTTPS
	if(Request.Url.Scheme=="http") {
		Response.RedirectPermanent("https://"+Request.Url.Host+Request.Url.AbsolutePath);
	}
	if(Request.Url.Host=="www.ibisfightclub.tk") Response.RedirectPermanent("https://ibisfightclub.tk"+Request.Url.AbsolutePath);
	if(Request.Url.Host=="www.ibisfightclub.ml") Response.RedirectPermanent("https://ibisfightclub.ml"+Request.Url.AbsolutePath);
	if(Request.RawUrl=="/index.aspx") Response.RedirectPermanent("https://"+Request.Url.Host);

	// Open a database connection
	try {
		conn.Open();
	} catch(Exception ex) {
		DisplayMaintenanceScreen("Error connecting to database: "+ex.Message);
	}

	WeaponArcs.Add("Boresight");
	WeaponArcs.Add("Forward");
	WeaponArcs.Add("Port");
	WeaponArcs.Add("Starboard");
	WeaponArcs.Add("Aft");
	WeaponArcs.Add("BoresightAft");
	WeaponArcs.Add("Turret");
}

protected void OutputShipList(string Version,int SplitSource,string UrlStem,SqlDataReader reader) {
	string LastRace="";
	int NumLevels=6;
	int DoingLevel=0;
	string OldSource="";
	// Go through each of the ships
	if(Version=="Ancients") {
		while(reader.Read()) {
			if((string) reader["RaceName"] != LastRace) {
				Response.Write("<h3 style='margin:5px 0'>"+reader["RaceName"]+"</h3>");
				Response.Write("<div class='ship-list-table'><div></div><div style='background-color:#fc8'>");
				LastRace=(string) reader["RaceName"];
			}
			Response.Write("<p><a href='"+UrlStem+"-ship.aspx?v=Ancients&ShipID="+reader["ShipID"]+"'>"+reader["ShortName"]+"</a></p>");
		}
		Response.Write("</div><div></div></div>");
	} else {
		while(reader.Read()) {
			// If the race of this ship is different than the last one, start a new row
			if((string) reader["RaceName"] != LastRace) {
				if(LastRace != "") {
					// Finish off the current box
					if(DoingLevel > 0) Response.Write("</div>");
					// If the previous race didn't go all the way to level 6, add blanks
					if(DoingLevel > 0 && DoingLevel < NumLevels) {
						for( ; DoingLevel < NumLevels ; DoingLevel++) {
							Response.Write("<div></div>");
						}
					}
					// Finish of fthe current row
					Response.Write("</div>");
				}

				// If this ship is from a new source, show it
				if(OldSource != (string)reader["Source"] && SplitSource==1) {
					Response.Write("<h1 style='margin:50px 0 0 0'>"+reader["Source"]+"</h1>");
					OldSource=(string)reader["Source"];
				}
				// Write new race name
				Response.Write("<h3 style='margin:5px 0'>"+reader["RaceName"]+"</h3>");
				Response.Write("<div class='ship-list-table'>");
				DoingLevel=0;
				LastRace=(string) reader["RaceName"];
			}
			// If this ship is a different level than the last, make a new box
			if(DoingLevel != (int)reader["ShipLevel"]) {
				for( ; DoingLevel < (int)reader["ShipLevel"] ; DoingLevel++) {
					if(DoingLevel>0) Response.Write("</div>");
					Response.Write("<div>");
				}
				Response.Write("<div class='ship-levels-inline'><b>"+reader["LevelName"]+"</b></div>");
			}
			// Show a link, based on the ship type
			switch((int)reader["SheetType"]) {
				case 1:
				case 2:
					Response.Write("<p><a href='"+UrlStem+"-ship.aspx?v="+Version+"&ShipID="+reader["ShipID"]+"'>"+reader["ShortName"]+"</a></p>");
					break;
				case 3:
					Response.Write("<p><a class='link-auxcraft' href='"+UrlStem+"-auxcraft.aspx?v="+Version+"&ShipID="+reader["ShipID"]);
					if(SplitSource==1) Response.Write("&Additionals=1");
					Response.Write("'>"+reader["ShortName"]+" ("+reader["Craft"]+")</a></p>");
					break;
				case 4:
					Response.Write("<p><a class='link-station' href='"+UrlStem+"-ship.aspx?v="+Version+"&ShipID="+reader["ShipID"]+"'>"+reader["ShortName"]+"</a></p>");
					break;
			}
		}
		// Close the boxes
		if(DoingLevel > 0) Response.Write("</div>");
		if(DoingLevel > 0 && DoingLevel < NumLevels) {
			for( ; DoingLevel < NumLevels ; DoingLevel++) {
				Response.Write("<div></div>");
			}
		}
		Response.Write("</div>");
	}
}

protected bool PermaTrait(string Trait) {
	if(Trait=="<I>Lumbering</I>" || Trait=="Lumbering" || Trait=="<I>Immobile</I>" || Trait=="Immobile" || Trait=="<I>Space Station</I>" || Trait=="Space Station" || Trait=="<I>Unique</I>" || Trait=="Unique" || Trait=="None")
		return true;
	if(Trait.Length>=10)
		if(Trait.Substring(0,10)=="<I>Targets") return true;
	if(Trait.Length>=7)
		if(Trait.Substring(0,7)=="Targets") return true;
	return false;
}
protected void WriteWeapon(string Arc,string Weapons,int RaceID,string ShipName,string ShipSheetID) {
	string[] WeaponsList=Weapons.Split(';');
	Response.Write("<tr><td colspan=4 class='arc'>"+Arc+"</td></tr>");
	int ThisID=0;
	foreach(string Weapon in WeaponsList) {
		ThisID++;
		Response.Write("<tr>");
		string[] WeaponAttrs=Weapon.Split(':');
		int ThisCol=0;
		bool IsMissile=false;
		foreach(string WeaponAttr in WeaponAttrs) {
			ThisCol++;
			if(ShipSheetID!="" && (WeaponAttr=="Missile Rack" || WeaponAttr=="Advanced Missile Rack" || WeaponAttr=="Missile Racks") && (RaceID==5 || RaceID==6 || RaceID==7) && ShipName.Substring(0,6)!="Tethys" && ShipName.Substring(0,6)!="Hermes") IsMissile=true;
			if(IsMissile==true) {
				Response.Write("<td style='cursor:pointer' id='weapon-"+ShipSheetID+"-"+Arc+"-"+ThisID);
				if(ThisCol==1) Response.Write("-name");
				if(ThisCol==2) Response.Write("-range");
				if(ThisCol==3) Response.Write("-ad");
				if(ThisCol==4) Response.Write("-traits");
				Response.Write("' onClick='selectMissile("+ShipSheetID+",\""+Arc+"\","+ThisID+")'");
				Response.Write(">"+WeaponAttr);
				if(ThisCol==1) {
					Response.Write(" <i class='noprint missile-swapicon fa-solid fa-sync-alt'></i>");
				}
				Response.Write("</td>");
			} else {
				Response.Write("<td>"+WeaponAttr+"</td>");
			}
		}
		Response.Write("</tr>");
	}
}
protected int WriteWeapon2(string Arc,string Weapons,int m) {
	string[] WeaponsList=Weapons.Split(';');
	foreach(string Weapon in WeaponsList) {
		m=(m+1)%2;
		Response.Write("<tr");
		if(m==0) Response.Write(" style='background:#ddd'");
		Response.Write(">");
		string[] WeaponAttrs=Weapon.Split(':');
		Response.Write("<td>"+WeaponAttrs[0]+"</td>");
		Response.Write("<td style='text-align:center'>"+WeaponAttrs[1]+"</td>");
		Response.Write("<td style='text-align:center'>");
		switch(Arc) {
			case "Boresight": Response.Write("B"); break;
			case "Forward": Response.Write("F"); break;
			case "Port": Response.Write("P"); break;
			case "Starboard": Response.Write("S"); break;
			case "Aft": Response.Write("A"); break;
			case "BoresightAft": Response.Write("BA"); break;
			case "Turret": Response.Write("T"); break;
		}
		Response.Write("</td>");
		Response.Write("<td style='text-align:center'>"+WeaponAttrs[2]+"</td>");
		Response.Write("<td>");
		if(WeaponAttrs.Length>3) {
			string[] WeaponTraits=WeaponAttrs[3].Split('/');
			foreach(string ThisTrait in WeaponTraits) {
				if(ThisTrait=="A") Response.Write("Accurate<BR>");
				if(ThisTrait=="AP") Response.Write("AP<BR>");
				if(ThisTrait=="B") Response.Write("Beam<BR>");
				if(ThisTrait=="DD") Response.Write("Double Damage<BR>");
				if(ThisTrait=="EM") Response.Write("Energy Mine<BR>");
				if(ThisTrait=="MB") Response.Write("Mini-Beam<BR>");
				if(ThisTrait=="MD") Response.Write("Mass Driver<BR>");
				if(ThisTrait=="OS") Response.Write("One Shot<BR>");
				if(ThisTrait=="OB") Response.Write("Orbital Bomb<BR>");
				if(ThisTrait=="P") Response.Write("Precise<BR>");
				if(ThisTrait=="QD") Response.Write("Quad Damage<BR>");
				if(ThisTrait=="SAP") Response.Write("Super AP<BR>");
				if(ThisTrait=="SL") Response.Write("Slow-Loading<BR>");
				if(ThisTrait=="SL*") Response.Write("Slow-Loading *<BR>");
				if(ThisTrait=="TD") Response.Write("Triple Damage<BR>");
				if(ThisTrait=="TL") Response.Write("Twin-Linked<BR>");
				if(ThisTrait=="W") Response.Write("Weak<BR>");
				if(ThisTrait=="VB") Response.Write("Virus Bomb<BR>");
			}
		}
		Response.Write("</td>");
		Response.Write("</tr>");
	}
	return m;
}

protected void DisplayMaintenanceScreen(string Reason) {
	Response.Write("<!DOCTYPE html>"+(char)10);
	Response.Write("<html class='no-js' lang='en'>"+(char)10);
	Response.Write("<head>"+(char)10);
	Response.Write("	<meta charset='UTF-8' />"+(char)10);
	Response.Write("	<meta http-equiv='X-UA-Compatible' content='IE=edge' />"+(char)10);
	Response.Write("	<meta name='description' content='' />"+(char)10);
	Response.Write("	<meta name='viewport' content='width=device-width, initial-scale=1' />"+(char)10);
	Response.Write("	<link rel='shortcut icon' type='image/png' sizes='16x16' href='/favicon.png' />"+(char)10);
	Response.Write("	<link rel='icon' type='image/png' sizes='16x16' href='/images/favicon-16x16.png' />"+(char)10);
	Response.Write("	<link rel='icon' type='image/png' sizes='32x32' href='/images/favicon-32x32.png' />"+(char)10);
	Response.Write("	<link rel='icon' type='image/png' sizes='180x180' href='/images/favicon-180x180.png' />"+(char)10);
	Response.Write("	<link rel='icon' type='image/png' sizes='192x192' href='/images/favicon-192x192.png' />"+(char)10);
	Response.Write("	<link rel='icon' type='image/png' sizes='512x512' href='/images/favicon-512x512.png' />"+(char)10);
	Response.Write("	<link rel='apple-touch-icon' sizes='180x180' type='image/png' href='/images/favicon-180x180.png' />"+(char)10);
	Response.Write("	<link rel='stylesheet' href='https://fonts.googleapis.com/css2?family=Roboto+Slab&family=Open+Sans&display=swap'>"+(char)10);
	Response.Write("	<script src='https://kit.fontawesome.com/1dd753af00.js' crossorigin='anonymous'></scr"+"ipt>"+(char)10);
	Response.Write("	<link rel='stylesheet' type='text/css' href='includes/styles.css' />"+(char)10);
	Response.Write("</head>"+(char)10);
	Response.Write("<body>"+(char)10);
	Response.Write("<center>");
	Response.Write("<br /><br /><i class='fas fa-cogs fa-6x'></i><br /><br /><br />");
	Response.Write("<h3>Understanding is a three-edged sword</h3><br />");
	Response.Write(Reason);
	Response.Write("</center>");
	Response.Write("</body>");
	Response.Write("</html>");
	TheEnd();
}

protected void TheEnd() {
	if(conn.State==ConnectionState.Open) conn.Close();
	Response.End();
}
</script>
