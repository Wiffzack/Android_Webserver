(function() {

	// Important !!!!!!!!!!
	// DONT USE THIS !!!!!!
	//ytplayer = document.getElementById("movie_player");
	//videotimesec = ytplayer.getCurrentTime();
	var txt;	
	var tabUrl = window.location.toString();
	var element =  document.getElementById('movie_player');
	if (typeof(element) != 'undefined' && element != null)
	{	
	video = document.getElementsByClassName('video-stream')[0];
	//var intvalue = Math.round( floatvalue );
	var videotimesec = Math.round(video.currentTime);
	alert(videotimesec);
	alert(tabUrl);
	}
	
	// stupid i know
	groupn = prompt("Which group number do you want?:", "");
	if (groupn == null || groupn == "") {
		txt = "User cancelled the prompt.";
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
	xmlhttp.open("GET","http://127.0.0.1/settime.php?url="+encodeURIComponent(tabUrl)+"&"+"seconds="+encodeURIComponent(videotimesec)+"&"+"groupid="+encodeURIComponent(groupn),true);
	xmlhttp.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
	xmlhttp.timeout = 5000;
	xmlhttp.send();
	
	
})();
