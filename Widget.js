define([
  'dojo/_base/declare',
  'jimu/BaseWidget',
  'esri/dijit/Search',
  'dojo/on',
  'esri/layers/FeatureLayer',
  'dojo/dom-construct',
  'jimu/dijit/CheckBox',
  'dijit/form/CheckBox',
  'dojo/domReady!'
],
function(
  declare, BaseWidget, Search, on, FeatureLayer
) {
  var clazz = declare([BaseWidget], {

  	baseClass: 'MySearch',

    postCreate: function() {
      this.createSearchWidget();
    },

    createSearchWidget: function() {
      var server = "https://services9.arcgis.com/JRMODTvFgZJ2QGlB/arcgis/rest/services/AT/FeatureServer/0?token=";
      
      // Set token here
      var token = "g5nv99YbUZO6gWek1P4-SLQ6dknJ1-5CcLuHLNO-rqjsO06gq10XpinUKYexgiRO_zpdMCDvAtKIKjJ3T-0RSyE---Ngar8uP8jahGo969p8trG4NJUUdRrNoDlIJ-w-80IbbZGrj28PFNEy1jD6B4-QXRSq6eVAPTgQKgubQZhir0LpF5uWlfTsLZZtg6G3GNrevjfXE7IjJcz1B9QbxpeIFxfHfPKKLfd_cgm18Y6znwSlptd7INVg3G1dfI6J";
    
      this.search = new Search({
        sources: [{
          featureLayer: new FeatureLayer (server + token),
          placeholder: "Address.",
          searchFields: ["CIVIC", "Address_2", "City"],
          suggestionTemplate: "${CIVIC}, ${Address_2}, ${City}",
          outFields: ["*"],
          exactMatch: false, 
          enableSuggestions: true,
          maxSuggestions: 3
        }],
        map: this.map,
        autoNavigate: true
      }, this.searchWidgetWrapper);
      this.search.startup();

      on(this.search, 'select-result', function(evt) {
        var address = evt.result.feature.attributes.CIVIC+ ", " + evt.result.feature.attributes.Address_2 + ", " + evt.result.feature.attributes.City;
        var length = evt.result.feature.attributes.Lgth_Service;
        this.showResultsForPoint(address, length);
        this.selectOptions(length);
      }.bind(this));

    },

    showResultsForPoint: function(address, length) {
      this.resultsWrapper.innerHTML = "<br><hr><div> Selected: <br>" + "Address: <strong>" + address + "</strong> "+ "<br> " + "Pipe Length: <strong>" + length + "</strong>" + "<hr></div>";
    },

    selectOptions: function (length) {
      
      // base cost multiplier
      var amt = 100; 
      
      // Increment values
      var sidewalk_amt = 1000;
      var plant_clusters_amt = 2000;
      var retaining_wall_amt = 3000;
      var lawn_amt = 4000;
      var driveway_amt = 5000;


      var base_cost = length *= amt;
      on(this.submitbutton, "click", function(e){
        increment = 0;
        if (this.sidewalkCheckbox.checked) {
          increment += sidewalk_amt;
        }
        if (this.plantClustersCheckbox.checked) {
          increment += plant_clusters_amt;
        }
        if (this.retainingWallCheckbox.checked) {
          increment += retaining_wall_amt;
        }
        if (this.lawnCheckbox.checked) {
          increment += lawn_amt;
        }
        if (this.drivewayCheckbox.checked) {
          increment += driveway_amt;
        }
        this.showCalculatedCost(base_cost, increment);
      }.bind(this));

    },

    showCalculatedCost: function (base_cost, increment) {
      this.calculatedCost.innerHTML = "<hr><br><div> Calculated Cost: <strong>" + (base_cost + increment) + "</strong></div>";
    }

  });
  return clazz;
});