var wsUri;
var chan;
var nick = Math.random().toString(36).substring(7);
var msgnum = 0;

fetch("https://yoctu.github.io/yoctu-website/html/chat.html")
    .then((response) => response.text())
    .then((html) => {
        document.getElementById("yoctu-chat").innerHTML = html;
    })
    .catch((error) => {
        console.warn(error);
    });


function sleep (time) {
    return new Promise((resolve) => setTimeout(resolve, time));
}

function init() {
    wsUri = document.querySelector('#yoctu-chat').dataset.url;
    chan = document.querySelector('#yoctu-chat').dataset.chan;
    color = document.querySelector('#yoctu-chat').dataset.color;
    document.querySelector(':root').style.setProperty('--main-color', color);
    websocket = new WebSocket(wsUri);
    websocket.onopen = function(evt) { onOpen(evt) };
    websocket.onclose = function(evt) { onClose(evt) };
    websocket.onmessage = function(evt) { onMessage(evt) };
    websocket.onerror = function(evt) { onError(evt) };
}

function onOpen(evt)
{
    writeToScreen("CONNECTED");
    doSend("USER " + chan + "_" + nick + "  * * :" + chan + "_" + nick);
    sleep(1000).then(() => {
            doSend("NICK " + chan + "_" + nick);
    });
    sleep(2000).then(() => {
            doSend("JOIN #" + chan);
    });
    sleep(2000).then(() => {
        setInterval(function(){ doSend("PING :upela"); }, 30000);
    });
}

function onClose(evt) {}

function onMessage(evt) {
    writeToScreen(evt.data);
}

function onError(evt) {
    console.log(evt.data);
}

function doSend(message) {
    websocket.send(message);
}

function openForm() {
  document.getElementById("chat-popup-form").style.display = "block";
}

function closeForm() {
  document.getElementById("chat-popup-form").style.display = "none";
}

function cleanMessage() {
    if (msgnum > 6) {
        output = document.getElementById("chat-messages-container");
        output.removeChild(output.childNodes[0]);
    }
}

function sendPRVMSG() {
    input = document.getElementById("prvmsg");
    output = document.getElementById("chat-messages-container");
    doSend("PRIVMSG #upela " + input.value);
    var pre = document.createElement("p");
    pre.innerHTML = '<div class="chat-container"><font color="#444">' + msgdate.getHours() + ':' + msgdate.getMinutes()  + ' : ' + input.value + '</font></div>';
    output.appendChild(pre);
    msgnum += 1;
    cleanMessage();
    input.value = "";
}

function writeToScreen(message) {
    privmsg = message.split(" ");
    msgdate = new  Date();
    output = document.getElementById("chat-messages-container");
    if (privmsg[1] == "PRIVMSG" && output && !privmsg[3].startsWith(':***')) {
        var pre = document.createElement("p");
        let privmsgbody = "";
        for(var i = 3; i < privmsg.length; i++){
            privmsgbody += " " + privmsg[i];
        }
        pre.innerHTML = '<div class="chat-container"><font color="' + color + '">' + msgdate.getHours() + ':' + msgdate.getMinutes()  + ' : ' + privmsgbody.substring(2) + '</font></div>';
        output.appendChild(pre);
        msgnum += 1;
        cleanMessage();
        document.getElementById("chat-popup-form").style.display = "block";
    }
}

function tableInputKeyPress(e){
    e=e||window.event;
    var key = e.keyCode;
    if(key==13) {
        sendPRVMSG();
        return false;
    }
}

window.addEventListener("load", init, false);
