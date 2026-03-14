var gstaArray=new Array();//active
var gslavestaArray=new Array();
var gallagentdata = "";
var g_agent_maxnum = 4;
var glandata = "";
var mainbr0 = "";
//level img(strength --> weak)
var imgsrcArr_2G = ["../image/WiFi2.4_4v2.png", "../image/WiFi2.4_3v2.png", "../image/WiFi2.4_1v2.png"];
var imgsrcArr_5G = ["../image/WiFi5.0_4v4.png", "../image/WiFi5.0_3v4.png", "../image/WiFi5.0_2v4.png", "../image/WiFi5.0_1v4.png"];
var imgsrcArr_6G = ["../image/WiFi6.0_4v2.png", "../image/WiFi6.0_3v2.png", "../image/WiFi6.0_2v2.png", "../image/WiFi6.0_1v2.png"];
var wifi_level_keyArr = [];

$(document).ready(function(){
	//优化滚动条，无需改动
	customScrollBar("html");
	
	showOrHideLoadingWindowFromIframe("show");
	
	XHR.get("get_lan_status", null, parseGetData);
	
	XHR.get("get_allagent_info", null, function(data){
		if(data.agent_maxnum != undefined)
		{
			g_agent_maxnum = data.agent_maxnum;
		}
	
		if ( data && data.allagentinfo )
		{
			gallagentdata = data.allagentinfo;
		}
	});
	
	getData();
});

function parseGetData(data)
{
	if ( data && data.lan_status )
	{
		glandata = data.lan_status;
		
		//active device
		for (var i=1; i<=glandata.max_lan_host_num; i++)
		{
			if ( eval('glandata.Active' + i) == 1 )
			{
				if ( eval('glandata.MACAddress' + i) && eval('glandata.IPAddress' + i))
				{
					var portid = eval('glandata.portid' + i);
					
					if (portid != "MeshSlaveAP")
					{
						gstaArray.push(i);
					}
					else
					{
						gslavestaArray.push(i);
					}
				}
			}
		}
	}
}


function getData()
{
	if ( gDebug ) //调试模式读取本地数据
	{
		getDataByAjax("../fake/mesh_info", parseMeshData);
	}
	else
	{
		XHR.get("get_mesh_info", null, parseMeshData);
	}
	
	showOrHideLoadingWindowFromIframe("hide");
}

var gparentArray=new Array();

/*
var gparentArray = [
	["mac", "key"],
	["02:DE:03:D5:F2:05", "rootap"],
	["00:0a:c2:d6:66:88", "agent1"],
	["00:0a:c2:d6:66:89", "agent2"]
];
*/

var gparentArray2=new Array();


function parseMeshData(getdata)
{
	var meshnetwkinfoHTML = '';
	var ssidandstainfoHTML = '';

	if ( getdata )
	{
		if(getdata.meshmode != "Master AP"){
			showOrHideLoadingWindowFromIframe("hide");
			return 0;
		}
		var meshdata = getdata;
		
		//start construct parentstr Array for root
		var singleparentArray=new Array();
		singleparentArray.push(meshdata.rootap.agent_mac1905.toUpperCase());
		singleparentArray.push("rootap");
		gparentArray.push(singleparentArray);
		
		var singleparentArray2=new Array();
		singleparentArray2.push(meshdata.rootap.mac_br0.toUpperCase());
		mainbr0 = meshdata.rootap.mac_br0.toUpperCase();
		singleparentArray2.push("rootap");
		gparentArray2.push(singleparentArray2);

		
		//end
		
		var gnodeDataArray=new Array();
		
		//root ap info
		var rootap_obj = new Object();
		rootap_obj = {
			key: "rootap",
			name: meshdata.rootap.mac_br0,
			source: "../image/Controller1.png",
			tips: 
				"AL_MAC:" + meshdata.rootap.controller_mac1905 + '\r \n' +
				"Serial Number:" + meshdata.rootap.SerialNumber + '\r \n' +
				"Model Name:" + meshdata.rootap.DeviceName,
		}

		var nodestr = JSON.stringify(rootap_obj);
		
		gnodeDataArray.push(JSON.stringify(rootap_obj));
		
		//agent ap info
		
		//start construct parentstr Array for agent
		for (var i=0; i<4; i++)
		{
			if (meshdata.agentap[i].active == 1)
			{
				var singleparentArray=new Array();
				
				var keystr = "Slave AP";
				keystr += eval(i+1);
				
				singleparentArray.push(meshdata.agentap[i].mac1905.toUpperCase());
				singleparentArray.push(keystr);
				gparentArray.push(singleparentArray);
				
				var singleparentArray2=new Array();
				
				var keystr = "Slave AP";
				keystr += eval(i+1);
				
				singleparentArray2.push(meshdata.agentap[i].mac_br0.toUpperCase());
				singleparentArray2.push(keystr);
				gparentArray2.push(singleparentArray2);
			}
		}
		//end
	
		for (var i=0; i<4; i++)
		{
			var single_agent = meshdata.agentap[i];
			
			if (single_agent.active == 1)
			{
				var parentstr = "Slave AP";
				parentstr += eval(i+1);
				
				
				var agentparentstr = "";
				
				agentparentstr = getParentStr(single_agent.neighbor_mac.toUpperCase());

				//agent conntected Band
				var band = "";
				for (var j=1; j<=glandata.max_lan_host_num; j++)
				{
					var mac = eval('glandata.MACAddress'+j);
					if(mac != undefined && mac.toUpperCase() == single_agent.mac_br0.toUpperCase()) {
						band = eval('glandata.Band' + j) == "2.4G" ? "2G" : eval('glandata.Band' + j);
					}
				}

				var srcImg = "";
				var wifi_level = -1;
				if (band != "") {
					wifi_level = rssiLevel(band, single_agent.rssi);
					srcImg = eval('imgsrcArr_' + band)[wifi_level];
				} else {
					srcImg = "../image/conn_eth.png";
				}

				var agent_obj = new Object();
				if (agentparentstr != "")//not found parent ap
				{

					//wifi level img
					var wifi_symbol_obj = new Object();
					wifi_symbol_obj = {
						key: single_agent.mac_br0 + "img" + wifi_level,
						category: "img",
						parent: agentparentstr,
						source: srcImg,
					}
					wifi_level_keyArr.push(wifi_symbol_obj.key);
					gnodeDataArray.push(JSON.stringify(wifi_symbol_obj));

					agent_obj = {
						key: parentstr,
						parent: single_agent.mac_br0 + "img" + wifi_level,
						name: "",
						source: "../image/TRUEMesh.png",
						tips: "",
					}

					var agent_tips_obj = new Object()
					
					//get model name from host alias
					
					var modelnamestr = "";
					if (gslavestaArray.length > 0)//active
					{
						for (var l=0; l<gslavestaArray.length; l++)
						{
							var n = gslavestaArray[l];
									
							var slavehostmac = eval('glandata.MACAddress' + n);
							
							if (single_agent.mac_br0.toUpperCase() == slavehostmac.toUpperCase())
							{
								modelnamestr = eval('glandata.HostName' + n);
								agent_obj.name = eval('glandata.HostName' + n);
								break;
							}
						}
					}
					
					if (modelnamestr == "")
					{
						agent_tips_obj.ModelName = "Agent";
					}
					else
					{
						agent_tips_obj.ModelName = modelnamestr;
					}
					
					var backhaultypestr = "";
					if (gallagentdata.length > 0)//active
					{
						for (var p=0; p<gallagentdata.length; p++)
						{	
							var single_agentinfo = gallagentdata[p];
							
							if (single_agent.mac1905.toUpperCase() == single_agentinfo.AL_MAC.toUpperCase())
							{
								backhaultypestr = single_agentinfo.MediaType;
								break;
							}
						}
					}
					
					if (single_agent.connect_type == "wireless")//0:wireless  1:wired
					{
						if (backhaultypestr == "")
						{
							agent_tips_obj.BackhaulType = 'IEEE 802.11ax';
						}
						else
						{
							agent_tips_obj.BackhaulType = backhaultypestr;
						}

						agent_tips_obj.BackhaulPHYRate = single_agent.throughput + 'Mbps';
						agent_tips_obj.BackhaulSignalStrength = single_agent.rssi + 'dBm';

					}
					else
					{
						if (backhaultypestr == "")
						{
							agent_tips_obj.BackhaulType = 'IEEE 802.3ab' ;
						}
						else
						{
							agent_tips_obj.BackhaulType = backhaultypestr;
						}
						
						agent_tips_obj.BackhaulPHYRate =  single_agent.throughput + 'Mbps';
					}

					agent_tips_obj.BackhaulPacketsTx = single_agent.PacketsTX;
					//{a:1,b:2,Model_Name:3} ==> 'a:1 \r\n b:2 \r\n Model Name: 3'
					agent_obj.tips = JSON.stringify(agent_tips_obj).replace(/,/g, "\r \n").replace(/"|{|}/g, '');

					nodestr += JSON.stringify(agent_obj);
					gnodeDataArray.push(JSON.stringify(agent_obj));

					//var selectedNode = myDiagram.findNodeForKey(key);
					// var selectedNode = myDiagram.model.findNodeDataForKey(wifi_symbol_obj.key);
					// console.log("222",selectedNode);
				}
			}
		}
		
		//sta info
		if (gstaArray.length > 0)//active
		{
			for (var l=0; l<gstaArray.length; l++)
			{
				var n = gstaArray[l];
						
				var baseapmac = eval('glandata.BaseAPMAC' + n);
				var meshhostbaseapmac = "";
				if(baseapmac.length == 12)
				{
					meshhostbaseapmac = macaddcolon(baseapmac);
				}
				else
				{
					meshhostbaseapmac = baseapmac;
				}
				var parentstr = "Sta";
				parentstr += eval(n);
				
				var agentparentstr = "";
				
				agentparentstr = getParentStr2(meshhostbaseapmac.toUpperCase());
				
				if (agentparentstr != "")// found parent ap
				{
					if( eval('glandata.portid' + n) == "MeshHost" && meshhostbaseapmac.toUpperCase() == mainbr0){
						continue;
					}

					//sta conntected Band
					var band = eval('glandata.Band' + n) == "2.4G" ? "2G" : eval('glandata.Band' + n);

					var srcImg = "";
					var wifi_level = -1;
					//1:wireless  0:wired
					if (eval('glandata.Type' + n) == 1 && band != "") {
						wifi_level = rssiLevel(band, eval('glandata.Rssi' + n));
						srcImg = eval('imgsrcArr_' + band)[wifi_level];
					} else {
						srcImg = "../image/conn_eth.png";
					}

					//wifi level img
					var wifi_symbol_obj = new Object();
					wifi_symbol_obj = {
						key: parentstr + "img" + wifi_level,
						parent: agentparentstr,
						category: "img",
						hasImage: true,
						source: srcImg,
					}
					wifi_level_keyArr.push(wifi_symbol_obj.key);
					gnodeDataArray.push(JSON.stringify(wifi_symbol_obj));

					var sta_obj = new Object();
					var devicetype = eval('glandata.devicetype' + n);
					sta_obj = {
						key: parentstr,
						parent: parentstr + "img" + wifi_level,
						name: "",
						source:   devicetype == 1 ? "../image/TRUEMesh.png" 
								: devicetype == 2 ? "../image/Unknown.png" 
								: devicetype == 3 ? "../image/Phone1.png" 
								: devicetype == 4 ? "../image/Unknown.png" 
								: devicetype == 5 ? "../image/PC1.png" 
								: devicetype == 6 ? "../image/TrueIDTV.png" 
								: devicetype == 7 ? "../image/TRUEIPC.png"
								: devicetype == 8 ? "../image/IoTdraft.png"
								: devicetype == 9 ? "../image/TRUEMesh.png"
								: "../image/Unknown.png",
						tips: "",
					}
					
					if (eval('glandata.HostName' + n).length == 0)
					{
						sta_obj.name = "No Host Name";
					}
					else if (eval('glandata.HostName' + n).length > 15){
						sta_obj.name = eval('glandata.HostName' + n).substr(0,14) + "...";
					}   
					else{
						sta_obj.name = eval('glandata.HostName' + n);
					}
					
					var sta_tips_obj = new Object()
					sta_tips_obj.Hostname = eval('glandata.HostName' + n);

					var lanmac = eval('glandata.MACAddress' + n);
					if(lanmac.length == 12)
					{
						lanmac = macaddcolon(lanmac);
					}
					sta_tips_obj.MAC = lanmac;

					if (eval('glandata.Type' + n) == 1)//1:wireless  0:wired
					{
						sta_tips_obj.RSSI = eval('glandata.Rssi' + n) + 'dBm';
						sta_tips_obj.IEEE80211mode = eval('glandata.wlanmode' + n);
						sta_tips_obj.LinkSpeed = getNetworkRate2(eval('glandata.NegoRate' + n)*1000, 1) + 'bps';
						sta_tips_obj.Security = eval('glandata.wlansecurity' + n);
						sta_tips_obj.Frequency = eval('glandata.Band' + n);
						sta_tips_obj.IP = eval('glandata.IPAddress' + n);
					}
					else
					{
						sta_tips_obj.LinkSpeed = getNetworkRate2(eval('glandata.NegoRate' + n)*1000, 1) + 'bps';
						sta_tips_obj.Frequency = 'LAN';
						sta_tips_obj.IP = eval('glandata.IPAddress' + n);
					}
					sta_tips_obj.OnlineTime = formatTime2(eval('glandata.OnlineTime' + n));

					sta_obj.tips = JSON.stringify(sta_tips_obj).replace(/,/g, "\r \n").replace(/"|{|}/g, '').replace(/IEEE80211/g, '802.11');
					gnodeDataArray.push(JSON.stringify(sta_obj));
				}
			}
		}
		
		var gnodeDataArrayStr = "[";
		gnodeDataArrayStr += gnodeDataArray;
		gnodeDataArrayStr += "]";
	
		var $$ = go.GraphObject.make;
 
		var myDiagram =
		  $$(go.Diagram, "myDiagramDiv",
			{
			  initialContentAlignment: go.Spot.Center,
			  contentAlignment: go.Spot.Center,
			  "undoManager.isEnabled": false, 
			  "toolManager.hoverDelay": 10,
              "toolManager.toolTipDuration": 10000,
			  isReadOnly:true,
			  "animationManager.isEnabled": false,
			  "draggingTool.dragsTree": false,
			  "draggingTool.dragsLink": false,
			  allowMove:false,
			  allowDragOut:false,
			  allowDelete:false,
			  allowCopy:false,
			  allowClipboard:false,
			  layout: $$(go.TreeLayout, // specify a Diagram.layout that arranges trees
						{ angle: 90, layerSpacing: 35 })
			});
			
		// the template we defined earlier
		myDiagram.nodeTemplateMap.add ('',
		  $$(go.Node, "Vertical",
			{ background: "#fff" },
			$$(go.Picture,
			  { margin: 0, width: 85, height: 85, background: "#fff" },
			  new go.Binding("source")),
			$$(go.TextBlock, "Default Text",
			  { margin: 0, width: 150, stroke: "#535353", textAlign: "center",  background: "#fff", font: "14px sans-serif" },
			  new go.Binding("text", "name")),
			{
				toolTip:  // define a tooltip for each node that displays the tips as text
				  $$("ToolTip",
					$$(go.TextBlock, { margin: 4, stroke: "#535353" },
					  new go.Binding("text", "tips"))
				  )  

			},
		  ));

		  //eth/wifi level
		  myDiagram.nodeTemplateMap.add ('img',
		  $$(go.Node, "Vertical",
			{ background: "#fff" },
			$$(go.Picture,
			  { margin: 0, width: 35, height: 35, background: "#fff" },
			  new go.Binding("source")),
		  ));
		 
		// define a Link template that routes orthogonally, with no arrowhead
		myDiagram.linkTemplate =
		  $$(go.Link,
			{ routing: go.Link.Orthogonal, corner: 5 },
			$$(go.Shape, { strokeWidth: 1, stroke: "#5D646E" })); // the link shape
		 
		var model = $$(go.TreeModel);
		model.nodeDataArray = eval('(' + gnodeDataArrayStr + ')');
	
		myDiagram.model = model;

	
	}
}

function getParentStr(input)
{
	var returnstr = ""; //if not found,use ""
	for ( var j=0; j<gparentArray.length; j++ )
	{
		if ( input.indexOf(gparentArray[j][0]) >= 0 )
		{
			returnstr = gparentArray[j][1];
			break;
		}
	}
	
	return returnstr;
}

function getParentStr2(input)
{
	var returnstr = ""; //if not found,use ""
	for ( var j=0; j<gparentArray2.length; j++ )
	{
		if ( input.indexOf(gparentArray2[j][0]) >= 0 )
		{
			returnstr = gparentArray2[j][1];
			break;
		}
	}
	
	return returnstr;
}

function refreshApply()
{
	if ( parent && parent.gLastOperateTime != undefined )
	{
		parent.gLastOperateTime = new Date().getTime();
	}
	window.location.reload();
}

//RSSI LEVEL(RSSI-->LEVEL)
function rssiLevel(Frequency, rssi)
{
	var level = -1;  //-1:init or err ; 0->3: level weaken

	if(rssi > 0) {
		return level;
	}

	switch(Frequency) {
		case '2G':
			switch(true) {
				case rssi >= -60:
					level = 0;
					break;
				case rssi >= -70:
					level = 1;
					break;
				default:
					level = 2;
					break;
			}
			break;

		case '5G':
			switch(true) {
				case rssi >= -70:
					level = 0;
					break;
				case rssi >= -75:
					level = 1;
					break;
				case rssi >= -79:
					level = 2;
					break;
				default:
					level = 3;
					break;
			}
			break;

		case '6G':
			switch(true) {
				case rssi >= -70:
					level = 0;
					break;
				case rssi >= -75:
					level = 1;
					break;
				case rssi >= -79:
					level = 2;
					break;
				default:
					level = 3;
					break;
			}
			break;

		default:
			break;
	}

	return level;

}

