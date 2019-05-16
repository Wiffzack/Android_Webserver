
// careful with  JSON
window.addEventListener("PassToBackground", function(evt) {
	var videotimesec = evt.detail.detail1;
	chrome.runtime.sendMessage({parameter: videotimesec});
}, false);
