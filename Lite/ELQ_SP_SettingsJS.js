app_ELQ_SP_Settings = angular.module('app_ELQ_SP_Settings', []);
ctrl_ELQ_SP_Settings = app_ELQ_SP_Settings.controller('ctrl_ELQ_SP_Settings', function($scope, $http, $timeout) {
	/*$scope.ELQ_SP_Settings = {
								isExtnEnabled: true, version: "1.0.5",
								Shortcuts: {
									Save: false, Copy: true, Delete: true, FieldMerges: true,
									TestToMyself: true, TestToOthers: true,
								},
								FileStorageMulti: true
							};
	
	localSettings = localStorage.ELQ_SP_Settings;
	try {
		localSettings = $.parseJSON(localSettings);
		$scope.ELQ_SP_Settings = localSettings;
	}
	catch(err)
	{
		//localStorage.ELQ_SP_Settings = JSON.stringify(window.ELQ_SP_Settings);
	}*/
	
	$scope.ELQ_SP_Settings = $.parseJSON(localStorage.ELQ_SP_Settings);
	
	$scope.ELQ_SP_Settings_Save = function()
	{
		localStorage.ELQ_SP_Settings = JSON.stringify($scope.ELQ_SP_Settings);
		
		chrome.tabs.query({ currentWindow: true }, function(tabs){
			for (var i = 0; i < tabs.length; i++)
			{
				if( tabs[i].url.indexOf("https://secure.p03.eloqua.com") == 0 || tabs[i].url.indexOf("http://localhost/") == 0 )
				{
					if( $scope.ELQ_SP_Settings.isExtnEnabled )
					{
						chrome.browserAction.setIcon({ path:"Catalyst_Active_32p.png", tabId: tabs[i].id });
						chrome.browserAction.setTitle({title: "Catalyst - Eloqua Extension (Active)"});
					}
					else
					{
						chrome.browserAction.setIcon({ path:"Catalyst_Normal_32p.png", tabId: tabs[i].id });
						chrome.browserAction.setTitle({title: "Catalyst - Eloqua Extension (Inactive)"});
					}
				}
				
				chrome.tabs.sendMessage(tabs[i].id,
					{
						type: "ELQ_SP_CONTENTSCRIPT", ELQ_SP_Request: "REFRESH_SETTINGS", ELQ_SP_Settings: $scope.ELQ_SP_Settings
					}, function(response)
					{
						
					}
				);
			}
		});
	};
	
	/*localSettings = localStorage.ELQ_SP_Settings;
	try {
		localSettings = $.parseJSON(localSettings);
		$scope.ELQ_SP_Settings = localSettings;
	}
	catch(err)
	{
		localStorage.ELQ_SP_Settings = JSON.stringify($scope.ELQ_SP_Settings);
	}*/
});