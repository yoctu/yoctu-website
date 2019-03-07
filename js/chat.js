var wsUri;
var chatuser = Math.random().toString(36).substring(7);
var chan = "#" + chatuser;
var nick = Math.random().toString(36).substring(7);
var invite = "";
var notice = "";
var msgnum = 0;

document.write('<script async src="https://www.googletagmanager.com/gtag/js?id=UA-113891182-2"></script>');
window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', 'UA-113891182-2');

function sleep (time) {
    return new Promise((resolve) => setTimeout(resolve, time));
}

function init() {   
    wsUri = document.querySelector('#yoctu-chat').dataset.url;
    if (document.querySelector('#yoctu-chat').dataset.chan) {
        chatuser = document.querySelector('#yoctu-chat').dataset.chan;
        chan = "#" + chatuser;
    }
    if (document.querySelector('#yoctu-chat').dataset.nick) {
        nick = document.querySelector('#yoctu-chat').dataset.nick;
    }
    if (document.querySelector('#yoctu-chat').dataset.invite) {
        invite = document.querySelector('#yoctu-chat').dataset.invite;
    }
    if (document.querySelector('#yoctu-chat').dataset.notice) {
        notice = document.querySelector('#yoctu-chat').dataset.notice;
    }
    color = document.querySelector('#yoctu-chat').dataset.color;
    document.querySelector(':root').style.setProperty('--main-color', color);
    websocket = new WebSocket(wsUri);
    websocket.onopen = function(evt) { onOpen(evt) };
    websocket.onclose = function(evt) { onClose(evt) };
    websocket.onmessage = function(evt) { onMessage(evt) };
    websocket.onerror = function(evt) { onError(evt) };
}

function onOpen(evt) {
    writeToScreen("CONNECTED");
    doSend("NICK " + chatuser + "_" + nick);
    sleep(200).then(() => {
            doSend("USER " + chatuser + "_" + nick + "  * * :" + chatuser + "_" + nick);
    });
    sleep(500).then(() => {
            doSend("JOIN " + chan);
            document.getElementById("yoctu-chat").innerHTML = '<button class="open-button" onclick="openForm()">Chat</button>\
<div class="chat-popup" id="chat-popup-form">\
    <a href="#" onclick="closeForm()"><div class="chat-header">Help</div></a>\
        <form class="form-container">\
            <div id="chat-messages-container"></div>\
            <div class="chat-container">\
                <table width="100%"><tr>\
                    <td align="left"><input id="prvmsg" onkeypress="return tableInputKeyPress(event);"></input></td>\
                    <td><button type="button" onclick="sendPRVMSG();" class="chat-btn">Send</button></td>\
                </tr></table>\
            </div>\
        </form>\
</div>';
            document.getElementById("yoctu-chat").style.display = 'block';
    });
    sleep(2000).then(() => {
        setInterval(function(){ doSend("PING :test"); }, 30000);
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
    doSend("PRIVMSG " + chan + " " + input.value);
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
        chan = privmsg[0].split("!")[0].substring(1);
        for(var i = 3; i < privmsg.length; i++){
            privmsgbody += " " + privmsg[i];
        }
        pre.innerHTML = '<div class="chat-container"><font color="' + color + '">' + msgdate.getHours() + ':' + msgdate.getMinutes()  + ' : ' + privmsgbody.substring(2) + '</font></div>';
        output.appendChild(pre);
        msgnum += 1;
        cleanMessage();
        document.getElementById("chat-popup-form").style.display = "block";
    } else {
           if (privmsg[3] == "JOIN") {
               sleep(500).then(() => {
                   doSend("JOIN " + chan);
               });
           }
           if ((invite != "") && (privmsg[1] == "JOIN") && privmsg[2].startsWith(':#')) {
               sleep(500).then(() => {
                   doSend("INVITE " + invite + " " + chan);
               });
           }
           if ((notice != "") && (privmsg[1] == "JOIN") && privmsg[2].startsWith(':#')) {
               sleep(500).then(() => {
                   doSend("NOTICE " + chan + " " + chatuser + " join " + chan);
               });
           }
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
