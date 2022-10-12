<%@ Import namespace="System.Drawing" %>
<%@ Import namespace="System.Drawing.Imaging" %>
<%@ Import Namespace="System.IO" %>
<SCRIPT RUNAT="Server">
Private Function GetEncoderInfo(ByVal mimeType As String) As ImageCodecInfo
	Dim j As Integer
	Dim encoders As ImageCodecInfo()
	encoders = ImageCodecInfo.GetImageEncoders()
	For j = 0 To encoders.Length
		If encoders(j).MimeType = mimeType Then
			Return encoders(j)
		End If
	Next j
	Return Nothing
End Function

Sub Page_Load
	Dim objBitmap As Bitmap
	Dim tmpBitmap As Bitmap
	Dim objGraphics As Graphics
	Dim fnt As Font
	Dim x,y,h As Integer
	Dim objType,objX,objY,objSize As Integer
	Dim objString,objName,worldtype As String
	Dim jpgQuality As Integer

	' ################### CONFIGURATION ####################
	jpgQuality=Request("Quality")
	If jpgQuality=0 Then jpgQuality=80
	' ################### END CONFIGURATION ####################

	' ################### GRAPHICAL PART #########################
	' Load background image.
	If Request("background")="" Then
		Response.Write("Please use <a href='index.html'>the map generation utility</a> to create a campaign map")
		Response.End
	End If

	objBitmap=System.Drawing.Image.FromFile(Server.MapPath("") & "/" & Request("background"))

	' Initialize Graphics Class
	objGraphics=Graphics.FromImage(objBitmap)
	objGraphics.SmoothingMode=Drawing.Drawing2D.SmoothingMode.HighQuality
	objGraphics.InterpolationMode=Drawing.Drawing2D.InterpolationMode.HighQualityBicubic
	objGraphics.PixelOffsetMode=Drawing.Drawing2D.PixelOffsetMode.HighQuality
	objGraphics.TextRenderingHint=System.Drawing.Text.TextRenderingHint.AntiAlias
	fnt=new Font("Impact",15)

	' Add objects.
	For x=1 To 50
		If Request("obj" & x)<>"" Then

			' Extract the values
			objString=Request("obj" & x)
			objType=Left(objString,Instr(objString,"|")-1)
			objString=Right(objString,Len(objString)-Instr(objString,"|"))
			objX=Left(objString,Instr(objString,"|")-1)
			objString=Right(objString,Len(objString)-Instr(objString,"|"))
			objY=Left(objString,Instr(objString,"|")-1)
			objString=Right(objString,Len(objString)-Instr(objString,"|"))
			objSize=Left(objString,Instr(objString,"|")-1)
			objName=Right(objString,Len(objString)-Instr(objString,"|"))

			' Manipulate the values
			objX=objX*2
			objY=(objY-97)*2
			objSize=objSize*2

			' Draw the object
			tmpBitmap=System.Drawing.Image.FromFile(Server.MapPath("") & "/png/object_" & objType & ".png")
			y=objSize*tmpBitmap.Height/tmpBitmap.Width
			objGraphics.DrawImage(tmpBitmap,objX,objY,objSize,y)

			' Write the labels
			fnt=new Font("Arial",16)
			h=objGraphics.MeasureString(objName,fnt).Width
			objGraphics.DrawString(objName,fnt,Brushes.White,objX+objSize/2-h/2,objY+y)
			If objType=1 Then worldtype="Construction Yard"
			If objType=2 Then worldtype="Diplomatic Station"
			If objType=3 Then worldtype="Military Installation"
			If objType=4 Then worldtype="Scrap Yard"
			If objType=5 Then worldtype="Space Docks"
			If objType=6 Then worldtype="Trade Station"
			If objType=7 Then worldtype="Asteroid Belt"
			If objType=8 Then worldtype="Planetary Ring"
			If objType=9 Then worldtype="Rich Dustcloud"
			If objType=10 Then worldtype="Ship Graveyard"
			If objType=11 Then worldtype="Gas Giant: Medium-Yield"
			If objType=12 Then worldtype="Gas Giant: Low-Yield"
			If objType=13 Then worldtype="Gas Giant: High-Yield"
			If objType=14 Then worldtype="Hidden Outpost"
			If objType=15 Then worldtype="Leisure World"
			If objType=16 Then worldtype="Primitive World"
			If objType=17 Then worldtype="Industrial World"
			If objType=18 Then worldtype="Agrarian World"
			If objType=19 Then worldtype="Commerce World"
			If objType=20 Then worldtype="Barren World"
			If objType=21 Then worldtype="Ice World"
			If objType=22 Then worldtype="Molten World"
			If objType=23 Then worldtype="Toxic World"
			If objType=24 Then worldtype="Temperate Planet"
			If objType=25 Then worldtype="Verdant Planet"
			If objType=26 Then worldtype="Water Planet"
			If objType=27 Then worldtype="Jump Gate"
			If objType=28 Then worldtype="Ancient Jump Gate"
			If objType=29 Then worldtype="Faulty Jump Gate"
			If objType=30 Then worldtype="Mining Outpost"
			If objType=31 Then worldtype="Observation Outpost"
			If objType=32 Then worldtype="Religious Outpost"
			If objType=33 Then worldtype="Scientific Outpost"
			If objType=34 Then worldtype="Ice-Rock Comet"
			If objType=35 Then worldtype="Mineral-Rich Comet"
			fnt=new Font("Arial",10)
			h=objGraphics.MeasureString("(" & worldtype & ")",fnt).Width
			If objName="" Then
				objGraphics.DrawString(worldtype,fnt,Brushes.White,objX+objSize/2-h/2,objY+y)
			Else
				objGraphics.DrawString("(" & worldtype & ")",fnt,Brushes.White,objX+objSize/2-h/2,objY+y+23)
			End If
		End If
	Next
	' ################### END GRAPHICAL PART #####################

	' ################### OUTPUT AS JPEG #########################
	Response.ContentType="image/jpeg"
	Response.AddHeader("Content-Disposition","attachment; filename=map.jpg")
	Dim eps As EncoderParameters=New EncoderParameters(1)
	eps.Param(0)=New EncoderParameter(System.Drawing.Imaging.Encoder.Quality,jpgQuality)
	Dim ici As ImageCodecInfo=GetEncoderInfo("image/jpeg")
	objBitmap.Save(Response.OutputStream,ici,eps)
	objBitmap.Dispose

	' ################### OUTPUT AS PNG ##########################
'	Response.ContentType="image/png"
'	Dim MemStream As New MemoryStream()
'	objBitmap.Save(MemStream, ImageFormat.Png)
'	MemStream.WriteTo(Response.OutputStream)
'	objBitmap.Dispose

End Sub
</SCRIPT>
