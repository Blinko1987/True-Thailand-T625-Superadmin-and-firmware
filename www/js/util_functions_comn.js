

function isIE7Browser()
{
	if(navigator.appName == "Microsoft Internet Explorer" && navigator.appVersion.match(/7./i)=="7.") 
	{ 
		return true;
	}
	else
	{
		return false;
	}
}
function judedNavation()
{
	if(navigator.appName == "Microsoft Internet Explorer" && navigator.appVersion.match(/6./i)=="6."){ 
		return 6;
	} 
	else if(navigator.appName == "Microsoft Internet Explorer" && navigator.appVersion.match(/7./i)=="7."){ 
		return 7;
	} 
	else if(navigator.appName == "Microsoft Internet Explorer" && navigator.appVersion.match(/8./i)=="8."){ 
		return 8;
	} 
	else if(navigator.appName == "Microsoft Internet Explorer" && navigator.appVersion.match(/9./i)=="9."){ 
		return 9;
	}
	else{
		return 10;
	}
}

/*add -----------------start---------------------------*/
function ptweblog()
{
	if ( window["console"] && arguments && arguments.length > 0 )
	{
		var message = '';
		for ( var i=0; i<arguments.length; i++ )
		{
			if ( message == '' )
			{
				message = arguments[i];
			}
			else
			{
				message = message + ' ' + arguments[i];
			}
		}
		console.log(message);
	}
}
/*add -----------------end-----------------------------*/

function createInput(id, name, placeholder, maxlength, type, value)
{
	var inputObj = "<input ";
	if ( id != "" && id != "undefined" )
	{
		inputObj += "id='" + id + "' ";
	}
	if ( name != "" && name != "undefined" )
	{
		inputObj += "name='" + name + "' ";
	}
	if ( placeholder != "" && placeholder != "undefined" )
	{
		inputObj += "placeholder='" + placeholder + "' ";
	}
	if ( maxlength != "" && maxlength != "undefined" )
	{
		inputObj += "maxlength='" + maxlength + "' ";
	}
	inputObj += "type='" + type + "' ";
	inputObj += "value='" + value + "' ";
	inputObj += ">";
	return inputObj;
}

function inputBindFocus()
{
	$("input[type='password'], .password_content input[type='text']").bind("focusin", function(){
		$(this).parent().eq(0).addClass("password_content_focus");
		if ( !$(this).next().hasClass("password_switch_eyeon") )
		{
		$(this).next().addClass("password_switch_focus");
		}
	});
	$("input[type='password'], .password_content input[type='text']").bind("focusout", function(){
		$(this).parent().eq(0).removeClass("password_content_focus");
		$(this).next().removeClass("password_switch_focus");
	});
}

function customSwitchInit()
{
	$(".switch_content").bind("click", function(){
		if($(this).hasClass("switch_content_on")){
			$(this).removeClass("switch_content_on");
			$(this).addClass("switch_content_off");
      //$("#" + $(".switch_content").attr("id") + "_value").val(0);
      $(this).children("input").val(0);
		}else{
			$(this).addClass("switch_content_on");
			$(this).removeClass("switch_content_off");
			//$("#" + $(".switch_content").attr("id") + "_value").val(1);
      $(this).children("input").val(1);
		}
		ptweblog($(this).children("input").val());
	});
}
function customSelectInit()
{
	$(".dropdown-select").bind("click", function(){
		if($(this).hasClass("select-open")){
			$(this).removeClass("select-open");
		}else{
			$(this).addClass("select-open");
		}
	});

	$(".dropdown-select").focusout(function() {
  		if($(this).hasClass("select-open")){
			$(this).removeClass("select-open");
		}
	});
	
	$(".dropdown-menu-select li").click(function(){
		$(this).parent().siblings("label").first().text($(this).text());
		$("#" + $(this).parent().attr("id") + "_value").val($(this).attr("livalue"));
	});
}
function customPasswordInit()
{
	inputBindFocus();
	$(".password_switch").bind("click", function(){
		if( $(this).css("background-image").indexOf("eye_close") > -1 )
		{
			$(this).removeClass("password_switch_unfocus");
			$(this).removeClass("password_switch_focus");
			$(this).addClass("password_switch_eyeon");
		}
		else
		{
			$(this).removeClass("password_switch_eyeon");
			$(this).addClass("password_switch_unfocus");
		}
		
		if( 9 > judedNavation() )
		{
			var $pwdInput = $(this).parent(".password_content").find("input");
			if($pwdInput.attr("type").indexOf("password") != -1){
				var inputStr = createInput($pwdInput.attr("id"), $pwdInput.attr("name"), $pwdInput.attr("placeholder"), $pwdInput.attr("maxlength"), "text", $pwdInput.val());
				$pwdInput.replaceWith($(inputStr));
			}else{
				var inputStr = createInput($pwdInput.attr("id"), $pwdInput.attr("name"), $pwdInput.attr("placeholder"), $pwdInput.attr("maxlength"), "password", $pwdInput.val());
				$pwdInput.replaceWith($(inputStr));
			}
		}
		else
		{
			var $pwd_input = $(this).parent(".password_content").find("input");
			if($pwd_input.attr("type") == "password"){
				$pwd_input[0].type = "text";
			}else if($pwd_input.attr("type") == "text"){
				$pwd_input[0].type = "password";
			}else{
				$pwd_input[0].type = "password";
			}
		}
		inputBindFocus();
	});
}
function customScrollBar(ele)
{
	//todo, if cu ,just let go
	return;
	// 需要单独处理IE7的滚动
	// ptweblog(judedNavation());
	if ( 8 > judedNavation() ) //IE7
	{
		$(ele).css("overflow-x", "hidden");
		$(ele).css("overflow-y", "auto");
		return;
	}
	
	$(ele).niceScroll({  
		cursorcolor:"#f18e1f",
		cursoropacitymin:1,
		cursoropacitymax:1,
		touchbehavior:false,
		cursorwidth:"5px",
		cursorborder:"0",
		cursorborderradius:"5px"
	});
}

//显示loading框
function showOrHideLoadingWindow(action)
{
	if ( action == "show" )
	{
		$("#loading_window_div").show();
	}
	else
	{
		$("#loading_window_div").hide();
	}
}
function showOrHideLoadingWindowFromIframe(action)
{
	if ( action == "show" )
	{
		$("#loading_window_div", window.parent.document).show();
	}
	else
	{
		$("#loading_window_div", window.parent.document).hide();
	}
}

//[floor,top]
function isValidNumberRange(number, floor, top)
{
	if (!number )
		return false;
		
	if (0 != number % 1)  //20140214 number must be an integer
		return false;
    if (isNaN(number) || number < floor || number > top)
	    return false;
		
	return true;
}

function isHexaDigit(digit) {
   var hexVals = new Array("0", "1", "2", "3", "4", "5", "6", "7", "8", "9",
                           "A", "B", "C", "D", "E", "F", "a", "b", "c", "d", "e", "f");
   var len = hexVals.length;
   var i = 0;
   var ret = false;

   for ( i = 0; i < len; i++ )
      if ( digit == hexVals[i] ) break;

   if ( i < len )
      ret = true;

   return ret;
}

function isValidKey(val, size) {
   var ret = false;
   var len = val.length;
   var dbSize = size * 2;

   if ( len == size )
      ret = true;
   else if ( len == dbSize ) {
      for ( i = 0; i < dbSize; i++ )
         if ( isHexaDigit(val.charAt(i)) == false )
            break;
      if ( i == dbSize )
         ret = true;
   } else
      ret = false;

   return ret;
}


function isValidHexKey(val, size) {
   var ret = false;
   if (val.length == size) {
      for ( i = 0; i < val.length; i++ ) {
         if ( isHexaDigit(val.charAt(i)) == false ) {
            break;
         }
      }
      if ( i == val.length ) {
         ret = true;
      }
   }

   return ret;
}


function isNameUnsafe(compareChar) {
   var unsafeString = "\"<>%\\^[]`\+\$\,='#&@.: \t";
	
   if ( unsafeString.indexOf(compareChar) == -1 && compareChar.charCodeAt(0) > 32
        && compareChar.charCodeAt(0) < 123 )
      return false; // found no unsafe chars, return false
   else
      return true;
}   

// Check if a name valid
function isValidName(name) {
   var i = 0;	
   
   for ( i = 0; i < name.length; i++ ) {
      if ( isNameUnsafe(name.charAt(i)) == true )
         return false;
   }

   return true;
}

// same as is isNameUnsafe but allow spaces
function isCharUnsafe(compareChar) {
   var unsafeString = "\"<>%\\^[]`\+\$\,='#&@.:\t";
	
   if ( unsafeString.indexOf(compareChar) == -1 && compareChar.charCodeAt(0) >= 32
        && compareChar.charCodeAt(0) < 123 )
      return false; // found no unsafe chars, return false
   else
      return true;
}   

function isValidNameWSpace(name) {
   var i = 0;	
   
   for ( i = 0; i < name.length; i++ ) {
      if ( isCharUnsafe(name.charAt(i)) == true )
         return false;
   }

   return true;
}

function isSameSubNet(lan1Ip, lan1Mask, lan2Ip, lan2Mask) {

   var count = 0;
   
   lan1a = lan1Ip.split('.');
   lan1m = lan1Mask.split('.');
   lan2a = lan2Ip.split('.');
   lan2m = lan2Mask.split('.');

   for (i = 0; i < 4; i++) {
      l1a_n = parseInt(lan1a[i]);
      l1m_n = parseInt(lan1m[i]);
      l2a_n = parseInt(lan2a[i]);
      l2m_n = parseInt(lan2m[i]);
      if ((l1a_n & l1m_n) == (l2a_n & l2m_n))
         count++;
   }
   if (count == 4)
      return true;
   else
      return false;
}

function isSameSubNetVer2(srcaddr1, mask, endsrcaddr1, mask)
{
  pArray1 = srcaddr1.split(".");
  pArray2 = endsrcaddr1.split(".");
  if( (pArray1[0] == pArray2[0]) && (pArray1[1] == pArray2[1]) && (pArray1[2] == pArray2[2]))
  {
  	return true;
  }
  else {
  	return false;
  }
}


function isValidIpAddress(address) {

   ipParts = address.split('/');
   if (ipParts.length > 2) return false;
   if (ipParts.length == 2) {
      num = parseInt(ipParts[1]);
      if (num <= 0 || num > 32)
         return false;
   }
   if (ipParts[0] == '0.0.0.0' ||
       ipParts[0] == '255.255.255.255' )
      return false;

   addrParts = ipParts[0].split('.');
   if ( addrParts.length != 4 ) return false;
        
   for (i = 0; i < 4; i++) {
      if (isNaN(addrParts[i]) || addrParts[i] =="")
         return false;
      num = parseInt(addrParts[i]);
      if ( num < 0 || num > 255 )
         return false;
   }
   return true;
}

function isValidIpv6PrefixAddress(address) {
	return /([0-9a-fA-F]{1,4}:){1,7}:/.test(address);
}

//将IPv6地址分割成容量为8的数组，::省略的部分用0填充
function splitIPv6AddressToArray(addr)
{
	var parts = new Array(8);
	if (-1 == addr.indexOf('::'))
	{
		parts = addr.split(':');
		for (var i=0; i<8; i++)
		{
			if (isNullString(parts[i]))
				parts[i] = '0';
		}
	}	
	else
	{
		var twopart = addr.split('::');
		var parts1 = twopart[0].split(':'), parts2 = twopart[1].split(':');
		for (var i=0; i<parts1.length; i++)
		{
			parts[i] = parts1[i];
		}
		var startIndex = 8-parts2.length
		for(var m=0; m<(8-parts1.length-parts2.length); m++)
		{
			parts[m+parts1.lengt] = '0';
		}
		for (var j=startIndex; j<8; j++)
		{
			parts[i] = parts2[j-startIndex];
		}
	}
	return parts;
}
function isValidIPv6AddressRange(minAddr, maxAddr)
{
	var minAddrParts = splitIPv6AddressToArray(minAddr), maxAddrParts = splitIPv6AddressToArray(maxAddr);
	for(var i=0; i<8; i++)
	{
		var minPart = parseInt(minAddrParts[i], 16), maxPart = parseInt(maxAddrParts[i], 16);
		if (minPart > maxPart)
			return false;
	}
	return true;
}
function isValidIpv6AddressRegexp(str)  
{  
	if(null == str.match(/:/g))
		return false;
		
	return str.match(/:/g).length<=7  
	&&/::/.test(str)  
	?/^([\da-f]{1,4}(:|::)){1,6}[\da-f]{1,4}$/i.test(str)  
	:/^([\da-f]{1,4}:){7}[\da-f]{1,4}$/i.test(str);  
}

function isIPv6(str)  
{  
	return str.match(/:/g).length<=7  
	&&/::/.test(str)  
	?/^([\da-f]{1,4}(:|::)){1,6}[\da-f]{1,4}$/i.test(str)  
	:/^([\da-f]{1,4}:){7}[\da-f]{1,4}$/i.test(str);  
}

function isValidIpv6PrefixAddressV2(prefix)
{
	return /([0-9a-fA-F]{1,4}:){1,4}:\/64/.test(prefix);
}


function isValidIpAddress6(address) {

   ipParts = address.split('/');
   if (ipParts.length > 2) return false;
   if (ipParts.length == 2) {
      num = parseInt(ipParts[1]);
      if (num <= 0 || num > 128)
         return false;
   }

   addrParts = ipParts[0].split(':');
   if (addrParts.length < 3 || addrParts.length > 8)
      return false;
   for (i = 0; i < addrParts.length; i++) {
      if ( addrParts[i] != "" )
         num = parseInt(addrParts[i], 16);
      if ( i == 0 ) {
//         if ( (num & 0xf000) == 0xf000 )
//            return false;	//can not be link-local, site-local or multicast address
      }
      else if ( (i + 1) == addrParts.length) {
         if ( num == 0 || num == 1)
            return false;	//can not be unspecified or loopback address
      }
      if ( num != 0 )
         break;
   }
   return true;
}

function isValidPrefixLength(prefixLen) {
   var num;

   num = parseInt(prefixLen);
   if (isNaN(num) || num <= 0 || num > 128)
      return false;
   return true;
}

function areSamePrefix(addr1, addr2) {
   var i, j;
   var a = [0, 0, 0, 0, 0, 0, 0, 0];
   var b = [0, 0, 0, 0, 0, 0, 0, 0];

   addr1Parts = addr1.split(':');
   if (addr1Parts.length < 3 || addr1Parts.length > 8)
      return false;
   addr2Parts = addr2.split(':');
   if (addr2Parts.length < 3 || addr2Parts.length > 8)
      return false;
   j = 0;
   for (i = 0; i < addr1Parts.length; i++) {
      if ( addr1Parts[i] == "" ) {
		 if ((i != 0) && (i+1 != addr1Parts.length)) {
			j = j + (8 - addr1Parts.length + 1);
		 }
		 else {
		    j++;
		 }
	  }
	  else {
         a[j] = parseInt(addr1Parts[i], 16);
		 j++;
	  }
   }
   j = 0;
   for (i = 0; i < addr2Parts.length; i++) {
      if ( addr2Parts[i] == "" ) {
		 if ((i != 0) && (i+1 != addr2Parts.length)) {
			j = j + (8 - addr2Parts.length + 1);
		 }
		 else {
		    j++;
		 }
	  }
	  else {
         b[j] = parseInt(addr2Parts[i], 16);
		 j++;
	  }
   }
   //only compare 64 bit prefix
   for (i = 0; i < 4; i++) {
      if (a[i] != b[i]) {
	     return false;
	  }
   }
   return true;
}

function getLeftMostZeroBitPos(num) {
   var i = 0;
   var numArr = [128, 64, 32, 16, 8, 4, 2, 1];

   for ( i = 0; i < numArr.length; i++ )
      if ( (num & numArr[i]) == 0 )
         return i;

   return numArr.length;
}

function getRightMostOneBitPos(num) {
   var i = 0;
   var numArr = [1, 2, 4, 8, 16, 32, 64, 128];

   for ( i = 0; i < numArr.length; i++ )
      if ( ((num & numArr[i]) >> i) == 1 )
         return (numArr.length - i - 1);

   return -1;
}

function isValidSubnetMask(mask) {
   var i = 0, num = 0;
   var zeroBitPos = 0, oneBitPos = 0;
   var zeroBitExisted = false;

   if ( mask == '0.0.0.0' )
      return false;

   maskParts = mask.split('.');
   if ( maskParts.length != 4 ) return false;

   for (i = 0; i < 4; i++) {
      if ( isNaN(maskParts[i]) == true )
         return false;
      num = parseInt(maskParts[i]);
      if ( num < 0 || num > 255 )
         return false;
      if ( zeroBitExisted == true && num != 0 )
         return false;
      zeroBitPos = getLeftMostZeroBitPos(num);
      oneBitPos = getRightMostOneBitPos(num);
      if ( zeroBitPos < oneBitPos )
         return false;
      if ( zeroBitPos < 8 )
         zeroBitExisted = true;
   }

   return true;
}

function isValidPortRange(port) {
   var fromport = 0;
   var toport = 100;

   portrange = port.split(':');
   if ( portrange.length < 1 || portrange.length > 2 ) {
       return false;
   }
   if ( isNaN(portrange[0]) )
       return false;
   fromport = parseInt(portrange[0]);
   
   if ( portrange.length > 1 ) {
       if ( isNaN(portrange[1]) )
          return false;
       toport = parseInt(portrange[1]);
       if ( toport <= fromport )
           return false;      
   }
   
   if ( fromport < 1 || fromport > 65535 || toport < 1 || toport > 65535 )
       return false;
   
   return true;
}
function isValidNatPort(port) {
   var fromport = 0;
   var toport = 100;

   portrange = port.split('-');
   if ( portrange.length < 1 || portrange.length > 2 ) {
       return false;
   }
   if ( isNaN(portrange[0]) )
       return false;
   fromport = parseInt(portrange[0]);

   if ( portrange.length > 1 ) {
       if ( isNaN(portrange[1]) )
          return false;
       toport = parseInt(portrange[1]);
       if ( toport <= fromport )
           return false;
   }

   if ( fromport < 1 || fromport > 65535 || toport < 1 || toport > 65535 )
       return false;

   return true;
}

function isValidMacAddress(address) {
   var c = '';
   var num = 0;
   var i = 0, j = 0;
   var zeros = 0;

   addrParts = address.split(':');
   if ( addrParts.length != 6 ) return false;

   for (i = 0; i < 6; i++) {
      if ( addrParts[i] == '' || addrParts[i].length != 2)
         return false;
      for ( j = 0; j < addrParts[i].length; j++ ) {
         c = addrParts[i].toLowerCase().charAt(j);
         if ( (c >= '0' && c <= '9') ||
              (c >= 'a' && c <= 'f') )
            continue;
         else
            return false;
      }

      // num = parseInt(addrParts[i], 16);
      // if ( num == NaN || num < 0 || num > 255 )
         // return false;
      // if ( num == 0 )
         // zeros++;
   }
   // if (zeros == 6)
      // return false;
      
   // if ( parseInt(addrParts[0], 16) & 1 )	  
      // return false;

   return true;
}

var hexVals = new Array("0", "1", "2", "3", "4", "5", "6", "7", "8", "9",
              "A", "B", "C", "D", "E", "F");
var unsafeString = "\"<>%\\^[]`\+\$\,'#&";
// deleted these chars from the include list ";", "/", "?", ":", "@", "=", "&" and #
// so that we could analyze actual URLs

function isUnsafe(compareChar)
// this function checks to see if a char is URL unsafe.
// Returns bool result. True = unsafe, False = safe
{
   if ( unsafeString.indexOf(compareChar) == -1 && compareChar.charCodeAt(0) > 32
        && compareChar.charCodeAt(0) < 123 )
      return false; // found no unsafe chars, return false
   else
      return true;
}

function decToHex(num, radix)
// part of the hex-ifying functionality
{
   var hexString = "";
   while ( num >= radix ) {
      temp = num % radix;
      num = Math.floor(num / radix);
      hexString += hexVals[temp];
   }
   hexString += hexVals[num];
   return reversal(hexString);
}

function reversal(s)
// part of the hex-ifying functionality
{
   var len = s.length;
   var trans = "";
   for (i = 0; i < len; i++)
      trans = trans + s.substring(len-i-1, len-i);
   s = trans;
   return s;
}

function convert(val)
// this converts a given char to url hex form
{
   return  "%" + decToHex(val.charCodeAt(0), 16);
}

function special_char_check(val)
{
	var specialchar = new Array("`", "<", ">", "++", "--");
	var len = specialchar.length;
	var i = 0;
	var ret = false;
	
	for( i = 0; i < len; i++ )
	{
		if (val.indexOf(specialchar[i]) >= 0)
		{
			break;
		}
	}
	
	if ( i < len )
      ret = true;

   return ret;
}

function encodeUrl(val)
{
   var len     = val.length;
   var i       = 0;
   var newStr  = "";
   var original = val;

   for ( i = 0; i < len; i++ ) {
      if ( val.substring(i,i+1).charCodeAt(0) < 255 ) {
         // hack to eliminate the rest of unicode from this
         if (isUnsafe(val.substring(i,i+1)) == false)
            newStr = newStr + val.substring(i,i+1);
         else
            newStr = newStr + convert(val.substring(i,i+1));
      } else {
         // woopsie! restore.
         alert ("Found a non-ISO-8859-1 character at position: " + (i+1) + ",\nPlease eliminate before continuing.");
         newStr = original;
         // short-circuit the loop and exit
         i = len;
      }
   }

   return newStr;
}

var markStrChars = "\"'";

// Checks to see if a char is used to mark begining and ending of string.
// Returns bool result. True = special, False = not special
function isMarkStrChar(compareChar)
{
   if ( markStrChars.indexOf(compareChar) == -1 )
      return false; // found no marked string chars, return false
   else
      return true;
}

// use backslash in front one of the escape codes to process
// marked string characters.
// Returns new process string
function processMarkStrChars(str) {
   var i = 0;
   var retStr = '';

   for ( i = 0; i < str.length; i++ ) {
      if ( isMarkStrChar(str.charAt(i)) == true )
         retStr += '\\';
      retStr += str.charAt(i);
   }

   return retStr;
}

// Web page manipulation functions

function showhide(element, sh)
{
    var status;
    if (sh == 1) {
        status = "block";
    }
    else {
        status = "none";
    }
    
	if (document.getElementById)
	{
		// standard
		document.getElementById(element).style.display = status;
	}
	else if (document.all)
	{
		// old IE
		document.all[element].style.display = status;
	}
	else if (document.layers)
	{
		// Netscape 4
		document.layers[element].display = status;
	}
}

// Load / submit functions

function getSelect(item)
{
	var idx;
	if (item.options.length > 0) {
	    idx = item.selectedIndex;
	    return item.options[idx].value;
	}
	else {
		return '';
    }
}

function setSelect(item, value)
{
	for (i=0; i<item.options.length; i++) {
        if (item.options[i].value == value) {
        	item.selectedIndex = i;
        	break;
        }
    }
}

function setDisable(item, value)
{
    if ( value == 1 || value == '1' ) {
         item.disabled = true;
    } else {
         item.disabled = false;
    }     
}

function isHexaDigit(digit) {
   var hexVals = new Array("0", "1", "2", "3", "4", "5", "6", "7", "8", "9",
                           "A", "B", "C", "D", "E", "F", "a", "b", "c", "d", "e", "f");
   var len = hexVals.length;
   var i = 0;
   var ret = false;

   for ( i = 0; i < len; i++ )
      if ( digit == hexVals[i] ) break;

   if ( i < len )
      ret = true;

   return ret;
}

function isInValidDhcpPool(lan1StartIp, lan1EndIp,lan2StartIp, lan2EndIp )
{
   lan1addrEnd = lan1EndIp.split('.');
   lan1addrStart = lan1StartIp.split('.');
   lan2addrEnd = lan2EndIp.split('.');
   lan2addrStart = lan2StartIp.split('.');
   E1 = parseInt(lan1addrEnd[3]) + 1;
   S1 = parseInt(lan1addrStart[3]) + 1;
   E2 = parseInt(lan2addrEnd[3]) + 1;
   S2 = parseInt(lan2addrStart[3]) + 1;

   if (E1 > S2 && E1 < E2)
       return false;
   if (S1 > S2 && S1 < E2)
       return false;
   if (S2 > S1 && S2 < E1)
       return false;
   if (E2 > S1 && E2 < E1)
       return false;
   return true;
}

function isValidIpAddress_dhcpDevice(address){
   var i = 0;

   if ( address == '255.255.255.255' )
      return false;

   addrParts = address.split('.');
   if ( addrParts.length != 4 ) return false;
   for (i = 0; i < 4; i++) {
      if (isNaN(addrParts[i]) || addrParts[i] =="")
         return false;
      num = parseInt(addrParts[i]);
      if ( num < 0 || num > 255 )
         return false;
   }
   return true;
}

function isValidDigit(digit) {
   var hexVals = new Array("0", "1", "2", "3", "4", "5", "6", "7", "8", "9");
   var len = hexVals.length;
   var i = 0;
   var ret = false;

   for ( i = 0; i < len; i++ )
      if ( digit == hexVals[i] ) break;

   if ( i < len )
      ret = true;

   return ret;
}

function isValidServerPort(val){
   var ret = false;
   var max = 65535;
   var min = 0;
   var i = 0;

   if((val.length > 1) &&(val.charAt(0) == '0'))
   {
			return false;
   }

   for(i;i<val.length;i++)
   {
      if ( isValidDigit(val.charAt(i)) == false )
        break;
   }
   if ( i == val.length )
   {
       ret = true;
   }

   if(ret == true)
   {
   	   if (( val <= max) &&( val >= min))
	         ret = true;
	     else
	        ret = false;
   }

   return ret;
}

function isValidValue(val)
{
   var ret = false;
   var min = 0;
   var i=0;

   if((val.length > 1) &&(val.charAt(0) == '0'))
   {
			return false;
   }

   for(i;i<val.length;i++)
   {
      if ( isValidDigit(val.charAt(i)) == false )
        break;
   }
   if ( i == val.length )
   {
       ret = true;
   }

   if(ret == true)
   {
        if (val > min)
        {
            ret = true;
        }
        else
        {
            ret = false;
        }
   }
   return ret;
}

function isSameSubNet(lan1Ip, lan1Mask, lan2Ip, lan2Mask) {

   var count = 0;

   lan1a = lan1Ip.split('.');
   lan1m = lan1Mask.split('.');
   lan2a = lan2Ip.split('.');
   lan2m = lan2Mask.split('.');

   for (i = 0; i < 4; i++) {
     var  l1a_n = parseInt(lan1a[i],10);
     var  l1m_n = parseInt(lan1m[i],10);
     var  l2a_n = parseInt(lan2a[i],10);
     var  l2m_n = parseInt(lan2m[i],10);
	 
      if ((l1a_n & l1m_n) == (l2a_n & l2m_n))
         count++;
   }
   if (count == 4)
      return true;
   else
      return false;
}

function isNumber( val )
{
	var len = val.length;
	var sign = 0;
	
	for( var i = 0; i < len; ++i )
	{
		if( ( val.charAt(i) == '-' ) && ( sign == 0 ) )
		{
			sign = 1;
			continue;
		}
		
		if( ( val.charAt(i) > '9' ) 
		    || ( val.charAt(i) < '0' ) )
		{
			return false;
		}
		sign = 1;
	}
	
	return true;
}

function IsNotDigit(fData)
{
     var i;

	 for(i = 0; i < fData.length; i++) 
	 {
		if (!(fData.charAt(i) >= '0' && fData.charAt(i) <= '9'))
			return true;
	 }
	
	 return false;
}

function isValidNetMask(address) {

   ipParts = address.split('/');
   if (ipParts.length > 2) return false;
   if (ipParts.length == 2) {
      num = parseInt(ipParts[1]);
      if (num <= 0 || num > 32)
         return false;
   }

   if (ipParts[0] == '0.0.0.0' ||
       ipParts[0] == '255.255.255.255' )
      return false;

   addrParts = ipParts[0].split('.');
   if ( addrParts.length != 4 ) return false;
   for (i = 0; i < 4; i++) {
      if (isNaN(addrParts[i]) || addrParts[i] =="")
         return false;
      num = parseInt(addrParts[i]);
      if ( num < 0 || num > 255 )
         return false;
   }
   return true;
}


function isValidIpAddress_dhcpDevice(address){
   var i = 0;

   if ( address == '255.255.255.255' )
      return false;

   addrParts = address.split('.');
   if ( addrParts.length != 4 ) return false;
   for (i = 0; i < 4; i++) {
      if (IsNotDigit(addrParts[i]) || addrParts[i] =="")
         return false;
      
      num = parseInt(addrParts[i]);
      if (i == 0 && num == 0)
      {
          return false;
      }
      if ( num < 0 || num >= 255 )
         return false;
   }
   if(parseInt(addrParts[3]) == 0)
   	return false;
   return true;
}

function isValidPrefixAddress(address) {
   var i = 0, num = 0;
   var space=0;
   addrParts = address.split(':');
   if (addrParts.length < 3 || addrParts.length > 8)
      return false;
   for (i = 0; i < addrParts.length; i++) {
      if ( addrParts[i] != "" && isValidHexKey(addrParts[i],addrParts[i].length) )
         num = parseInt(addrParts[i], 16);
	  else
	   {
		  space++;
		  if(space>1 && (i + 1) != addrParts.length)
		  return false;
		  continue;
	   }
      if ( i == 0 ) {
         if ( (num & 0xf000) == 0xf000 )
            return false;	
      }
      if ( num > 0xffff || num < 0 )
         return false;
   }
   return true;
}

function getIpMaskBit(mask) {
   var i = 0, num = 0;
   var oneBitPos = 0;
   
   if ( isValidSubnetMask(mask) == false)
	 return -1;

   maskParts = mask.split('.');
   for (i = 0; i < 4; i++) {
      num = parseInt(maskParts[i]);
      oneBitPos = getRightMostOneBitPos(num);
	if(oneBitPos < 7){
		return i*8 + oneBitPos + 1;
	}
   }
   return 32;
}

function markDscpToName(mark){
   var i;
   var dscpMarkDesc = new Array ('auto', 'default', 'AF13', 'AF12', 'AF11', 'CS1',
                           'AF23', 'AF22', 'F21', 'S2',
                           'AF33', 'AF32', 'AF31', 'CS3',
                           'AF43', 'AF42', 'AF41', 'CS4',
                           'EF', 'CS5', 'CS6', 'CS7', '');
   var dscpMarkValues = new Array(-2, 0x00, 0x38, 0x30, 0x28, 0x20,
                             0x58, 0x50, 0x48, 0x40,
                             0x78, 0x70, 0x68, 0x60,
                             0x98, 0x90, 0x88, 0x80,
                             0xB8, 0xA0, 0xC0, 0xE0);
   if(mark == -1)
   	return '';
   for (i = 0; dscpMarkDesc[i] != ''; i++)
   {
      if (mark == dscpMarkValues[i])
         return dscpMarkDesc[i];
   }
   return dscpMarkDesc[0];
}

 function String_Replace(expression, find, replacewith, start) {
  var index = expression.indexOf(find, start);
  if (index == -1)
   return expression;

  var findLen = find.length;
  var newexp = "";
  newexp = expression.substring(0, index)+(replacewith)+(expression.substring(index+findLen));

  return String_Replace(newexp, find, replacewith, index+1+findLen);
 }
 

function SsidisIncludeInvalidChar(val) {
   var len = val.length;

   for ( i = 0; i < len; i++ )
   {
      if( val.charAt(i) == '&' )
      {
         return false;
      }
   }

   return true;
}

function isPppNameUnsafe(compareChar) {
   var unsafeString = "\"\\`\,=' \t";
	
   if ( unsafeString.indexOf(compareChar) == -1 && compareChar.charCodeAt(0) > 32
        && compareChar.charCodeAt(0) < 123 )
      return false; // found no unsafe chars, return false
   else
      return true;
}   

// Check if a ppp name or password valid
function isValidPppName(pppname) {
   var i = 0;	
   
   for ( i = 0; i < pppname.length; i++ ) {
      if ( isPppNameUnsafe(pppname.charAt(i)) == true )
         return false;
   }

   return true;
}

function setElementAttr(elementArr, statuArr, attrName){
    for(var i=0; i != elementArr.length; i++)
	    $(elementArr[i]).attr(attrName, statuArr[i])
}

function setElementCss(elementArr, cssArry, cssName){
    for(var i=0; i != elementArr.length; i++)
	    $(elementArr[i]).css(cssName, cssArry[i])
}

function setElementsDisabled(elementArr, statusArr){
    for(var i=0; i != elementArr.length; i++)
	{
		document.getElementById(elementArr[i]).disabled = statusArr[i];
	}
}

function isInValidNumRange(num, floor, top){
    if( isNaN(num) || num < floor || num > top)
	    return false;
	return true;
}

function isValidPort(port){
    return isInValidNumRange(port, 0, 65535);
}

function isNullString(checkText){
    if(checkText == null || checkText == "" || checkText.length == 0)
        return true;
    else
        return false;
}

function Entry(key, value){
	this.key = key;
	this.value = value;
}

//设置input:checkbox的选中状态
function setCheckbox(elementId, status)
{
	if(status == '1' || status == true || status == 'Enabled')
	{
		$("#" + elementId).prop("checked", true);
	}
	else
	{
		$("#" + elementId).prop("checked", false);
	}
}
//获取input:checkbox的选中状态
function getCheckbox(elementId)
{
	if ( $("#" + elementId).attr("checked") )
	{
		return 1;
	}
	else
	{
		return 0;
	}
}

function isValidNetIpAddress(address) {
   var i = 0;

   if ( address == '0.0.0.0' ||
        address == '127.0.0.1'||
        address == '255.255.255.255' )
      return false;

   addrParts = address.split('.');
   if ( addrParts.length != 4 ) return false;
   for (i = 0; i < 4; i++) {
      if (isNaN(addrParts[i]) || addrParts[i] =="")
         return false;
      num = parseInt(addrParts[i]);
      if ( isNaN(num)|| num < 0 || num > 255 )
         return false;
   }

   if (parseInt(addrParts[0]) < 1 || parseInt(addrParts[0]) > 223)
   	return false;
   
   
   return true;
}

function isValidIpAddressRange(startAddr, endAddr){

   if ( !isValidIpAddress(startAddr) || !isValidIpAddress(endAddr) )
      return false;

   var i;
   var startAddrParts = startAddr.split('.');
   var endAddrParts = endAddr.split('.');

   for ( i = 0; i < 4; i++ ){
      if ( parseInt(startAddrParts[i]) < parseInt(endAddrParts[i]) )
         return true;
      else if ( parseInt(startAddrParts[i]) > parseInt(endAddrParts[i]) )
         return false;
   }

   return true;
}
function getDataByAjax(url, callback)
{
	$.ajax({
		type:"GET",
		url: url,
		dataType: 'json',
		cache: false,
		async: false,
		timeout: 30000,
		success: function(returnData, status){
			if((returnData != null) && (returnData != undefined))
			{
				if(returnData.success == "true")
				{
					callback(returnData);
					return returnData;
				}
				// ptweblog("Retuen yet?");
			}
		},
		error: function(XMLHttpRequest, textStatus, errorThrown){
			if(textStatus == "timeout")
			{
				// ptweblog("get data timeout....");
			}
			else
			{
				// ptweblog("get data error....");
			}
			callback(null);
			return null;
		}
	});
}

function postDataByAjax(url, data, options)
{
  $.ajax({
    type:"POST",
    data: data,
    url: url,
    dataType: 'json',
    cache: false,
    async: true,
    timeout: 30000,
    success: function(returnData, status){
      if((returnData != null) && (returnData != undefined))
      {
        return returnData;
      }
    },
    error: function(XMLHttpRequest, textStatus, errorThrown){
      if(textStatus == "timeout")
      {
        // ptweblog("get data timeout....");
      }
      else
      {
        // ptweblog("get data error....");
      }
    }
  });
}

function setSwitchValue(id, enable)
{
  if((id != null) && (id != undefined))
  {
    if(enable == "1")
    {
      $("#"+id).removeClass("switch_content_off").addClass("switch_content_on");
      
    }
    else
    {
      $("#"+id).removeClass("switch_content_on").addClass("switch_content_off");  
    }
  }
}

//给定的string是否包含中文，包含返回true，不包含返回false
function isCnInclude(string)
{
	for( var i=0; i<string.length; i++ )
	{
		var singlechar = string.substr(i,1);
		var char_escape = escape(singlechar);
		if(char_escape.substring(0,2) == "%u")
		{
			return true;
		}
	}
	return false;
}

// -----------------start---------------------------
// 给定string，解析出如下Aarray对应的值
// 如string为'INTERNET,TR069'，解析出的值为9
// var modeArray = new Array('TR069', 'VOIP', 'IPTV', 'INTERNET', 'OTHER'); //1 2 4 8 16
function parseValueByString(string, arrayName)
{
	var chooseValue = 0;
	for ( var i=0; i<arrayName.length; i++ )
	{
		if ( string.toUpperCase().indexOf(arrayName[i]) >= 0 )
		{
			chooseValue += Math.pow(2, i);
		}
	}
	return chooseValue;
}

// 给定value，解析出如下Aarray对应的string
// 如value值为9，解析出的string为'INTERNET,TR069'
// var modeArray = new Array('TR069', 'VOIP', 'IPTV', 'INTERNET', 'OTHER'); //1 2 4 8 16
function parseStringByValue(value, arrayName)
{
	var string = '';
	for ( var i=0; i<arrayName.length; i++ )
	{
		var j = Math.pow(2, i);
		if ( j == (j & value) )
		{
			if ( string == '' )
			{
				string = arrayName[i];
			}
			else
			{
				string += ',' + arrayName[i];
			}
		}
	}
	return string;
}

function cleanPopWindowContentFromIframe()
{
	$("#pop_window_icon", window.parent.document).html('');
	$("#pop_window_title", window.parent.document).html('');
	$("#pop_window_message", window.parent.document).html('');
	$("#pop_window_option", window.parent.document).show();
}

function showOrHidePopWindowFromIframe(action)
{
	if ( action == "show" )
	{
		$("#pop_window_div", window.parent.document).show();
	}
	else
	{
		$("#pop_window_div", window.parent.document).hide();
	}
}

//name: radio元素的name
//value: 想要选中的radio元素的值
function setRadio(name, value)
{
	$("input[name='" + name + "']").each(function(){
		if ( $(this).val() == value )
		{
			$(this).attr("checked", "checked");
			return;
		}
	});
}

//获取选中raido元素的取值，name: radio元素的name
function getRadio(name)
{
	return $("input[name='" + name + "']:checked").val();
}

function jumpToLoginPage(isFormIframe)
{
	var interval = window.setInterval(function() {
		var img = new Image();

		img.onload = function() {
			window.clearInterval(interval);
			if (isFormIframe)
			{
				window.parent.location = ('https:' == document.location.protocol ? 'https://' : 'http://') + document.location.host;
			}
			else
			{
				window.location = ('https:' == document.location.protocol ? 'https://' : 'http://') + document.location.host;
			}
		};

		img.src = ('https:' == document.location.protocol ? 'https://' : 'http://') + document.location.host + "/image/loading.gif?" + Math.random();
	}, 10000);
}

function isValidInteger(value)
{
	return /^-?\d+$/.test( value );
}
// -----------------end-----------------------------


//显示或者隐藏多个元素
function hide()
{
  for(var i=0; i < arguments.length; i++)
  {
    $("#"+arguments[i]).css("display", "none");
  }
}
//显示多个元素
function show()
{
  for(var i=0; i < arguments.length; i++)
  {
    $("#"+arguments[i]).css("display", "");
  }
}
//隐藏表单元素的父级div
function hideItem()
{
  for(var i=0; i < arguments.length; i++)
  {
    $("#"+arguments[i]).parents(".main_item").css("display", "none");
  }
  
}
//隐藏表单元素的父级div
function showItem()
{
  for(var i=0; i < arguments.length; i++)
  {
    $("#"+arguments[i]).parents(".main_item").css("display", "");
  }
}

//检查密码强度
function checkPasswordStrength(sValue, tipElementId)
{
  var levelStr = ["Weak", "Medium", "Strong", "Good"];
  var pwdLevel = 0;
  var modes = 0;
  if (sValue.length <= 6){
    pwdLevel = 1;
  }else{
    if (/\d/.test(sValue)) modes++; //数字
    if (/[a-z]/.test(sValue)) modes++; //小写
    if (/[A-Z]/.test(sValue)) modes++; //大写  
    if (/\W/.test(sValue)) modes++; //特殊字符
    switch (modes)
    {
    case 1:
     pwdLevel = 1;
     break;
    case 2:
     pwdLevel = 2;
     break;
    case 3:
    case 4:
     if(sValue.length < 12){
        pwdLevel = 3;
     }else{
        pwdLevel = 4;
     }
     break;
    }
  }

  $("#"+tipElementId).removeClass().addClass("level"+pwdLevel);
  $("#"+tipElementId).find("span").removeClass().text("");
  $("#"+tipElementId).find("span").eq(pwdLevel-1).addClass("active").text(levelStr[pwdLevel-1]);

  return pwdLevel;
}

//check the validation of WEPKey
function isValidKey(variable, digit)
{
    var val = String(variable);
    if (val.length == digit)
    return true;
    else
    return false;
}

function isValidHex(hexNum, hexNumLength)
{   
	if(hexNum.length > hexNumLength){
		return false;
	}
	var pattHexnum = /^[a-f0-9A-F]+$/;
	return pattHexnum.test(hexNum);
}

//获取运营商CT CU CM
function getOperator()
{
	var operator;
	if ( parent.gOperator != undefined && parent.gOperator != '' )
	{
		operator = parent.gOperator;
	}
	else
	{
		if (gDebug)
		{
			getDataByAjax("../fake/operator", function(data){
				if ( data )
				{
					operator = data.operator;
				}
			});
		}
		else
		{
			XHR.get("get_operator", null, function(data){
				if ( data )
				{
					operator = data.operator;
				}
			});
		}
	}
	
	if ( operator == '' )
	{
		operator = "CT"; //default
	}
	
	return operator;
}

function isValidURL(ipAddress)
{
    var urlPat=/(?:(?:http[s]?|ftp):\/\/)?[^\/\.]+?\.[^\.\\\/]+?\.\w{2,}$/i;
    var matchArray=ipAddress.match(urlPat);
    if( matchArray != null )
    {
        return true;
    } 
    else 
    {
        return false;
    } 
}

function isValidIpv6Address(address){
	var i = 0, num = 0;
	var space=0;
	addrParts = address.split(':');
	if (addrParts.length < 3 || addrParts.length > 8)
			return false;
	for (i = 0; i < addrParts.length; i++) {
		if ( addrParts[i] != "" && isValidHexKey(addrParts[i],addrParts[i].length) )
		num = parseInt(addrParts[i], 16);
		else
		{
				space++;
				if(space>1)
				return false;
				continue;
		}

		if ( num > 0xffff || num < 0 ){
		    return false;
		}
	}
	return true;
}

function macaddcolon(data)
{
	var macArray = data.split("");
	var colonmac = "";
	for (var i = 0; i < data.length - 2;)
	{
		colonmac += macArray[i];
		colonmac += macArray[i+1];
		colonmac += ":";
		i += 2;
	}
	colonmac += macArray[i];
	colonmac += macArray[i+1];
	return colonmac;
}


function PadZero(str) 
{
    //补零
	if(str<10) 
		return "0" +""+ str;
	else 
		return str;
}
 
function getNetworkRate(rate, dec)
{
	var str;
	if ((rate / dec) < 1024)
	{
		str = (rate / dec).toFixed(1) + "";
	}
	else if ((rate / (1024 * dec)) < 1024)
	{
		str = (rate / (1024 * dec)).toFixed(1) + "K";	
	}
	else if ((rate / (1024 * 1024 * dec)) < 1024)
	{
		str = (rate / (1024 * 1024 * dec)).toFixed(1) + "M";	
	}
	else if ((rate / (1024 * 1024 * 1024 * dec)) < 1024)
	{
		str = (rate / (1024 * 1024 * 1024 * dec)).toFixed(1) + "G";		
	}
	else if ((rate / (1024 * 1024 * 1024 * 1024 * dec)) < 1024)
	{
		str = (rate / (1024 * 1024 * 1024 * 1024 * dec)).toFixed(1) + "T";		
	}	

	return str;
}
 
function getNetworkRate2(rate, dec)
{
	var str;
	if ((rate / dec) < 1000)
	{
		str = (rate / dec).toFixed(1) + "";
	}
	else if ((rate / (1000 * dec)) < 1000)
	{
		str = (rate / (1000 * dec)).toFixed(1) + "K";	
	}
	else if ((rate / (1000 * 1000 * dec)) < 1000)
	{
		str = (rate / (1000 * 1000 * dec)).toFixed(1) + "M";	
	}
	else if ((rate / (1000 * 1000 * 1000 * dec)) < 1000)
	{
		str = (rate / (1000 * 1000 * 1000 * dec)).toFixed(1) + "G";		
	}
	else if ((rate / (1000 * 1000 * 1000 * 1000 * dec)) < 1000)
	{
		str = (rate / (1000 * 1000 * 1000 * 1000 * dec)).toFixed(1) + "T";		
	}	

	return str;
}


function formatTime(s) 
{
	var t;
	var hour = Math.floor(s/3600);
	var min = Math.floor(s/60) % 60;
	var day = parseInt(hour / 24);

	t = day + ":";
	hour = hour - 24 * day;
	t +=  hour + ":" + min;

	return t;
}
 
function formatTime2(s) 
{
	s = parseInt(s);
	var hours = 0; 
	var mins = 0; 
	var seconds = 0;
	var result = '';
	seconds = parseInt(s % 60);
	mins = parseInt(s % 3600 / 60);
	hours = parseInt(s / 3600);

	if (hours)
		result = PadZero(hours) + ":" + PadZero(mins) + ":" + PadZero(seconds);
	else
		result = PadZero(hours) + ":" + PadZero(mins) + ":" + PadZero(seconds);
	
	return result;
}

function string2MACFormat(strMac)
{
	if (strMac.length == 12)
		var mac = strMac.substring(0,2) + ":" + strMac.substring(2,4) + ":" + strMac.substring(4,6) + ":" + strMac.substring(6,8) + ":" + strMac.substring(8,10) + ":" + strMac.substring(10,12);
	else
		var mac = strMac;

	return mac;
}





