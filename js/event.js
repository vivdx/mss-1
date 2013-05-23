$(document).ready(function(){

  /**
   * map variables for polygon definition in add dataset and browsing of datasets
   */
  var mapAdd,mapBrowse,drawnItems;
  var mapPanelOpen = false;
  var addInfoPanelOpen = false;

/*
Function that is invoked, when submit button in add dataset panel is clicked; 
 */
$("#entrySubmitButton").click(function(){
	var sourceUrl = $("#SourceURL").val();
  var format = $("#Format").val();
  var varType = $("#VarTypeID").val();
  var license = $("#License").val();
  var phenUri = $("#PhenomenonUri").val();
  var wktObsWin = $("#wktObsWin").val();
  var beginDate = $('#beginpicker').data('datetimepicker').getDate();
  var endDate = $('#endpicker').data('datetimepicker').getDate();
  var entry = new Entry(sourceUrl,format,varType,license,phenUri,wktObsWin,beginDate,endDate);

  //posting the data to the Webapp that converts the data to RDF and inserts it to the Parliament server
  jQuery.ajax({
          url: "http://localhost:8080/tsproxy",
          type: "POST",
          data: JSON.stringify(entry),
          contentType: "application/json"
  })
  .done(function() { alert("Entry successfully inserted!"); })
  .fail(function(){alert("Error while inserting entry!")});
});

$("#savePolygonBtn").click(function(){
  var layers = drawnItems.getLayers();
  if (layers.length==1){
    $("#wktObsWin").val(toWKT(layers[0]));
    $("#EPSGcode").val(4326);
    $("#mapPanelContainer").collapse("hide");
    $("#mapPanelBtn").text("Open Map Panel");

    mapPanelOpen=false;
  }
  else {
    alert("There needs to be exactly one rectangle or polygon defining the observed window!");
  }
});

/*
* function that opens the map panel when the button is clicked
 */
$("#mapPanelBtn").click(function(){
    /*
    If map is not initilized, initialize
     */
    if (!mapAdd){
      $("#mapPanelAdd").css("height","400px");
  	 mapAdd = L.map("mapPanelAdd").setView([51.505, -0.09], 13);
     L.tileLayer('http://{s}.tile.cloudmade.com/c69899fe599542e9ba5cdc63d9a3870c/997/256/{z}/{x}/{y}.png', {
      attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://cloudmade.com">CloudMade</a>',
      maxZoom: 18
      }).addTo(mapAdd);

     // Initialize the FeatureGroup to store editable layers
      drawnItems = new L.FeatureGroup();
      mapAdd.addLayer(drawnItems);

      // Initialize the draw control and pass it the FeatureGroup of editable layers
      var drawControl = new L.Control.Draw({
          draw: {
            circle: false,
            marker: false,
            polyline: false
          },
          edit: {
              featureGroup: drawnItems
          }
      });
      mapAdd.addControl(drawControl);

    mapAdd.on('draw:created', function (e) {
    var type = e.layerType,
        layer = e.layer;

    if (type === 'marker') {
        layer.bindPopup('A popup!');
    }

      drawnItems.addLayer(layer);
    });
    }
    /*
    If map panel is opened, when button is clicked, change button text to open map panel
     */
    if (mapPanelOpen){
      $("#mapPanelBtn").text("Open Map Panel");
      mapPanelOpen=false;
    }
    /*
    If map panel is closed and button is clicked, change button text to close map panel
     */
    else{
      $("#mapPanelBtn").text("Close Map Panel");
      mapPanelOpen=true;
    }
	}
);

$("#addInfoBtn").click(function(){
  if (addInfoPanelOpen){
      $("#addInfoBtn").text("Add additional information");
      addInfoPanelOpen=false;
    }
    /*
    If map panel is closed and button is clicked, change button text to close map panel
     */
    else{
      $("#addInfoBtn").text("Close additional information form");
      addInfoPanelOpen=true;
      if ($("#VarTypeID").val()=="POINT_PATTERN"){
        $("#obsWinSpContainer").css("display","inline");
        $("#obsWinTempContainer").css("display","inline");
      }
      else {
        $("#obsWinSpContainer").css("display","none");
        $("#obsWinTempContainer").css("display","none");
      }
    }
  
});

$("#VarTypeID").change(function(){
  if (addInfoPanelOpen && $("#VarTypeID").val()=="POINT_PATTERN"){
    $("#obsWinSpContainer").css("display","inline");
    $("#obsWinTempContainer").css("display","inline");
  }
  else if (addInfoPanelOpen) {
    $("#obsWinSpContainer").css("display","none");
    $("#obsWinTempContainer").css("display","none");
  }
});



$(function() {
    $('#beginpicker').datetimepicker({
      language: 'en'
    });
  });

$(function() {
    $('#endpicker').datetimepicker({
      language: 'en'
    });
  });

/* 
***************************
CLICKOVERS 
****************************
*/

$("#suInfo").clickover({
	global_close: 'false',
	placement : 'right',
	title : 'Data Source URL',
    content: 'The URL of the data set you want to add. The URL may point to a file on a server or to a Web Service offering a specific data set. Please make sure that the dataset does not contain data for different variable types (e.g. Point Patterns and Geostatistical Data)',
    trigger: 'hover'
	}
);

$("#varTypeInfo").clickover({
	global_close: 'false',
	placement : 'right',
	title : 'Specifying the Statistical Variable Type',
    content: 'Please specify the variable type here. If you are not sure about the variable type, please have a quick look on our about page.',
    trigger: 'hover'
	}
);


//end $(document).ready(function(){
});

