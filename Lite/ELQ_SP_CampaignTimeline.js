window.ELQ_SP_CSim_Prototype = function(scope, http, timeout)
{
	CSim = {
		E: [],
		CampaignTracks: {},
		TracksCount: -1,
		isValidCampSD: function()
		{
			if( Object.prototype.toString.call(this.CampSDCtrl) === "[object Date]" && (!isNaN(this.CampSDCtrl.getTime())) )
				return true;
			else
			{
				//this.ClearSelectedEntryPoint();
				//this.ContactSearch.ClearSelectedContact(false);
			}
		},
		getUTCDateFromCtrl: function()
		{
			if( this.isValidCampSD() )
			{
				camp_tzo = 0;
				
				if( this.Timezones.hasOwnProperty(parseInt(this.CampTZInd)) )
				{
					camp_tzo = parseInt(this.Timezones[parseInt(this.CampTZInd)].utcOffset) * 60;
					if( this.Timezones[parseInt(this.CampTZInd)].hasOwnProperty("dstOffset") )
						camp_tzo += parseInt(this.Timezones[parseInt(this.CampTZInd)].dstOffset)*60;
				}
				
				tzo = this.CampSDCtrl.getTimezoneOffset() * 60000;
				camp_tzo *= 1000;
				return new Date( this.CampSDCtrl.valueOf() + tzo + camp_tzo );
			}
			else
				return false;	
		},
		updateCampaignTimezone: function()
		{
			this.CampSD = this.getUTCDateFromCtrl();
			this.UpdateDateOnCanvas();
		},
		CampTZInd: "0",
		CampSDCtrl: undefined,
		CampSD: undefined,
		CurrDate: undefined,
		CSimEl: { height: 55, width: 250 },
		isVisible: false,
		isLoading: false,
		isCollectingData: false,
		simulationMode: false,
		CompletedNodes: [],
		CompletedNodePaths: [],
		CampaignName: "(Local Campaign Data)",
		ExtremeRight: 0,
		ExtremeBottom: 0,
		allowStepSelection: false,
		Scenario: [],
		ShowScenariosList: false,
		ScenarioSteps: {},
		SelectedContacts: [],
		ContactToStep: -1,
		haslistMembershipStep: false, hasfilterMembershipStep: false, hasCustomObjectFieldComparisonStep: false,
		hasContactFieldComparisonStep: false,
		listMembershipsDone: false, filterMembershipsDone: false, cdoRecordsDone: false, contactDataDone: false,
		CSD: {},
		Timezones: [],
		FormatUnixTimestamp: function( UNIX_timestamp, isDateVar ) {
			if( UNIX_timestamp )
			{
				var a = new Date();
				js_tzo = a.getTimezoneOffset() * 60;
				if( this.Timezones.hasOwnProperty(parseInt(this.CampTZInd)) )
				{
					camp_tzo = parseInt(this.Timezones[parseInt(this.CampTZInd)].utcOffset) * 60;
					if( this.Timezones[parseInt(this.CampTZInd)].hasOwnProperty("dstOffset") )
						camp_tzo += parseInt(this.Timezones[parseInt(this.CampTZInd)].dstOffset)*60;
				}
				else
					camp_tzo = 0;
				
				a = new Date((UNIX_timestamp-js_tzo-camp_tzo) * 1000);
				var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
				var year = a.getFullYear();
				var month = months[a.getMonth()];
				var date = a.getDate();
				var hour = a.getHours();
				var min = a.getMinutes();
				var sec = a.getSeconds();
				if( isDateVar )
					var time = new Date(date + ' ' + month + ' ' + year + ' ' + hour + ':' + min + ':' + sec);
				else
				{
					AMPM = (hour > 11) ? "PM" : "AM";
					HR = (hour > 12) ? hour - 12 : ( hour == 0 ? 12 : hour );
					var time = ("0"+date).slice(-2) + '-' + month.toUpperCase() + '-' + year + ' ' + ("0"+HR).slice(-2) + ':' + ("0"+min).slice(-2) + ':' + ("0"+sec).slice(-2)+" "+AMPM;
					
				}
				return time;
			}
			else
				return "Unknown";
		},
		UpdateDateOnCanvas: function()
		{
			_this = this;
			$.each( _this.E, function(k,v)
			{
				if( v.hasOwnProperty("stepEnterDate") )
					delete v.stepEnterDate;
				if( v.hasOwnProperty("stepExitDate") )
					delete v.stepExitDate;
			});
			$.each( _this.E, function(k,v)
			{
				if( v.isParentNode )
				{
					v.stepEnterDate = v.stepExitDate = _this.CampSD.valueOf()/1000;
					if( v.hasOwnProperty("outputTerminals") )
					{
						for(var ud=0;ud<v.outputTerminals.length;ud++)
						{
							step = jQuery.grep(_this.E, function( eoBj, eInd ) {
								return ( eoBj.id == v.outputTerminals[ud].connectedId );
							});
							if( step.length > 0 )
								_this.UpdatestepEnterDateofChild( step[0], _this.CampSD.valueOf()/1000 );
						}
					}
				}
			});
		},
		UpdatestepEnterDateofChild: function(step, parentExitDate)
		{
			if( !step.hasOwnProperty("stepEnterDate") )
			{
				step.stepEnterDate = parentExitDate;
				switch( step.type )
				{
					case "CampaignEmail":
					{
						sendTimeLength = 0;
						switch( step.sendTimePeriod )
						{
							case "sendAllEmailAtOnce":
								sendTimeLength = 0;
							break;
							case "sendEmailsOverANumberOfHours":
								sendTimeLength = parseFloat( step.sendTimeLength ) * 3600;
							break;
							case "sendEmailsOverANumberOfDays":
								sendTimeLength = parseFloat( step.sendTimeLength ) * 86400;
							break;
						}
						
						scheduleOffset = 0;
						if( step.hasOwnProperty("schedule") )
						{
							dtz_obj = $.grep( this.Timezones, function(v,k)
							{
								return ( v.id == step.schedule.displayTimeZoneId );
							});
							if( dtz_obj.length > 0 )
							{
								dtz = dtz_obj[0].utcOffset * 60;
								if( dtz_obj[0].hasOwnProperty("dstOffset") )
									dtz += dtz_obj[0].dstOffset * 60;
							}
							else
								dtz = 0;
							
							var camp_tzo = 0;
							if( this.Timezones.hasOwnProperty(parseInt(this.CampTZInd)) )
							{
								camp_tzo = parseInt(this.Timezones[parseInt(this.CampTZInd)].utcOffset) * 60;
								if( this.Timezones[parseInt(this.CampTZInd)].hasOwnProperty("dstOffset") )
									camp_tzo += parseInt(this.Timezones[parseInt(this.CampTZInd)].dstOffset)*60;
							}
							
							var a = new Date();
							var tzo = a.getTimezoneOffset()*60;
							
							parSD = new Date((parentExitDate-tzo-camp_tzo) * 1000);
							var dayOfWeek = parSD.getDay();
							secsPassedOfDay = (parSD.getHours()*3600)+(parSD.getMinutes()*60)+parSD.getSeconds();
							totalSecsSinceWeekStart = (dayOfWeek*86400) + secsPassedOfDay;
							
							sch_els = step.schedule.elements;
							first_day = sch_els[0];
							for(var sch_i=0;sch_i<sch_els.length;sch_i++)
							{
								if( totalSecsSinceWeekStart < parseInt(sch_els[sch_i].relativeStart) )
								{
									first_day = sch_els[sch_i];
									sch_i = sch_els.length + 1;
								}
							}
							
							scheduleOffset = parseInt(first_day.relativeStart) - totalSecsSinceWeekStart - dtz + camp_tzo;
							scheduleOffset = scheduleOffset < 0 ? 0 : scheduleOffset;
						}
						step.stepEnterDate = parentExitDate;
						step.stepExitDate = step.stepEnterDate + sendTimeLength + scheduleOffset;
					}
					break;
					case "CampaignWaitAction":
					{
						if( step.hasOwnProperty("waitFor") )
							step.stepExitDate = parentExitDate + parseInt(step.waitFor);
						else if( step.hasOwnProperty("waitUntil") )
							step.stepExitDate = ( parentExitDate <= step.waitUntil ) ? parseInt(step.waitUntil) : parentExitDate;
					}
					break;
					default:
					{
						step.stepExitDate = parentExitDate;
					}
				}
				
				if( step.hasOwnProperty("outputTerminals") )
				{
					for(var udc=0;udc<step.outputTerminals.length;udc++)
					{
						childStep = jQuery.grep(_this.E, function( eoBj, eInd ) {
							return ( eoBj.id == step.outputTerminals[udc].connectedId );
						});
						if( childStep.length > 0 )
							this.UpdatestepEnterDateofChild( childStep[0], step.stepExitDate );
					}
				}
			}
			else
				return;
		},
		Close: function()
		{
			$("#ELQ_SP_CSim_SVG path").remove();
			this.CampaignTracks = {};
			this.TracksCount = -1;
			this.isVisible = false;
		},
		Init: function()
		{
			this.isVisible = true;
			this.isLoading = true;
			_this = this;
			
			this.CampSDCtrl = new Date("20 Jul 2017 10:00:00");
			
			this.CampaignName = Orion.campaignController.get("name");
			
			cUserTZ = CoreOrion.store.dataHashes[ CoreOrion.currentUser.storeKey ].preferences.timezoneId;
			
			TimeZonesStoreKeys = CoreOrion.TimeZone.storeKeysById();
			_this.Timezones = [];
			$.each( TimeZonesStoreKeys, function(k,v)
			{
				tz = angular.merge({}, CoreOrion.store.dataHashes[v]);
				tz.utcOffset = parseInt(tz.utcOffset);
				_this.Timezones.push( tz );
			});
			
			this.Timezones.sort( function(a,b)
			{
				return (parseInt(a.displayOrder) > parseInt(b.displayOrder)) ? 1 : -1;
			});
			
			for(var tzi=0; tzi<this.Timezones.length; tzi++)
			{
				if( this.Timezones[tzi].id == cUserTZ )
					_this.CampTZInd = ""+tzi;
			}
			
			this.UpdateDateOnCanvas();
			
			CCElements = Orion.campaignElementsController.get("content").toArray();
			this.E = [];
			for(ci=0;ci<CCElements.length;ci++)
				this.E.push( CoreOrion.store.dataHashes[ CCElements[ci].storeKey ] );
			
			this.hasScenarioNode = false;
			$.each( _this.E, function(k,v)
			{
				vMBK = Orion.campaignPage.mainView.contentView.mainView._contentView.contentView.contentView._viewModelByKeys;
				
				if( vMBK.hasOwnProperty(v.id+"_"+v.type) )
				{
					v.name = vMBK[v.id+"_"+v.type].name;
					v.desc = vMBK[v.id+"_"+v.type].descriptionText;
				}
				
				hasParentNode = false; parentNode = false;
				switch(v.type)
				{
					case "CampaignEmailSentRule":
					case "CampaignEmailOpenedRule":
					case "CampaignEmailClickthroughRule":
					case "CampaignSubmitFormRule":
					case "CampaignWebsiteVisitRule":
						v.isScenarioNode = true;
						_this.hasScenarioNode = true;
					break;
					default:
						v.isScenarioNode = false;
				}
				
				if( "||CampaignSegment||CampaignInput||CampaignCloudFeeder||".indexOf(v.type) > -1 && v.hasOwnProperty("outputTerminals") && (v.outputTerminals.length > 0) )
				{
					_this.TracksCount++;
					v.isParentNode = true;
					_this.CampaignTracks[_this.TracksCount] = v;
				}
			});

			
			evaluationResult = _this.EvaluateTracks();
			if( _this.CampaignTracks )
			{
				_this.SetupView();
			}
			
			this.isLoading = false;
		},
		GetScenarioFromUser: function()
		{
			//GET START DATE
			//GET EMAIL SENT, CLICKED, OPENED, WEB VISIT, FORM SUBMIT SETTINGS
			//START MUSIC!!!
		},
		EvaluateTracks: function()
		{
			trackEls = [];
			evaluationResult = { allOkay: true, msg: "Relax - Everything is fine!" };
			$.each( this.CampaignTracks, function(trackKey,track)
			{
				trackResult = { allOkay: true, msg: "Relax - everything is fine!" };
				if( Object.keys(track).length > 0 )
				{
					if( "||CampaignSegment||CampaignInput||CampaignCloudFeeder||".indexOf(track.type) > -1 )
					{
						isListMember = "CampaignContactListMembershipRule";
						emailSentRule = "CampaignEmailSentRule";
						emailOpenedRule = "CampaignEmailOpenedRule";
						clickThroughRule = "CampaignEmailClickthroughRule";
						filterMembershipRule = "CampaignContactFilterMembershipRule";
						formSubmitRule = "CampaignSubmitFormRule";
						webVisitRule = "CampaignWebsiteVisitRule";
						contactFieldComparison = "CampaignContactFieldComparisonRule";
						customObjectFieldComparison = "CampaignCustomObjectFieldComparisonRule";
						addToContactList = "CampaignAddToContactListAction";
						moveToContactList = "CampaignMoveToContactListAction";
						removeFromContactList = "CampaignRemoveFromContactListAction";
						addToCampaign = "CampaignAddToCampaignAction";
						moveToCampaign = "CampaignMoveToCampaignAction";
						addToProgramBuilder = "CampaignAddToProgramBuilderAction";
						moveToProgramBuilder = "CampaignMoveToProgramBuilderAction";
						addToProgram = "CanvasAddToProgramAction";
						moveToProgram = "CanvasMoveToProgramAction";
						wait = "CampaignWaitAction";
					}
					else
					{
						trackResult = false;
						return false;
					}
				}
				else
				{
					trackResult = false;
					return false;
				}
				
				if( !trackResult )
					delete track;
			});
			
			if( Object.keys(_this.CampaignTracks).length == 0 )
				evaluationResult = { allOkay: false, msg: "There are no valid tracks in the Campaign!" };
			
			return evaluationResult;
		},
		SetupView: function()
		{
			_this = this;
			_this.ExtremeBottom = 0;
			_this.ExtremeRight = 0;
			
			//CALCULATE EXTREME RIGHT AND BOTTOM ELEMENTS FOR EXTRA SCROLL SPACE ON THE CANVAS
			$.each(this.E, function(k,v){
				
				//DRAW CONNECTING LINES ON SVG FOR EACH STEP WITH IT'S CHILD NODES
				_this.DrawConnectingLines(v);
				isReportingOnly = "||CampaignLandingPage||CampaignForm||".indexOf(v.type) > -1;
				if( !isReportingOnly )
				{
					if( _this.ExtremeBottom < parseInt(v.position.y) )
						_this.ExtremeBottom = parseInt(v.position.y);
					if( _this.ExtremeRight < parseInt(v.position.x) )
						_this.ExtremeRight = parseInt(v.position.x);
				}
			});
			
			_this.ExtremeBottom += window.innerHeight-180+this.CSimEl.height;
			_this.ExtremeRight += window.innerWidth-60+this.CSimEl.width;
			
			$("#ELQ_SP_CSim_SVG").attr("width", _this.ExtremeRight).attr("height", _this.ExtremeBottom);
		},
		DrawConnectingLines: function(node)
		{
			_this = this;
			
			if( node.hasOwnProperty("outputTerminals") && ( Object.keys(node.outputTerminals).length > 0 ) )
			{
				for(oi=0;oi<node.outputTerminals.length;oi++)
				{
					v = jQuery.grep(_this.E, function( eoBj, eInd ) {
						return ( eoBj.id == node.outputTerminals[oi].connectedId );
					});
					if( v.length > 0 )
					{
						var svg = document.getElementById('ELQ_SP_CSim_SVG'); //Get svg element
						var newElement = document.createElementNS("http://www.w3.org/2000/svg", 'path');
						
						switch( node.outputTerminals[oi].terminalType )
						{
							case "no": xpos = 15; strokeColor = "#f3ac7a"; break;
							case "yes": xpos = 40; strokeColor = "#89c7ad"; break;
							default: xpos = 30; strokeColor = "#537fa8";
						}
						
						x1 = parseInt(node.position.x)+xpos;
						y1 = parseInt(node.position.y)+_this.CSimEl.height-1;
						x2 = parseInt(v[0].position.x)+30;
						y2 = parseInt(v[0].position.y)+1;
						
						cx = (x1+x2) / 2;
						cy = (y1+y2) / 2;
						
						xdiff = x2 - x1;
						ydiff = y2 - y1;
						
						if( ydiff < 0 )
						{
							ydiff = 0;
							xdiff = -xdiff;
						}
						
						if( xdiff < 0 )
							xdiff = 0;
						
						c1x = x1 - (xdiff / 2);
						c1y = y1 + (ydiff / 2);
						
						c2x = x2 + (xdiff / 2);
						c2y = y2 - (ydiff / 2);
						
						if( c1x < x1 && x2 > x1 )
							c1x = x1;
						if( c2x > x2 && x1 < x2 )
							c2x = x2;
						
						strokePath = "M"+x1+","+y1+" C"+c1x+","+c1y+" "+c2x+","+c2y+" "+x2+","+y2;
						
						newElement.id = "ELQ_SP_CSim_Path_"+node.id+"_"+v.id;
						newElement.setAttribute("d", strokePath);
						newElement.setAttribute("xdiff", xdiff);
						newElement.setAttribute("ydiff", ydiff);
						newElement.setAttribute("fill", "none");
						newElement.style.stroke = strokeColor; //Set stroke colour
						newElement.style.strokeWidth = "2px"; //Set stroke width
						svg.appendChild(newElement);
					}
				}
			}
		},
		ContactSearch: {
			parObj: {},
			isLoading: false,
			SearchKW: "",
			SearchResults: [],
			ShowResults: false,
			SelectedContact: false,
			FocusedIndex: -1,
			BlurTimeout: 0,
			Search: function(e)
			{
				_CSthis = this;
				this.SearchKW = $.trim(this.SearchKW);
				
				if( e && (e.hasOwnProperty("keyCode") && ( e.keyCode == 38 || e.keyCode == 40 )) )
				{
					dir = e.keyCode - 39;
					if( this.FocusedIndex < 0 )
						this.FocusedIndex = ( dir > 0 ) ? 0 : this.SearchResults.length - 1;
					else
					{
						this.FocusedIndex += dir;
						if( this.FocusedIndex < 0 )
							this.FocusedIndex = this.SearchResults.length - 1;
						if( this.FocusedIndex > this.SearchResults.length - 1 )
							this.FocusedIndex = 0;
					}
				}
				else if( e && (e.hasOwnProperty("keyCode") && ( e.keyCode == 13 && _CSthis.FocusedIndex > -1 )) )
				{
					this.SelectContact( this.SearchResults[ this.FocusedIndex ] );
				}
				else if( $.trim(this.SearchKW) !== "" && !this.isLoading && (!e || ( e && e.hasOwnProperty("keyCode") && (e.keyCode == 13) )) )
				{
					_CSthis.isLoading = true;
					_CSthis.FocusedIndex = -1;
					_CSthis.SearchResults = [];
					_CSthis.SelectedContact = false;
					_CSthis.Output = "";
					timeout( function()
					{
						timeout.cancel(_CSthis.BlurTimeout);
					}, 75);
					http({
						method: 'GET',
						url: "https://secure.p03.eloqua.com/API/REST/2.0/data/contact/view/100001/contacts?xsrfToken="+window.xsrfToken+"&count=500&page=1&depth=complete&search=common_fields%3d%22*"+this.SearchKW+"*%22"
					}).then(function successCallback(response) {
						_CSthis.isLoading = false;
						_CSthis.SearchResults = response.data.elements;
						timeout( function()
						{
							$("#ELQ_SP_CSim_ContactSearch").focus();
						}, 100);
						// this callback will be called asynchronously
						// when the response is available
					}, function errorCallback(response) {
						_CSthis.isLoading = false;
						_CSthis.SearchResults = [];
						// called asynchronously if an error occurs
						// or server returns response with an error status.
					});
				}
			},
			Close: function()
			{
				this.isLoading = false;
				this.allowStepSelection = false;
				this.ContactSearch.SearchKW = "";
				$("#ELQ_SP_CampaignSimulator").css("opacity", 1);
				$("#ELQ_SP_CampaignSimulator").stop().animate({ opacity: 0 }, 250, function()
				{
					$("#ELQ_SP_CampaignSimulator").css("display","none");
				});
			},
			SelectContact: function(Contact)
			{
				NewContact = { contactId: Contact.contactId, C_EmailAddress: Contact.C_EmailAddress };
				NewContact.x = 0; NewContact.y = 0; NewContact.icon = 0;
				this.parObj.SelectedContacts.push( NewContact );
				$("#ELQ_SP_CSimulator_Contact").css("transform", "none").css("left", 0).css("top", -150);
			},
			BlurSearch: function()
			{
				_this = this;
				this.BlurTimeout = timeout( function()
				{
					_this.ShowResults = false;
				}, 150);
			},
		},
		SelectCampaignContact: function(ind, e)
		{
			if( e.which == 1 )
			{
				if( !this.simulationMode )
				{
					if( this.ContactToStep !== ind )
					{
						this.ContactToStep = ind;
						$(e.target).focus();
						this.allowStepSelection = true;
					}
					else
					{
						this.ContactToStep = -1;
						this.allowStepSelection = false;
					}
				}
			}
			else if( e.which == 3 )
			{
				ct = this.SelectedContacts[ind];
				if( !ct.hasOwnProperty("icon") )
					ct.icon = 1;
				else
				{
					ct.icon++;
					if( ct.icon > 6 )
						ct.icon = 0;
				}
			}
		},
		DoAllContactsHaveEntryPoint: function()
		{
			allContactsOkay = true;
			$.each( this.SelectedContacts, function(k,v)
			{
				if( !v.startsFrom )
				{
					allContactsOkay = false;
					return false;
				}
			});
			return allContactsOkay;
		},
		SelectCampaignStep: function(step)
		{
			if( !this.simulationMode )
			{
				if( this.allowStepSelection && step.isParentNode )
				{
					this.SelectedContacts[this.ContactToStep].x = parseInt(step.position.x)+2;
					this.SelectedContacts[this.ContactToStep].y = step.position.y;
					
					this.SelectedContacts[this.ContactToStep].startsFrom = step.name;
					
					this.ContactToStep = -1;
					this.allowStepSelection = false;
				}
				else if( step.isScenarioNode && this.SelectedContacts.length > 0 )
				{
					if( step.hasOwnProperty("showScenarioPopup") )
						step.showScenarioPopup = !step.showScenarioPopup;
					else
						step.showScenarioPopup = true;
				}
			}
		},
		RemoveCampaignContact: function(ind)
		{
			this.SelectedContacts.splice(ind,1);
			this.ContactToStep = -1;
			this.allowStepSelection = false;
		},
		MoveContactToCampaignStep: function(step)
		{
			p = $("[id*=ELQ_SP_CSim_Path_"+step.id+"]").eq(0).attr("d");
			
			pSplit = p.split(" ");
			sP = pSplit[0]; eP = pSplit[pSplit.length-1];
			sPSplit = sP.replace("M","").split(","); ePSplit = eP.split(",");
			
			newSP = "M"+sPSplit[0]+","+(parseInt(sPSplit[1])-(this.CSimEl.height/2));
			newCPs = p.substr(1);
			newEP = "M"+eP+" "+ePSplit[0]+","+(parseInt(ePSplit[1])+(this.CSimEl.height/2));
			
			p = newSP+" "+newCPs+" "+newEP;
			
			ContactMotion = new Motion($("#ELQ_SP_CSimulator_Contact"), {
				path: p,
				rotation: 0
			});
			ContactMotion.to( 1, { duration: 1000 } );
		},
		ScrollCanvasToCampaignStep: function(step)
		{
			x = parseInt(step.position.x);
			y = parseInt(step.position.y);
			
			abh = window.innerHeight-120;
			abw = window.innerWidth-60;
			
			$(".ELQ_SP_CSim_Artboard").stop().animate( { scrollLeft: x-(abw/4), scrollTop: y-(abh/4) }, 500, function()
			{
				$("#ELQ_SP_CSim_Step_"+step.id).css("borderSpacing", 1).stop().animate({ borderSpacing: 1.1 },
				{
					step: function(now,fx) {
						$(this).css('transform','scale('+now+')');  
					},
					complete: function()
					{
						$(this).css("borderSpacing", 1.1).stop().animate({ borderSpacing: 1 },
						{
							step: function(now,fx)
							{
								$(this).css("transform", "scale("+now+")");
							}, duration: 200
						});
					}, duration: 200
				});
			});
		},
		isScenarioStep: function(step)
		{
			if( step.hasOwnProperty("type") )
			{
				switch( step.type )
				{
					case "CampaignEmailSentRule":
					case "CampaignEmailOpenedRule":
					case "CampaignEmailClickthroughRule":
					case "CampaignSubmitFormRule":
					case "CampaignWebsiteVisitRule":
						return true;
					break;
					default:
						return false;
				}
			}
			else
				return false;
		},
		isContactNotSelected: function(contact)
		{
			CSR = CSim.ContactSearch.SearchResults;
			contactDoesNotExists = true;
			for(ci=0;ci<CSim.SelectedContacts.length;ci++)
			{
				if( contact.contactId == CSim.SelectedContacts[ci].contactId )
					contactDoesNotExists = false;
			}
			return contactDoesNotExists;
		},
		ToggleScenarioList: function()
		{
			this.ShowScenariosList = !this.ShowScenariosList;
		},
		LoadContactDetailsAndActivities: function()
		{
			switch( step.type )
			{
				case "CampaignContactListMembershipRule":
				case "CampaignEmailSentRule":
				case "CampaignEmailOpenedRule":
				case "CampaignEmailClickthroughRule":
				case "CampaignContactFilterMembershipRule":
				case "CampaignSubmitFormRule":
				case "CampaignWebsiteVisitRule":
				case "CampaignContactListMembershipRule":
				case "CampaignContactFieldComparisonRule":
				case "CampaignCustomObjectFieldComparisonRule":
					return true;
				break;
				default:
					return false;
			}
		},
		StartCampaignSimulation: function()
		{
			_this = this;
			_this.simulationMode = true;
			_this.isCollectingData = true;
			
			_this.CSD = {};
			
			_this.hasListMembershipStep = false;
			_this.hasFilterMembershipStep = false;
			_this.hasContactFieldComparisonStep = false;
			_this.hasCustomObjectFieldComparisonStep = false;
			
			$.each( this.E, function(k,v)
			{
				switch( v.type )
				{
					case "CampaignContactListMembershipRule":
						_this.hasListMembershipStep = true;
					break;
					case "CampaignContactFilterMembershipRule":
						_this.hasFilterMembershipStep = true;
					break;
					case "CampaignContactFieldComparisonRule":
						_this.hasContactFieldComparisonStep = true;
					break;
					case "CampaignCustomObjectFieldComparisonRule":
						_this.hasCustomObjectFieldComparisonStep = true;
					break;
				}
			});
			
			if( _this.hasListMembershipStep )
			{
				_this.listMembershipsDone = false;
				_this.GetListMemberships.Init();
			}
			else
				_this.listMembershipsDone = true;
			
			if( _this.hasFilterMembershipStep )
			{
				_this.filterMembershipsDone = false;
				filtersArr = [];
				$.each( _this.E, function(k,v)
				{
					if( v.type == "CampaignContactFilterMembershipRule" )
						filtersArr.push( v.filterId );
				});
				
				if( filtersArr.length > 0 )
				{
					_this.GetFilterMemberships.filtersArr = filtersArr;
					_this.GetFilterMemberships.Init();
				}
				else
					_this.filterMembershipsDone = true;
			}
			else
				_this.filterMembershipsDone = true;
			
			if( _this.hasContactFieldComparisonStep )
			{
				_this.contactDataDone = false;
				_this.GetContactData.Init();
			}
			else
				_this.contactDataDone = true;
			
			if( _this.hasCustomObjectFieldComparisonStep )
			{
				_this.cdoRecordsDone = false;
				cdoArr = [];
				$.each( this.E, function(k,v)
				{
					if( v.type == "CampaignCustomObjectFieldComparisonRule" )
						cdoArr.push( v.customObjectId );
				});
				
				if( cdoArr.length > 0 )
				{
					_this.GetCDORecords.cdoArr = cdoArr;
					_this.GetCDORecords.Init();
				}
				else
				{
					_this.cdoRecordsDone = true;
				}
			}
			else
				_this.cdoRecordsDone = true;
		},
		CheckCSDLoaded: function()
		{
			if( this.listMembershipsDone && this.filterMembershipsDone && this.cdoRecordsDone && this.contactDataDone )
			{
				console.log( this.CSD );
				console.log("We're all set to begin with Simulation!");
			}
		},
		EvaluateCampaignStep: function(step)
		{
			
		},
	};
	
	CSim.ContactSearch.parObj = CSim;
	
	CSim.GetListMemberships = {
		parObj: CSim,
		DataRequestsSent: 0,
		DataRequestsReceived: 0,
		Init: function()
		{
			_GLthis = this;
			SConts = _GLthis.parObj.SelectedContacts;
			
			for(li=0;li<SConts.length;li++)
			{
				_GLthis.DataRequestsSent++;
				http({
					method: 'GET',
					url: "https://secure.p03.eloqua.com/API/REST/2.0/data/contact/"+SConts[li].contactId+"/membership?xsrfToken="+window.xsrfToken
				}).then(function successCallback(response) {
					_GLthis.DataRequestsReceived++;
					
					contId = response.config.url.split("data/contact/")[1].split("/membership?")[0];
					
					if( !_GLthis.parObj.CSD.hasOwnProperty(contId) )
						_GLthis.parObj.CSD[contId] = {};

					_GLthis.parObj.CSD[contId].ListMemberships = [];
					for(var tli=0;tli<response.data.length;tli++)
					{
						if( response.data[tli].type == "ContactList" )
							_GLthis.parObj.CSD[contId].ListMemberships.push( response.data[tli].id );
					}
					if( _GLthis.DataRequestsSent == _GLthis.DataRequestsReceived )
					{
						_GLthis.DataRequestsSent = _GLthis.DataRequestsReceived = 0;
						_GLthis.parObj.listMembershipsDone = true;
						_GLthis.parObj.CheckCSDLoaded();
					}
				}, function errorCallback(response) {
					_GLthis.parObj.CancelCampaignSimulation(response);
				});
			}
		}
	};
	
	CSim.GetFilterMemberships = {
		parObj: CSim,
		filtersArr: [],
		DataRequestsSent: 0,
		DataRequestsReceived: 0,
		Init: function()
		{
			if( this.filtersArr.length > 0 )
			{
				_GFthis = this;
				
				SConts = _GFthis.parObj.SelectedContacts;
				
				for(var fi=0;fi<SConts.length;fi++)
				{
					if( !_GFthis.parObj.CSD.hasOwnProperty(SConts[fi].contactId) )
						_GFthis.parObj.CSD[SConts[fi].contactId] = {};
					
					_GFthis.parObj.CSD[SConts[fi].contactId].FilterMemberships = [];
					for(var fj=0;fj<this.filtersArr.length;fj++)
					{
						_GFthis.DataRequestsSent++;
						http({
							method: 'GET',
							url: "https://secure.p03.eloqua.com/API/REST/2.0/data/contact/view/100020/contacts/filter/"+this.filtersArr[fj]+"?search='contactId=%22"+SConts[fi].contactId+"%22'&xsrfToken="+window.xsrfToken
						}).then(function successCallback(response) {
							_GFthis.DataRequestsReceived++;
							if( response.data.elements.length > 0 )
							{
								filterId = response.config.url.split("contacts/filter/")[1].split("?search=")[0];
								contactId = response.config.url.split("?search='contactId=%22")[1].split("%22'&xsrfToken")[0];
								_GFthis.parObj.CSD[contactId].FilterMemberships.push( filterId );
							}
							if( _GFthis.DataRequestsSent == _GFthis.DataRequestsReceived )
							{
								_GCDOthis.DataRequestsSent = _GCDOthis.DataRequestsReceived = 0;
								_GFthis.parObj.filterMembershipsDone = true;
								_GFthis.parObj.CheckCSDLoaded();
							}
						}, function errorCallback(response) {
							_GFthis.CancelCampaignSimulation(response);
						});
					}
				}
			}
			else
			{
				this.parObj.filterMembershipsDone = true;
				this.parObj.CheckCSDLoaded();
			}
		}
	};
	
	CSim.GetContactData = {
		parObj: CSim,
		DataRequestsSent: 0,
		DataRequestsReceived: 0,
		Init: function()
		{
			_GCthis = this;
			SConts = _GCthis.parObj.SelectedContacts;
			
			for(var ci=0;ci<SConts.length;ci++)
			{
				if( !_GCthis.parObj.CSD.hasOwnProperty(SConts[ci].contactId) )
					_GCthis.parObj.CSD[SConts[ci].contactId] = {};
				
				_GCthis.parObj.CSD[SConts[ci].contactId].ContactData = [];
				_GCthis.DataRequestsSent++;
				http({
					method: 'GET',
					url: "https://secure.p03.eloqua.com/API/REST/2.0/data/contact/view/100023/contacts?search='contactId=%22"+SConts[ci].contactId+"%22'&xsrfToken="+window.xsrfToken
				}).then(function successCallback(response) {
					_GCthis.DataRequestsReceived++;
					contId = response.config.url.split("contactId=%22")[1].split("%22'&xsrfToken")[0];
					if( response.data.elements.length > 0 )
						_GCthis.parObj.CSD[contId].ContactData = response.data.elements[0];
					
					if( _GCthis.DataRequestsSent == _GCthis.DataRequestsReceived )
					{
						_GCthis.parObj.contactDataDone = true;
						_GCthis.parObj.CheckCSDLoaded();
					}
				}, function errorCallback(response) {
					_GCthis.parObj.CancelCampaignSimulation(response);
				});
			}
		}
	};
	
	CSim.GetCDORecords = {
		parObj: CSim,
		cdoArr: [],
		DataRequestsSent: 0,
		DataRequestsReceived: 0,
		Init: function()
		{
			_GCDOthis = this;
			if( _GCDOthis.cdoArr.length > 0 )
			{
				SConts = _GCDOthis.parObj.SelectedContacts;
				_GCDOthis.parObj.cdoRecordsDone = false;
			
				for(var cdoi=0;cdoi<SConts.length;cdoi++)
				{
					if( !_GCDOthis.parObj.CSD.hasOwnProperty(SConts[cdoi].contactId) )
						_GCDOthis.parObj.CSD[SConts[cdoi].contactId] = {};
					
					_GCDOthis.parObj.CSD[SConts[cdoi].contactId].CDORecords = {};
					
					for(cdoj=0;cdoj<this.cdoArr.length;cdoj++)
					{
						_GCDOthis.DataRequestsSent++;
						http({
							method: 'GET',
							url: "https://secure.p03.eloqua.com/API/REST/1.0/data/customObject/"+this.cdoArr[cdoj]+"?search='MappedEntityID=%22"+SConts[cdoi].contactId+"%22'&xsrfToken="+window.xsrfToken
						}).then(function successCallback(response) {
							_GCDOthis.DataRequestsReceived++;
							
							cdoId = response.config.url.split("data/customObject/")[1].split("?search=")[0];
							contId = response.config.url.split("MappedEntityID=%22")[1].split("%22'&xsrfToken")[0];
							
							if( response.data.elements.length > 0 )
								_GCDOthis.parObj.CSD[contId].CDORecords[cdoId] = response.data.elements;
							
							if( _GCDOthis.DataRequestsSent == _GCDOthis.DataRequestsReceived )
							{
								_GCDOthis.DataRequestsSent = _GCDOthis.DataRequestsReceived = 0;
								_GCDOthis.parObj.cdoRecordsDone = true;
								_GCDOthis.parObj.CheckCSDLoaded();
							}
						}, function errorCallback(response) {
							_GCDOthis.CancelCampaignSimulation(response);
						});
					}
				}
			}
			else
			{
				this.parObj.cdoRecordsDone = true;
				this.parObj.CheckCSDLoaded();
			}
		}
	};
	
	CSim.CampSettings = {
		parObj: CSim,
		Data: "",
		State: "",
		ShowSave: function()
		{
			SaveData = {
				CampStartDate: this.parObj.CampSDCtrl,
				CampTimeZone: this.parObj.Timezones[parseInt(this.parObj.CampTZInd)].id,
				Contacts: this.parObj.SelectedContacts,
				ScenarioSteps: this.parObj.ScenarioSteps
			};
			this.Data = JSON.stringify(SaveData);
			this.State = "SAVE";
			timeout( function()
			{
				$("#ELQ_SP_CSim_Settings_Txt").focus();
			}, 100);
		},
		ShowLoad: function()
		{
			this.Data = "";
			this.State = "LOAD";
			timeout( function()
			{
				$("#ELQ_SP_CSim_Settings_Txt").focus();
			}, 100);
		},
	};
	
	return CSim;
};











/*
//GET HIDDEN ELEMENT ON CAMPAIGN CANVAS WITH POSITION & NAME
$(".hidden-campaign-element-view").filter(function(e,i)
{
	s = $(this).attr("style");
	t = s.indexOf("top: 451px") > -1;
	l = s.indexOf("left: 113px") > -1;
	d = $(this).attr("data-name") == "Send Update Email - 4";
	return (t && l && d);
});*/