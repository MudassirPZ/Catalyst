/*chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
	chrome.tabs.sendMessage(tabs[0].id, {greeting: "hello"}, function(response) {
		console.log("Background.js:");
		console.log(response);
	});
});*/

var isChrome = /Chrome/.test(navigator.userAgent) && /Google Inc/.test(navigator.vendor);

if( isChrome ) {
	extVersion = chrome.app.getDetails().version;
	guideURL = chrome.runtime.getURL("UserGuide.html");
} else {
	extVersion = browser.runtime.getManifest().version;
	guideURL = browser.runtime.getURL("UserGuide.html")
}

firstRun = false;
_ELQ_SP_Settings = {
						isExtnEnabled: true, version: extVersion,
						Shortcuts: {
							Save: false, Copy: true, Delete: true, FieldMerges: true,
							TestToMyself: true, TestToOthers: true,
						},
						FileStorageMulti: true,
						ValidateFieldMerges: true,
						guideURL: guideURL
					};

if( !localStorage.ELQ_SP_Settings )
{
	firstRun = true;
	localStorage.ELQ_SP_Settings = JSON.stringify(_ELQ_SP_Settings);
}

chrome.runtime.onMessage.addListener( function(request, sender, sendResponse) {
	switch( request.ELQ_SP_Request )
	{
		case "KEYDOWN":
		case "REFRESH_SETTINGS":
			chrome.tabs.query({}, function(tabs) {
				for (var i=0; i<tabs.length; ++i) {
					chrome.tabs.sendMessage(tabs[i].id, request);
				}
			});
		break;
		case "LOAD_SETTINGS":
			if( localStorage.ELQ_SP_Settings )
			{
				Settings = $.parseJSON(localStorage.ELQ_SP_Settings);
				
				if( Settings.version !== extVersion )
				{
					chrome.tabs.query(null, function(tabs) {
						chrome.tabs.sendMessage(tabs[0].id, { ELQ_SP_Request: "VERSION_CHANGE", ELQ_SP_Version: extVersion, ELQ_SP_Updates: "<span class='ELQ_SP_Strong'>Really?</span>"+
													"<br/>- Jumbo Canvas (twice the size of usual canvas)" });
					});
					
					Settings.version = extVersion;
					localStorage.ELQ_SP_Settings = JSON.stringify(Settings);
				}
				
				if( Settings.isExtnEnabled )
				{
					chrome.browserAction.setIcon({ path:"Catalyst_Active_32p.png" });
					chrome.browserAction.setTitle({title: "Catalyst - Eloqua Extension (Active)"});
				}
				else
				{
					chrome.browserAction.setIcon({ path:"Catalyst_Normal_32p.png" });
					chrome.browserAction.setTitle({title: "Catalyst - Eloqua Extension (Inactive)"});
				}
				chrome.browserAction.setPopup({popup: "ELQ_SP_Settings.html"});
			}
			
			if( firstRun )
			{
				firstRun = false;
				chrome.tabs.query({
					active: true,
					currentWindow: true
				}, function(tabs) {
					chrome.tabs.sendMessage(tabs[0].id, { ELQ_SP_Request: "FIRST_RUN", ELQ_SP_Version: extVersion });
				});
			}
			sendResponse(localStorage.ELQ_SP_Settings);
		break;
		case "EXTN_STATUS":
			sendResponse(localStorage.ELQ_SP_Settings);
		break;
		case "EXEC_PASTE":
			inp = document.createElement("input");
			document.body.appendChild(inp);
			inp.focus();
			pasted = document.execCommand("paste", null, null);
			pastedValue = inp.value;
			sendResponse(pastedValue);
			inp.remove();
		break;
	}
});


function SetIconAndPopup()
{
	chrome.tabs.query({
		active: true,
		currentWindow: true
	}, function(tabs) {
		var tab = tabs[0];
		if( tab.url && (tab.url.indexOf("https://secure.p03.eloqua.com") == 0 || tab.url.indexOf("http://localhost") == 0) )
		{
			if( localStorage.ELQ_SP_Settings )
			{
				Settings = $.parseJSON(localStorage.ELQ_SP_Settings);
				if( Settings.isExtnEnabled )
				{
					chrome.browserAction.setIcon({ path:"Catalyst_Active_32p.png" });
					chrome.browserAction.setTitle({title: "Catalyst - Eloqua Extension (Active)"});
				}
				else
				{
					chrome.browserAction.setIcon({ path:"Catalyst_Normal_32p.png" });
					chrome.browserAction.setTitle({title: "Catalyst - Eloqua Extension (Inactive)"});
				}
			}
			chrome.browserAction.setPopup({popup: "ELQ_SP_Settings.html"});
		}
		else
		{
			chrome.browserAction.setIcon({ path:"Catalyst_Disabled_32p.png" });
			chrome.browserAction.setTitle({ title: "Catalyst - Eloqua Extension" });
			chrome.browserAction.setPopup({ popup: "" });
		}
	});
}


chrome.tabs.onActivated.addListener(function(tabId) {
	SetIconAndPopup();
});

/*
window.onmessage = function(event) {
	//if( event.origin == "http://localhost" )
	//{
		if( event.data.type && (event.data.type == "ELQ_SP_CONTENTSCRIPT") ) {
			if( event.data.request )
			{
				switch( event.data.request.ELQ_SP_Request )
				{
					case "KEYDOWN":
						window.ELQ_SP_WinKeyDown(event.data.request.ELQ_SP_Event);
					break;
					case "REFRESH_SETTINGS":
						console.log("Updating settings...");
					break;
				}
			}
		}
	//}
};*/