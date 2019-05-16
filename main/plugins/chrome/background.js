var tabUrl;
var keywords;
var rating;
var searchword;
var httpRequest;
var xmlhttp;
var videotime;
var vidsurl;
var groupn;
var guestid;
var oldurl;
var injurl;
var videotimesec;
var status = " ";


chrome.browserAction.setBadgeText( { text: status } );
chrome.browserAction.setBadgeBackgroundColor({color: [0,0,250,250]});

function onError(error) {
  console.error('Error: ${error}');
}

	
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {	
	videotimesec = request.parameter;
	sendurl();
});

// Solve with content-script  so this is no longer required
// This is were the fun begin!!!
/*
var s = document.createElement('script');
// TODO: add "script.js" to web_accessible_resources in manifest.json
s.src = chrome.runtime.getURL('script.js');
s.onload = function() {
    this.remove();
};
(document.body || document.documentElement).appendChild(s);
//(document.head || document.documentElement).appendChild(s);
*/

//ytplayer = document.getElementById("movie_player");
//ytplayer.getCurrentTime();

// random from 0-1
function getRandomInt(max) {
	return Math.floor(Math.random() * Math.floor(max) + 1);
}

function getguestid(){
	guestid = window.localStorage.getItem('guestid');
	return (guestid);
	//alert(guestid);

}
    
// if no guestid exist generate one this is a primitive solution but should work for now	
function generateguestid() {
	var theID = getRandomInt(1000000);
	if (!theID) {
		alert("No id generated")
	}
	 window.localStorage.setItem('guestid', theID);
}

getguestid();
if (!guestid) {
	do{
		generateguestid();
	}while((!guestid));
	var code = 'window.location.reload();';
	chrome.tabs.executeScript(arrayOfTabs[0].id, {code: code});
}

//alert(guestid);
	
chrome.browserAction.onClicked.addListener(function (tab) {
	// for the current tab, inject the "inject.js" file & execute it
	chrome.tabs.executeScript(tab.ib, {
		file: 'inject.js'
	});
});

chrome.runtime.onInstalled.addListener(function() {
	var contexts = ["page","selection","link","editable"];
	var title = "Google Search";
	chrome.contextMenus.create({
		id: "Search",
		title: "Search in the Group",
		contexts: ["all"]
	});
});

chrome.runtime.onInstalled.addListener(function() {
	var contexts = ["page","selection","link","editable"];
	var title = "Google Search";
	chrome.contextMenus.create({
		id: "Add",
		title: "Add to the Group",
		contexts: ["all"]
	});
});

chrome.runtime.onInstalled.addListener(function() {
	var contexts = ["page","selection","link","editable"];
	var title = "Google Search";
	chrome.contextMenus.create({
		id: "Share",
		title: "Share video with Group",
		contexts: ["all"]
	});
});

chrome.runtime.onInstalled.addListener(function() {
	var contexts = ["page","selection","link","editable"];
	var title = "Google Search";
	chrome.contextMenus.create({
		id: "GetTime",
		title: "Get video time from Group",
		contexts: ["all"]
	});
});

//serverReachables();
chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab)  {
	
if (changeInfo.status == 'complete' && tab.active) {
	//chrome.tabs.sendMessage(tabs[0].id, {guestnumber: guestid}, function(response) {console.log(response.farewell);});
	chrome.tabs.query({'active': true, 'lastFocusedWindow': true, 'currentWindow': true}, function (tabs) {tabUrl = tabs[0].url;serverReachables();});	
}
});

async function refresh() {
// serverReachables();
await chrome.browserAction.onClicked.addListener(function(tab) {chrome.tabs.update(tab.id, {url: url});});
await chrome.tabs.query({'active': true, 'lastFocusedWindow': true, 'currentWindow': true}, function (tabs) {tabUrl = tabs[0].url;serverReachables();});	
}

function checkhttp()
{
	if (window.XMLHttpRequest) {
		xmlhttp=new XMLHttpRequest();
	} else {
		xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
	}
		xmlhttp.onreadystatechange=function() {
	if (this.readyState==4 && this.status==200) {
		//pass
	}
	}
}

function serverReachables() {
	checkhttp();
	xmlhttp.open("GET","https://127.0.0.1/index.html",true);
	xmlhttp.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
	xmlhttp.timeout = 1000;
	xmlhttp.onreadystatechange = evaluateit();
	}	
	
function evaluateit(){
	try {
	xmlhttp.send();
	xmlhttp.onload = function() {
	  if (xmlhttp.status != 200) { // analyze HTTP status of the response
		status = "  ";
		chrome.browserAction.setBadgeText( { text: status } );
		chrome.browserAction.setBadgeBackgroundColor({color: "red"});
		chrome.browserAction.setBadgeBackgroundColor({"color": [250, 0, 0, 100]});
		
	  } else { // show the result
		status = "OK";
		chrome.browserAction.setBadgeText( { text: status } );
		chrome.browserAction.setBadgeBackgroundColor({color: "green"}); 
		chrome.browserAction.setBadgeBackgroundColor({"color": [0,250,0,100]}); 
	  }
	};		
	} catch (e) {
	//alert("test1");
	chrome.browserAction.setBadgeBackgroundColor({color: "red"});
	return false;
	}	
}	

function sendCurrentUrl() {
	checkhttp();
	xmlhttp.open("GET","https://127.0.0.1/foobar_submit.php?url="+encodeURIComponent(tabUrl)+"&"+"keywords="+encodeURIComponent(keywords)+"&"+"rating="+encodeURIComponent(rating),true);
	xmlhttp.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
	xmlhttp.timeout = 5000;
	xmlhttp.send();
	//req.open('POST', 'https://127.0.0.1/', true);
	//req.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
	//req.send('url=' + encodeURIComponent(url));
	}
	
function getUrl() {
	checkhttp();
	window.open("https://127.0.0.1/search_plugin.php?keywords="+encodeURIComponent(searchword));
	//window.location.replace("https://127.0.0.1/search_plugin.php?keywords="+encodeURIComponent(searchword));

}	

function sendurl(){
	groupn = window.localStorage.getItem('groupn');
	if (groupn == null || groupn == "") {
		groupn = prompt("Which group number do you want?:", "");
		window.localStorage.setItem('groupn', groupn);
		if (groupn == null || groupn == "") {
			txt = "User cancelled the prompt.";
		}
	}
	if (window.XMLHttpRequest) {
		xmlhttp=new XMLHttpRequest();
	} else {
		xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
	}
		xmlhttp.onreadystatechange=function() {
	if (this.readyState==4 && this.status==200) {
		//pass
	}
	}
	// chrome require https connections if not mention under exceptions!
	xmlhttp.open("GET","http://127.0.0.1/settime.php?url="+encodeURIComponent(tabUrl)+"&"+"seconds="+encodeURIComponent(videotimesec)+"&"+"groupid="+encodeURIComponent(groupn)+"&"+"guestid="+encodeURIComponent(guestid),true);
	xmlhttp.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
	xmlhttp.timeout = 5000;
	xmlhttp.send();
	
	}	
	
function getvideourl() {
	checkhttp();
	window.open("https://127.0.0.1/gettime.php?keywords="+encodeURIComponent(vidsurl));
	//window.location.replace("https://127.0.0.1/search_plugin.php?keywords="+encodeURIComponent(searchword));

	}		
	

function myFunction() {
    var txt;
    keywords = prompt("Please write some keywords for the page:", "");
    if (keywords == null || keywords == "") {
        txt = "User cancelled the prompt.";
    } else {
		rating = prompt("Please give the page a rating (from 1-10) default:1", "");	
		if (rating == null || rating == "") {
			rating = 1;
		} else {
			//pass
		}
}
}

function mysearch() {
    var txt;
    searchword = prompt("Please enter search term:", "");
    if (searchword == null || searchword == "") {
        txt = "User cancelled the prompt.";
    } else {
		}
}

function groupselect() {
    var txt;
    vidsurl = prompt("Which Group do you wanna watch:", "");
    if (keywords == null || keywords == "") {
        txt = "User cancelled the prompt.";
    }
}

function getCookie(cname) {
	var name = cname + "=";
	var decodedCookie = decodeURIComponent(document.cookie);
	var ca = decodedCookie.split(';');
	for(var i = 0; i <ca.length; i++) {
		var c = ca[i];
		while (c.charAt(0) == ' ') {
			c = c.substring(1);
		}
	if (c.indexOf(name) == 0) {
		return c.substring(name.length, c.length);
	}
	}
	return "";
}


function checkCookie() {
	var cname = getCookie("username");
	if (cname != "") {
		alert("Welcome again " + username);
	}
}

chrome.commands.onCommand.addListener(function(command) {
	if (command == "toggle-feature") {
		refresh();
		myFunction();
		//console.log(window.tabUrl);
		if (tabUrl) {
		sendCurrentUrl();
		}
		console.log('onCommand event received for message: ', command);
	}
});

chrome.commands.onCommand.addListener(function(command) {
	if (command == "sendlink") {
		refresh();
		mysearch();
		if (searchword) {
		getUrl();	
    }
		console.log('onCommand event received for message: ', command);
	}
});

chrome.contextMenus.onClicked.addListener(function(info, tab) {
    if (info.menuItemId == "Search") {
		refresh();
		mysearch();
		if (searchword) {
		getUrl();	
    }
	}
});

chrome.contextMenus.onClicked.addListener(function(info, tab) {
    if (info.menuItemId == "Add") {
		refresh();
		myFunction();
		//console.log(window.tabUrl);
		if (tabUrl) {
		sendCurrentUrl();
		}
	}
});

/*
chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
	if (request.cmd == "any command") {
	  sendResponse({ result: "any response from background" });
	} else {
	  sendResponse({ result: "error", message: `Invalid 'cmd'` });
	}
	// Note: Returning true is required here!
	//  ref: http://stackoverflow.com/questions/20077487/chrome-extension-message-passing-response-not-sent
	return true; 
  });
*/
  
chrome.contextMenus.onClicked.addListener(function(info, tab) {	
    if (info.menuItemId == "Share") {
		refresh();
		//chrome.tabs.executeScript(tab.ib, {	file: 'inject.js'});
		chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
		var currenttab =tabs[0].id;
		if(injurl==currenttab){
			chrome.tabs.sendMessage(tabs[0].id, {parameter: guestid});		
		}else{
			injurl=tabs[0].id;
			chrome.tabs.executeScript(tabs[0].id, {file: 'inject.js'}, function() {
			chrome.tabs.sendMessage(tabs[0].id, {parameter: guestid});	
			});		
		}
	});
	}
});


/*
chrome.contextMenus.onClicked.addListener(function(info, tab) {	
    if (info.menuItemId == "Share") {
		refresh();
		//chrome.tabs.executeScript(tab.ib, {	file: 'inject.js'});
	
		chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
			chrome.tabs.executeScript(tabs[0].id, {file: 'inject.js'}, function() {
			chrome.tabs.sendMessage(tabs[0].id, {parameter: guestid});
			});		
			});
	}
});
*/

chrome.contextMenus.onClicked.addListener(function(info, tab) {	
    if (info.menuItemId == "GetTime") {
		groupselect();
		getvideourl();
		refresh();
		//alert(getCookie("videourlcookie"));
	}
});

