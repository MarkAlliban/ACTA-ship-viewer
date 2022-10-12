<!--#include virtual="includes/funcs.aspx"-->
<!--#include virtual="includes/header.aspx"-->
<%	string Version=Request.Params["v"]; %>
<div class='ship-list container'>
<%	if(Version!="2e" && Version!="ar") {
		Response.Write("<h2 style='padding:20px 0'>Version not specified or invalid</h2></div>");
		TheEnd();
	}
	if(Version=="2e") Response.Write("<h1>ACTA 2nd Edition PDFs</h1>");
	if(Version=="ar") Response.Write("<h1>Armageddon PDFs</h1>"); %>
<p>These sheets are for an older version of the game. They are available to download as a ZIP containing PDF files for all ships.</p>
<%	string SQLStmt = "SELECT RaceID,RaceName ";
	if(Version=="2e") SQLStmt += "FROM [2e_RaceTable] ";
	if(Version=="ar") SQLStmt += "FROM AR_RaceTable ";
	SQLStmt += "ORDER BY RaceName";
	SqlCommand cmd = new SqlCommand(SQLStmt,conn);
	SqlDataReader reader = cmd.ExecuteReader();
	while(reader.Read()) {
		Response.Write("<h3 style='margin:5px 0'><a href=\""+Version+"/"+reader["RaceName"]+".zip\">"+reader["RaceName"]+"</a></h3>");
	}
	reader.Close();
%>
</div>
<!--#include virtual="includes/footer.aspx"-->
<%	TheEnd(); %>
