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
  var epsgCode = $("#EPSGcode").val();
  if (epsgCode!=""){
    wktObsWin = "<![CDATA[<http://www.opengis.net/def/crs/EPSG/0/"+epsgCode+">"+wktObsWin+"]]>"
  }
  var beginDate = new Date($('#beginpicker').data('datetimepicker').getDate());
  var endDate = new Date($('#endpicker').data('datetimepicker').getDate());
  
  if (isTemporalString(varType) 
    &&(
      (beginDate.getTime()==endDate.getTime())
      ||endDate<beginDate)){
    alert("Please specify time period for temporal observed window! Begin date needs to be before end date!");
    return;
  }

  var entry = new Entry(sourceUrl,format,varType,license,phenUri,wktObsWin,beginDate.toUTCString(),endDate.toUTCString());

  //posting the data to the Webapp that converts the data to RDF and inserts it to the Parliament server
  jQuery.ajax({
          //url: "http://giv-mss.uni-muenster.de:8080/ts-proxy",
          url: "http://localhost:8080/ts-proxy",
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

$("#querySubmitButton").click(function(){
  var datatype = $("#VarTypeIDSelector").val();
  if (datatype=="GEOST"){
        $.getJSON('http://localhost:8080/ts-proxy?datatype='+datatype, function(data) {
          var entries = data.Entries;
          $("#resultTable").remove();
          $("#queryResultPanel").append(
              $("<table></table>").addClass("table table-hover").attr("id", "resultTable").append(
                $("<thead></thead>").append(
                $("<tr></tr>")
                  .append($("<td></td>").append($("<strong></strong>").text("Source URL")))
                  .append($("<td></td>").append($("<strong></strong>").text("Phenomenon")))
                  .append($("<td></td>").append($("<strong></strong>").text("License")))
                  .append($("<td></td>").append($("<strong></strong>").text("Format")))
                )
              ));
          $("#resultTable").append(
            $("<tbody></tbody>").attr("id","resultTableBody")
            );
          for (i=0;i<entries.length;i++){
            var entry = entries[i];
            $("#resultTableBody").append($("<tr></tr>")
                  .append($("<td></td>").text(entry.sourceURL))
                  .append($("<td></td>").text(entry.phenomenon))
                  .append($("<td></td>").text(entry.license))
                  .append($("<td></td>").text(entry.format))
                  );
          }
          alert("Result is " + JSON.stringify(data)+"!");
        });
  }
  else {
    alert("Currently, only querying Geostatistical datasets is supported!");
  }

  });


$("#clearResultsButton").click(function(){
  $("#resultTable").remove();
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
      var patt=/PointPattern/g;
      var varType = $("#VarTypeID").val();
      if (patt.test(varType)){
        var pattSpat1=/SpatialPoint/g;
        var pattSpat2=/Spatio/g;
        if (pattSpat1.test(varType)||pattSpat2.test(varType)) {
          $("#obsWinSpContainer").css("display","inline");
        }else {
          $("#obsWinSpContainer").css("display","none");
        }

        var pattTemp1=/temporal/g;
        var pattTemp2=/Temporal/g;
        if (pattTemp1.test(varType)||pattTemp2.test(varType)) {
          $("#obsWinTempContainer").css("display","inline");
        } else {
          $("#obsWinTempContainer").css("display","none");
          }
        }
        else {
          $("#obsWinSpContainer").css("display","none");
          $("#obsWinTempContainer").css("display","none");
        }
    } 
});

$("#VarTypeID").change(function(){
  var patt=/PointPattern/g;
  var varType = $("#VarTypeID").val();
  if (addInfoPanelOpen && patt.test(varType)){
    var pattSpat1=/SpatialPoint/g;
    var pattSpat2=/Spatio/g;
    if (pattSpat1.test(varType)||pattSpat2.test(varType)) {
      $("#obsWinSpContainer").css("display","inline");
    } else {
          $("#obsWinSpContainer").css("display","none");
        }
    var pattTemp1=/temporal/g;
    var pattTemp2=/Temporal/g;
    if (pattTemp1.test(varType)||pattTemp2.test(varType)) {
      $("#obsWinTempContainer").css("display","inline");
    }else {
          $("#obsWinTempContainer").css("display","none");
          }
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

