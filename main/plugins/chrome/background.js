// Copyright (c) 2012 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
var tabUrl;
var keywords;
var rating;
var searchword;

chrome.runtime.onInstalled.addListener(function() {
	var contexts = ["page","selection","link","editable"];
	var title = "Google Search";
	chrome.contextMenus.create({
		id: "Search",
		title: "some title",
		contexts: ["all"]
	});
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



chrome.tabs.onUpdated.addListener(function() {
	chrome.tabs.query({'active': true, 'lastFocusedWindow': true, 'currentWindow': true}, function (tabs) {tabUrl = tabs[0].url;});	
});

async function refresh() {
	
await chrome.browserAction.onClicked.addListener(function(tab) {chrome.tabs.update(tab.id, {url: url});});
await chrome.tabs.query({'active': true, 'lastFocusedWindow': true, 'currentWindow': true}, function (tabs) {tabUrl = tabs[0].url;});	
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


