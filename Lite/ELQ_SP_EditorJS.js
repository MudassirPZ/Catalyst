/*window.onmessage = function(e)
{
	if( e.data.type && (e.data.type == "getAssetHTML") )
	{
		HTML = Editor.mainPane.emailUploadEditor.topLeftView.contentView.preview.get("value");
		window.top.postMessage({
			type: "ELQ_SP_CodeEditor", action: "receiveAssetHTML",
			saveData: { HTML: HTML, saveBtn: e.data.saveBtn }
		}, "*");
	}
	
	if( e.data.type && (e.data.type == "updatePreviewHTML") )
	{
		Editor.mainPane.emailUploadEditor.topLeftView.contentView.preview.set("value", e.data.HTML);
	}
};*/

window.addEventListener("keydown", function(e)
{
	ELQ_SP_Event = {
		ctrlKey: e.ctrlKey,
		shiftKey: e.shiftKey,
		altKey: e.altKey,
		keyCode: e.keyCode,
		which: e.which,
		preventDefault: false,
		stopPropagation: false
	};
	window.top.postMessage({ type: "ELQ_SP_CONTENTSCRIPT", request: { ELQ_SP_Request: "KEYDOWN", ELQ_SP_Event: ELQ_SP_Event }}, "*");
	/*if( e.target.tagName.toUpperCase() == "TEXTAREA" )
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
	}*/
	if( e.keyCode == 83 && e.ctrlKey && !e.altKey && !e.shiftKey )
	{
		e.preventDefault();
		e.stopPropagation();
		return false;
	}
});

window.ELQ_SP_CheckEditorLoad = function()
{
	if( typeof window.Editor !== "undefined" )
	{
		/*EB = Editor.statechart.getState("editorBase");
		if( EB.allowedPostMessageEvents.indexOf("getAssetHTML") < 0 )
			EB.allowedPostMessageEvents.push("getAssetHTML");
		EB.getAssetHTML = function()
		{
			HTML = Editor.mainPane.emailUploadEditor.topLeftView.contentView.preview.get("value");
			Editor.postMessage("receiveAssetHTML", {HTML: HTML});
		};
		Editor.setValidPostMessageEvents(EB.allowedPostMessageEvents);*/
		
		ER = Editor.statechart.getState("editorReady");
		if( ER.allowedPostMessageEvents.indexOf("getAssetHTML") < 0 )
			ER.allowedPostMessageEvents.push("getAssetHTML");
		if( ER.allowedPostMessageEvents.indexOf("updateAssetHTML") < 0 )
			ER.allowedPostMessageEvents.push("updateAssetHTML");
		if( ER.allowedPostMessageEvents.indexOf("AddAssetID") < 0 )
			ER.allowedPostMessageEvents.push("AddAssetID");
		ER.getAssetHTML = function()
		{
			if( typeof Editor.mainPane.emailUploadEditor !== "undefined" )
			{
				HTML = Editor.mainPane.emailUploadEditor.topLeftView.contentView.preview.get("value");
				Editor.postMessage("receiveAssetHTML", {HTML: HTML});
			}
			if( typeof Editor.mainPane.lpUploadEditor !== "undefined" )
			{
				HTML = Editor.mainPane.lpUploadEditor.topLeftView.contentView.preview.get("value");
				Editor.postMessage("receiveAssetHTML", {HTML: HTML});
			}
		};
		ER.updateAssetHTML = function(ac)
		{
			targetObj = false;
			if( typeof Editor.mainPane.emailUploadEditor !== "undefined" )
				targetObj = Editor.mainPane.emailUploadEditor.topLeftView.contentView.preview;
			
			if( typeof Editor.mainPane.lpUploadEditor !== "undefined" )
				targetObj = Editor.mainPane.lpUploadEditor.topLeftView.contentView.preview;
			
			if( targetObj )
			{
				targetObj._document.open("text/html", "replace");
				targetObj._document.write(ac.HTML);
				targetObj._document.close();
				targetObj._addBorderCSS();
			}
		};
		ER.AddAssetID = function(ac)
		{
			targetObj = false;
			if( typeof Editor.mainPane.emailUploadEditor !== "undefined" )
				targetObj = Editor.mainPane.emailUploadEditor.topLeftView.contentView.preview;
			
			if( typeof Editor.mainPane.lpUploadEditor !== "undefined" )
				targetObj = Editor.mainPane.emailUploadEditor.topLeftView.contentView.preview;
			
			if( targetObj )
			{
				targetObj.set("value", ac.HTML);
				Editor.postMessage("AssetIDUpdated", {HTML: ac.HTML});
			}
		};
		Editor.setValidPostMessageEvents(ER.allowedPostMessageEvents);
	}
	else
	{
		setTimeout(function(){
			window.ELQ_SP_CheckEditorLoad();
		}, 25);
	}
};

window.ELQ_SP_CheckEditorLoad();