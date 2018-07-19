// Called when the user clicks on the browser action.

var xmlHttp = null;
xmlHttp = new XMLHttpRequest();
xmlHttp.open("GET", chrome.extension.getURL("ELQ_SP_Console.html"), false);
xmlHttp.send(null);
var ConsoleCode  = document.createElement("div");
ConsoleCode.innerHTML = xmlHttp.responseText;
document.documentElement.appendChild(ConsoleCode);

var scriptTag = document.createElement("script");
scriptTag.src = chrome.extension.getURL("jquery.min.js");
scriptTag.type = "text/javascript";
scriptTag.ascync = false;
document.documentElement.appendChild(scriptTag);

var scriptTag = document.createElement("script");
scriptTag.src = chrome.extension.getURL("angular.min.js");
scriptTag.type = "text/javascript";
scriptTag.ascync = false;
document.documentElement.appendChild(scriptTag);

setTimeout( function() {
	var scriptTag = document.createElement("script");
	scriptTag.src = chrome.extension.getURL("ELQ_SP_ConsoleJS.js");
	scriptTag.type = "text/javascript";
	scriptTag.ascync = false;
	document.documentElement.appendChild(scriptTag);

	var scriptTag = document.createElement("script");
	scriptTag.src = chrome.extension.getURL("ELQ_SP_NamingGen.js");
	scriptTag.type = "text/javascript";
	scriptTag.ascync = false;
	document.documentElement.appendChild(scriptTag);
}, 1000);

/*
setTimeout( function()
{
	var scriptTag = document.createElement("script");
	scriptTag.src = chrome.extension.getURL("motion.min.js");
	scriptTag.type = "text/javascript";
	scriptTag.ascync = false;
	document.documentElement.appendChild(scriptTag);
}, 2000);*/

var linkTag = document.createElement("link");
linkTag.href = chrome.extension.getURL("ELQ_SP_StyleSheet.css");
linkTag.id = "ELQ_SP_StyleSheet";
linkTag.rel = "stylesheet";
document.documentElement.appendChild(linkTag);

var port = chrome.runtime.connect();

chrome.runtime.onMessage.addListener( function(request, sender, sendResponse) {
	switch(request.ELQ_SP_Request)
	{
		case "KEYDOWN":
		case "REFRESH_SETTINGS":
		case "EXTN_STATUS":
		case "FIRST_RUN":
		case "VERSION_CHANGE":
		case "EXTN_ENABLED":
		case "EXTN_DISABLED":
		case "PASTE_CALLBACK":
			window.postMessage({type: "ELQ_SP_CONTENTSCRIPT", request: request}, "*");
		break;
	}
});

/*
window.onmessage = function(event)
{
	console.log( event );
	if( event.data.type && (event.data.type == "ELQ_SP_PAGESCRIPT") ) {
		if( event.data.request )
		{
			switch( event.data.request.ELQ_SP_Request )
			{
				case "LOAD_SETTINGS":
					chrome.runtime.sendMessage({ELQ_SP_Request: "LOAD_SETTINGS"}, function(response) {
						window.postMessage({
												type: "ELQ_SP_CONTENTSCRIPT",
												request: { ELQ_SP_Request: "REFRESH_SETTINGS", ELQ_SP_Settings: response }
											}, "*");
					});
				break;
				case "EXEC_PASTE":
					chrome.runtime.sendMessage({ELQ_SP_Request: "EXEC_PASTE"}, function(response) {
						window.postMessage({
												type: "ELQ_SP_CONTENTSCRIPT",
												request: { ELQ_SP_Request: "PASTE_CALLBACK", ELQ_SP_PastedValue: response }
											}, "*");
					});
				break;
			}
		}
	}
};*/


window.addEventListener("message", function(event) {
    if( event.data.type && (event.data.type == "ELQ_SP_PAGESCRIPT") ) {
		if( event.data.request )
		{
			switch( event.data.request.ELQ_SP_Request )
			{
				case "LOAD_SETTINGS":
					chrome.runtime.sendMessage({ELQ_SP_Request: "LOAD_SETTINGS"}, function(response) {
						window.postMessage({
												type: "ELQ_SP_CONTENTSCRIPT",
												request: { ELQ_SP_Request: "REFRESH_SETTINGS", ELQ_SP_Settings: response }
											}, "*");
					});
				break;
				case "EXEC_PASTE":
					chrome.runtime.sendMessage({ELQ_SP_Request: "EXEC_PASTE"}, function(response) {
						window.postMessage({
												type: "ELQ_SP_CONTENTSCRIPT",
												request: { ELQ_SP_Request: "PASTE_CALLBACK", ELQ_SP_PastedValue: response }
											}, "*");
					});
				break;
			}
		}
	}
});




chrome.runtime.sendMessage({ELQ_SP_Request: "EXTN_STATUS"}, function(response) {
	var localSettings = $.parseJSON(response);
	if( localSettings && (localSettings.isExtnEnabled) )
	{
		window.postMessage({
								type: "ELQ_SP_CONTENTSCRIPT",
								request: { ELQ_SP_Request: "EXTN_STATUS", ELQ_SP_Settings: localSettings.isExtnEnabled }
							}, "*");
	}
	else
	{
		window.postMessage({
								type: "ELQ_SP_CONTENTSCRIPT",
								request: { ELQ_SP_Request: "EXTN_STATUS", ELQ_SP_Settings: false }
							}, "*");
	}
});