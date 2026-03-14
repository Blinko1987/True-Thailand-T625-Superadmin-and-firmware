var gDebug = false; //调试模式默认关闭

var gLanPortDescribeArarry = new Array("LAN1", "LAN2", "LAN3", "LAN4","LAN5");
var g2GWifiPortDescribeArarry = new Array("2G-SSID1", "2G-SSID2", "2G-SSID3", "2G-SSID4");
var g5GWifiPortDescribeArarry = new Array("5G-SSID1", "5G-SSID2", "5G-SSID3", "5G-SSID4");
var g2GWifiMaxNum = 1;
var g5GWifiMaxNum = 1;

var gWANIPConnectionHead = "InternetGatewayDevice.WANDevice.1.WANConnectionDevice.1.WANIPConnection."; //1-8
var gWANPPPConnectionHead = "InternetGatewayDevice.WANDevice.1.WANConnectionDevice.1.WANPPPConnection."; //1-8
var gLanPortHead = "InternetGatewayDevice.LANDevice.1.LANEthernetInterfaceConfig."; //1-4
var gWifiPortHead = "InternetGatewayDevice.LANDevice.1.WLANConfiguration."; //1-8
var gStatusFreshInterval = 10; //状态页面刷新间隔，秒

var gCssName;
var gLoginUser;
var gOperator;
var gWebCode;
