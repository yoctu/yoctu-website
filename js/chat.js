var wsUri;
var chan;
//var wsUri = "ws://v-1538492917-525.dev.yoctu.ovh:7002";
//var chan = "upela";
var nick = Math.random().toString(36).substring(7);

function sleep (time) {
    return new Promise((resolve) => setTimeout(resolve, time));
}

function init() {
    wsUri = document.querySelector('#chat-popup-form').dataset.url;
    chan = document.querySelector('#chat-popup-form').dataset.wsUri;
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

function sendPRVMSG() {
    input = document.getElementById("prvmsg");
    output = document.getElementById("chat-messages-container");
    doSend("PRIVMSG #upela " + input.value);
    var pre = document.createElement("p");
    pre.innerHTML = '<div class="chat-container"><font color="#444">' + msgdate.getHours() + ':' + msgdate.getMinutes()  + ' : ' + input.value + '</font></div>';
    output.appendChild(pre);
    input.value = "";
}

function writeToScreen(message) {
    privmsg = message.split(" ");
    msgdate = new  Date();
    output = document.getElementById("chat-messages-container");
    if (privmsg[1] == "PRIVMSG" && output) {
        var pre = document.createElement("p");
        let privmsgbody = "";
        for(var i = 3; i < privmsg.length; i++){
            privmsgbody += privmsg[i];
        }
        pre.innerHTML = '<div class="chat-container">' + msgdate.getHours() + ':' + msgdate.getMinutes()  + ' : ' + privmsgbody.substring(1) + '</div>';
        output.appendChild(pre);
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
