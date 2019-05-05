var tabUrl;
var keywords;
var rating;
var searchword;
var httpRequest;
var xmlhttp;
var status = " ";


//chrome.browserAction.setBadgeText( { text: status } );
//chrome.browserAction.setBadgeBackgroundColor({color: [0,255,0,255]});
//chrome.browserAction.setBadgeBackgroundColor({color: [0,0,250,250]});

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

//serverReachables();
chrome.tabs.onUpdated.addListener(function() {
	chrome.tabs.query({'active': true, 'lastFocusedWindow': true, 'currentWindow': true}, function (tabs) {tabUrl = tabs[0].url;serverReachables();});	
});

async function refresh() {
// serverReachables();
await chrome.browserAction.onClicked.addListener(function(tab) {chrome.tabs.update(tab.id, {url: url});});
await chrome.tabs.query({'active': true, 'lastFocusedWindow': true, 'currentWindow': true}, function (tabs) {tabUrl = tabs[0].url;serverReachables();});	
}

function serverReachables() {
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
	xmlhttp.open("GET","http://127.0.0.1/index.html",true);
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
	xmlhttp.open("GET","http://127.0.0.1/foobar_submit.php?url="+encodeURIComponent(tabUrl)+"&"+"keywords="+encodeURIComponent(keywords)+"&"+"rating="+encodeURIComponent(rating),true);
	xmlhttp.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
	xmlhttp.timeout = 5000;
	xmlhttp.send();
	//req.open('POST', 'http://127.0.0.1/', true);
	//req.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
	//req.send('url=' + encodeURIComponent(url));
	}
	
function getUrl() {
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
	window.open("http://127.0.0.1/search_plugin.php?keywords="+encodeURIComponent(searchword));
	//window.location.replace("http://127.0.0.1/search_plugin.php?keywords="+encodeURIComponent(searchword));

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

chrome.contextMenus.onClicked.addListener(function(info, tab) {
    if (info.menuItemId == "Search") {
		refresh();
		mysearch();
		if (searchword) {
		getUrl();	
    }
    if (info.menuItemId == "Add") {
		refresh();
		myFunction();
		//console.log(window.tabUrl);
		if (tabUrl) {
		sendCurrentUrl();
		}
	}
	}	
});

