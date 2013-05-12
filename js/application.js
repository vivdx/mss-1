var panelIDs = ["StartPanel","TheoriesPanel","AddPanel","BrowsePanel","InfoPanel","ContactPanel"];


/*
*************************************
***JQUERY METHODS
*************************************
*/
function showAddPanel(){
	$("#NavList").children().attr("class","");
	$("#NavAdd").attr("class","active");
	setPanelActive("AddPanel");
}



/**
*  method for setting the panel on active
*
* @param activePanelID {string} the identifier of the panel that should be active
* @exception if the panel is not contained in the panelIDs configuration
*/
function setPanelActive(activePanelID){
	if (arrayContains(panelIDs,activePanelID)){
		for (x in panelIDs){
			panelID=panelIDs[x];
			if (panelID!=activePanelID){
				$("#"+panelID).css("display","none");
			}
			else {
				$("#"+activePanelID).css("display","inline");
			}
		}
	}
	else {
		throw "Panel is not activated or defined!";
	}
}

function showHomePanel(){
var navList = document.getElementById("NavList");
setNavigationActive(navList.getElementsByTagName("li"), "NavHome");
setPanelActive("StartPanel");
}

function showInfoPanel(){
	var navList = document.getElementById("NavList");
	setNavigationActive(navList.getElementsByTagName("li"),"NavInfo");
	setPanelActive("InfoPanel");
}


function showBrowsePanel(){
	var navList = document.getElementById("NavList");
	setNavigationActive(navList.getElementsByTagName("li"),"NavBrowse");
	setPanelActive("BrowsePanel");
}

function showTheoriesPanel(){
	var navList = document.getElementById("NavList");
	setNavigationActive(navList.getElementsByTagName("li"),"NavTheories");
	setPanelActive("TheoriesPanel");
}

function showContactPanel(){
	var navList = document.getElementById("NavList");
	setNavigationActive(navList.getElementsByTagName("li"),"NavContact");
	setPanelActive("ContactPanel");
}

/*
* funtion for setting a navigation item active
*
*  	@param listItems - the nodelist containing the li elements of the navigation panel
*	@param activeItemID - the ID of the navigation item that should be active
*/
function setNavigationActive(listItems, activeItemID){
	if (1<listItems.length) {
		for (x in listItems){
			var listItem = listItems[x];
			if (listItem.id==activeItemID){
				listItem.className="active"
			} else {
				listItem.className="";
			}
		}
	}
	else {
		throw "Method resetClassnames is only defined for NodeList with more than one element!";
	}

}

function arrayContains(a, obj) {
    for (var i = 0; i < a.length; i++) {
        if (a[i] === obj) {
            return true;
        }
    }
    return false;
}



