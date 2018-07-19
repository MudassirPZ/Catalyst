if( window.self !== window.top )
{
	chrome.runtime.sendMessage({ELQ_SP_Request: "EXTN_STATUS"}, function(response) {
		var localSettings = $.parseJSON(response);
		if( localSettings && (localSettings.isExtnEnabled) )
		{
			var scriptTag = document.createElement("script");
			scriptTag.src = chrome.extension.getURL("ELQ_SP_EditorJS.js");
			scriptTag.type = "text/javascript";
			scriptTag.ascync = false;
			document.documentElement.appendChild(scriptTag);
		}
	});
	/*window.addEventListener("keydown", function(e)
	{
		if( e.target.tagName.toUpperCase() == "TEXTAREA" )
		{
			ELQ_SP_Event = {
				ctrlKey: e.ctrlKey,
				shiftKey: e.shiftKey,
				altKey: e.altKey,
				keyCode: e.keyCode,
				which: e.which,
				preventDefault: function(){ console.log("Preventing Iframe Event Default..."); },
				stopPropagation: function() { console.log("Preventing Iframe Event Propagation..."); }
			};
			chrome.runtime.sendMessage({ELQ_SP_Request: "KEYDOWN", ELQ_SP_Event: ELQ_SP_Event}, function(response) {
				
			});
			if( e.keyCode == 83 && e.ctrlKey && !e.altKey && !e.shiftKey )
			{
				e.preventDefault();
				e.stopPropagation();
				return false;
			}
		}
	});*/
}