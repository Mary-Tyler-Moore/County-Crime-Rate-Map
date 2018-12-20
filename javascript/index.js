//Initialize map. Set default position and zoom level.
var map = L.map('map').setView([45.1486, -93.1516], 6);

//Initialize map controls.
var info = L.control();

//Set mapbox required variables.
var api = 'https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw';
var attribution = 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, ' +
'<a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>'

//Implement onAdd.
info.onAdd = function (map) {
    this._div = L.DomUtil.create('div', 'info');
    this.update();
    return this._div;
};

//Updates control based on feature properties passed (when hovering over county)
info.update = function (props) {
    
    this._div.innerHTML = '<h4>County Crime Rates per 1000 People</h4>' +  (props ?
        '<b>' + props.NAME + ' County</b><br />' +
        (props.GRNDTOT ?
        'Total Crimes per Year: '+ props.GRNDTOT.toFixed(3) + "<br />"  +
        'Murders per Year: ' + props.MURDER.toFixed(3) + "<br />"  +
        'Sexual Assaults per Year: ' + props.RAPE.toFixed(3) + "<br />"  +
        'Drug Crimes per Year: ' + props.DRUGTOT.toFixed(3) + "<br />"  +
        'DUIs per Year: ' + props.DUI.toFixed(3) + "<br />" : 
        "No data from this county."): 
        "Hover over a county.");
};

//Highlights county that mouse is hovering over
function highlightFeature(e){
    var layer = e.target;
    layer.setStyle({
        weight: 1.5,
        color: "black",
        fillOpacity: 0.7
    });

    if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
        layer.bringToFront();
    }

    info.update(layer.feature.properties);
}

//Resets highlight when mouse off of county
function resetHighlight(e) {
    geoJSON.resetStyle(e.target);
    info.update()
}

//Return color based on crime data. 
//Values currently hardcoded using Jenk's Natural Breaks.
//WIP
function getColor(d) {
    return d < 13.059 ? '#fee5d9' :
        d < 27.934 ? '#fcae91' :
        d < 43.055 ? '#fb6a4a' :
        d < 61.751 ? '#de2d26' :
        d < 187.3 ? '#a50f15' :
        '#FFFFFF';
}

//Styles provided feature
function style(feature) {
    return {
        fillColor: getColor(feature.properties.GRNDTOT),
        weight: 0.5,
        opacity: 1,
        color: 'black',
        fillOpacity: 0.7
    };
}

//Supports feature interaction
function onEachFeature(feature, layer){
    layer.on({
        mouseover: highlightFeature,
        mouseout: resetHighlight
    });
}

//Add control to map
info.addTo(map);

//Set mapbox overlay attributes
var geoJSON = L.tileLayer(api, {
  maxZoom: 18,
  attribution: attribution,
  id: 'mapbox.light'
}).addTo(map);


//Add geoJSON data
geoJSON = L.geoJson(countyData, {style: style, onEachFeature: onEachFeature}).addTo(map);
