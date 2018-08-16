var x = document.getElementById("myAudio"),
    tag = document.createElement("script"),
    myVideo = iframe.getElementById("ytplayer"),
    vid = document.getElementById("bgvid");
tag.src = "//www.youtube.com/iframe_api";
var firstScriptTag = document.getElementsByTagName("script")[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
var player;
window.onclick = function(a) {
    if (!a.target.matches(".dropbtn")) {
        a = document.getElementsByClassName("dropdown-content");
        var b;
        for (b = 0; b < a.length; b++) {
            var c = a[b];
            c.classList.contains("show") && c.classList.remove("show")
        }
    }
};

function setHref() {
    document.getElementById("chatbutton").href = window.location.protocol + "//" + window.location.hostname + "wiffzackius.ddns.net:5000"
}

function playAudio() {
    x.play()
}

function myFunction() {
    playAudio();
    document.getElementById("myDropdown").classList.toggle("show")
}
window.matchMedia("(prefers-reduced-motion)").matches && (vid.removeAttribute("autoplay"), vid.pause(), pauseButton.innerHTML = "Paused");

function vidFade() {
    vid.classList.add("stopfade")
}
vid.addEventListener("ended", function() {
    vid.pause();
    vidFade()
});
pauseButton.addEventListener("click", function() {
    vid.classList.toggle("stopfade");
    vid.paused ? (vid.play(), pauseButton.innerHTML = "Pause") : (vid.pause(), pauseButton.innerHTML = "Paused")
});
