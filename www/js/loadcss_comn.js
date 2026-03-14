
//if parent page has gCssName, use it
if ( parent.gCssName != undefined && parent.gCssName != '' )
{
	gCssName = parent.gCssName;
}
else
{
	gCssName = "main_style_ct.css";
}
document.write('<link href=\"../css/' + gCssName + '\" rel=\"stylesheet\" type=\"text/css\"/>');
