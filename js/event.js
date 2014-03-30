$(document).ready(function(){

  /**
   * map variables for polygon definition in add dataset and browsing of datasets
   */
  var mapAdd,mapBrowse,drawnItems;
  var mapPanelOpen = false;
  var addInfoPanelOpen = false;
  var addDesPanelOpen = false;
/*
Function that is invoked, when submit button in add dataset panel is clicked; 
 */
$("#entrySubmitButton").click(function(){
  var sourceUrl = $("#SourceURL").val();
  var IdTitle = $("#idTitle").val();
  var IdProject = $("#idProject").val();
  var IdInstitute = $("#idInstitute").val();
  var IdAuthor = $("#idAuthor").val();
  var IdAbstract = $("#idAbstract").val();
  var IdKeyword = $("#idKeyword").val();
  var IdCitation = $("#idCitation").val();
  var varType = $("#VarTypeID").val();
  var format = $("#Format").val();
  
  var IdParameter = $("#idParameter").val();
  var AllParameter = IdParameter.split('');
  var IdUnit = $("#idUnit").val();
  var AllUnit = IdUnit.split('');
  
  var license = $("#License").val();
  var phenUri = $("#PhenomenonUri").val();
  var wktObsWin = $("#wktObsWin").val();
  var epsgCode = $("#EPSGcode").val();
 
  //var parameter=$(Variable).val();
  //var result= parameter.split('');
  
  
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

  var entry = new Entry(sourceUrl,IdTitle,IdProject,IdInstitute,IdAuthor,IdAbstract,Idkeyword,IdCitation,varType,format,IdParameter,IdUnit,license,phenUri,wktObsWin,beginDate.toUTCString(),endDate.toUTCString());

  //posting the data to the Webapp that converts the data to RDF and inserts it to the Parliament server
  jQuery.ajax({
          //url: "http://giv-mss.uni-muenster.de:8080/ts-proxy",
          url: "http://giv-mss.uni-muenster.de:8080/ts-proxy",
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
  var datatype = $("#VarTypeIDSelector").val(), entries, tableHeading;
  $.getJSON('http://giv-mss.uni-muenster.de:8080/ts-proxy?datatype='+datatype, function(data) {
          entries = data.Entries;
          if (entries.length==0){
            alert("No entries found!");
            return;
          }
          $("#resultTable").remove();
          if (datatype=="GEOST")tableHeading="Geostatistical Datasets";
              else if (datatype=="SPP") tableHeading="Spatial Point Pattern Datasets";
              else if (datatype=="SPP") tableHeading="Temporal Point Pattern Datasets";
              else if (datatype=="MSPP") tableHeading="Marked Spatial Point Pattern Datasets";
              else if (datatype=="MTPP") tableHeading="Marked Temporal Point Pattern Datasets";
              else if (datatype=="MSTPP") tableHeading="Marked Spatiotemporal Point Pattern Datasets";
              else if (datatype=="STPP") tableHeading="Spatiotemporal Point Pattern Datasets";
              else if (datatype=="LAT") tableHeading="Lattice Datasets";
              else if (datatype=="TRAJ") tableHeading="Trajectory Datasets";
              else if (datatype=="MTRAJ") tableHeading="Marked Trajectory Datasets";
          $("#queryResultPanel").append(
            $("<div></div>").attr("id", "resultTable").append(
              //set title of table for results
              $("<h4></h4>").text(tableHeading))
          );
          $("#resultTable").append(
              $("<table></table>")
                .addClass("table table-hover")
                .append(
                    $("<thead></thead>")
                    .append(
                        $("<tr></tr>")
                          .append($("<td></td>").append($("<strong></strong>").text("Source URL")))
                          .append($("<td></td>").append($("<strong></strong>").text("Phenomenon")))
                          .append($("<td></td>").append($("<strong></strong>").text("License")))
                          .append($("<td></td>").append($("<strong></strong>").text("Format")))
                    ) 
                  )
                .append(
                  $("<tbody></tbody>")
                  .attr("id","resultTableBody")
                )
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
        });
  
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
$("#addDesBtn").click(function(){
    if (addDesPanelOpen){
      $("#addDesBtn").text("Add Description");
      addDesPanelOpen=false;
    }
    /*
    If map panel is closed and button is clicked, change button text to close map panel
     */
    else{
      $("#addDesBtn").text("Close Description form");
      addDesPanelOpen=true;
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
$("#VarTypeID").change(function(){
  var patt=/PointPattern/g;
  var varType = $("#VarTypeID").val();
  if (addDesPanelOpen && patt.test(varType)){
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
  else if (addDesPanelOpen) {
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

$("#suTitle").clickover({
	global_close: 'false',
	placement : 'right',
	title : 'Title URL',
    content: 'A short description of the dataset',
    trigger: 'hover'
	}
);
$("#suProject").clickover({
	global_close: 'false',
	placement : 'right',
	title : 'Project URL',
    content: 'If data are related to a project.',
    trigger: 'hover'
	}
);
$("#suInstitution").clickover({
	global_close: 'false',
	placement : 'right',
	title : 'Institution URL',
    content: 'Participating Institutes in the Project',
    trigger: 'hover'
	}
);
$("#suAuthor").clickover({
	global_close: 'false',
	placement : 'right',
	title : 'Author(s) URL',
    content: 'Name of Principle investigator or Project head.',
    trigger: 'hover'
	}
);
$("#suDescription").clickover({
	global_close: 'false',
	placement : 'right',
	title : 'Description URL',
    content: 'If data are supplementary to a publication, the (preliminary) abstract must be added',
    trigger: 'hover'
	}
);
$("#suKeywords").clickover({
	global_close: 'false',
	placement : 'right',
	title : 'Keywords URL',
    content: 'A comma separated list of key words and phrases.',
    trigger: 'hover'
	}
);
$("#suCitation").clickover({
	global_close: 'false',
	placement : 'right',
	title : 'Citation URL',
    content: 'Reference to a book, paper, or author',
    trigger: 'hover'
	}
);
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
	title : 'Variable Type',
    content: 'The statistical variable type indicates of which type the dataset is, e.g. whether it is a point pattern or a geostatistical variable. If you are not sure about the variable type, please have a quick look on our idea page. The variable type is mandatory.',
    trigger: 'hover'
	}
);

$("#addInfoInfo").clickover({
  global_close: 'false',
  placement : 'right',
  title : 'Additional information',
    content: 'You can add additional information like license, format or information about the observed or modelled phenomenon here. The additional information is optional.',
    trigger: 'hover'
  }
);

$("#formatInfo").clickover({
  global_close: 'false',
  placement : 'bottom',
  title : 'Format information',
    content: 'The format in which the data is available, if the source URL is resolved. Currently the format can be specified as free text. However, common formats for spatial information are ESRI SHP file, GML, CSV, ... .',
    trigger: 'hover'
  }
);

$("#paraUnitInfo").clickover({
  global_close: 'false',
  placement : 'bottom',
  title : 'Parameters',
    content: 'Parameter must have a unit. Use standart code from - Unified Code for Units of Measure (the UCUM).',
    trigger: 'hover'
  }
);

$("#paraInfo").clickover({
  global_close: 'false',
  placement : 'bottom',
  title : 'Parameters',
    content: 'Parameter must have a unit.',
    trigger: 'hover'
  }
);

$("#unitInfo").clickover({
  global_close: 'false',
  placement : 'bottom',
  title : 'Unit',
    content: 'Unified Code for Units of Measure (the UCUM).',
    trigger: 'hover'
  }
);

$("#licenseInfo").clickover({
  global_close: 'false',
  placement : 'bottom',
  title : 'License information',
    content: 'The license under which the data is available. Currently the license can be specified as free text. However, if possible, please provide a link to the license text.',
    trigger: 'hover'
  }
);


$("#phenUriInfo").clickover({
  global_close: 'false',
  placement : 'right',
  title : 'Observed or modelled phenomenon',
    content: 'We recommend to point to a definition in a dictionary or an ontology, e.g. the NASA SWEET ontologies.',
    trigger: 'hover'
  });


$("#wktInfo").clickover({
  global_close: 'false',
  placement : 'right',
  title : 'Observed Spatial Window - Polygon',
    content: 'The observed spatial window provides information about the extent which has been observed or modelled for a point pattern variable. Note that this usually differs from the bounding box or convex hull of the points contained in a pattern. The Polygon needs to be provided in the Well-Known-Text (WKT) format.',
    trigger: 'hover'
  }
);

$("#epsgInfo").clickover({
  global_close: 'false',
  placement : 'right',
  title : 'Observed Spatial Window - EPSG code',
    content: 'The code defined by the European Petroleum Survey Group (EPSG) provides information about the spatial reference system in which the coordinates of the observed spatial window are available.',
    trigger: 'hover'
  }
);

$("#mapDefInfo").clickover({
  global_close: 'false',
  placement : 'right',
  title : 'Map Definition',
    content: 'In case you do not have information about the spatial window yet, you can also directly define it in a map here.',
    trigger: 'hover'
  }
);


$("#beginInfo").clickover({
  global_close: 'false',
  placement : 'right',
  title : 'Observed Temporal Window - Begin',
    content: 'The observed temporal window specifies the extent which has been observed or modelled for a temporal point pattern variable. Begin needs to be before end date.',
    trigger: 'hover'
  }
);


$("#endInfo").clickover({
  global_close: 'false',
  placement : 'right',
  title : 'Observed Temporal Window - End',
    content: 'The observed temporal window specifies the extent which has been observed or modelled for a temporal point pattern variable. End needs to be after begin date.',
    trigger: 'hover'
  }
);

/* 
***************************
function for "+" symbol to add multiple Parametes and Unit in a row 
****************************
 */

$("#addPara").click( function() {

  var toAppend = 
  '<tr>\
      <td class="Parameter"><input class="input-xlarge form-inline" type="text" id="idParameter" placeholder="Parameter"></td>\
      <td class="Unit"><input class="input-xlarge form-inline" type="text" id="idUnit" placeholder="Unit"></td>\
   </tr>'

  $("#parameterBody").append(toAppend);
});

$('#remPara').click( function() {
  var count = $("#parameterBody tr").length;
  if(count > 1)
  	$("#parameterBody tr:last-child").remove();
});

});

/* 
***************************
function to show / hide the table 
****************************
 
$('#myTable').ready(function(){
    $('#film td').hide();
});

$(document).ready(function(){
var n1 = 0;
      $('#film th.1').click(function(){
         if(n1 == 0){
         $('#film td.1').show();
         n1 = 1;
         }else{
        $('#film td.1').hide();
         n1 = 0;}
       });


*/

//end $(document).ready(function(){



