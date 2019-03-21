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

    // TODO: Set source as the AT feature layer
    createSearchWidget: function() {
      this.search = new Search({
        // sources: [{
        //   featureLayer: new FeatureLayer ("https://services9.arcgis.com/DTFv8R1G3csu62AY/arcgis/rest/services/AT/FeatureServer"),
        //   placeholder: "Address."
        // }],
        map: this.map,
        autoNavigate: true
      }, this.searchWidgetWrapper);
      this.search.startup();

      // TODO: when the source is set as
      on(this.search, 'select-result', function(evt) {
        this.showResultsForPoint(evt.result.feature.geometry);
        this.selectOptions(evt.result.feature.geometry.getLatitude());
        // console.log(evt.attributes.lgth_service);
      }.bind(this));

    },

    showResultsForPoint: function(point) {
      this.resultsWrapper.innerHTML = "<br><hr><div> Selected: <br>" + "Longitude: <strong>" + point.getLongitude() + "</strong> "+ "<br> " + "Latitude: <strong>" + point.getLatitude() + "</strong>" + "<hr></div>";
    },

    selectOptions: function (number) {

      number *= 100; //base cost

      on(this.submitbutton, "click", function(e){
        increment = 0;
        if (this.sidewalkCheckbox.checked) {
          increment += 1000;
        }
        if (this.plantClustersCheckbox.checked) {
          increment += 2000;
        }
        if (this.retainingWallCheckbox.checked) {
          increment += 3000;
        }
        if (this.lawnCheckbox.checked) {
          increment += 4000;
        }
        if (this.drivewayCheckbox.checked) {
          increment += 5000;
        }
        this.showCalculatedCost(number, increment);
      }.bind(this));

    },

    showCalculatedCost: function (number, increment) {
      this.calculatedCost.innerHTML = "<hr><br><div> Calculated Cost: <strong>" + (number + increment) + "</strong></div>";
    }

  });
  return clazz;
});