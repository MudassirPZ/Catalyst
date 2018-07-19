function openNav() {
	$(".openbtn").hide();
	$("#mySidenav").css("width", "30%");
	$("#main").css("width", "70%");
	$(".closebtn").css("display", "block");
}

function closeNav() {
	$(".closebtn").hide();
	$("#mySidenav").css("width", "0%");
	$("#mySidenav").css("margin", "0");
	$(".openbtn").css("display", "block");
	$("#main").css("width", "100%");

}

function openHelp(evt, helpname) {
	// Declare all variables
	var i, tabcontent, tablinks;

	// Get all elements with class="tabcontent" and hide them
	tabcontent = document.getElementsByClassName("tabcontent");
	for (i = 0; i < tabcontent.length; i++) {
		tabcontent[i].style.display = "none";
	}

	// Get all elements with class="tablinks" and remove the class"active"
	tablinks = document.getElementsByClassName("tablinks");
	for (i = 0; i < tablinks.length; i++) {
		tablinks[i].className = tablinks[i].className.replace(" active", "");
	}

	// Show the current tab, and add an"active" class to the link that opened the tab
	document.getElementById(helpname).style.display = "block";
	
	if( evt )
		evt.currentTarget.className += " active";
}


document.getElementById('openbtn').addEventListener('click', function (e){
   openNav();
   try {
		e.stopProgagation(); e.stopImmediatePropagation(); e.preventDefault();
   } catch (err) {
	   return false;
   }
   return false;
}, false);

document.getElementById('closebtn').addEventListener('click', function (e){
   closeNav();
   try {
		e.stopProgagation(); e.stopImmediatePropagation(); e.preventDefault();
   } catch (err) {
	   return false;
   }
   return false;
}, false);

openLinks = document.getElementsByClassName("tablinks");
for (i = 0, total = openLinks.length; i < total; i++) {
	el = openLinks[i];

	el.addEventListener('click', function (e){
		param = this.getAttribute('id').replace("openHelp_", "");
		openHelp(e, param);
	}, false);
}

openHelp(false, 'Save');