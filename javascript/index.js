var map = L.map('map').setView([45.1486, -93.1516], 6);

var info = L.control();

info.onAdd = function (map) {
    this._div = L.DomUtil.create('div', 'info');
    this.update();
    return this._div;
};

// method that we will use to update the control based on feature properties passed
info.update = function (props) {
    this._div.innerHTML = '<h4>County Crime Rates per 1000 People</h4>' +  (props ?
        '<b>' + props.NAME + ' County</b><br />' +
        'Total Crimes Per Year: '+ props.GRNDTOT.toFixed(3) + "<br />"  +
        'Murders Per Year: ' + props.MURDER.toFixed(3) + "<br />"  +
        'Rapes Per Year: ' + props.RAPE.toFixed(3) + "<br />"  +
        'Drug Crimes Per Year: ' + props.DRUGTOT.toFixed(3) + "<br />"  +
        'DUIs Per Year: ' + props.DUI.toFixed(3) + "<br />" : 
        'Hover over a county');
};

info.addTo(map);

var geoJSON;

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

function resetHighlight(e) {
    geoJSON.resetStyle(e.target);
    info.update()
}

function getColor(d) {
    return d < 13.059 ? '#fee5d9' :
        d < 27.934 ? '#fcae91' :
        d < 43.055 ? '#fb6a4a' :
        d < 61.751 ? '#de2d26' :
        d < 187.3 ? '#a50f15' :
        '#FFFFFF';
}

function style(feature) {
    return {
        fillColor: getColor(feature.properties.GRNDTOT),
        weight: 0.5,
        opacity: 1,
        color: 'black',
        fillOpacity: 0.7
    };
}

function onEachFeature(feature, layer){
    layer.on({
        mouseover: highlightFeature,
        mouseout: resetHighlight
    });
}

geoJSON = L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw', {
  maxZoom: 18,
  attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, ' +
    '<a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
    'Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
  id: 'mapbox.light'
}).addTo(map);



geoJSON = L.geoJson(countyData, {style: style, onEachFeature: onEachFeature}).addTo(map);
