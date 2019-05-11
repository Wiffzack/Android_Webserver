(function() {
	var guestid;	
	// used to recive the guestid
	// I could move the groupn to the background script ... maybe
    chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
        guestid = request.parameter;
		//alert(guestid);
		if(guestid){
			return (sendurl());
		}
	});
	// Important !!!!!!!!!!
	// DONT USE THIS !!!!!!
	//ytplayer = document.getElementById("movie_player");
	//videotimesec = ytplayer.getCurrentTime();
	function sendurl(){
	
	var txt;	
	var tabUrl = window.location.toString();
	var element =  document.getElementById('movie_player');
	
	
	if (typeof(element) != 'undefined' && element != null)
	{	
	video = document.getElementsByClassName('video-stream')[0];
	//var intvalue = Math.round( floatvalue );
	var videotimesec = Math.round(video.currentTime);
	//alert(videotimesec);
	//alert(tabUrl);
	}	
	
	// stupid i know ...
	groupn = window.localStorage.getItem('groupn');
	if (groupn == null || groupn == "") {
		groupn = prompt("Which group number do you want?:", "");
		window.localStorage.setItem('groupn', groupn);
		if (groupn == null || groupn == "") {
			txt = "User cancelled the prompt.";
		}
	}else{
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
		xmlhttp.open("GET","https://127.0.0.1/settime.php?url="+encodeURIComponent(tabUrl)+"&"+"seconds="+encodeURIComponent(videotimesec)+"&"+"groupid="+encodeURIComponent(groupn)+"&"+"guestid="+encodeURIComponent(guestid),true);
		xmlhttp.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
		xmlhttp.timeout = 5000;
		xmlhttp.send();
		return groupn;
	}
	}
	// could prevent ...
	/*
    if (window.hasRun === true)
        return true;  // Will ultimately be passed back to executeScript
    window.hasRun = true;	
	*/
})();
