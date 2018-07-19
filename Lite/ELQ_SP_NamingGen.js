window.ELQ_SP_NamingGenPrototype = function(scope, http, timeout)
{
	NG = {};
	
	NG.ManualInvoke = true; NG.isCustomName = false; NG.CustomName = ""; NG.TargetBinding = false; NG.TargetType = "ELOQUA";
	NG.isVisible = false;
	NG.AssetType = "campaigns";
	NG.AssetTypes = {
		"campaigns": "Campaign", "emails": "Email", "landing_pages": "Landing Page",
		"segments": "Segment", "forms": "Form"
	};
	
	NG.Show = function()
	{
		window.ELQ_SP_BtnClose_Click();
		NG.isVisible = false;
		$("#ELQ_SP_NamingGenerator").css("opacity", 0);
		NG.isVisible = true;
		$("#ELQ_SP_NamingGenerator").stop().animate({ opacity: 1 }, 250, function()
		{
			$("[ng-model*=ProgramType]").focus();
		});
	};
	
	NG.Close = function()
	{
		NG.isVisible = true;
		$("#ELQ_SP_NamingGenerator").css("opacity", 1);
		$("#ELQ_SP_NamingGenerator").stop().animate({ opacity: 0 }, 250, function()
		{
			scope.safeApply( function()
			{
				NG.isVisible = false;
			});
		});
	};
	
	NG.FieldValidations = {
		ProgramType: { images: { isUsed: false }, files: { isUsed: false } },
		Vendor: { images: { isRequired: false } },
		Country: { images: { isUsed: false } },
		Technology: { isRequired: false },
		CustomerGroup: { isRequired: false },
		OfferType: {
			campaigns: { isRequired: false },
			landing_pages: { isRequired: false },
			images: { isRequired: false },
			segments: { isRequired: false },
		},
		Responsiveness: {
			campaigns: { isUsed: false },
			images: { isUsed: false },
			files: { isUsed: false },
			segments: { isUsed: false },
			forms: { isUsed: false },
		},
		HostSite: {
			forms: { isUsed: false }
		},
		CommunicationType: {
			images: { isRequired: false }, forms: { isUsed: false }
		},
		TemplateType: {
			campaigns: { isUsed: false },
			images: { isUsed: false },
			files: { isUsed: false },
			segments: { isUsed: false },
			forms: { isUsed: false },
		}
	};
	
	NG.ProgramTypes = {
		"ATT": "Attach", "BNB": "Batch and Blast", "DLR": "Dealer Reg", "EULG": "End-User Lead Gen",
		"GIP": "Growth Incentive Program", "RDG": "Reseller Demand Gen", "RWL": "Renewal", "UPS": "Upsell"
	};
	
	dt = new Date();
	prevYear = dt.getFullYear() - 1;
	currYear = dt.getFullYear();
	NG.FiscalYears = [prevYear, currYear];
	
	NG.Quarters = ["Q1","Q2","Q3","Q4"];
	
	
	NG.Vendors = {
		"AIM": "Agency Ingram Micro", "APC": "APC", "AXS": "Axis", "BAR": "Barco", "CIS": "Cisco", "CTX": "Citrix", "DEL": "Dell",
		"EAT": "Eaton", "FRE": "FireEye", "FTN": "Frotinet", "HP": "HP", "HPE": "HPE", "IBM": "IBM", "INT": "Intel", "JAB": "Jabra",
		"LNT": "Lantronix", "LXM": "Lexmark", "MIC": "Microsoft", "RGC": "RingCentral", "SHT": "ShoreTel", "SYM": "Symantec",
		"TSN": "TransitionNetworks", "VEM": "Veeam", "VMW": "VMware", "ZEB": "Zebra", "KPY": "Kaspersky"
	};
	
	NG.Countries = {
		"AF": "AFGHANISTAN", "AL": "ALBANIA", "DZ": "ALGERIA", "AS": "AMERICAN SAMOA", "AD": "ANDORRA", "AO": "ANGOLA",
		"AI": "ANGUILLA", "AQ": "ANTARCTICA", "AG": "ANTIGUA AND BARBUDA", "AR": "ARGENTINA", "AM": "ARMENIA", "AW": "ARUBA",
		"AU": "AUSTRALIA", "AT": "AUSTRIA", "AZ": "AZERBAIJAN", "BS": "BAHAMAS", "BH": "BAHRAIN", "BD": "BANGLADESH",
		"BB": "BARBADOS", "BY": "BELARUS", "BE": "BELGIUM", "BZ": "BELIZE", "BJ": "BENIN", "BM": "BERMUDA", "BT": "BHUTAN",
		"BO": "BOLIVIA", "BA": "BOSNIA AND HERZEGOWINA", "BW": "BOTSWANA", "BV": "BOUVET ISLAND (Norway)",
		"BR": "BRAZIL", "IO": "BRITISH INDIAN OCEAN TERRITORY", "BN": "BRUNEI DARUSSALAM", "BG": "BULGARIA", "BF": "BURKINA FASO",
		"BI": "BURUNDI", "KH": "CAMBODIA", "CM": "CAMEROON", "CA": "CANADA", "CV": "CAPE VERDE", "KY": "CAYMAN ISLANDS",
		"CF": "CENTRAL AFRICAN REPUBLIC", "TD": "CHAD", "CL": "CHILE", "CN": "CHINA", "CX": "CHRISTMAS ISLAND",
		"CC": "COCOS (KEELING) ISLANDS (Austrailia)", "CO": "COLOMBIA", "KM": "COMOROS", "CG": "CONGO", "CD": "CONGO, THE DRC",
		"CK": "COOK ISLANDS", "CR": "COSTA RICA", "CI": "COTE D'IVOIRE", "HR": "CROATIA (local name: Hrvatska)", "CU": "CUBA",
		"CY": "CYPRUS", "CZ": "CZECH REPUBLIC", "DK": "DENMARK", "DJ": "DJIBOUTI", "DM": "DOMINICA", "DO": "DOMINICAN REPUBLIC",
		"TP": "EAST TIMOR", "EC": "ECUADOR", "EG": "EGYPT", "SV": "EL SALVADOR", "GQ": "EQUATORIAL GUINEA", "ER": "ERITREA",
		"EE": "ESTONIA", "ET": "ETHIOPIA", "FK": "FALKLAND ISLANDS (MALVINAS)", "FO": "FAROE ISLANDS", "FJ": "FIJI", "FI": "FINLAND",
		"FR": "FRANCE", "FX": "FRANCE, METROPOLITAN", "GF": "FRENCH GUIANA", "PF": "FRENCH POLYNESIA",
		"TF": "FRENCH SOUTHERN TERRITORIES", "GA": "GABON", "GM": "GAMBIA", "GE": "GEORGIA", "DE": "GERMANY", "GH": "GHANA",
		"GI": "GIBRALTAR", "GR": "GREECE", "GL": "GREENLAND", "GD": "GRENADA", "GP": "GUADELOUPE", "GU": "GUAM", "GT": "GUATEMALA",
		"GN": "GUINEA", "GW": "GUINEA-BISSAU", "GY": "GUYANA", "HT": "HAITI", "HM": "HEARD AND MC DONALD ISLANDS",
		"VA": "HOLY SEE (VATICAN CITY STATE)", "HN": "HONDURAS", "HK": "HONG KONG", "HU": "HUNGARY", "IS": "ICELAND", "IN": "INDIA",
		"ID": "INDONESIA", "IR": "IRAN (ISLAMIC REPUBLIC OF)", "IQ": "IRAQ", "IE": "IRELAND", "IL": "ISRAEL", "IT": "ITALY",
		"JM": "JAMAICA", "JP": "JAPAN", "JO": "JORDAN", "KZ": "KAZAKHSTAN", "KE": "KENYA", "KI": "KIRIBATI", "KP": "KOREA, D.P.R.O.",
		"KR": "KOREA, REPUBLIC OF", "KW": "KUWAIT", "KG": "KYRGYZSTAN", "LA": "LAOS", "LV": "LATVIA", "LB": "LEBANON",
		"LS": "LESOTHO", "LR": "LIBERIA", "LY": "LIBYAN ARAB JAMAHIRIYA", "LI": "LIECHTENSTEIN", "LT": "LITHUANIA",
		"LU": "LUXEMBOURG", "MO": "MACAU", "MK": "MACEDONIA", "MG": "MADAGASCAR", "MW": "MALAWI", "MY": "MALAYSIA",
		"MV": "MALDIVES", "ML": "MALI", "MT": "MALTA", "MH": "MARSHALL ISLANDS", "MQ": "MARTINIQUE", "MR": "MAURITANIA",
		"MU": "MAURITIUS", "YT": "MAYOTTE", "MX": "MEXICO", "FM": "MICRONESIA, FEDERATED STATES OF", "MD": "MOLDOVA, REPUBLIC OF",
		"MC": "MONACO", "MN": "MONGOLIA", "ME": "MONTENEGRO", "MS": "MONTSERRAT", "MA": "MOROCCO", "MZ": "MOZAMBIQUE",
		"MM": "MYANMAR (Burma)", "NA": "NAMIBIA", "NR": "NAURU", "NP": "NEPAL", "NL": "NETHERLANDS", "AN": "NETHERLANDS ANTILLES",
		"NC": "NEW CALEDONIA", "NZ": "NEW ZEALAND", "NI": "NICARAGUA", "NE": "NIGER", "NG": "NIGERIA", "NU": "NIUE",
		"NF": "NORFOLK ISLAND", "MP": "NORTHERN MARIANA ISLANDS", "NO": "NORWAY", "OM": "OMAN", "PK": "PAKISTAN", "PW": "PALAU",
		"PA": "PANAMA", "PG": "PAPUA NEW GUINEA", "PY": "PARAGUAY", "PE": "PERU", "PH": "PHILIPPINES", "PN": "PITCAIRN",
		"PL": "POLAND", "PT": "PORTUGAL", "PR": "PUERTO RICO", "QA": "QATAR", "RE": "REUNION", "RO": "ROMANIA",
		"RU": "RUSSIAN FEDERATION", "RW": "RWANDA", "KN": "SAINT KITTS AND NEVIS", "LC": "SAINT LUCIA",
		"VC": "SAINT VINCENT AND THE GRENADINES", "WS": "SAMOA", "SM": "SAN MARINO", "ST": "SAO TOME AND PRINCIPE",
		"SA": "SAUDI ARABIA", "SN": "SENEGAL", "RS": "SERBIA", "SC": "SEYCHELLES", "SL": "SIERRA LEONE", "SG": "SINGAPORE",
		"SK": "SLOVAKIA (Slovak Republic)", "SI": "SLOVENIA", "SB": "SOLOMON ISLANDS", "SO": "SOMALIA", "ZA": "SOUTH AFRICA",
		"SS": "SOUTH SUDAN", "GS": "SOUTH GEORGIA AND SOUTH S.S.", "ES": "SPAIN", "LK": "SRI LANKA", "SH": "ST. HELENA",
		"PM": "ST. PIERRE AND MIQUELON", "SD": "SUDAN", "SR": "SURINAME", "SJ": "SVALBARD AND JAN MAYEN ISLANDS", "SZ": "SWAZILAND",
		"SE": "SWEDEN", "CH": "SWITZERLAND", "SY": "SYRIAN ARAB REPUBLIC", "TW": "TAIWAN, PROVINCE OF CHINA", "TJ": "TAJIKISTAN",
		"TZ": "TANZANIA, UNITED REPUBLIC OF", "TH": "THAILAND", "TG": "TOGO", "TK": "TOKELAU", "TO": "TONGA",
		"TT": "TRINIDAD AND TOBAGO", "TN": "TUNISIA", "TR": "TURKEY", "TM": "TURKMENISTAN", "TC": "TURKS AND CAICOS ISLANDS",
		"TV": "TUVALU", "UG": "UGANDA", "UA": "UKRAINE", "AE": "UNITED ARAB EMIRATES", "GB": "UNITED KINGDOM", "US": "UNITED STATES",
		"UM": "U.S. MINOR ISLANDS", "UY": "URUGUAY", "UZ": "UZBEKISTAN", "VU": "VANUATU", "VE": "VENEZUELA", "VN": "VIETNAM",
		"VG": "VIRGIN ISLANDS (BRITISH)", "VI": "VIRGIN ISLANDS (U.S.)", "WF": "WALLIS AND FUTUNA ISLANDS", "EH": "WESTERN SAHARA",
		"YE": "YEMEN", "ZM": "ZAMBIA", "ZW": "ZIMBABWE"
	};
	
	NG.Technologies = {
		"CLD": "Cloud", "DC": "Data Center", "MOB": "Mobility", "NET": "Networking", "SEC": "Security", "SER": "Servers",
		"STO": "Storage", "SMT": "Smartphones", "TEC": "Telecommunications", "VIR": "Virtualization", "WIR": "Wireless"
	};
	
	NG.CustomerGroups = {
		"COMM": "Commercial", "FED": "Federal", "SLED": "State & Local Government"
	};
	
	NG.OfferTypes = {
		"CS": "CaseStudy", "FF": "Form-Fill", "IFG": "Infographic", "PRO": "Promotion", "TRS": "Tradeshow", "VID": "Video",
		"WEB": "Webinar", "WP": "Whitepaper"
	};
	
	NG.Responsiveness = { "NR": "Non-Responsive", "RS": "Responsive" };
	
	NG.HostSites = { "ELQ": "Eloqua", "INTP": "Intelligence Platform", "SP": "Sales Portal" };
	
	NG.CommunicationTypes = {
		"AR": "Auto-Responder", "FOL": "Follow-Up", "INV": "Invite", "NO": "Non-Open Resend", "NUR": "Nurture", "REC": "Recruitment"
	};
	
	NG.TemplateTypes = { "1COL": "1 Column", "2COL": "2 Column", "3COL": "3 Column" };
	
	NG.StartMonths = [
		{ MnInd: "01", MnName: "01 - January"},
		{ MnInd: "02", MnName: "02 - February"},
		{ MnInd: "03", MnName: "03 - March"},
		{ MnInd: "04", MnName: "04 - April"},
		{ MnInd: "05", MnName: "05 - May"},
		{ MnInd: "06", MnName: "06 - June"},
		{ MnInd: "07", MnName: "07 - July"},
		{ MnInd: "08", MnName: "08 - August"},
		{ MnInd: "09", MnName: "09 - September"},
		{ MnInd: "10", MnName: "10 - October"},
		{ MnInd: "11", MnName: "11 - Noovember"},
		{ MnInd: "12", MnName: "12 - December" }
	];
	
	NG.Versions = [];
	for(i=1;i<10;i++)
	{
		for(j=1;j<10;j++)
			NG.Versions.push("0"+i+""+j);
	}
	
	NG.NewAssetPropertyValidation = function(prop)
	{
		Validation = { isRequired: true, isUsed: true };
		fvP = NG.FieldValidations[prop];
		if( typeof fvP !== "undefined" )
		{
			fvPC = NG.FieldValidations[prop][NG.AssetType];
			switch( NG.AssetType )
			{
				case "campaigns":
				case "emails":
				case "landing_pages":
				case "forms":
				case "segments":
				case "images":
				case "files":
				{
					if( typeof fvPC !== "undefined" )
					{
						if( typeof fvPC.isRequired == "undefined" )
						{
							if( typeof fvPC.isUsed !== "undefined" )
							{
								if( !fvPC.isUsed )
								{
									Validation.isRequired = false;
									Validation.isUsed = false;
								}
							}
							Validation.isRequired = fvPC.isRequired;
						}
					}
					else
					{
						if( typeof fvP.isUsed !== "undefined" )
						{
							if( !fvP.isUsed )
							{
								Validation.isRequired = false;
								Validation.isUsed = false;
							}
						}
						else
						if( typeof fvP.isRequired !== "undefined" )
						{
							Validation.isRequired = fvP.isRequired;
						}
					}
				}
				break;
			}
		}
		
		return Validation;
	};
	
	NG.ShowBlankOpt = function(prop)
	{
		Vld = NG.NewAssetPropertyValidation(prop);
		return !Vld.isRequired;
	};
	
	NG.ShowNGField = function(prop)
	{
		Vld = (!NG.isCustomName && NG.NewAssetPropertyValidation(prop));
		return Vld.isUsed;
	};
	
	NG.NewAsset = {
		__AssetName: "", ProgramType: "", FiscalYear: "", Quarter: "", Vendor: "", ProductName: "", Country: "", Technology: "", CustomerGroup: "", OfferType: "",
		Responsiveness: "", HostSite: "", CommunicationType: "", TemplateType: "", StartMonth: "", Version: "",
		AssetNameOkay: false
	};
	
	NG.NewAsset.GetAssetName = function()
	{
		AName = "";
		
		NG.NewAsset.AssetNameOkay = true;
		AllOkay = true;
		
		if( !NG.isCustomName )
		{
			$.each( NG.NewAsset, function(k,v)
			{
				if( typeof v !== "function" && typeof v !== "boolean" && k.substr(0,2) !== "__" )
				{
					MetricOkay = true;
					MetricValue = "";
					Vld = NG.NewAssetPropertyValidation(k);
					
					if( $.trim(v) !== "" )
					{
						MetricValue = $.trim(v);
					}
					else
					{
						MetricOkay = (!Vld.isRequired || !Vld.isUsed);
						if( !MetricOkay )
							AllOkay = false;
					}
					
					if( Vld.isUsed )
					{
						if( AName !== "" && (Vld.isRequired || $.trim(v) !== "") )
							AName += "_";
						
						if( MetricOkay )
						{
							AName += MetricValue;
						}
						else
						{
							AName += "<<"+k+">>";
						}
					}
				}
			});
		}
		else
		{
			AName = $.trim(NG.CustomName);
			if( AName == "" )
				AllOkay = false;
		}
		
		NG.NewAsset.AssetNameOkay = AllOkay;
		NG.NewAsset.__AssetName = AName;
		
		return AName;
	};
	
	NG.UpdateName = function()
	{
		if( !NG.ManualInvoke )
		{
			ElqPage = NG.AssetType;
			
			dMB = false;
			storeKey = false;
			
			if( NG.TargetType == "ELQ_SP_COPYASSET" )
			{
				if( NG.TargetBinding && NG.NewAsset.AssetNameOkay )
				{
					NG.TargetBinding.name = NG.NewAsset.__AssetName;
				}
			}
			else if( NG.TargetType == "ELOQUA" )
			{
				switch( ElqPage )
				{
					case "campaigns":
					{
						if( Orion.basicCampaignController.content !== null )
						{
							dMB = Orion.basicCampaignMenuBarsPage.designMenuBar.title;
							storeKey = Orion.basicCampaignController.content.storeKey;
							currStatus = Orion.basicCampaignController.get("currentStatus");
						}
						else if( Orion.campaignController.content !== null )
						{
							dMB = Orion.campaignMenuBarsPage.designMenuBar.title;
							storeKey = Orion.campaignController.content.storeKey;
							currStatus = Orion.campaignController.get("currentStatus");
						}
					}
					break;
					case "emails":
					{
						dMB = Orion.emailMenuBarsPage.designMenuBar.title;
						storeKey = Orion.emailController.content.storeKey;
						currStatus = Orion.emailController.get("currentStatus");
					}
					break;
					case "landing_pages":
					{
						dMB = Orion.landingPageMenuBarsPage.designMenuBar.title;
						storeKey = Orion.landingPageController.content.storeKey;
						currStatus = Orion.landingPageController.get("currentStatus");
					}
					break;
					case "forms":
					{
						dMB = Orion.formMenuBarsPage.designMenuBar.title;
						storeKey = Orion.formController.content.storeKey;
						currStatus = Orion.formController.get("currentStatus");
					}
					break;
					case "segments":
					{
						dMB = Orion.segmentMenuBarsPage.designMenuBar.title;
						storeKey = Orion.segmentController.content.storeKey;
						currStatus = Orion.segmentController.get("currentStatus");
					}
					break;
				}
				
				if( dMB && NG.NewAsset.AssetNameOkay && currStatus.toLowerCase() == "draft" )
				{
					dMB.set("value", NG.NewAsset.__AssetName);
					CoreOrion.store.dataHashes[storeKey].name = NG.NewAsset.__AssetName;
					dMB.updateLayer();
				}
				else
				{
					scope.ELQ_SP_SetConsoleStatus("<span class='ELQ_SP_RedStrong'>Active assets cannot be renamed!</span>", "NamingGenerator", true, 3000);
				}
			}
		}
		
		NG.Close();
	};
	
	NG.CustomNameCheck = function()
	{
		if( NG.isCustomName )
		{
			setTimeout( function()
			{
				$("#ELQ_SP_NG_CustomName").focus();
			}, 125);
		}
	}
	
	return NG;
};