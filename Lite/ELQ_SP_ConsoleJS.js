//$("body").append(ELQ_SP_StyleSheet);
//window.postMessage({ type: "ELQ_SP_PAGESCRIPT", request: { ELQ_SP_Request: "EXTN_STATUS" } },"*");
window.ELQ_SP_AppLoaded = false;
window.ELQ_SP_ExtnIsEnabled = false;
window.ELQ_SP_ExtnIsFirstRun = false;
window.ELQ_SP_ExtnVersion = false;
window.ELQ_SP_ExtnVersionChange = false;
window.ELQ_SP_ELQ_FunctionsTweaked = false;
window.ELQ_SP_OriginalELQStateChartFunctions = [];
window.ELQ_SP_ExtendedCanvas = false;
window.ELQ_SP_TweakedELQStateChartFunctions = [
	{
		state: "campaignDesign",
		property: "enterState",
		val: function()
		{
			var Ang_Scope = angular.element($("#ELQ_SP_App")).scope();
			Ang_Scope.safeApply( function()
			{
				Ang_Scope.ELQ_SP_CampaignSearch.isEnabled = true;
			});
			var b = Orion.campaignPage.get("mainView");
			Orion.set("appMenuBar", Orion.campaignMenuBarsPage.get("designMenuBar"));
			Orion.set("popupMenuBar", Orion.campaignMenuBarsPage.get("popupDesignMenuBar"));
			Orion.set("workarea", Orion.campaignPage.get("mainView"));
			b.set("nowShowing", "designerView");
			b.becomeFirstResponder();
			var c = Orion.campaignController.get("content");
			Orion.currentCanvasController = Orion.campaignController;
			Orion.set("saveObject", c);
			var e = Orion.campaignController.getPath("content.id") || 0;
			if (e) {
				Orion.allOperationalReportsController.refreshContent(YES)
			}
			SC.routes.set("informLocation", "campaigns&id=%@".fmt(e));
			Orion.emailConfigController.refreshContent();
			var a = Orion.campaignController.get("content");
			Orion.CampaignSettings.campaignController.store = a.store;
			Orion.CampaignSettings.campaignController.set("content", a);
		}
	},
	{
		state: "campaignDesign",
		property: "exitState",
		val: function()
		{
			var Ang_Scope = angular.element($("#ELQ_SP_App")).scope();
			Ang_Scope.safeApply( function()
			{
				Ang_Scope.ELQ_SP_CampaignSearch.Close();
				Ang_Scope.ELQ_SP_CampaignSearch.isEnabled = false;
			});
			
			this.closeRightMenu();
			
			Orion.set("saveObject", null);
			Orion.campaignController.set("content", null);
			Orion.set("workarea", null);
			Orion.set("appMenuBar", null);
			Orion.campaignCalenderActiveCampaignListController.set("openCampaignSetting", false);
			Orion.campaignCalenderActiveCampaignListController.set("openCampaignReport", false);
			Orion.campaignCalenderActiveCampaignListController.set("controller", null);
		}
	},
	{
		state: "emailDesign",
		property: "proposeSave",
		val: function(a) {
			Orion.postTo("editorIframe").withMessage("getAssetHTML");
			this._callback = a;
		}
	},
	{
		state: "landingPageDesign",
		property: "proposeSave",
		val: function(b) {
			Orion.postTo("editorIframe").withMessage("getAssetHTML");
			this._callback = b;
		}
	}
];

window.ELQ_SP_OriginalELQFunctions = [];
window.ELQ_SP_TweakedELQFunctions = [
	{
		model: "Orion||Statechart||_all_states||globalSearch||globalSearchOpen||enterState",
		val: function() {
			var a = Orion.getPathOrThrow("appNavigation.mainView");
			var c = Orion.getPathOrThrow("globalNavigation.globalSearchPanel");
			c.popup(a, SC.PICKER_FIXED);
			c.becomeKeyPane();
			Orion.setActiveGlobal("search");
			var b = Orion.getPathOrThrow("globalNavigation.globalHelpPanel");
			b.hidePane();
			if (!SC.empty(Orion.globalSearchRecordController.get("searchText"))) {
				Orion.globalSearchRecordController.doSearch()
			} else {
				Orion.globalSearchRecordController._reposition_pane(42)
			}
			c.layout.right = 0; c.layout.top = 46;
			$(c._view_layer).css("top",46).css("right",0);
		}
	},
	{
		model: "Orion||chooserController||chooserCopy",
		val: function(c, i, j, l, CopyListIndex) {
			if (!l) { return }
			var f = {}, a, g, k, h, b, e;
			e = Orion.categoryController.get("recordType");
			if (e && e.resourceParams) { f.resourceParams = e.resourceParams }
			a = l.type !== "Folder" ? this._findPath(l) + "/copy" : Orion.categoryController.getPath("content.folderPostPath");
			if (SC.empty(a)) { return }
			g = SC.copy(l); h = Orion.currentUserController.get("id");
			b = ~~(SC.DateTime.create().get("milliseconds") / 1000);
			
			var Ang_Scope = angular.element($("#ELQ_SP_App")).scope();
			g.name = Ang_Scope.ELQ_SP_CopyAssets.CopyList[CopyListIndex].name;
			
			g.createdBy = h; g.createdAt = b; g.updatedBy = h; g.updatedAt = b;
			if (c) { k = c.indexOf(l) } else { k = i.indexOf(l) }
			if (g.x_e10_docGuid) { g.x_e10_docGuid = Helpers.generateRandomUuid(10) }
			f.successCallback = function(m) {
				if (c) { c.insertAt(k, m) } else { i.insertAt(k, m) }
				i.addExclusion(m.id);
				j.set("selection", SC.SelectionSet.create().addObject(m))
				ELQ_SP_CopyAsset_Finish(CopyListIndex, true);
			};
			f.failureCallback = function() {
				ELQ_SP_CopyAsset_Finish(CopyListIndex, false);
			};
			CoreOrion.executeTransientPost(a, g, f)
		}
	},
	{
		model: "Orion||chooserController||chooserDelete",
		val: function(b, f, DeleteListIndex) {
			if (!f) { return }
			var e, g = {}, c = this._getResourceParams(f);
			e = this._findPath(f);
			if (SC.empty(e)) { return }
			g.successCallback = function() {
				switch (f.type) {
					case "Email": break;
					case "Form": break;
					case "LandingPage": break;
					case "Campaign": break;
					case "Program": break;
					case "ContactScoringModelDefinition": break;
					case "ContactSegment": break
				}
				if (f.type === "Folder") { Orion.foldersController.clearFolderStructure(f.id) }
				if (b && b.reset) { b.reset() }
				if (!SC.empty(f.folderId)) { Orion.foldersController.markForRefresh(f.folderId) }
				ELQ_SP_DeleteAsset_Finish(DeleteListIndex, true);
			};
			g.failureCallback = function(h) {
				ELQ_SP_DeleteAsset_Finish(DeleteListIndex, false, h);
			};
			if (c) { g.resourceParams = c }
			CoreOrion.executeTransientDelete(e, null, g);
		}
	},
	{
		model: "Orion||set",
		val: function(i, g) {
			try
			{
				var Ang_Scope = angular.element($("#ELQ_SP_App")).scope();
				elqLoc = Ang_Scope.ELQ_SP_GetElqLocation();
				
				ShowNG = function()
						{
							tObj = this;
							var Ang_Scope = angular.element($("#ELQ_SP_App")).scope();
							if( Ang_Scope.ELQ_SP_NamingGenerator )
							{
								Ang_Scope.safeApply( function()
								{
									Ang_Scope.ELQ_SP_NamingGenerator.CustomName = tObj.value;
									Ang_Scope.ELQ_SP_NamingGenerator.ManualInvoke = false;
									Ang_Scope.ELQ_SP_NamingGenerator.AssetType = Ang_Scope.ELQ_SP_GetElqLocation();
									Ang_Scope.ELQ_SP_NamingGenerator.TargetType = "ELOQUA";
									Ang_Scope.ELQ_SP_NamingGenerator.Show();
								});
							}
						};
				
				targetObj = false;
				
				switch( elqLoc )
				{
					case "campaigns":
					{
						if( typeof Orion.campaignController.get("id") !== "undefined" )
							targetObj = Orion.campaignMenuBarsPage;
						if( typeof Orion.basicCampaignController.get("id") !== "undefined" )
							targetObj = Orion.basicCampaignMenuBarsPage;
					}
					break;
					case "emails":
					{
						if( typeof Orion.emailController.get("id") !== "undefined" )
							targetObj = Orion.emailMenuBarsPage;
					}
					break;
					case "landing_pages":
					{
						if( typeof Orion.landingPageController.get("id") !== "undefined" )
							targetObj = Orion.landingPageMenuBarsPage;
					}
					break;
					case "forms":
					{
						if( typeof Orion.formController.get("id") !== "undefined" )
						{
							targetObj = Orion.formMenuBarsPage;
							setTimeout( function()
							{
								if( $("#ELQ_SP_BtnBlindFormLink").length > 0 )
									$("#ELQ_SP_BtnBlindFormLink").remove();

									cv = Orion.formsDesignPage.designerView.paletteView.childViews;
									ProgProfBtnId = cv[cv.length - 1]._layerId;
									BlindFormLinkBtn = "<a title='Get Blind Form Link' id='ELQ_SP_BtnBlindFormLink' onclick='ELQ_SP_GetBlindFormLink();' alt='Get Blind Form Link' class='sc-view dockbutton-view palette-button' style='left: 50%; width: 70px; margin-left: -42px; top: 293px; height: 62px'><div class='icon ic-link medium'></div><div class='label should-wrap'>Get Blind Form Link</div></a>";
									$(BlindFormLinkBtn).insertBefore("#"+ProgProfBtnId);
							}, 500);
						}
					};
					break;
					case "segments":
					{
						if( typeof Orion.segmentController.get("id") !== "undefined" )
							targetObj = Orion.segmentMenuBarsPage;
					}
					break;
				}
				
				if( targetObj && (!targetObj.ELQ_SP_NG_Bound) )
				{
					if( targetObj.hasOwnProperty("designMenuBar") )
					{
						if( targetObj.designMenuBar.hasOwnProperty("title") && !targetObj.designMenuBar.hasOwnProperty("ELQ_SP_NG_Bound") )
						{
							targetObj.designMenuBar.ELQ_SP_NG_Bound = true;
							targetObj.designMenuBar.ELQ_SP_OrgBeginEditingFunction = targetObj.designMenuBar.title.beginEditing;
							targetObj.designMenuBar.title.beginEditing = ShowNG;
						}
					}
					if( targetObj.hasOwnProperty("reportMenuBar") )
					{
						if( targetObj.reportMenuBar.hasOwnProperty("title") && !targetObj.reportMenuBar.hasOwnProperty("ELQ_SP_NG_Bound") )
						{
							targetObj.reportMenuBar.ELQ_SP_NG_Bound = true;
							targetObj.reportMenuBar.ELQ_SP_OrgBeginEditingFunction = targetObj.reportMenuBar.title.beginEditing;
							targetObj.reportMenuBar.title.beginEditing = ShowNG;
						}
					}
				}
			}
			catch(err)
			{
				console.log("Attempt to overwrite Title editing function - failed!");
			}
			
			var b = this[i], j = this.automaticallyNotifiesObserversFor(i), f = g, c, a, h, e; if (!j && this._kvo_cacheable && (a = this._kvo_cache)) { c = this._kvo_cachedep; if (!c || (c = c[i]) === undefined) { c = this._kvo_computeCachedDependentsFor(i) } if (c) { h = c.length; while (--h >= 0) { e = c[h]; a[e.cacheKey] = a[e.lastSetValueKey] = undefined } } } if (b && b.isProperty) { a = this._kvo_cache; if (b.isVolatile || !a || (a[b.lastSetValueKey] !== g)) { if (!a) { a = this._kvo_cache = {} } a[b.lastSetValueKey] = g; if (j) { this.propertyWillChange(i) } f = b.call(this, i, g); if (b.isCacheable) { a[b.cacheKey] = f } if (j) { this.propertyDidChange(i, f, YES) } } } else { if (b === undefined) { if (j) { this.propertyWillChange(i) } this.unknownProperty(i, g); if (j) { this.propertyDidChange(i, f) } } else { if (this[i] !== g) { if (j) { this.propertyWillChange(i) } f = this[i] = g; if (j) { this.propertyDidChange(i, f) } } } } return this;
		}
	}
];

window.ELQ_SP_ImgLoc = "https://secure.p03.eloqua.com/EloquaImages/clients/IngramMicroInc";

window.ELQ_SP_Welcome = function()
{
	window.ELQ_SP_ShowMessage("INFO", 
		"<div style='text-align: center; min-width: 300px;'>"+
			"<img src='https://secure.p03.eloqua.com/EloquaImages/clients/IngramMicroInc/%7B43f09dc9-49d7-4bb7-bb9f-86239214ea97%7D_Catalyst_Active_128p.png' style='display: block; margin: 0 auto; margin-bottom: 30px;'/>"+
			"<span class='ELQ_SP_Strong'>Welcome to Catalyst!</span>"+
			"<p><span class='ELQ_SP_Hyperlink' onclick='ELQ_SP_ShowTour(1);'>Let's get started&nbsp;&raquo;</span></p>"+
		"</div>", false, false);
};

window.ELQ_SP_CatalystUpdated = function()
{
	window.ELQ_SP_ShowMessage("INFO", 
		"<div style='text-align: center; min-width: 300px;'>"+
			"<img src='https://secure.p03.eloqua.com/EloquaImages/clients/IngramMicroInc/%7B43f09dc9-49d7-4bb7-bb9f-86239214ea97%7D_Catalyst_Active_128p.png' style='display: block; margin: 0 auto; margin-bottom: 30px;'/>"+
			"<span class='ELQ_SP_Strong'>Catalyst has been upgraded!</span>"+
			"<p style='font-size: 75%;'>Version <span class='ELQ_SP_Strong'>"+ELQ_SP_ExtnVersion+"</strong></p>"+
			"<p style='font-size: 75%; text-align: left; margin-top: 15px;'>"+ELQ_SP_ExtnVersionUpdates+"</p>"+
		"</div>", false, true);
};

window.ELQ_SP_CheckTestDone = function()
{
	if( $("#ELQ_SP_testCenter").contents().find(".EloquaNotificationbar").length > 0 )
	{
		$("#ELQ_SP_MessageBox").remove();
		if( $("#ELQ_SP_testCenter").contents().find(".EloquaNotificationbar").hasClass("NotificationSuccess") )
		{
			var Ang_Scope = angular.element($("#ELQ_SP_App")).scope();
			Ang_Scope.safeApply( function()
			{
				Ang_Scope.ELQ_SP_isBusy = false;
				Ang_Scope.ELQ_SP_SetConsoleStatus("<span class='ELQ_SP_GreenStrong'>Test email successfully sent!</span>", "EmailTestCenter", true, 2000);
			});
		}
		else
		{
			var Ang_Scope = angular.element($("#ELQ_SP_App")).scope();
			Ang_Scope.safeApply( function()
			{
				Ang_Scope.ELQ_SP_isBusy = false;
				Ang_Scope.ELQ_SP_SetConsoleStatus("<span class='ELQ_SP_GreenStrong'>Error occurred while sending Test email!</span>", "EmailTestCenter", true, 2000);
			});
		}
		$("#ELQ_SP_testCenter").remove();
	}
	else
	{
		setTimeout( function()
		{
			window.ELQ_SP_CheckTestDone();
		}, 500);
	}
};

window.ELQ_SP_BF_Completed = 0;
window.ELQ_SP_GetBlindFormLink = function()
{
	var Ang_Scope = angular.element($("#ELQ_SP_App")).scope();
	Ang_Scope.safeApply(function()
	{
		Ang_Scope.ELQ_SP_GenerateBFLink();
	});
};

window.ELQ_SP_ShowMessage_TO = 0;

window.ELQ_SP_ShowMessage = function(msgType, msg, closeTO, isClosable)
{
	$("#ELQ_SP_MessageBox").remove();
	clearTimeout(window.ELQ_SP_ShowMessage_TO);
	var textColor = "#666666";
	switch( msgType )
	{
		case "SUCCESS": textColor = "#00CC00"; break;
		case "ERROR": textColor = "#CC0000"; break;
	}
	
	msg += (isClosable) ? "<img class='ELQ_SP_CloseMessage' src='"+ELQ_SP_ImgLoc+"/%7B4c1be894-50fa-4b93-bca0-7922f43ce4f3%7D_FMB_Close_Button_Black.png' onclick='ELQ_SP_CloseMessage();'/>" : "";
	
	$("body").append("<div id='ELQ_SP_MessageBox' class='ELQ_SP_Dialog'><div class='ELQ_SP_MessageBoxBackDrop'></div><div class='ELQ_SP_MessageBoxContent' style='color: #666666;'>"+msg+"</div>");
	$("#ELQ_SP_MessageBox").stop().animate( { opacity: 1 }, 250, function()
	{
		if( closeTO )
		{
			closeTO = (closeTO) ? closeTO : 1000;
			ELQ_SP_ShowMessage_TO = setTimeout( function()
			{
				$("#ELQ_SP_MessageBox").stop().animate( { opacity: 0 }, 250, function()
				{
					$("#ELQ_SP_MessageBox").remove();
				});
			}, closeTO);
		}
	});
};

window.ELQ_SP_CloseMessage = function()
{
	clearTimeout(window.ELQ_SP_ShowMessage_TO);
	$("#ELQ_SP_MessageBox").stop().animate( { opacity: 0 }, 250, function()
	{
		$("#ELQ_SP_MessageBox").remove();
	});
};

window.ELQ_SP_testCenter = document.createElement("iframe");
window.ELQ_SP_testCenter.id = "ELQ_SP_testCenter";
window.ELQ_SP_testCenter.onload = window.ELQ_SP_CheckTestDone;
window.ELQ_SP_testCenter.style = "display: none;";

window.ELQ_SP_BtnMain_Click = function()
{
	$("#ELQ_SP_IntroLightbox").remove();
	if( !ELQ_SP_isDragActive )
	{
		$("#ELQ_SP_Console").toggleClass("ELQ_SP_Class_ShowConsole");
		if( $("#ELQ_SP_Console").hasClass("ELQ_SP_Class_ShowConsole") )
			$("body").css("filter", "blur(10px)");
		else
			$("body").css("filter", "blur(0px)");
	}
};

window.ELQ_SP_BtnClose_Click = function()
{
	$("#ELQ_SP_Console").removeClass("ELQ_SP_Class_ShowConsole");
	$("body").css("filter", "blur(0px)");
};

window.ELQ_SP_ClickedTextBox = false;
window.addEventListener("click mousedown", function(e)
{
	if( ELQ_SP_AppLoaded )
	{
		if( $(e.target).hasClass("ELQ_SP_Input") )
		{
			window.ELQ_SP_ClickedTextBox = e.target;
			setTimeout( function()
			{
				$(ELQ_SP_ClickedTextBox).focus();
				ELQ_SP_ClickedTextBox = false;
			}, 25);
		}
	}
});

window.ELQ_SP_DeleteAsset_Perform = function()
{
	var Ang_Scope = angular.element($("#ELQ_SP_App")).scope();
	if( Ang_Scope.ELQ_SP_DeleteAssets.DeleteList.length > 0 )
	{
		Ang_Scope.safeApply(function()
		{
			Ang_Scope.ELQ_SP_DeleteAsset_Perform();
		});
	}
};

window.ELQ_SP_DeleteAsset_Cancel = function()
{
	var Ang_Scope = angular.element($("#ELQ_SP_App")).scope();
	if( Ang_Scope.ELQ_SP_DeleteAssets.DeleteList.length > 0 )
	{
		Ang_Scope.safeApply(function()
		{
			Ang_Scope.ELQ_SP_DeleteAsset_Cancel();
		});
	}
};

window.ELQ_SP_ViewDependencies = function()
{
	Orion.sendAction("showEmailDependencies");
	Orion.sendAction("showLandingPageDependencies");
	Orion.sendAction("showFormDependencies");
	Orion.sendAction("showSegmentDependencies");
	ELQ_SP_BtnClose_Click();
};

window.ELQ_SP_CopyAsset_Finish = function(ind,suc)
{
	if( ELQ_SP_AppLoaded )
	{
		var Ang_Scope = angular.element($("#ELQ_SP_App")).scope();
		Ang_Scope.safeApply( function()
		{
			Ang_Scope.ELQ_SP_CopyAsset_Finish(ind,suc);
		});
	}
};

window.ELQ_SP_DeleteAsset_Finish = function(ind,suc,err_resp)
{
	if(!err_resp)
		err_resp = false;
	if( ELQ_SP_AppLoaded )
	{
		var Ang_Scope = angular.element($("#ELQ_SP_App")).scope();
		Ang_Scope.safeApply( function()
		{
			Ang_Scope.ELQ_SP_DeleteAsset_Finish(ind,suc,err_resp);
		});
	}
};

window.ELQ_SP_isDragActive = false; window.ELQ_SP_isDragOffset = false; window.ELQ_SP_DragTO = 0;
window.ELQ_SP_DragOffset = { x: 0, y: 0 };
window.ELQ_SP_DragStart = function(e,el,doffset)
{
	ELQ_SP_DragTO = setTimeout( function()
	{
		$(el).addClass("ELQ_SP_Dragging");
		ELQ_SP_isDragActive = true;
		ELQ_SP_isDragOffset = (doffset.toLowerCase() == "true");
		
		if( ELQ_SP_isDragOffset )
		{
			ELQ_SP_DragOffset.x = $(el).offset().left - e.clientX;
			ELQ_SP_DragOffset.y = $(el).offset().top - e.clientY;
		}
		else
		{
			ELQ_SP_DragOffset = { x: 0, y: 0 };
		}
		
		//e.preventDefault();
		//e.stopPropagation();
		//return false;
	}, 250);
};

window.addEventListener('mouseup', function(e)
{
	clearTimeout( ELQ_SP_DragTO );
	$(".ELQ_SP_Dragging").removeClass("ELQ_SP_Dragging");
	setTimeout( function()
	{
		ELQ_SP_isDragActive = false;
	}, 250);
});
window.addEventListener('mousemove', function(e)
{
	if( ELQ_SP_isDragActive )
	{
		hW = ($(".ELQ_SP_Dragging").width()/2);
		hH = ($(".ELQ_SP_Dragging").height()/2);
		newX = e.pageX-ELQ_SP_DragOffset.x-hW;
		newY = e.pageY-ELQ_SP_DragOffset.y-hW;
		
		if( ELQ_SP_isDragOffset )
		{
			newX = e.pageX+ELQ_SP_DragOffset.x+hW;
			newY = e.pageY+ELQ_SP_DragOffset.y+hH;
			if( newX > hW && newX+hW < window.innerWidth-1 )
			{
				$(".ELQ_SP_Dragging").css("left", newX);
				if( $(".ELQ_SP_Dragging").attr("id") == "ELQ_SP_Console" )
					$("#ELQ_SP_ConsoleStatus").css("left", newX);
			}
		
			if( newY > hH && newY+hH < window.innerHeight-1 )
			{
				$(".ELQ_SP_Dragging").css("top", newY);
				if( $(".ELQ_SP_Dragging").attr("id") == "ELQ_SP_Console" )
					$("#ELQ_SP_ConsoleStatus").css("top", newY);
			}
		}
		else
		{
			if( newX > 0 && newX+(hW*2) < window.innerWidth )
			{
				$(".ELQ_SP_Dragging").css("left", newX);
				if( $(".ELQ_SP_Dragging").attr("id") == "ELQ_SP_Console" )
					$("#ELQ_SP_ConsoleStatus").css("left", newX);
			}
		
			if( newY > 0 && newY+(hH*2) < window.innerHeight )
			{
				$(".ELQ_SP_Dragging").css("top", newY);
				if( $(".ELQ_SP_Dragging").attr("id") == "ELQ_SP_Console" )
					$("#ELQ_SP_ConsoleStatus").css("top", newY);
			}
		}
	}
});

window.ELQ_SP_OpenMyReports = function()
{
	window.open("https://insight.p03.eloqua.com/EloquaInsight/asp/Main.aspx?evt=3003&src=Main.aspx.3003");
};

window.ELQ_SP_SendTestEmail = function()
{
	if( typeof Orion !== "undefined" )
	{
		if( typeof Orion.emailController.get("id") !== "undefined" )
		{
			//Orion.sendAction('testEmailDeliverability');
			
		}
		else
		{
			window.ELQ_SP_ShowMessage("INFO", "<img src='"+ELQ_SP_ImgLoc+"/%7Bc2bd773d-1707-4bbe-9b10-767ae9c3de20%7D_SarcasticFace.png' class='ELQ_SP_Emoji'/><br/><span class='ELQ_SP_Strong'>Oops!</span><br/>Are you sure you have selected an email in Eloqua first?", false, true);
		}
	}
	else
	{
		window.ELQ_SP_ShowMessage("ERROR", "<img src='"+ELQ_SP_ImgLoc+"/%7Bd328ed83-6414-4cf7-928c-9f04412d18d2%7D_WorriedFace.png' class='ELQ_SP_Emoji'/><br/><span class='ELQ_SP_RedStrong'>Whoa!!</span><br/>Either this is not Eloqua, or you are in a different Universe...", false, true);
	}
	window.ELQ_SP_BtnClose_Click();
};

window.ELQ_SP_SendTestEmailToMyself = function()
{
	var Ang_Scope = angular.element($("#ELQ_SP_App")).scope();
	Ang_Scope.safeApply( function()
	{
		Ang_Scope.ELQ_SP_WinKeyDown({ ctrlKey: true, altKey: true, keyCode: 77 });
	});
	window.ELQ_SP_BtnClose_Click();
};

window.ELQ_SP_FMBrowserIsActive = false;

window.ELQ_SP_CloseFieldMergeLookup = function()
{
	$("#ELQ_SP_FieldMergeBrowser").stop().animate({opacity: 0}, 250, function()
	{
		$("#ELQ_SP_FieldMergeBrowser").css("display", "none");
		window.ELQ_SP_FMBrowserIsActive = false;
	});
};

window.ELQ_SP_SelectText = function(el)
{
	if( el.tagName.toUpperCase() == "INPUT" )
	{
		$(el).select();
	}
	else
	{
		var range = document.createRange();
		range.selectNodeContents(el);
		var sel = window.getSelection();
		sel.removeAllRanges();
		sel.addRange(range);
	}
};

window.ELQ_SP_InvokeFieldMergeLookup = function()
{
	var Ang_Scope = angular.element($("#ELQ_SP_App")).scope();
	Ang_Scope.safeApply( function()
	{
		Ang_Scope.ELQ_SP_FM_Init();
	});
	window.ELQ_SP_BtnClose_Click();
};

window.ELQ_SP_Abracadabra = function()
{
	var ELQ_SP_App = document.getElementById('ELQ_SP_App');
	
	window.app_ELQ_SP = angular.module('ELQ_SP_App', []);

	window.ctrl_ELQ_SP = window.app_ELQ_SP.controller('ctrl_ELQ_SP', function($scope, $http, $timeout, $sce) {
		$scope.ELQ_SP_FM_Loading = false;
		$scope.ELQ_SP_FM_RootFolder = { type: "Folder", name: "root", id: "root" };
		$scope.ELQ_SP_FM_PreviousFolder = { type: "Folder", name: "root", id: "root" };
		$scope.ELQ_SP_FieldMerges = [];
		$scope.ELQ_SP_TextBox_FMBSearch = "";
		$scope.ELQ_SP_TextBox_FMBFilter = "";
		$scope.ELQ_SP_FM_LastSearch = "";
		$scope.ELQ_SP_SelectedFM = false;
		
		//$scope.ELQ_SP_ExtnID = ELQ_SP_ExtnID;
		$scope.ELQ_SP_Settings = {};
		$scope.ELQ_SP_ConsoleHasStatus = false;
		$scope.ELQ_SP_ConsoleStatus = [];
		
		$scope.ELQ_SP_DeleteAssets = { Deleting: false, DeleteList: [], Completed: [], Errors: [] };
		$scope.ELQ_SP_CopyAssets = { Valid: false, Copying: false, CopyPath: "", CopyList: [], Completed: [], Errors: [] };
		
		$scope.ELQ_SP_CopyAssets_ShowNG = function(Asset)
		{
			if( $scope.ELQ_SP_NamingGenerator )
			{
				$scope.ELQ_SP_NamingGenerator.TargetType = "ELQ_SP_COPYASSET";
				$scope.ELQ_SP_NamingGenerator.ManualInvoke = false;
				
				AType = { Email: "emails", LandingPage: "landing_pages", Campaign: "camapigns", Form: "forms", Segment: "segments" };
				$scope.ELQ_SP_NamingGenerator.TargetBinding = Asset;
				$scope.ELQ_SP_NamingGenerator.CustomName = Asset.name;
				
				$scope.ELQ_SP_NamingGenerator.AssetType = AType[Asset.type];
				$scope.ELQ_SP_NamingGenerator.Show();
			}
		};
		
		$scope.ELQ_SP_isLoading = true;
		$scope.ELQ_SP_isBusy = false;
		$scope.ELQ_SP_LoadingMsg = "Initializing Consciousness...";
		$scope.ELQ_SP_PreloaderClass = "";
		$scope.ELQ_SP_CurrLoadStage = -1;
		$scope.ELQ_SP_CurrLoadMsgInd = 0;
		$scope.ELQ_SP_LoadingMsgsTO = 0;
		$scope.ELQ_SP_LoadingMessages = [
			["Initializing Consciousness...", "Shh...  Eloqua is loading...", "Go ahead... hold your breath...", "Don't think of purple hippos...", "You just thought of them, didn't you?"],
			["Eloqua is testing your patience...", "Faster...? Get down and push...", "Get some coffee and come back in 30 mins... with a sandwich!", "8 Hobbits = 1 HobBYTE..."],
			["As if you had another choice...", "Turning off slow-motion...", "Estimated time left = Infinity...", "Are you waiting for something to load?", "Error loading application... or maybe not...", "Any moment now...", "I swear it's almost done...", "Because, I'm out of witty loading messages..."]
		];
		
		if( window.ELQ_SP_ExtnIsFirstRun )
			$scope.ELQ_SP_LoadingMessages[2].push( "Next time, you won't have to wait this long - Pinky Promise!" );
		
		$scope.ELQ_SetLoadingMsg = function()
		{
			$scope.ELQ_SP_LoadingMsg = $scope.ELQ_SP_LoadingMessages[$scope.ELQ_SP_CurrLoadStage][$scope.ELQ_SP_CurrLoadMsgInd];
		};
		
		$scope.TrustHTML = function(text) {
			return $sce.trustAsHtml(text);
		};
		
		$scope.ELQ_SP_RotateLoadingMsgs = function()
		{
			$scope.ELQ_SP_StopRotateLoadingMsgs();
			$scope.ELQ_SetLoadingMsg();
			
			if( $scope.ELQ_SP_CurrLoadStage == 0 && $scope.ELQ_SP_CurrLoadMsgInd == 1 )
				$scope.ELQ_SP_PreloaderClass = "ELQ_SP_Red";
			
			MsgCnt = $scope.ELQ_SP_LoadingMessages[$scope.ELQ_SP_CurrLoadStage].length;
			$scope.ELQ_SP_CurrLoadMsgInd++;
			if( $scope.ELQ_SP_CurrLoadMsgInd >= MsgCnt )
			{
				$scope.ELQ_SP_CurrLoadMsgInd = MsgCnt - 1;
				if( $scope.ELQ_SP_CurrLoadStage < 2 )
				{
					$scope.ELQ_SP_CurrLoadStage++;
					$scope.ELQ_SP_CurrLoadMsgInd = 0;
				}
			}
			
			$scope.ELQ_SP_LoadingMsgsTO = $timeout( function()
			{
				$scope.ELQ_SP_RotateLoadingMsgs();
			}, 5000);
		};
		
		$scope.ELQ_SP_StopRotateLoadingMsgs = function()
		{
			$timeout.cancel($scope.ELQ_SP_LoadingMsgsTO);
		};
		
		$scope.ELQ_SP_GetElqLocation = function()
		{
			if( typeof SC !== "undefined" && ( typeof SC.routes !== "undefined" && (typeof SC.routes.location === "function") ) )
				return SC.routes.location().split("&")[0];
			else
				return "";
		};
		
		$scope.ELQ_SP_FM_Init = function()
		{
			$scope.ELQ_SP_FieldMerges = [];
			$("#ELQ_SP_FieldMergeBrowser").css("opacity", 0).css("display", "block");
			$("#ELQ_SP_FieldMergeBrowser").stop().animate({opacity: 1}, 250);
			$("#ELQ_SP_TextBox_FMBSearch").focus();
			window.ELQ_SP_FMBrowserIsActive = true;
		};
		
		$scope.ELQ_SP_SelectFieldMerge = function(FMEntry)
		{
			if( !$scope.ELQ_SP_FM_Loading )
				$scope.ELQ_SP_SelectedFM = FMEntry;
		};
		
		$scope.ELQ_SP_SearchFieldMerges = function(e)
		{
			var SearchKW = $.trim($scope.ELQ_SP_TextBox_FMBSearch);
			InputEnterPress = false;
			
			if( e )
			{
				if( typeof e.keyCode == "undefined" )
					InputEnterPress = false;
				else if( e.keyCode == 13 )
					InputEnterPress = true;
				else if( e.keyCode == 27 )
					$scope.ELQ_SP_CloseFMBrowser();
			}
			else
				InputEnterPress = true;
			
			if( InputEnterPress )
			{
				if( SearchKW == "" )
					return false;
				
				$scope.ELQ_SP_FM_LastSearch = SearchKW;
				$scope.ELQ_SP_FM_Loading = true;
				
				var data = null;
				var xhr = new XMLHttpRequest();
				xhr.withCredentials = true;

				xhr.addEventListener("readystatechange", function () {
					if (this.readyState === 4) {
						$scope.ELQ_SP_FM_Loading = false;
						try {
							ParsedJSON = $.parseJSON(this.responseText);
							if( typeof ParsedJSON.elements !== "undefined" )
								$scope.ELQ_SP_FieldMerges = ParsedJSON.elements;
							else
							{
								$scope.ELQ_SP_FieldMerges = [];
								$scope.ELQ_SP_CloseFMBrowser();
								window.ELQ_SP_ShowMessage("ERROR", "<img src='"+ELQ_SP_ImgLoc+"/%7Be3b24732-f82a-4d5a-949e-6e8c06cdff09%7D_DeadFace.png' class='ELQ_SP_Emoji'/><br/><span class='ELQ_SP_RedStrong'>Bummer!</span><br/>There was an error when trying to perform that action...", false, true);
							}
						}
						catch(err)
						{
							$scope.ELQ_SP_FieldMerges = [];
							$scope.ELQ_SP_CloseFMBrowser();
							window.ELQ_SP_ShowMessage("ERROR", "<img src='"+ELQ_SP_ImgLoc+"/%7Be3b24732-f82a-4d5a-949e-6e8c06cdff09%7D_DeadFace.png' class='ELQ_SP_Emoji'/><br/><span class='ELQ_SP_RedStrong'>Bummer!</span><br/>There was an error when trying to perform that action...", false, true);
						}
						$scope.safeApply();
						setTimeout( function()
						{
							$("#ELQ_SP_TextBox_FMBSearch").focus();
						}, 25);
					}
				});
				$scope.ELQ_SP_FM_Loading = true;
				xhr.open("GET", "https://secure.p03.eloqua.com/API/REST/2.0/assets/fieldMerges?xsrfToken="+window.xsrfToken+"&depth=partial&count=250&orderBy=name%20ASC&search=name=%27*"+SearchKW+"*%27");
				xhr.send(data);
			}
		};
		
		$scope.ELQ_SP_CloseFMBrowser = function()
		{
			$scope.ELQ_SP_TextBox_FMBSearch = "";
			$scope.ELQ_SP_TextBox_FMBFilter = "";
			$scope.ELQ_SP_FM_LastSearch = "";
			$scope.ELQ_SP_SelectedFM = [];
			$scope.ELQ_SP_FieldMerges = [];
			window.ELQ_SP_CloseFieldMergeLookup();
			window.ELQ_SP_FMBrowserIsActive = false;
		};
		
		$scope.ELQ_SP_WinKeyDown = function(e)
		{
			prevDefStopProp = false;
			
				if( typeof e.target == "undefined" || (e.target && (e.target.tagName.toUpperCase() !== "INPUT" && e.target.tagName.toUpperCase() !== "TEXTAREA")) )
				{
					if( e.ctrlKey )
					{
						switch( e.keyCode )
						{
							case 67: //C
							{
								if( $scope.ELQ_SP_Settings.Shortcuts.Copy && !$scope.ELQ_SP_CopyAssets.Copying )
								{
									GP = Orion.currentFolderContentsController.getPath("selection").toArray();
									FGP = [];
									for(iGP=0;iGP<GP.length;iGP++)
									{
										NewGP = $.extend(true,{},GP[iGP]);
										NewGP._oldname = NewGP.name;
										NewGP.name = NewGP.name+" : Copy";
										FGP.push(NewGP);
									}
									
									//GP = [{ type: "Email", folderId: 1234, name: "Intro_Email_WhiteSpace" }];
									if( FGP.length > 0 )
									{
										if( typeof FGP[0].type !== "undefined" )
										{
											$scope.ELQ_SP_CopyAssets.CopyPath = Orion.foldersController.path;
											$scope.ELQ_SP_CopyAssets.CopyList = FGP;
											$scope.ELQ_SP_CopyAssets.Valid = true;
											$scope.ELQ_SP_SetCopyStatus();
											prevDefStopProp = true;
										}
									}
								}
							}
							break;
							case 68: //D
							{
								if( e.altKey )
								{
									window.ELQ_SP_ViewDependencies();
									prevDefStopProp = true;
								}
							}
							break;
							case 70: //F
							{
								if( e.shiftKey && !e.altKey )
								{
									if( (Orion.componentLibraryFoldersController.currentFolderContents && Orion.componentLibraryController.canCreateNewFolder) || ( Orion.sharedLibraryFoldersController && Orion.sharedLibraryFoldersController.currentFolderContents && Orion.sharedLibraryController.canCreateNewFolder ) || (Orion.currentFolderContentsController.content && Orion.currentFolderContentsController.contextMenuSettings.canCreateFolder) )
									{
										Orion.sendAction("chooserAddNewFolder");
									}
								}
								else if( e.altKey && !window.ELQ_SP_FMBrowserIsActive )
								{
									window.ELQ_SP_InvokeFieldMergeLookup();
									prevDefStopProp = true;
								}
								else if( !e.altKey && !e.shiftKey && $scope.ELQ_SP_CampaignSearch.isEnabled )
								{
									$scope.ELQ_SP_CampaignSearch.Init();
									prevDefStopProp = true;
								}
							}
							break;
							case 71: //G
							{
								if( e.altKey )
								{
									$scope.ELQ_SP_Debugger.Show();
									prevDefStopProp = true;
								}
							}
							break;
							case 77: //M
							{
								if( e.altKey )
								{
									if( typeof Orion !== "undefined" )
									{
										eid = Orion.currentUserController.get("emailAddress");
										if( typeof Orion.emailController.get("id") !== "undefined" )
										{
											aid = Orion.emailController.get("id");
											$scope.ELQ_SP_SendTestEmail(eid, aid);
										}
										else if( Orion.campaignElementController.get("content") !== null )
										{
											CampSelEl = Orion.campaignElementController.get("content");
											if( typeof CampSelEl.storeKey !== "undefined" )
											{
												asset = CoreOrion.store.dataHashes[ CampSelEl.storeKey ];
												if( typeof asset.type !== "undefined" && (asset.type == "CampaignEmail") )
												{
													aid = asset.emailId;
													$scope.ELQ_SP_SendTestEmail(eid, aid);
												}
											}
										}
										else
										{
											window.ELQ_SP_ShowMessage("INFO", "<img src='"+ELQ_SP_ImgLoc+"/%7Bc2bd773d-1707-4bbe-9b10-767ae9c3de20%7D_SarcasticFace.png' class='ELQ_SP_Emoji'/><br/><span class='ELQ_SP_Strong'>Oops!</span><br/>Are you sure you have selected an email in Eloqua first?", false, true);
										}
									}
									else
									{
										window.ELQ_SP_ShowMessage("ERROR", "<img src='"+ELQ_SP_ImgLoc+"/%7Bd328ed83-6414-4cf7-928c-9f04412d18d2%7D_WorriedFace.png' class='ELQ_SP_Emoji'/><br/><span class='ELQ_SP_RedStrong'>Whoa!!</span><br/>Either this is not Eloqua, or you are in a different Universe...", false, true);
									}
									window.ELQ_SP_BtnClose_Click();
									prevDefStopProp = true;
								}
							}
							break;
							case 78: //N
							{
								if( e.altKey )
								{
									if( $scope.ELQ_SP_NamingGenerator )
									{
										if( !$scope.ELQ_SP_NamingGenerator.isVisible )
										{
											$scope.ELQ_SP_NamingGenerator.ManualInvoke = true;
											$scope.ELQ_SP_NamingGenerator.Show();
											prevDefStopProp = true;
										}
									}
								}
							}
							break;
							case 79: //O
							{
								if( e.altKey )
								{
									if( !$scope.ELQ_SP_CDOCreator.isVisible )
									{
										$scope.ELQ_SP_CDOCreator.Show();
										prevDefStopProp = true;
									}
								}
							}
							break;
							case 82: //R
							{
								if( e.altKey )
								{
									ELQ_SP_OpenMyReports();
									prevDefStopProp = true;
								}
							}
							break;
							case 83: //S
							{
								if( $scope.ELQ_SP_Settings.Shortcuts.Save )
								{
									if( typeof Orion !== "undefined" )
										Orion.sendEvent("proposeSave");
									else
										window.ELQ_SP_ShowMessage("ERROR", "<img src='"+ELQ_SP_ImgLoc+"/%7Bd328ed83-6414-4cf7-928c-9f04412d18d2%7D_WorriedFace.png' class='ELQ_SP_Emoji'/><br/><span class='ELQ_SP_RedStrong'>Whoa!!</span><br/>Either this is not Eloqua, or you are in a different Universe...", false, true);
									prevDefStopProp = true;
								}
							}
							break;
							case 84: //T
							{
								if( e.altKey )
								{
									if( typeof Orion !== "undefined" )
									{
										eid = Orion.currentUserController.get("emailAddress");
										if( typeof Orion.emailController.get("id") !== "undefined" )
										{
											aid = Orion.emailController.get("id");
											$scope.ELQ_SP_EmailTestCenter.isVisible = true;
											$scope.ELQ_SP_EmailTestCenter.AssetID = aid;
											$timeout( function()
											{
												$("#ELQ_SP_ETC_Textbox").focus();
											}, 100);
										}
										else if( Orion.campaignElementController.get("content") !== null )
										{
											CampSelEl = Orion.campaignElementController.get("content");
											if( typeof CampSelEl.storeKey !== "undefined" )
											{
												asset = CoreOrion.store.dataHashes[ CampSelEl.storeKey ];
												if( typeof asset.type !== "undefined" && (asset.type == "CampaignEmail") )
												{
													aid = asset.emailId;
													$scope.ELQ_SP_EmailTestCenter.isVisible = true;
													$scope.ELQ_SP_EmailTestCenter.AssetID = aid;
													$timeout( function()
													{
														$("#ELQ_SP_ETC_Textbox").focus();
													}, 100);
												}
											}
										}
										else
										{
											window.ELQ_SP_ShowMessage("INFO", "<img src='"+ELQ_SP_ImgLoc+"/%7Bc2bd773d-1707-4bbe-9b10-767ae9c3de20%7D_SarcasticFace.png' class='ELQ_SP_Emoji'/><br/><span class='ELQ_SP_Strong'>Oops!</span><br/>Are you sure you have selected an email in Eloqua first?", false, true);
										}
									}
									else
									{
										window.ELQ_SP_ShowMessage("ERROR", "<img src='"+ELQ_SP_ImgLoc+"/%7Bd328ed83-6414-4cf7-928c-9f04412d18d2%7D_WorriedFace.png' class='ELQ_SP_Emoji'/><br/><span class='ELQ_SP_RedStrong'>Whoa!!</span><br/>Either this is not Eloqua, or you are in a different Universe...", false, true);
									}
									window.ELQ_SP_BtnClose_Click();
									prevDefStopProp = true;
								}
							}
							break;
							case 86: //V
							{
								if( $scope.ELQ_SP_Settings.Shortcuts.Copy && !e.altKey && !e.shiftKey )
								{
									if( $scope.ELQ_SP_CopyAssets.CopyList.length > 0 )
									{
										if( $scope.ELQ_SP_CopyAssets.Valid )
										{
											if( typeof Orion.foldersController.path !== "undefined" )
											{
												if( $scope.ELQ_SP_CopyAssets.CopyPath == Orion.foldersController.path )
												{
													$scope.ELQ_SP_CopyAsset_Start();
												}
												else
												{
													$scope.ELQ_SP_DeleteAsset_Cancel();
													SelAssetType = $scope.ELQ_SP_CopyAssets.CopyList[0].type;
													SFT = Orion.foldersController.prefix;
													SFT = SFT.substr(0,1).toUpperCase()+SFT.substr(1,SFT.length-2);
													$scope.ELQ_SP_SetConsoleStatus("Cannot paste "+SelAssetType+" into "+SFT, "AssetCopy", true, 2000);
												}
											}
											else
											{
												$scope.ELQ_SP_CopyAsset_Cancel();
												$scope.ELQ_SP_SetConsoleStatus("<span class='ELQ_SP_RedStrong'>Cannot paste assets here!</span>", "AssetCopy", true, 2000);
											}
										}
										prevDefStopProp = true;
									}
								}
							}
							break;
						}
					}
					else if( e.shiftKey )
					{
						switch( e.keyCode )
						{
							case 46: //DELETE
							{
								if( $scope.ELQ_SP_Settings.Shortcuts.Delete )
								{
									GP = Orion.currentFolderContentsController.getPath("selection").toArray();
									FGP = [];
									for(iGP=0;iGP<GP.length;iGP++)
									{
										if( GP[iGP].type == "Folder" )
										{
											if( !GP[iGP].isSystem || GP[iGP].isSystem == "false" )
											{
												NewGP = $.extend(true,{},GP[iGP]);
												FGP.push(NewGP);
											}
										}
										else
										{
											PermString = "||"+GP[iGP].permissions.join("||")+"||";
											if( GP[iGP].currentStatus == "Draft" && PermString.indexOf("Delete") > -1 )
											{
												NewGP = $.extend(true,{},GP[iGP]);
												FGP.push(NewGP);
											}
										}
									}
									
									//GP = [{ type: "Email", folderId: 1234, name: "Intro_Email_WhiteSpace" }];
									if( FGP.length > 0 )
									{
										if( typeof FGP[0].type !== "undefined" )
										{
											$scope.ELQ_SP_CopyAsset_Cancel();
											ConfirmText = (FGP.length == 1) ? "<span class='ELQ_SP_BlueStrong'>"+FGP[0].name+"</span>" : FGP.length+" assets";
											$scope.ELQ_SP_DeleteAssets.DeleteList = FGP;
											$scope.ELQ_SP_SetConsoleStatus("<span class='ELQ_SP_RedStrong'>Delete "+ConfirmText+"?</span>&emsp;&emsp;&emsp;<span class='ELQ_SP_Hyperlink ELQ_SP_GreenStrong' onclick='ELQ_SP_DeleteAsset_Perform();'>YES</span>&emsp;|&emsp;<span class='ELQ_SP_Hyperlink ELQ_SP_RedStrong' onclick='ELQ_SP_DeleteAsset_Cancel();'>NO</span>", "AssetDelete", false, false);
											prevDefStopProp = true;
										}
									}
								}
							}
							break;
						}
					}
					else if( e.keyCode == 27 ) //ESC
					{
						if( !$scope.ELQ_SP_CopyAssets.Copying && $scope.ELQ_SP_CopyAssets.CopyList.length > 0 )
						{
							$scope.ELQ_SP_CopyAsset_Cancel();
						}
						if( !$scope.ELQ_SP_DeleteAssets.Deleting && $scope.ELQ_SP_DeleteAssets.DeleteList.length > 0 )
						{
							$scope.ELQ_SP_DeleteAsset_Cancel();
						}
					}
					else if( e.keyCode == 113 ) //F2
					{
						lP = Orion.launchpadChooserPage.folderTableView;
						if( typeof lP === "object" && (lP.selection.length() == 1) )
						{
							cv = lP._bodyView.childViews;
							for(icv=0;icv<cv.length;icv++)
							{
								if( cv[icv].isSelected )
								{
									sTop = $(cv[icv]._view_layer).offset().top + 100;
									Orion.launchpadChooserPage.folderTableView.scrollTo(0,Orion.launchpadChooserPage.folderTableView._bodyScrollView._verticalScrollOffset);
									setTimeout( function()
									{
										lP = Orion.launchpadChooserPage.folderTableView;
										cv = lP._bodyView.childViews;
										for(icv=0;icv<cv.length;icv++)
										{
											if( cv[icv].isSelected && !cv[icv].isEditing )
											{
												cv[icv].beginEditingFirstColumn();
												$("label.sc-view.sc-text-field-view.inline-editor.sc-regular-size").focus();
											}
										}
									}, 50);
								}
							}
						}
						else if( (typeof Orion.componentLibraryPage.gridView === "object" && (Orion.componentLibraryPage.gridView.isVisibleInWindow)) || (typeof Orion.componentLibraryPage.tableView === "object" && (Orion.componentLibraryPage.tableView.isVisibleInWindow)) )
						{
							if( typeof Orion.componentLibraryPage.gridView === "object" && (Orion.componentLibraryPage.gridView.isVisibleInWindow) )
							{
								selectionObj = Orion.componentLibraryPage.gridView.contentView;
								gVChildren = Orion.componentLibraryPage.gridView.contentView.childViews;
							}
							else if( typeof Orion.componentLibraryPage.tableView === "object" && (Orion.componentLibraryPage.tableView.isVisibleInWindow) )
							{
								selectionObj = Orion.componentLibraryPage.tableView;
								gVChildren = Orion.componentLibraryPage.tableView._bodyView.childViews;
							}
							if( selectionObj.selection.length() == 1 )
							{
								for(var gvi=0;gvi<gVChildren.length;gvi++)
								{
									if( gVChildren[gvi].isSelected )
									{
										gVChildren[gvi].beginEditingFirstColumn();
										gvi = gVChildren.length + 1;
										setTimeout( function()
										{
											$("label.sc-view.sc-text-field-view.inline-editor.sc-regular-size").focus();
										}, 50);
									}
								}
							}
						}
					}
				}
				else
				{
					if( $(e.target).hasClass("ELQ_SP_Input") )
					{
						if( e.ctrlKey && (e.keyCode == 65 || e.keyCode == 97) )
						{
							e.target.select();
						}
					}
				}
						
			if( prevDefStopProp )
			{
				if( typeof e.preventDefault === "function" )
					e.preventDefault();
				if( typeof e.stopPropagation === "function" )
					e.stopPropagation();
				return false;
			}
		};
		
		
		$scope.ELQ_SP_ValidateSendTestEmail = function()
		{
			
		};
		
		$scope.ELQ_SP_SendTestEmail = function(eid,aid)
		{
			$("body").append(ELQ_SP_testCenter);
			$scope.ELQ_SP_isBusy = true;
			$scope.ELQ_SP_SetConsoleStatus("Sending test email to <span class='ELQ_SP_Strong'>"+eid+"</span>...", "EmailTestCenter", false, false);
			var GenURL = 'https://secure.p03.eloqua.com//agent/Email/QuickSendEmailExecute2.aspx?EmailDefnID='+aid+'&xsrfToken='+window.xsrfToken+'&draft=1&FromUser=-1&PFromName=true&PFromAddress=true&PReplyName=true&PReplyAddress=true&TypeOverride=0&WireFramePersonalization=-1&EmailAddress='+encodeURIComponent(eid);
			$("#ELQ_SP_testCenter").attr('src', GenURL);
		};
		
		
		
		$scope.ELQ_SP_DeleteAsset_Perform = function()
		{
			$scope.ELQ_SP_isBusy = true;
			$scope.ELQ_SP_DeleteAssets.Deleting = true;
			if( $scope.ELQ_SP_DeleteAssets.DeleteList.length == 1 )
				$scope.ELQ_SP_SetConsoleStatus("Deleting <span class='ELQ_SP_BlueStrong'>"+$scope.ELQ_SP_DeleteAssets.DeleteList[0].name+"</span>...", "AssetDelete", false, false);
			else
				$scope.ELQ_SP_SetConsoleStatus("Deleting <span class='ELQ_SP_BlueStrong'>"+$scope.ELQ_SP_DeleteAssets.DeleteList.length+"</span> assets...", "AssetDelete", false, false);
			
			var a = Orion.currentFolderContentsController.get("content");
			for(DAL=0;DAL<$scope.ELQ_SP_DeleteAssets.DeleteList.length;DAL++)
			{
				b = $.extend(true, {}, $scope.ELQ_SP_DeleteAssets.DeleteList[DAL]);
				Orion.chooserController.chooserDelete(a,b,DAL);
			}
		};
		$scope.ELQ_SP_DeleteAsset_Cancel = function()
		{
			$scope.ELQ_SP_DeleteAssets = { Deleting: false, DeleteList: [], Completed: [], Errors: [] };
			$scope.ELQ_SP_SetConsoleStatus("Delete cancelled!", "AssetDelete", true, 2000);
		};
		$scope.ELQ_SP_DeleteAsset_Finish = function(AssetIndex,success,err_resp)
		{
			if( success )
			{
				$scope.ELQ_SP_DeleteAssets.DeleteList[AssetIndex].ELQ_SP_Status = "ELQ_SP_SUCCESS";
				$scope.ELQ_SP_DeleteAssets.Completed.push( $scope.ELQ_SP_DeleteAssets.DeleteList[AssetIndex] );
			}
			else
			{
				$scope.ELQ_SP_DeleteAssets.DeleteList[AssetIndex].ELQ_SP_Status = "ELQ_SP_ERROR";
				if( typeof err_resp.status !== "undefined" )
				{
					if( err_resp.status == 412 )
						$scope.ELQ_SP_DeleteAssets.DeleteList[AssetIndex].ELQ_SP_ErrMsg = "<span class='ELQ_SP_RedStrong'>Dependency - </span>";
				}
				$scope.ELQ_SP_DeleteAssets.Errors.push( $scope.ELQ_SP_DeleteAssets.DeleteList[AssetIndex] );
			}
			
			if( $scope.ELQ_SP_DeleteAssets.Deleting && $scope.ELQ_SP_DeleteAssets.DeleteList.length == ($scope.ELQ_SP_DeleteAssets.Completed.length + $scope.ELQ_SP_DeleteAssets.Errors.length) )
			{
				$scope.ELQ_SP_SetConsoleStatus("Delete finished!", "AssetDelete", true, 2000);
				$scope.ELQ_SP_isBusy = false;
				$timeout( function()
				{
					$scope.ELQ_SP_DeleteAssets = { Deleting: false, DeleteList: [], Completed: [], Errors: [] };
				}, 2500);
			}
		};
		
		
		
		
		
		
		
		
		
		$scope.ELQ_SP_CopyAsset_Cancel = function()
		{
			$scope.ELQ_SP_CopyAssets = { Valid: false, Copying: false, CopyPath: "", CopyList: [], Completed: [], Errors: [] };
			$scope.ELQ_SP_SetConsoleStatus("Copy cancelled!", "AssetCopy", true, 2000);
		};
		
		$scope.ELQ_SP_CopyAsset_Remove = function(ind)
		{
			$scope.ELQ_SP_CopyAssets.CopyList.splice(ind,1);
			if( $scope.ELQ_SP_CopyAssets.CopyList.length == 0 )
				$scope.ELQ_SP_CopyAsset_Cancel();
		};
		
		$scope.ELQ_SP_ValidateCopyAssetNames = function()
		{
			CL = $scope.ELQ_SP_CopyAssets.CopyList;
			$scope.ELQ_SP_CopyAssets.Valid = true;
			for(iCL=0;iCL<CL.length;iCL++)
			{
				if( $.trim(CL[iCL].name) == "" )
				{
					$scope.ELQ_SP_CopyAssets.Valid = false;
					$scope.ELQ_SP_SetConsoleStatus("<span class='ELQ_SP_RedStrong'>Please enter a name for all assets!</span>", "AssetCopy", false, false);
				}
			}
			if( $scope.ELQ_SP_CopyAssets.Valid )
				$scope.ELQ_SP_SetCopyStatus();
		};
		
		$scope.ELQ_SP_CopyAsset_Start = function()
		{
			$scope.ELQ_SP_isBusy = true;
			$scope.ELQ_SP_CopyAssets.Copying = true;
			if( $scope.ELQ_SP_CopyAssets.CopyList.length == 1 )
				$scope.ELQ_SP_SetConsoleStatus("Copying <span class='ELQ_SP_BlueStrong'>"+$scope.ELQ_SP_CopyAssets.CopyList[0].name+"</span>...", "AssetCopy", false, false);
			else
				$scope.ELQ_SP_SetConsoleStatus("Copying <span class='ELQ_SP_BlueStrong'>"+$scope.ELQ_SP_CopyAssets.CopyList.length+" assets</span>...", "AssetCopy", false, false);
			FolderContent = Orion.currentFolderContentsController.get("content");
			for(CAL = 0;CAL < $scope.ELQ_SP_CopyAssets.CopyList.length; CAL++ )
			{
				$scope.ELQ_SP_CopyAssets.CopyList[CAL].folderId = Orion.foldersController.currentFolderId;
				Orion.chooserController.chooserCopy(FolderContent, Orion.foldersController, Orion.currentFolderContentsController, $scope.ELQ_SP_CopyAssets.CopyList[CAL], CAL);
				$scope.ELQ_SP_CopyAssets.CopyList[CAL].ELQ_SP_Status = "";
				$scope.ELQ_SP_SetCopyStatus();
			}
		};

		$scope.ELQ_SP_CopyAsset_Finish = function(AssetIndex, success)
		{
			if( success )
			{
				$scope.ELQ_SP_CopyAssets.CopyList[AssetIndex].ELQ_SP_Status = "ELQ_SP_SUCCESS";
				$scope.ELQ_SP_CopyAssets.Completed.push( $scope.ELQ_SP_CopyAssets.CopyList[AssetIndex] );
			}
			else
			{
				$scope.ELQ_SP_CopyAssets.CopyList[AssetIndex].ELQ_SP_Status = "ELQ_SP_ERROR";
				$scope.ELQ_SP_CopyAssets.Errors.push( $scope.ELQ_SP_CopyAssets.CopyList[AssetIndex] );
			}
			
			$scope.ELQ_SP_SetCopyStatus();
		};
		
		$scope.ELQ_SP_SetCopyStatus = function()
		{
			if( $scope.ELQ_SP_CopyAssets.Copying )
			{
				if( $scope.ELQ_SP_CopyAssets.CopyList.length == ($scope.ELQ_SP_CopyAssets.Completed.length + $scope.ELQ_SP_CopyAssets.Errors.length) )
				{
					$scope.ELQ_SP_isBusy = false;
					$scope.ELQ_SP_SetConsoleStatus("Copy finished!", "AssetCopy", true, 2000);
					$timeout( function()
					{
						$scope.ELQ_SP_CopyAssets = { Valid: false, Copying: false, CopyPath: "", CopyList: [], Completed: [], Errors: [] };
					}, 2500);
				}
				else
				{
					$scope.ELQ_SP_SetConsoleStatus("Copying assets...", "AssetCopy", false, false);
				}
			}
			else
			{
				if( $scope.ELQ_SP_CopyAssets.CopyList.length == 1 )
				{
					$scope.ELQ_SP_SetConsoleStatus("<span class='ELQ_SP_BlueStrong'>"+$scope.ELQ_SP_CopyAssets.CopyList[0].name+"</span> | Press <span class='ELQ_SP_Strong'>(Ctrl+V)</span> to paste...", "AssetCopy", false, false);
				}
				else
				{
					$scope.ELQ_SP_SetConsoleStatus("<span class='ELQ_SP_BlueStrong'>"+$scope.ELQ_SP_CopyAssets.CopyList.length+" assets in clipboard</span> | Press <span class='ELQ_SP_Strong'>(Ctrl+V)</span> to paste...", "AssetCopy", false, false);
				}
			}
		};
		
		$scope.ELQ_SP_SetConsoleStatus = function(msg, mod, autoclose, closein)
		{
			$scope.ELQ_SP_ConsoleHasStatus = true;
			$scope.ELQ_SP_ConsoleStatus[mod] = msg;
			lki = Object.keys($scope.ELQ_SP_ConsoleStatus).length - 1;
			$scope.ELQ_SP_CurrConsoleStatus = $scope.ELQ_SP_ConsoleStatus[ Object.keys($scope.ELQ_SP_ConsoleStatus)[lki] ];
			if( autoclose )
			{
				$timeout( function()
				{
					$scope.ELQ_SP_ClearConsoleStatus(mod);
				}, closein);
			}
		};
		$scope.ELQ_SP_ClearConsoleStat_TO = 0;
		$scope.ELQ_SP_CurrConsoleStatus = "";
		$scope.ELQ_SP_ClearConsoleStatus = function(mod)
		{
			if( $scope.ELQ_SP_ConsoleStatus.hasOwnProperty(mod) )
			{
				if( Object.keys($scope.ELQ_SP_ConsoleStatus).length == 1 )
				{
					$timeout.cancel($scope.ELQ_SP_ClearConsoleStat_TO);
					$scope.ELQ_SP_ConsoleHasStatus = false;
					$scope.ELQ_SP_ClearConsoleStat_TO = $timeout( function()
					{
						delete $scope.ELQ_SP_ConsoleStatus[mod];
						$timeout.cancel($scope.ELQ_SP_ClearConsoleStat_TO);
						$scope.ELQ_SP_ConsoleStatus = {};
					}, 500);
				}
				else if( Object.keys($scope.ELQ_SP_ConsoleStatus).length > 1 )
				{
					delete $scope.ELQ_SP_ConsoleStatus[mod];
					lki = Object.keys($scope.ELQ_SP_ConsoleStatus).length - 1;
					$scope.ELQ_SP_CurrConsoleStatus = $scope.ELQ_SP_ConsoleStatus[ Object.keys($scope.ELQ_SP_ConsoleStatus)[lki] ];
				}
			}
		};
		
		
		$scope.ELQ_SP_NamingGenerator = false;
		$scope.ELQ_SP_InitNamingGenerator = function()
		{
			if( typeof ELQ_SP_NamingGenPrototype === "function" )
				$scope.ELQ_SP_NamingGenerator = ELQ_SP_NamingGenPrototype($scope, $http, $timeout);
			else
			{
				$timeout( function()
				{
					$scope.ELQ_SP_InitNamingGenerator();
				}, 250);
			}
		};
		$scope.ELQ_SP_InitNamingGenerator();
		
		
		$scope.ELQ_SP_CampaignSearch = { isEnabled: false, Show: false, CurrentKW: "", LastKW: "", CurrIndex: 0, Matches: 0,
			Init: function()
			{
				//this.Close();
				this.Show = true;
				$timeout( function()
				{
					$("#ELQ_SP_CampaignSearch").click();
				}, 250);
			},
			Search: function(e)
			{
				if( e.keyCode == 27 )
				{
					this.Close();
				}
				else
				{
					$(".hidden-campaign-element-view").removeClass("ELQ_SP_CampaignSearch_HL").removeClass("ELQ_SP_CampaignSearch_Current");
					if( $.trim(this.CurrentKW) !== "" )
					{
						kw = $.trim(this.CurrentKW).toLowerCase();
						sel = $(".hidden-campaign-element-view").filter( function()
								{
									n = $(this).attr("data-name").toLowerCase().indexOf(kw);
									d = $(this).attr("data-description").toLowerCase().indexOf(kw);
									return ( n > -1 || d > -1 );
								});
						$(sel).addClass("ELQ_SP_CampaignSearch_HL");
						this.Matches = $(sel).length;
						
						if( e.keyCode == 13 )
						{
							if( kw !== this.LastKW )
							{
								this.CurrIndex = 0;
								this.LastKW = kw;
							}
							else
							{
								if( e.shiftKey )
								{
									if( this.CurrIndex <= 0 )
										this.CurrIndex = sel.length - 1;
									else
										this.CurrIndex--;
								}
								else
								{
									if( this.CurrIndex >= sel.length - 1 )
										this.CurrIndex = 0;
									else
										this.CurrIndex++;
								}
							}
							
							if( $(sel).length > 0 && this.CurrIndex < $(sel).length )
								$(sel).eq(this.CurrIndex).addClass("ELQ_SP_CampaignSearch_Current").get(0).scrollIntoView();
						}
					}
					else
					{
						this.Matches = 0;
					}
				}
				e.stopPropagation();
			},
			Close: function()
			{
				$(".hidden-campaign-element-view").removeClass("ELQ_SP_CampaignSearch_HL").removeClass("ELQ_SP_CampaignSearch_Current");
				this.LastKW = "";
				this.CurrentKW = "";
				this.CurrIndex = 0;
				this.Matches = 0;
				this.Show = false;
			}
		};
		
		$scope.ELQ_SP_ValidatingFMSyntax = false;
		$scope.ELQ_SP_FMV_HTML = "";
		$scope.ELQ_SP_AssetFieldMerges = [];
		$scope.ELQ_SP_ValidateAssetHTML = function(saveData)
		{
			if( !$scope.ELQ_SP_Settings.ValidateFieldMerges ) {
				Orion.postTo("editorIframe").withMessage("proposeSave", { saveType: Orion.SAVE_TYPE });
				return false;
			} else {
				
				$scope.ELQ_SP_FMV_HTML = saveData.HTML;
				AID = false;
				AssetController = false;
				
				if( saveData.AssetType == "Email" )
				{
					EmD = Orion.Statechart.getState("emailDesign");
					EmD._callback = saveData.saveBtn;
					AID = parseInt(Orion.emailController.get("id"));
					AssetController = Orion.emailController;
				}
				else if( saveData.AssetType == "LP" )
				{
					LpD = Orion.Statechart.getState("landingPageDesign");
					LpD._callback = saveData.saveBtn;
					AID = parseInt(Orion.landingPageController.get("id"));
					AssetController = Orion.landingPageController;
				}
				
				//CHECK FOR ASSET ID AND ADD IT...
				if( AID && AID > 0 && !saveData.AssetIDUpdated )
				{
					RegStr = "<!--([asetid\\s]{0,})([\\s:=-]{0,})"+AID+"([\\s]{0,})-->";
					RE = new RegExp(RegStr,"im");
					AssetID = RE.test(saveData.HTML);
					if( !AssetID )
					{
						Orion.postTo("editorIframe").withMessage("AddAssetID", { HTML: saveData.HTML+String.fromCharCode(10)+"<!-- AssetID : "+AID+" -->" });
						return false;
					}
				}
				//END OF ASSET ID ADDITION...
				
				$scope.ELQ_SP_AssetFieldMerges = []; fmkws = [];
				
				//VALIDATE ~~eloqua..type--emailfield fieldmerges...
				fmsyntaxes = saveData.HTML.match(/([~eloqua]{4,})([.type-]{3,})([emailfd.]{4,})([syntax-]{4,})([\w\d\s]{3,})([.inertx-]{4,})([\w\d\s]{3,})([.encodfrul-]{4,})(~{0,})/gim);
				AllTildeSyntaxesArePerfect = true;
				if( fmsyntaxes && (fmsyntaxes.length > 0) )
				{
					$.each(fmsyntaxes, function(k,v)
					{
						perfectSyntax = v.match(/~~eloqua..type--emailfield..syntax--([a-zA-Z0-9_]{3,})..innerText--\1..encodeFor--url~~/gm);
						if( perfectSyntax && (perfectSyntax.length > 0) )
						{
							synt = v.replace(/~~eloqua..type--emailfield..syntax--([a-zA-Z0-9_]{3,})..innerText--\1..encodeFor--url~~/gm, "$1");
							searchsynt = synt.replace(/[*%]{1,}/g,"+").replace(/[0-9_]/g,"*").replace(/[^a-zA-Z0-9_*%]/g,"_").replace(/\*{2,}/g,"*");
							if( fmkws.indexOf(synt) < 0 )
							{
								fmkws.push( searchsynt );
								$scope.ELQ_SP_AssetFieldMerges.push({ syntax: synt, outerHTML: v, isTag: false });
							}
						}
						else
						{
							syntpos = saveData.HTML.indexOf(v);
							lnNo = saveData.HTML.substr(0, syntpos).split(String.fromCharCode(10)).length;
							$scope.ELQ_SP_SetConsoleStatus("<span class='ELQ_SP_RedStrong'>Invalid ~ fieldmerge syntax at Line No. : "+lnNo+"</span>", "AssetFieldMerge", true, 5000);
							AllTildeSyntaxesArePerfect = false;
							return false;
						}
					});
				}
				else
					fmsyntaxes = [];
				
				if( !AllTildeSyntaxesArePerfect )
					return false;
				
				//VALIDATE SPAN.ELOQUAEMAIL TAGS
				fmtags = saveData.HTML.match(/<span(\s*)class=(('|")*)eloquaemail(\s*)(('|")*)(\s*)>([\w\d\s!@#\$%\^\&*\)\(+=._-]*)<(\s*)\/span(\s*)>/gim);
				if( fmtags && (fmtags.length > 0) )
				{
					$.each( fmtags, function(k,v)
					{
						span = $(v).text();
						$scope.ELQ_SP_AssetFieldMerges.push({ syntax: span, outerHTML: v, isTag: true });
						synt = span.replace(/[*%]{1,}/g,"+").replace(/[0-9_]/g,"*").replace(/[^a-zA-Z0-9_*%]/g,"_").replace(/\*{2,}/g,"*");
						if( fmkws.indexOf(synt) < 0 )
							fmkws.push( synt );
					});
				}
				
				
				if( fmkws.length > 0 )
				{
					$scope.ELQ_SP_SetConsoleStatus("Validating fieldmerges before saving...", "AssetFieldMerge", false, false);
					$scope.ELQ_SP_isBusy = true;
					fmquery = "name=%27"+fmkws.join("%27%20and%20name=%27")+"%27";
					fmurl = "https://secure.p03.eloqua.com/API/REST/2.0/assets/fieldMerges?xsrfToken="+window.xsrfToken+"&depth=partial&count=500&search=\""+fmquery+"\"";
					
					var data = null;
					var xhr = new XMLHttpRequest();
					xhr.withCredentials = true;

					xhr.addEventListener("readystatechange", function () {
						if (this.readyState === 4) {
							$scope.ELQ_SP_isBusy = false;
							updatedHTML = $scope.ELQ_SP_FMV_HTML;
							
							$scope.ELQ_SP_ValidatingFMSyntax = false;
							try {
								ParsedJSON = $.parseJSON(this.responseText);
								if( typeof ParsedJSON.elements !== "undefined" )
								{
									FMs = ParsedJSON.elements;
									FMs = FMs.concat([
														{ syntax: "elqReplyToName"}, 
														{ syntax: "elqReplyToAddress" }, 
														{ syntax: "elqFromName" }, 
														{ syntax: "elqFromAddress" }, 
														{ syntax: "elqEmailSaveGUID" }, 
														{ syntax: "recipientid" }, 
														{ syntax: "siteid" }, 
														{ syntax: "campaignid" }, 
														{ syntax: "elqRFcontent" }, 
														{ syntax: "elqRFtoname" }, 
														{ syntax: "elqRFfromname" }, 
														{ syntax: "elqRFtoemailaddress" }, 
														{ syntax: "elqRFfromemailaddress" }, 
														{ syntax: "elqReferFriendID" }
													]);
									InvalidFMsExist = false; InvalidFMLineNos = [];
									for(iFM=0;iFM<$scope.ELQ_SP_AssetFieldMerges.length;iFM++)
									{
										FMExists = false;
										for(jFM=0;jFM<FMs.length;jFM++)
										{
											if( FMs[jFM].syntax.toLowerCase() == $scope.ELQ_SP_AssetFieldMerges[iFM].syntax.toLowerCase() )
												FMExists = true;
										}
										if( !FMExists )
										{
											if( $scope.ELQ_SP_AssetFieldMerges[iFM].isTag )
											{
												errSyntax = $scope.ELQ_SP_AssetFieldMerges[iFM].outerHTML.replace("eloquaemail", "ELQ_SP_InvalidFMSyntax eloquaemail");
												updatedHTML = updatedHTML.replace($scope.ELQ_SP_AssetFieldMerges[iFM].outerHTML, errSyntax);
											}
											else
											{
												syntpos = $scope.ELQ_SP_FMV_HTML.indexOf($scope.ELQ_SP_AssetFieldMerges[iFM].outerHTML);
												lnNo = $scope.ELQ_SP_FMV_HTML.substr(0, syntpos).split(String.fromCharCode(10)).length;
												InvalidFMLineNos.push(lnNo);
											}
											InvalidFMsExist = true;
										}
									}
									if( !InvalidFMsExist )
									{
										$scope.ELQ_SP_SetConsoleStatus("<strong class='ELQ_SP_GreenStrong'>All Fieldmerge syntaxes are correct - Saving...</strong>", "AssetFieldMerge", true, 2000);
										Orion.postTo("editorIframe").withMessage("proposeSave", { saveType: Orion.SAVE_TYPE });
									}
									else
									{
										updatedHTML += "<style> .ELQ_SP_InvalidFMSyntax { background-color: #CC0000 !important; border: 2px solid #CC0000 !important; color: #FFFFFF !important; font-weight: bold !important; } </style>";
										if( InvalidFMLineNos.length > 0 )
										{
											IFMMsg = "<span class='ELQ_SP_RedStrong'>Invalid fieldmerge syntaxes found at Line(s): "+InvalidFMLineNos.join(",")+"</span>";
											$scope.ELQ_SP_SetConsoleStatus(IFMMsg, "AssetFieldMerge", true, 5000);
										}
										else
										{
											$scope.ELQ_SP_SetConsoleStatus("<span class='ELQ_SP_RedStrong'>Invalid Fieldmerge syntaxes found - Save cancelled!</span>", "AssetFieldMerge", true, 2000);
										}
										Orion.postTo("editorIframe").withMessage("updateAssetHTML", { HTML: updatedHTML });
									}
								}
								else
								{
									$scope.ELQ_SP_ValidatingFMSyntax = false;
									$scope.ELQ_SP_ClearConsoleStatus("AssetFieldMerge");
									window.ELQ_SP_ShowMessage("ERROR", "<img src='"+ELQ_SP_ImgLoc+"/%7B1599507c-959c-4a6b-b612-4a17cfaa5706%7D_AfraidFace.png' class='ELQ_SP_Emoji'/><br/><span class='ELQ_SP_RedStrong'>Ah, biscuits!</span><br/>There was an error when trying to validate the fieldmerges within this asset... But never mind, we'll save it! ;)", false, true);
								}
							}
							catch(err)
							{
								$scope.ELQ_SP_ValidatingFMSyntax = false;
								$scope.ELQ_SP_ClearConsoleStatus("AssetFieldMerge");
								Orion.postTo("editorIframe").withMessage("proposeSave", { saveType: Orion.SAVE_TYPE });
								window.ELQ_SP_ShowMessage("ERROR", "<img src='"+ELQ_SP_ImgLoc+"/%7B1599507c-959c-4a6b-b612-4a17cfaa5706%7D_AfraidFace.png' class='ELQ_SP_Emoji'/><br/><span class='ELQ_SP_RedStrong'>Ah, biscuits!</span><br/>There was an error when trying to validate the fieldmerges within this asset... But never mind, we'll save it! ;)", false, true);
							}
							$scope.safeApply();
						}
					});
					$scope.ELQ_SP_ValidatingFMSyntax = true;
					xhr.open("GET", fmurl);
					xhr.send(data);
				}
				else
				{
					Orion.postTo("editorIframe").withMessage("proposeSave", { saveType: Orion.SAVE_TYPE });
				}
			}
		};
		
		$scope.ELQ_SP_BF_FMIDS = []; $scope.ELQ_SP_BF_FMS = []; $scope.ELQ_SP_BFLink_InProgress = false;
		$scope.ELQ_SP_GenerateBFLink = function()
		{
			if( typeof Orion.formController !== "undefined" && !$scope.ELQ_SP_BFLink_InProgress )
			{
				ELQ_SP_BF_Completed = 0;
				$scope.ELQ_SP_BFLink_InProgress = true;
				c = Orion.formController.content;
				if( typeof CoreOrion.store.dataHashes[c.storeKey].elements !== "undefined" )
				{
					els = CoreOrion.store.dataHashes[c.storeKey].elements;
					flds = []; $scope.ELQ_SP_BF_FMIDS = []; $scope.ELQ_SP_BF_FMS = [];
					for(i=0;i<els.length;i++)
					{
						switch( els[i].displayType )
						{
							case "text":
							case "hidden":
							case "checkbox":
							case "radio":
							case "textArea":
							case "singleSelect":
							case "multiSelect":
							{
								fmid = false;
								if( els[i].hasOwnProperty("fieldMergeId") && (els[i].fieldMergeId) )
								{
									$scope.ELQ_SP_BF_FMIDS.push( els[i].fieldMergeId );
									fmid = els[i].fieldMergeId;
								}
								flds.push({ htmlName: els[i].htmlName, fieldMergeId: fmid, fieldMergeSyntax: "" });
							}
							break;
						}
					}
					
					if( $scope.ELQ_SP_BF_FMIDS.length > 0 )
					{
						for(AFM=0;AFM<$scope.ELQ_SP_BF_FMIDS.length;AFM++)
						{
							fmquery = "id=%27"+$scope.ELQ_SP_BF_FMIDS[AFM]+"%27";
							fmurl = "https://secure.p03.eloqua.com/API/REST/2.0/assets/fieldMerges?xsrfToken="+window.xsrfToken+"&depth=partial&count=250&search=\""+fmquery+"\"";
							
							var data = null;
							var xhr = new XMLHttpRequest();
							xhr.withCredentials = true;

							$scope.ELQ_SP_isBusy = true;
							$scope.ELQ_SP_SetConsoleStatus("Generating Blind Form URL...", "BlindFormLinks", false, false);
							xhr.addEventListener("readystatechange", function () {
								if (this.readyState === 4) {
									ELQ_SP_BF_Completed++;
									try {
										ParsedJSON = $.parseJSON(this.responseText);
										if( typeof ParsedJSON.elements !== "undefined" )
										{
											$scope.ELQ_SP_BF_FMS.push(ParsedJSON.elements[0]);
										}
									}
									catch(err)
									{
										//NOTHING NEEDS TO BE DONE
									}
									if( ELQ_SP_BF_Completed == $scope.ELQ_SP_BF_FMIDS.length )
									{
										if( $scope.ELQ_SP_BF_FMS.length == $scope.ELQ_SP_BF_FMIDS.length )
										{
											$scope.ELQ_SP_isBusy = false;
											$scope.ELQ_SP_BFLink_InProgress = false;
											FMSyntaxes = {};
											
											$.each($scope.ELQ_SP_BF_FMS, function(k,v)
											{
												FMSyntaxes[v.id] = v.syntax;
											});
											
											BFBase = "http://"+CoreOrion.getPath("site.webTrackingDomain")+"/e/f2?elqFormName="+Orion.formController.get("htmlName")+"&elqSiteId="+CoreOrion.getPath("site.id");
											fldParams = "";
											for(i=0;i<flds.length;i++)
											{
												FMSyntax = ( flds[i].fieldMergeId && (typeof FMSyntaxes[flds[i].fieldMergeId] !== "undefined") ) ? "<span class=eloquaemail>"+FMSyntaxes[flds[i].fieldMergeId]+"</span>" : "";
												fldParams += "&"+flds[i].htmlName+"="+FMSyntax;
											}
											BFLink = BFBase + fldParams;
											
											window.ELQ_SP_ShowMessage("INFO", "<span class='ELQ_SP_Strong'>Blind Form URL:</span><br/><textarea id='ELQ_SP_BF_Textarea' autocomplete='off' autocorrect='off' autocapitalize='off' spellcheck='false' class='ELQ_SP_Input' rows='20' cols='70' style='word-break: break-all;' onkeydown='if(event.keyCode == 27) { ELQ_SP_CloseMessage(); }'>"+BFLink+"</textarea>", false, true);
											setTimeout( function()
											{
												$("#ELQ_SP_BF_Textarea").focus().select();
											}, 250);
											
											$scope.ELQ_SP_ClearConsoleStatus("BlindFormLinks");
										}
										else
										{
											$scope.ELQ_SP_GenerateBFLinkWithoutFM(flds);
										}
									}
									$scope.safeApply();
								}
							});
							xhr.open("GET", fmurl);
							xhr.send(data);
						}
					}
					else
						$scope.ELQ_SP_GenerateBFLinkWithoutFM(flds);
				}
			}
		};
		
		$scope.ELQ_SP_GenerateBFLinkWithoutFM = function(flds)
		{
			BFBase = "https://"+CoreOrion.getPath("site.webTrackingDomain")+"/e/f2?elqFormName="+Orion.formController.get("htmlName")+"&elqSiteId="+CoreOrion.getPath("site.id");
			fldParams = "";
			for(i=0;i<flds.length;i++)
			{
				fldParams += "&"+flds[i].htmlName+"=";
			}
			BFLink = BFBase + fldParams;
			
			window.ELQ_SP_ShowMessage("INFO", "<span class='ELQ_SP_Strong'>Blind Form URL:</span><br/><textarea id='ELQ_SP_BF_Textarea' autocomplete='off' autocorrect='off' autocapitalize='off' spellcheck='false' class='ELQ_SP_Input' rows='20' cols='70' style='word-break: break-all;' onkeydown='if(event.keyCode == 27) { ELQ_SP_CloseMessage(); }'>"+BFLink+"</textarea>", false, true);
			setTimeout( function()
			{
				$("#ELQ_SP_BF_Textarea").focus().select();
			}, 250);
			$scope.ELQ_SP_ClearConsoleStatus("BlindFormLinks");
			$scope.ELQ_SP_BFLink_InProgress = false;
		};
		
		
		$scope.ELQ_SP_LPFromURL = {
			
			isLoading: false,
			SearchKW: "",
			SearchStatus: "",
			SearchResults: [],
			Show: function()
			{
				window.ELQ_SP_BtnClose_Click();
				$("#ELQ_SP_LPBrowser").css("opacity", 0).css("display","block");
				$("#ELQ_SP_LPBrowser").stop().animate({ opacity: 1 }, 250, function()
				{
					$("#ELQ_SP_TextBox_LPFUSearch").focus();
				});
			},
			Search: function(e)
			{
				if( !e || (e.hasOwnProperty("keyCode") && (e.keyCode == 13)) )
				{
					$scope.ELQ_SP_LPFromURL.isLoading = true;
					$scope.ELQ_SP_LPFromURL.SearchStatus = "";
					$scope.ELQ_SP_LPFromURL.SearchResults = [];
					$http({
						method: 'GET',
						url: "https://secure.p03.eloqua.com/API/REST/1.0/assets/landingPages?xsrfToken="+window.xsrfToken+"&search=\"relativePath='*"+encodeURIComponent($scope.ELQ_SP_LPFromURL.SearchKW)+"*'\""
					}).then(function successCallback(response) {
						$scope.ELQ_SP_LPFromURL.isLoading = false;
						try {
							if( typeof response.data.elements !== "undefined" )
							{
								$scope.ELQ_SP_LPFromURL.SearchResults = response.data.elements;
								$scope.ELQ_SP_LPFromURL.SearchStatus = "SUCCESS";
							}
						}
						catch(err)
						{
							$scope.ELQ_SP_LPFromURL.Close();
							window.ELQ_SP_ShowMessage("ERROR", "<img src='"+ELQ_SP_ImgLoc+"/%7B415c7f82-3650-49b9-92ce-7a10e45301cc%7D_IndifferentFace.png' class='ELQ_SP_Emoji'/><br/><span class='ELQ_SP_RedStrong'>Blargh...</span><br/>The search returned an unexpected response...", false, true);
							//NOTHING NEEDS TO BE DONE
						}
						// this callback will be called asynchronously
						// when the response is available
					}, function errorCallback(response) {
						$scope.ELQ_SP_LPFromURL.Close();
						window.ELQ_SP_ShowMessage("ERROR", "<img src='"+ELQ_SP_ImgLoc+"/%7B4627d031-de98-43cc-afc4-4a35ac328109%7D_LaughterControlFace.png' class='ELQ_SP_Emoji'/><br/><span class='ELQ_SP_RedStrong'>Hmmm...</span><br/>There was an error... but quite obviously it's not you!", false, true);
						// called asynchronously if an error occurs
						// or server returns response with an error status.
					});
				}
			},
			OpenLP: function(LP)
			{
				window.open("/Main.aspx#landing_pages&id="+LP.id);
			},
			Close: function()
			{
				$scope.ELQ_SP_LPFromURL.isLoading = false;
				$scope.ELQ_SP_LPFromURL.SearchKW = "";
				$scope.ELQ_SP_LPFromURL.SearchStatus = "";
				$scope.ELQ_SP_LPFromURL.SearchResults = [];
				$("#ELQ_SP_LPBrowser").css("opacity", 1);
				$("#ELQ_SP_LPBrowser").stop().animate({ opacity: 0 }, 250, function()
				{
					$("#ELQ_SP_LPBrowser").css("display","none");
				});
			}
			
		};
		
		
		
		$scope.ELQ_SP_CDOCreator = {
			isSaving: false, NewCDO: true, ExistingCDOID: 0, ExistingCDODetails: {}, CDOList: [], isLoading: false, SearchKW: "", SearchStatus: "", Status: "Enter a name for the CDO, add the number of fields and click on Create button...",
			Name: "", isVisible: false,
			Fields: [{ name: "", defaultValue: "", dataType: "text", displayType: "text" }],
			PickList: { totalCount: 0, totalPages: 0, LoadedPages: 0, Entries: [] },
			dataTypes: [
				{ name: "Number", value: "number" },
				{ name: "Text", value: "text" },
				{ name: "Large Text", value: "largeText" },
				{ name: "Date/Time", value: "date" },
				{ name: "Numeric", value: "numeric" }
			],
			displayTypes: [
				{ name: "Textbox", value: "text" },
				{ name: "Textarea", value: "textArea" },
				{ name: "Checkbox", value: "checkbox" }
			],
			Show: function()
			{
				this.isVisible = true;
				window.ELQ_SP_BtnClose_Click();
				$("#ELQ_SP_CDOCreator").css("opacity", 0).css("display","block");
				$("#ELQ_SP_CDOCreator").stop().animate({ opacity: 1 }, 250, function()
				{
					$("#ELQ_SP_TextBox_CDOName").focus();
				});
			},
			Close: function()
			{
				this.isSaving = false;
				this.isLoading = false;
				this.isVisible = false;
				this.Name = "";
				this.SearchKW = "";
				this.CDOList = [];
				this.ExistingCDOID = 0;
				this.ExistingCDODetails = {};
				this.NewCDO = true;
				this.BrowseCDO = false;
				this.SearchStatus = "";
				this.Status = "Enter a name for the CDO, add the number of fields and click on Create button...";
				this.Fields = [{ name: "", defaultValue: "", dataType: "text", displayType: "text" }];
				$("#ELQ_SP_CDOCreator").css("opacity", 1);
				$("#ELQ_SP_CDOCreator").stop().animate({ opacity: 0 }, 250, function()
				{
					$("#ELQ_SP_CDOCreator").css("display","none");
				});
			},
			ToggleCDOMode: function()
			{
				this.NewCDO = !this.NewCDO;
				if( this.NewCDO )
				{
					if( this.ExistingCDOID > 0 )
					{
						this.Name = "";
						FldArrObj = this;
						NewFldsList = this.Fields.filter(function(v,k) { return !v.hasOwnProperty("id"); });
						this.Fields = NewFldsList;
						if( this.Fields.length == 0 )
							this.AddField();
					}
					this.ExistingCDOID = 0;
					this.ExistingCDODetails = {};
					this.BrowseCDO = false;
				}
				else
					this.BrowseCDO = true;
				this.CDOList = [];
				this.isLoading = false;
				this.SearchKW = "";
				if( this.NewCDO )
				{
					setTimeout( function()
					{
						$("#ELQ_SP_TextBox_CDOName").focus();
					}, 100);
					this.Status = "Enter a name for the CDO, add the number of fields and click on Create button...";
				}
				else
				{
					this.Status = "Search and select a CDO to modify...";
					setTimeout( function()
					{
						$("#ELQ_SP_TextBox_SearchCDOKW").focus();
					}, 100);
				}
			},
			Search: function(e)
			{
				if( !e || (e.hasOwnProperty("keyCode") && (e.keyCode == 13)) )
				{
					this.isLoading = true;
					this.SearchStatus = "";
					this.CDOList = [];
					$http({
						method: 'GET',
						url: "https://secure.p03.eloqua.com/API/REST/1.0/assets/customObjects?xsrfToken="+window.xsrfToken+"&count=250&search=%27*"+encodeURIComponent($scope.ELQ_SP_CDOCreator.SearchKW)+"*%27"
					}).then(function successCallback(response) {
						$scope.ELQ_SP_CDOCreator.isLoading = false;
						try {
							if( typeof response.data.elements !== "undefined" )
							{
								$scope.ELQ_SP_CDOCreator.CDOList = response.data.elements;
							}
						}
						catch(err)
						{
							$scope.ELQ_SP_CDOCreator.Close();
							window.ELQ_SP_ShowMessage("ERROR", "<img src='"+ELQ_SP_ImgLoc+"/%7B1599507c-959c-4a6b-b612-4a17cfaa5706%7D_AfraidFace.png' class='ELQ_SP_Emoji'/><br/><span class='ELQ_SP_RedStrong'>Blargh...</span><br/>The search returned an unexpected response...", false, true);
							//NOTHING NEEDS TO BE DONE
						}
						// this callback will be called asynchronously
						// when the response is available
					}, function errorCallback(response) {
						$scope.ELQ_SP_CDOCreator.Close();
						window.ELQ_SP_ShowMessage("ERROR", "<img src='"+ELQ_SP_ImgLoc+"/%7B1599507c-959c-4a6b-b612-4a17cfaa5706%7D_AfraidFace.png' class='ELQ_SP_Emoji'/><br/><span class='ELQ_SP_RedStrong'>Oh no!</span><br/>That search didn't go so well...", false, true);
					});
				}
			},
			SelectCDO: function(CDO)
			{
				this.Name = CDO.name;
				this.ExistingCDOID = parseInt(CDO.id);
				if( !this.isLoading )
				{
					$scope.ELQ_SP_CDOCreator.Status = "Please be patient while we retrieve the CDO details...";
					this.isLoading = true;
					$http({
						method: 'GET',
						url: "https://secure.p03.eloqua.com/API/REST/1.0/assets/customObject/"+CDO.id+"?xsrfToken="+window.xsrfToken+"&count=250&search=id="+CDO.id
					}).then(function successCallback(response) {
						$scope.ELQ_SP_CDOCreator.isLoading = false;
						try {
							if( typeof response.data.id !== "undefined" && (parseInt(response.data.id) == $scope.ELQ_SP_CDOCreator.ExistingCDOID) )
							{
								$scope.ELQ_SP_CDOCreator.Name = response.data.name;
								$scope.ELQ_SP_CDOCreator.ExistingCDODetails = response.data;
								$scope.ELQ_SP_CDOCreator.NewCDO = false;
								$scope.ELQ_SP_CDOCreator.BrowseCDO = false;
								$scope.ELQ_SP_CDOCreator.Fields = response.data.fields;
								$scope.ELQ_SP_CDOCreator.Status = "Modify the CDO name, add/remove fields or change the Display Type and click on Update button...";
							}
							else
							{
								$scope.ELQ_SP_CDOCreator.Close();
								window.ELQ_SP_ShowMessage("ERROR", "<img src='"+ELQ_SP_ImgLoc+"/%7Bc2bd773d-1707-4bbe-9b10-767ae9c3de20%7D_SarcasticFace.png' class='ELQ_SP_Emoji'/><br/><span class='ELQ_SP_RedStrong'>Hmmm...</span><br/>The server returned something gibberish...", false, true);
							}
						}
						catch(err)
						{
							$scope.ELQ_SP_CDOCreator.Close();
							window.ELQ_SP_ShowMessage("ERROR", "<img src='"+ELQ_SP_ImgLoc+"/%7Bc2bd773d-1707-4bbe-9b10-767ae9c3de20%7D_SarcasticFace.png' class='ELQ_SP_Emoji'/><br/><span class='ELQ_SP_RedStrong'>Hmmm...</span><br/>The server returned something gibberish...", false, true);
							//NOTHING NEEDS TO BE DONE
						}
						// this callback will be called asynchronously
						// when the response is available
					}, function errorCallback(response) {
						$scope.ELQ_SP_CDOCreator.Close();
						window.ELQ_SP_ShowMessage("ERROR", "<img src='"+ELQ_SP_ImgLoc+"/%7Bd328ed83-6414-4cf7-928c-9f04412d18d2%7D_WorriedFace.png' class='ELQ_SP_Emoji'/><br/><span class='ELQ_SP_RedStrong'>Err...</span><br/>Sorry, unable to fetch the CDO details right now...", false, true);
					});
				}
			},
			AddField: function()
			{
				this.Fields.push({ name: "", defaultValue: "", dataType: "text", displayType: "text" });
			},
			RemoveField: function(ind)
			{
				this.Fields.splice(ind,1);
			},
			UpdateDisplayType: function(ind)
			{
				if( this.Fields[ind].dataType == "largeText" )
					this.Fields[ind].displayType = "textArea";
			},
			AllFieldsOkay: function()
			{
				AFO = true;
				
				if( $.trim(this.Name) == "" || $.trim(this.Name).length > 50 )
					return false;
				
				for(ti=0;ti<this.Fields.length;ti++)
				{
					if( $.trim(this.Fields[ti].name) == "" || $.trim(this.Fields[ti].name).length > 50 )
						return false;
				}
				
				return AFO;
			},
			Save: function()
			{
				if( this.AllFieldsOkay() )
				{
					if( this.ExistingCDOID > 0 )
					{
						postBody = "{ \"id\": \""+this.ExistingCDOID+"\", \"name\": \""+this.Name+"\", \"description\": \"\", \"fields\": "+JSON.stringify(this.Fields)+" }";
						request = {
							method: "PUT",
							url: "https://secure.p03.eloqua.com/API/REST/2.0/assets/customObject/"+this.ExistingCDOID+"?xsrfToken="+window.xsrfToken,
							headers: {
								'Content-Type': "application/json"
							},
							data: postBody
						};
						$scope.ELQ_SP_CDOCreator.Status = "<span class='ELQ_SP_BlueStrong'>Updating CDO...</span>";
					}
					else
					{
						postBody = "{ \"name\": \""+this.Name+"\", \"description\": \"\", \"fields\": "+JSON.stringify(this.Fields)
						+" }";
						request = {
							method: "POST",
							url: "https://secure.p03.eloqua.com/API/REST/1.0/assets/customObject?xsrfToken="+window.xsrfToken,
							headers: {
								'Content-Type': "application/json"
							},
							data: postBody
						};
						$scope.ELQ_SP_CDOCreator.Status = "<span class='ELQ_SP_BlueStrong'>Creating CDO...</span>";
					}
					
					this.isSaving = true;
					$http(request).then(function successCallback(response) {
						
						if( response.status == 201 )
						{
							$scope.ELQ_SP_CDOCreator.Status = "<span class='ELQ_SP_GreenStrong'>CDO Created successfully!</span>";
							$timeout( function()
							{
								$scope.ELQ_SP_CDOCreator.isSaving = false;
								$scope.ELQ_SP_CDOCreator.Close();
							}, 2000);
						}
						else if( response.status == 200 )
						{
							$scope.ELQ_SP_CDOCreator.Status = "<span class='ELQ_SP_GreenStrong'>CDO updated successfully!</span>";
							$timeout( function()
							{
								$scope.ELQ_SP_CDOCreator.isSaving = false;
								$scope.ELQ_SP_CDOCreator.Close();
							}, 2000);
						}
					}, function errorCallback(response) {
						
						if( response.data.length > 0 && (response.data[0].container && (response.data[0].container.objectType == "CustomObject") && (response.data[0].requirement.type == "NoDuplicatesRequirement")))
						{
							$scope.ELQ_SP_CDOCreator.isSaving = false;
							$scope.ELQ_SP_CDOCreator.Status = "<span class='ELQ_SP_RedStrong'>CDO name already exists!</span>";
							$timeout(function()
							{
								$scope.ELQ_SP_CDOCreator.Status = "Enter a name for the CDO, add the number of fields and click on Create button...";
							}, 3000);
						}
						else
						{
							$scope.ELQ_SP_CDOCreator.Close();
							window.ELQ_SP_ShowMessage("ERROR", "<img src='"+ELQ_SP_ImgLoc+"/%7B4627d031-de98-43cc-afc4-4a35ac328109%7D_LaughterControlFace.png' class='ELQ_SP_Emoji'/><br/><span class='ELQ_SP_RedStrong'>Ahem!...</span><br/>That created an ERROR not a CDO! Please check the details you have entered.", false, true);
						}
					});
				}
			}
		};
		
		
		if( !localStorage.hasOwnProperty("ELQ_SP_ETC_List") )
		{
			localStorage.ELQ_SP_ETC_List = "[]";
		} else {
			try {
				tJSON = $.parseJSON( localStorage.ELQ_SP_ETC_List );
			} catch(err) {
				localStorage.ELQ_SP_ETC_List = "[]";
			}
		}
		
		// START OF EMAIL TEST CENTER
		$scope.ELQ_SP_EmailTestCenter = {
			isVisible: false,
			ShowList: false,
			AssetID: false,
			List: $.parseJSON(localStorage.ELQ_SP_ETC_List),
			EmailAddress: "",
			CloseTO: 0,
			Close: function()
			{
				_ETCthis = this;
				$timeout( function()
				{
					_ETCthis.ShowList = false;
					_ETCthis.isVisible = false;
					_ETCthis.EmailAddress = "";
				}, 100);
			},
			Validate: function(email) {
				var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
				return re.test(email);
			},
			EmailAddressExists: function()
			{
				return this.List.join("||--||").toLowerCase().split("||--||").indexOf(this.EmailAddress.toLowerCase()) > -1;
			},
			Send: function(e)
			{
				if( typeof e === "string" )
				{
					this.EmailAddress = e;
				}
				
				this.EmailAddress = $.trim(this.EmailAddress);
				
				if( typeof e === "object" && (e.hasOwnProperty("keyCode") && (e.keyCode == 27)) )
				{
					_ETCthis = this;
					_ETCthis.ShowList = false;
					_ETCthis.isVisible = false;
					_ETCthis.EmailAddress = "";
					_ETCthis.ValidationStatus = true;
				}
				else if( this.EmailAddress !== "" && this.Validate(this.EmailAddress) )
				{
					this.ValidationStatus = true;
					if( typeof e === "string" || typeof e === "object" && (e.keyCode == 13) )
					{
						if( !this.EmailAddressExists() )
						{
							this.List.push( this.EmailAddress );
							this.List = this.List.splice(-20);
							localStorage.ELQ_SP_ETC_List = JSON.stringify( this.List );
						}
						$scope.ELQ_SP_SendTestEmail(this.EmailAddress, this.AssetID);
						this.Close();
					}
				}
				else
				{
					if( this.EmailAddress !== "" )
						this.ValidationStatus = false;
					else
						this.ValidationStatus = true;
				}
			}
		};
		
		
		// START OF DEBUGGER
		$scope.ELQ_SP_Debugger = {
			
			isLoading: false,
			URL: "",
			Output: "",
			ShowResults: false,
			Show: function()
			{
				window.ELQ_SP_BtnClose_Click();
				$("#ELQ_SP_Debugger").css("opacity", 0).css("display","block");
				$("#ELQ_SP_Debugger").stop().animate({ opacity: 1 }, 250, function()
				{
					$("#ELQ_SP_TextBox_DebuggerURL").focus();
				});
			},
			Search: function(e)
			{
				if( e && (e.hasOwnProperty("keyCode") && (e.keyCode == 27)) )
					this.Close();
				else if( !this.isLoading && (!e || ( e && e.hasOwnProperty("keyCode") && (e.keyCode == 13) )) )
				{
					u = $scope.ELQ_SP_Debugger.URL;
					u += ( u.indexOf("?") > -1 ? "&" : "?" )+"xsrfToken="+window.xsrfToken;
					$scope.ELQ_SP_Debugger.isLoading = true;
					$scope.ELQ_SP_Debugger.Output = "";
					$http({
						method: 'GET',
						url: u
					}).then(function successCallback(response) {
						$scope.ELQ_SP_Debugger.isLoading = false;
						$scope.ELQ_SP_Debugger.Output = JSON.stringify(response);
						// this callback will be called asynchronously
						// when the response is available
					}, function errorCallback(response) {
						$scope.ELQ_SP_Debugger.Output = JSON.stringify(response);
						// called asynchronously if an error occurs
						// or server returns response with an error status.
					});
				}
			},
			Close: function()
			{
				$scope.ELQ_SP_Debugger.isLoading = false;
				$scope.ELQ_SP_Debugger.URL = "";
				$scope.ELQ_SP_Debugger.Output = "";
				$("#ELQ_SP_Debugger").css("opacity", 1);
				$("#ELQ_SP_Debugger").stop().animate({ opacity: 0 }, 250, function()
				{
					$("#ELQ_SP_Debugger").css("display","none");
				});
			}
			
		};
		//  END OF DEBUGGER
		
		$scope.safeApply = function(fn) {
			var phase = this.$root.$$phase;
			if(phase == '$apply' || phase == '$digest') {
				if(fn && (typeof(fn) === 'function')) {
					fn();
				}
			} else {
				this.$apply(fn);
			}
		};
		
		$scope.OpenUserGuide = function() {
			
		};
		
	});
	
	try {
		angbs = angular.bootstrap(ELQ_SP_App, ["ELQ_SP_App"]);
	}
	catch(err)
	{
		console.log("Catalyst bootstrap caused an error!");
	}

	var Ang_Scope = angular.element($("#ELQ_SP_App")).scope();
	if( Ang_Scope ) {
		Ang_Scope.safeApply( function()
		{
			Ang_Scope.ELQ_SP_CurrLoadMsgInd = 0;
			Ang_Scope.ELQ_SP_CurrLoadStage = 0;
			Ang_Scope.ELQ_SP_RotateLoadingMsgs();
		});
		
		$("#ELQ_SP_App").addClass("ELQ_SP_AngularLoaded");
			
		setTimeout( function()
		{
			window.postMessage({ type: "ELQ_SP_PAGESCRIPT", request: { ELQ_SP_Request: "LOAD_SETTINGS" } },"*");
			
			window.ELQ_SP_CheckSCReady();
			
			if( window.location.hostname == "localhost" )
			{
				setTimeout(function()
				{
					window.SC = {};
					setTimeout(function()
					{
						window.SC.isReady = true;
						setTimeout( function()
						{
							$("html").addClass("body-main-pane");
						}, 1000);
					}, 1000);
				}, 1000);
			}
			
		}, 250);
		
		$(document).keydown( function(e)
		{
			if( ELQ_SP_AppLoaded )
			{
				var Ang_Scope = angular.element($("#ELQ_SP_App")).scope();
				if( Ang_Scope.ELQ_SP_Settings.isExtnEnabled )
				{
					Ang_Scope.safeApply(function()
					{
						Ang_Scope.ELQ_SP_WinKeyDown(e);
					});
				}
			}
		});
		
	}
};

window.ELQ_SP_CheckAngReady = function()
{
	if( typeof window.angular !== "undefined" )
	{
		window.ELQ_SP_Abracadabra();
	}
	else
	{
		setTimeout( function()
		{
			ELQ_SP_CheckAngReady();
		}, 1);
	}
};

window.ELQ_SP_JQueryReady = false;

window.ELQ_SP_CheckJQReady = function()
{
	if( typeof window.jQuery !== "undefined" )
	{
		$(".ELQ_SP_Input").focus( function(e)
		{
			var a = Orion.getPathOrThrow("appNavigation.mainView");
			var c = Orion.getPathOrThrow("globalNavigation.globalSearchPanel");
			if( !c.isVisible )
			{
				c.popup(a, SC.PICKER_FIXED);
				c.becomeKeyPane();
				$(c._view_layer).css("top", "-1000px").css("right", "-1000px");
			}
		});
		$(".ELQ_SP_Input").click( function(e)
		{
			var a = Orion.getPathOrThrow("appNavigation.mainView");
			var c = Orion.getPathOrThrow("globalNavigation.globalSearchPanel");
			c.popup(a, SC.PICKER_FIXED);
			c.becomeKeyPane();
			$(c._view_layer).css("top", "-1000px").css("right", "-1000px");
			$(this).focus();
		});

		$(".ELQ_SP_Input").blur( function()
		{
			var a = Orion.getPathOrThrow("globalNavigation.globalSearchPanel");
			a.remove();
		});

		$(".ELQ_Draggable").each( function()
		{
			$(this).attr("onmousedown", "ELQ_SP_DragStart(event, '"+$(this).attr('data-dragtarget')+"', '"+$(this).attr('data-dragoffset')+"');");
		});
		
		window.ELQ_SP_CheckAngReady();
	}
	else
	{
		setTimeout( function()
		{
			ELQ_SP_CheckJQReady();
		}, 100);
	}
}
window.ELQ_SP_CheckJQReady();


window.indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;
window.IDBTransaction = window.IDBTransaction || window.webkitIDBTransaction || window.msIDBTransaction || {READ_WRITE: "readwrite"};
window.IDBKeyRange = window.IDBKeyRange || window.webkitIDBKeyRange || window.msIDBKeyRange;


window.ELQ_SP_AttemptedBSCachedLoad = false;

window.ELQ_SP_SCReadyTO = 0;
window.ELQ_SP_CheckSCReady = function()
{
	var Ang_Scope = angular.element($("#ELQ_SP_App")).scope();
	if( typeof window.SC !== "undefined" )
	{
		if( typeof window.SC.isReady !== "undefined" )
		{
			if( !window.ELQ_SP_AttemptedBSCachedLoad && SC.mode == "APP_MODE" )
			{
				//LOAD CACHED ELOQUA BOOTSTRAP...
				var ELQ_SP_OpenRequest = indexedDB.open("ELQ_BS_DB");
				var ELQ_SP_DB;
				ELQ_SP_OpenRequest.onupgradeneeded = function(e)
				{
					ELQ_SP_DB = e.target.result;
					if(!ELQ_SP_DB.objectStoreNames.contains("BootStrapData"))
					{
						ELQ_SP_DB.createObjectStore("BootStrapData", { autoIncrement: true });
						window.ELQ_SP_RefreshELQBSData(ELQ_SP_DB);
					}
				};
				ELQ_SP_OpenRequest.onsuccess = function(e) {
					ELQ_SP_DB = e.target.result;
					if(ELQ_SP_DB.objectStoreNames.contains("BootStrapData"))
					{
						var ELQ_SP_DBTRXN = ELQ_SP_DB.transaction(["BootStrapData"],"readonly");
						var ELQ_SP_DBSTORE = ELQ_SP_DBTRXN.objectStore("BootStrapData");
						var ELQ_SP_DBSTOREREQ = ELQ_SP_DBSTORE.getAll();
						ELQ_SP_DBSTOREREQ.onsuccess = function(e)
						{
							if( typeof e.target.result !== "undefined" && (e.target.result.length > 0) )
							{
								console.log("Loading cached Bootstrap data...");
								window.BSP = { data: e.target.result[0] };
								window.ELQ_SP_RefreshELQBSData(ELQ_SP_DB);
							}
							else
							{
								window.ELQ_SP_RefreshELQBSData(ELQ_SP_DB);
							}
						};
					}
				};
				ELQ_SP_AttemptedBSCachedLoad = true;
			}
			
			if( Ang_Scope.ELQ_SP_PreloaderClass == "ELQ_SP_Red" && Ang_Scope.ELQ_SP_CurrLoadStage == 1 )
			{
				Ang_Scope.safeApply( function()
				{
					Ang_Scope.ELQ_SP_PreloaderClass = "ELQ_SP_Yellow";
				});
			}
			if( $(".body-main-pane").length > 0 )
			{
				Ang_Scope.safeApply( function()
				{
					Ang_Scope.ELQ_SP_PreloaderClass = "ELQ_SP_Green";
					Ang_Scope.ELQ_SP_LoadingMsg = "Let's go...!!";
					Ang_Scope.ELQ_SP_StopRotateLoadingMsgs();
				});
				$("#ELQ_SP_App").addClass("ELQ_SP_AppInitSuccess");
				setTimeout( function()
				{
					if( ELQ_SP_ExtnIsFirstRun )
						window.ELQ_SP_Welcome();
					else if( ELQ_SP_ExtnVersionChange )
						window.ELQ_SP_CatalystUpdated();
					
					setTimeout( function()
					{
						Ang_Scope = angular.element($("#ELQ_SP_App")).scope();
						Ang_Scope.safeApply( function()
						{
							Ang_Scope.ELQ_SP_isLoading = false;
							Ang_Scope.ELQ_SP_LoadingMsg = "";
							Ang_Scope.ELQ_SP_PreloaderClass = "ELQ_SP_Default";
							$("#ELQ_SP_App").addClass("ELQ_SP_HideLoader");
						});
					}, 500);
					if( ELQ_SP_ExtnIsEnabled )
						window.ELQ_SP_TweakELQFunctions();
					ELQ_SP_AppLoaded = true;
				}, 1000);
			}
			else
			{
				window.ELQ_SP_SCReadyTO = setTimeout(function()
				{
					window.ELQ_SP_CheckSCReady();
				}, 50);
			}
		}
		else
		{
			window.ELQ_SP_SCReadyTO = setTimeout(function()
			{
				window.ELQ_SP_CheckSCReady();
			}, 50);
		}
	}
	else
	{
		window.ELQ_SP_SCReadyTO = setTimeout(function()
		{
			window.ELQ_SP_CheckSCReady();
		}, 50);
	}
};

window.ELQ_SP_UpdatingBSData = false;

window.ELQ_SP_RefreshELQBSData = function(ELQ_SP_DB)
{
	if(!window.ELQ_SP_UpdatingBSData) {
		window.ELQ_SP_UpdatingBSData = true;
		console.log("Attempting to download latest Bootstrap data for cached load...");
		var bootReqUrl="/API/REST/2.0/internal/eloquaUI/bootstrapPackage?xsrfToken="+window.xsrfToken;
		var bootReq = new XMLHttpRequest();
		bootReq.onreadystatechange = function()
		{
			var data = bootReq.responseText;
			if( bootReq.readyState == 4 && bootReq.status === 200 )
			{
				if(data)
				{
					try {
						JSONData = JSON.parse(data);
						
						var ELQ_SP_DBTRXN = ELQ_SP_DB.transaction(["BootStrapData"],"readwrite");
						var ELQ_SP_DBSTORE = ELQ_SP_DBTRXN.objectStore("BootStrapData");
						var ELQ_SP_DBSTOREREQ = ELQ_SP_DBSTORE.clear();
						ELQ_SP_DBSTOREREQ.onsuccess = function(e)
						{
							var ELQ_SP_DBTRXN = ELQ_SP_DB.transaction(["BootStrapData"],"readwrite");
							var ELQ_SP_DBSTORE = ELQ_SP_DBTRXN.objectStore("BootStrapData");
							var ELQ_SP_DBSAVEREQ = ELQ_SP_DBSTORE.put(JSONData);
							ELQ_SP_DBSAVEREQ.onsuccess = function()
							{
								console.log("Bootstrap data successfully cached!");
							};
						};
					}
					catch(err) {
						console.log("Error parsing Bootstrap data!");
					}
				}
				else
				{
					console.log("Error in network connectivity: "+bootReq.statusText);
				}
			}
			else
			{
				if( bootReq.readyState == 4 && bootReq.status !== 200 )
				{
					console.log("Failed to download Bootstrap data for cached load: " + bootReq.status);
				}
			}
		};
		bootReq.ontimeout = function()
		{
			console.log("Failed to download Bootstrap data for cached load: Request timed out!");
		};
		bootReq.onerror = function(e)
		{
			console.log("Failed to download Bootstrap data for cached load - Error in network connectivity: "+bootReq.statusText);
		};
		bootReq.overrideMimeType("text/plain");
		bootReq.open("GET",bootReqUrl,true);
		bootReq.setRequestHeader("Accept","application/json");
		bootReq.timeout=60000*5;
		bootReq.send();
	}
};

window.onmessage = function(event) {
	//if( event.origin == "http://localhost" )
	//{
		if( event.data.type && (event.data.type == "ELQ_SP_CONTENTSCRIPT") )
		{
			if( event.data.request )
			{
				switch( event.data.request.ELQ_SP_Request )
				{
					/*case "EXTNID":
						window.ELQ_SP_ExtnID = event.data.request.ELQ_SP_ExtnID;
					break;*/
					case "KEYDOWN":
					{
						if( ELQ_SP_AppLoaded )
						{
							var Ang_Scope = angular.element($("#ELQ_SP_App")).scope();
							if( Ang_Scope.ELQ_SP_Settings.isExtnEnabled )
							{
								Ang_Scope.safeApply(function()
								{
									Ang_Scope.ELQ_SP_WinKeyDown(event.data.request.ELQ_SP_Event);
								});
							}
						}
					}
					break;
					case "REFRESH_SETTINGS":
						var Ang_Scope = angular.element($("#ELQ_SP_App")).scope();
						
						firstRun = false;
						if( typeof Ang_Scope.ELQ_SP_Settings.version === "undefined" )
							firstRun = true;
						
						Ang_Scope.$apply( function()
						{
							if( typeof event.data.request.ELQ_SP_Settings === "string" )
								Ang_Scope.ELQ_SP_Settings = $.parseJSON(event.data.request.ELQ_SP_Settings);
							else if( typeof event.data.request.ELQ_SP_Settings === "object" )
							{
								Ang_Scope.ELQ_SP_Settings = event.data.request.ELQ_SP_Settings;
							}
							
							if( Ang_Scope.ELQ_SP_Settings.isExtnEnabled )
							{
								$("#ELQ_SP_App").removeAttr("style");
								if( ELQ_SP_AppLoaded )
									ELQ_SP_TweakELQFunctions();
								
								ELQ_SP_ExtnIsEnabled = true;
							}
							else
							{
								ELQ_SP_ExtnIsEnabled = false;
								ELQ_SP_RevertELQFunctions();
							}
							
							if( firstRun )
							{
								ELQ_SP_ExtnVersion = Ang_Scope.ELQ_SP_Settings.version;
								console.log( "Catalyst: Eloqua Extension - Load complete... Version: "+Ang_Scope.ELQ_SP_Settings.version );
							}
							
							$("#ELQ_SP_BtnUserGuide").attr("onclick", "window.open('"+Ang_Scope.ELQ_SP_Settings.guideURL+"');");
						});
					break;
					case "EXTN_STATUS":
					{
						window.ELQ_SP_ExtnIsEnabled = event.data.request.ELQ_SP_Settings;
						if( !event.data.request.ELQ_SP_Settings )
						{
							$("#ELQ_SP_App").css("display", "none");
						}
						else
						{
							console.log("Catalyst: Eloqua Extension - Initializing the awesomeness...");
						}
					}
					break;
					case "VERSION_CHANGE":
					{
						window.ELQ_SP_ExtnVersionChange = true;
						window.ELQ_SP_ExtnVersionUpdates = event.data.request.ELQ_SP_Updates;
					}
					break;
					case "FIRST_RUN":
						window.ELQ_SP_ExtnIsFirstRun = true;
					break;
					case "PASTE_CALLBACK":
						pastedValue = event.data.request.ELQ_SP_PastedValue;
						
						ae = document.activeElement;
						if( typeof ae !== "undefined" && typeof pastedValue !== "undefined" )
						{
							if( $(ae).hasClass("ELQ_SP_Input") )
							{
								ss = ae.selectionStart;
								se = (ae.selectionEnd == 0) ? ss : ae.selectionEnd;
								ev = ae.value;
								$(ae).val( ev.substr(0,ss)+pastedValue+ev.substr(se) );
								ae.selectionStart = ss+pastedValue.length;
								ae.selectionEnd = ss+pastedValue.length;
								
								ELQ_SP_ScrollTextboxTo(ae,ae.selectionStart,ae.selectionEnd,1);
								
								window.ELQ_SP_UpdateTextboxModels({
									target: ae,
									which: 86,
									preventDefault: function() {  },
									stopPropagation: function() {  },
									stopImmediatePropagation: function() {  },
								});
								return false;
							}
						}
					break;
				}
			}
		}
	//}
};

window.ELQ_SP_TweakELQFunctions = function()
{
	if( !ELQ_SP_ELQ_FunctionsTweaked )
	{
		$.each( ELQ_SP_TweakedELQStateChartFunctions, function(k,v)
		{
			ELQ_SP_OriginalELQStateChartFunctions.push({
				state: v.state,
				property: v.property,
				val: Orion.Statechart.getState(v.state)[v.property]
			});
			Orion.Statechart.getState(v.state)[v.property] = v.val;
		});
		
		$.each( ELQ_SP_TweakedELQFunctions, function(k,v)
		{
			modelNodes = v.model.split("||");
			currObj = window;
			for(i=0;i<modelNodes.length-1;i++)
			{
				currObj = currObj[modelNodes[i]];	
			}
			ELQ_SP_OriginalELQFunctions.push({
				model: v.model,
				val: currObj[modelNodes[modelNodes.length-1]]
			});
			currObj[modelNodes[modelNodes.length-1]] = v.val;
		});		
	}
	
	EmB = Orion.Statechart.getState("emailBase");
	EmB.enterState();
	
	if( EmB.allowedPostMessageEvents.indexOf("receiveAssetHTML") < 0 )
		EmB.allowedPostMessageEvents.push("receiveAssetHTML");
	if( EmB.allowedPostMessageEvents.indexOf("AssetIDUpdated") < 0 )
		EmB.allowedPostMessageEvents.push("AssetIDUpdated");
	
	Orion.setValidPostMessageEvents(EmB.allowedPostMessageEvents);
	
	EmB.receiveAssetHTML = function(ac)
	{
		var Ang_Scope = angular.element($("#ELQ_SP_App")).scope();
		Ang_Scope.safeApply( function()
		{
			Ang_Scope.ELQ_SP_ValidateAssetHTML({HTML: ac.HTML, saveBtn: Orion.emailMenuBarsPage.designMenuBar.saveButton, AssetType:"Email", AssetIDUpdated: false});
		});
	};
	EmB.AssetIDUpdated = function(ac)
	{
		var Ang_Scope = angular.element($("#ELQ_SP_App")).scope();
		Ang_Scope.safeApply( function()
		{
			Ang_Scope.ELQ_SP_ValidateAssetHTML({HTML: ac.HTML, saveBtn: Orion.emailMenuBarsPage.designMenuBar.saveButton, AssetType:"Email", AssetIDUpdated: true});
		});
	};
	
	
	LpB = Orion.Statechart.getState("landingPageBase");
	LpB.enterState();
	
	if( LpB.allowedPostMessageEvents.indexOf("receiveAssetHTML") < 0 )
		LpB.allowedPostMessageEvents.push("receiveAssetHTML");
	if( LpB.allowedPostMessageEvents.indexOf("AssetIDUpdated") < 0 )
		LpB.allowedPostMessageEvents.push("AssetIDUpdated");
	
	Orion.setValidPostMessageEvents(LpB.allowedPostMessageEvents);
	
	LpB.receiveAssetHTML = function(ac)
	{
		var Ang_Scope = angular.element($("#ELQ_SP_App")).scope();
		Ang_Scope.safeApply( function()
		{
			Ang_Scope.ELQ_SP_ValidateAssetHTML({HTML: ac.HTML, saveBtn: Orion.landingPageMenuBarsPage.designMenuBar.saveButton, AssetType:"LP", AssetIDUpdated: false});
		});
	};
	LpB.AssetIDUpdated = function(ac)
	{
		var Ang_Scope = angular.element($("#ELQ_SP_App")).scope();
		Ang_Scope.safeApply( function()
		{
			Ang_Scope.ELQ_SP_ValidateAssetHTML({HTML: ac.HTML, saveBtn: Orion.landingPageMenuBarsPage.designMenuBar.saveButton, AssetType:"LP", AssetIDUpdated: true});
		});
	};
	
	Orion.Statechart.getState("campaignDesignReady").enterState();
	
	ELQ_SP_RigCampaignRightMenu();
	
	ELQ_SP_ELQ_FunctionsTweaked = true;
};

window.ELQ_SP_RevertELQFunctions = function()
{
	if( ELQ_SP_OriginalELQStateChartFunctions.length == ELQ_SP_TweakedELQStateChartFunctions.length && ELQ_SP_OriginalELQFunctions.length == ELQ_SP_TweakedELQFunctions.length )
	{
		Orion.campaignPage.get("campaignCanvasView").set("layout", { left: 0, top: 0, bottom: 0, minWidth: 2000, minHeight: 2000 });
		
		$.each( ELQ_SP_OriginalELQStateChartFunctions, function(k,v)
		{
			Orion.Statechart.getState(v.state)[v.property] = v.val;
		});
		
		$.each( ELQ_SP_OriginalELQFunctions, function(k,v)
		{
			modelNodes = v.model.split("||");
			currObj = window;
			for(i=0;i<modelNodes.length-1;i++)
			{
				currObj = currObj[modelNodes[i]];	
			}
			currObj[modelNodes[modelNodes.length-1]] = v.val;
		});	
		
		pages = ["basicCampaignMenuBarsPage","campaignMenuBarsPage","emailMenuBarsPage","landingPageMenuBarsPage","segmentMenuBarsPage","formMenuBarsPage"];
		
		for(i=0;i<pages.length;i++)
		{
			targetObj = Orion[pages[i]];
			if( targetObj )
			{
				if( targetObj.hasOwnProperty("designMenuBar") )
				{
					if( targetObj.designMenuBar.hasOwnProperty("title") && targetObj.designMenuBar.hasOwnProperty("ELQ_SP_NG_Bound") && targetObj.designMenuBar.hasOwnProperty("ELQ_SP_OrgBeginEditingFunction") )
					{
						delete targetObj.designMenuBar.ELQ_SP_NG_Bound;
						targetObj.designMenuBar.title.beginEditing = targetObj.designMenuBar.ELQ_SP_OrgBeginEditingFunction;
					}
				}
				if( targetObj.hasOwnProperty("reportMenuBar") )
				{
					if( targetObj.reportMenuBar.hasOwnProperty("title") && targetObj.reportMenuBar.hasOwnProperty("ELQ_SP_NG_Bound") && targetObj.reportMenuBar.hasOwnProperty("ELQ_SP_OrgBeginEditingFunction") )
					{
						delete targetObj.reportMenuBar.ELQ_SP_NG_Bound;
						targetObj.reportMenuBar.title.beginEditing = targetObj.reportMenuBar.ELQ_SP_OrgBeginEditingFunction;
					}
				}
			}
		}	
		
		ELQ_SP_ELQ_FunctionsTweaked = false;
	}
};


window.ELQ_SP_RigCampaignRightMenu = function()
{
	Orion.catalystCampaignToolsController = SC.ArrayController.create({
		content: [
			{
				name: "Search Campaign Canvas (Ctrl + F)",
				id: "ELQ_SP_CampaignTools_Search",
				action: function(){
					var Ang_Scope = angular.element($("#ELQ_SP_App")).scope();
					if( Ang_Scope.ELQ_SP_Settings.isExtnEnabled )
					{
						Ang_Scope.safeApply( function()
						{
							Ang_Scope.ELQ_SP_CampaignSearch.isEnabled = true;
							Ang_Scope.ELQ_SP_CampaignSearch.Init();
						});
					}
					else
						alert("Catalyst is inactive! Re-enable Catalyst or exit this view to remove this control.");
					Orion.sendAction("closeRightMenu");
					Orion.campaignPage.designerView.mainView.childViews[0].contentView.contentView.becomeFirstResponder();
				}
			},
			{
				name: "Switch to Extended Canvas (4000px X 4000px)",
				id: "ELQ_SP_CampaignTools_ExtendedCanvas",
				action: function(){
					var Ang_Scope = angular.element($("#ELQ_SP_App")).scope();
					if( Ang_Scope.ELQ_SP_Settings.isExtnEnabled )
					{
						if( ELQ_SP_ExtendedCanvas )
						{
							txt = "Switch to Extended Canvas (4000px X 4000px)";
							d = 2000;
						}
						else
						{
							txt = "Switch to Normal Canvas (2000px X 2000px)";
							d = 4000;
						}
						Orion.campaignPage.get("campaignCanvasView").set("layout", { left: 0, top: 0, bottom: 0, minWidth: d, minHeight: d });
						$("#ELQ_SP_CampaignTools_ExtendedCanvas").text(txt).attr("title", txt);
						ELQ_SP_ExtendedCanvas = !ELQ_SP_ExtendedCanvas;
					}
					else
						alert("Catalyst is inactive! Re-enable Catalyst or exit this view to remove this control.");
					Orion.sendAction("closeRightMenu");
					Orion.campaignPage.designerView.mainView.childViews[0].contentView.contentView.becomeFirstResponder();
				}
			}
		],
		bindToAssetController: function(b, a) {
			this._binding = SC.Binding.from(a, b).to("content", this).oneWay();
			this._binding.connect()
		},
		unbindToAssetController: function(b, a) {
			if (this._binding) {
				this._binding.disconnect();
				delete this._binding
			}
		},
		arrangedObjects: function() {
			var a = this.get("content") || [];
			return a
		}.property("content").cacheable()
	});

	Orion.CatalystCampaignToolsItemView = SC.View.extend({
		classNames: "cloud-app-item catalyst-campaign-tools-item".w(),
		content: null,
		displayProperties: "content".w(),
		render: function(a, e) {
			var b = this.get("content");
			a = a.begin("div").attr("title", b.name).attr("id",b.id).text(b.name).end();
		},
		mouseDown: function(a) {
			this._InMouseDown = true
		},
		mouseUp: function(a) {
			if (!this._InMouseDown) {
				return
			}
			var b = this.get("content");
			b.action();
			this._InMouseDown = false;
		}
	});

	Orion.campaignRightMenuContentPage.catalystCampaignToolsMenuView = Orion.ScrollView.extend({
		classNames: "cloud-app-list".w(),
		layout: {
			left: 10,
			right: 10,
			top: 36,
			bottom: 10
		},
		floating: YES,
		contentView: SC.ListView.extend({
			layout: {
				left: 0,
				right: 0,
				top: 10,
				bottom: 0
			},
			rowSpacing: 0,
			rowHeight: 30,
			exampleView: Orion.CatalystCampaignToolsItemView,
			selectionBinding: SC.Binding.from("Orion.cloudAppsLauncherController.selection"),
			contentBinding: SC.Binding.oneWay("Orion.catalystCampaignToolsController.arrangedObjects")
		})
	});

	Orion.campaignController.rightMenuItems = function() {
		var h = !Orion.get("isPopup");
		var e = this.getPath("cloudMenuItems.length") > 0;
		var a = this.getPath("operationalReportMenuItems.length"),
			g = this.getPath("reportMenuContent.length");
		var f = (a > 0 || g > 0) && this.get("id") > 0;
		var c = [];
		c.push({
			title: "_Campaign Settings".loc(),
			value: "campaignInfoMenuView",
			icon: "ic-list"
		});
		if (h && e) {
			c.push({
				title: "_Apps".loc(),
				value: "campaignCloudAppsMenuView",
				icon: "ic-cloud"
			})
		}
		if (h && f) {
			var b = "";
			if (a > 0 && g > 0) {
				b = "_Reports".loc()
			} else {
				if (a > 0) {
					b = "_Operational Reports".loc()
				} else {
					if (g > 0) {
						b = "_Insight Reports".loc()
					}
				}
			}
			c.push({
				title: b,
				value: "campaignOperationalReportsMenuView",
				icon: "ic-chart-button"
			})
		}
		if( ELQ_SP_ExtnIsEnabled )
		{
			c.push({
					title: "Catalyst Campaign Tools",
					value: "catalystCampaignToolsMenuView",
					icon: "ic-activity"
				})
		}
		return c
	}.property("operationalReportMenuItems", "cloudMenuItems", "reportMenuContent","ELQ_SP_CampaignTimelineItems").cacheable();
};


window.ELQ_SP_ShowTour = function(step)
{
	switch( step )
	{
		case 1:
		{
			window.ELQ_SP_CloseMessage();
			$("body").append(
							"<div class='ELQ_SP_Lightbox' id='ELQ_SP_IntroLightbox' style='bottom: 70px; left: 15px; display: none;'>"+
								"<div class='ELQ_SP_LB_Header'>"+
	"<img id='ELQ_SP_LightBox_Emoji' src='"+ELQ_SP_ImgLoc+"/%7Bcd0005aa-f56f-4844-a28d-c4403ec7c3fe%7D_HappyFace.png' style='height: 24px; width: auto; margin-right: 10px; vertical-align: top;'/>"+
									"Hi "+Orion.currentUserController.get("name")+"!"+
								"</div>"+
								"<div class='ELQ_SP_LB_Content'>"+
									"Click on the <span class='ELQ_SP_Strong'>Idea</span> icon below to access the Console. Everything you need to know is right here.<br/><br/>"+
									"Since this is no rocket science, I'm going to let you explore it on your own. In case you need help, please refer to the <strong>User Guide</strong> (also available in the Console). Adios!<br/><br/>"+
									"<span class='ELQ_SP_Hyperlink' onclick='$(\"#ELQ_SP_IntroLightbox\").remove();'>Okay, got it!</span>"+
								"</div>"+
							"</div>"
							);
			$("#ELQ_SP_IntroLightbox").css("display", "block");
			setTimeout( function()
			{
				$("#ELQ_SP_IntroLightbox").addClass("ELQ_SP_LB_Show");
			}, 125);
		}
		break;
	}
};


window.ELQ_SP_CampaignTracks = [];