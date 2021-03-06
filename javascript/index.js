//Initialize map. Set default position and zoom level.
var map = L.map('map').setView([45.1486, -93.1516], 6);

//Initialize map info, legend, and view selector.
var info = L.control();
var legend = L.control({position: "bottomright"});
var viewSelector = L.control({position: "bottomleft"});

//Jenk's Stuff
catagory = {"GRNDTOT": 
        {NAME: "Grand Total",
        COLOR1: "#fee5d9", COLOR2: "#fcae91", COLOR3: "#fb6a4a", COLOR4: "#de2d26", COLOR5: "#a50f15", COLORDEFAULT: "#FFFFFF",
        RANGE1: 13.059, RANGE2: 27.934, RANGE3: 43.055, RANGE4: 61.751, RANGE5: 187.3},
        "MURDER": 
        {NAME: "Murder",
        COLOR1: "#fee5d9", COLOR2: "#fcae91", COLOR3: "#fb6a4a", COLOR4: "#de2d26", COLOR5: "#a50f15", COLORDEFAULT: "#FFFFFF",
        RANGE1: 0.028, RANGE2: 0.094, RANGE3: 0.246, RANGE4: 0.627, RANGE5: 2.256},
        "RAPE": 
        {NAME: "Sexual Assault",
        COLOR1: "#fee5d9", COLOR2: "#fcae91", COLOR3: "#fb6a4a", COLOR4: "#de2d26", COLOR5: "#a50f15", COLORDEFAULT: "#FFFFFF",
        RANGE1: 0.048, RANGE2: 0.149, RANGE3: 0.325, RANGE4: 0.884, RANGE5: 2.014},
        "DRUGTOT": 
        {NAME: "Drug Total",
        COLOR1: "#fee5d9", COLOR2: "#fcae91", COLOR3: "#fb6a4a", COLOR4: "#de2d26", COLOR5: "#a50f15", COLORDEFAULT: "#FFFFFF",
        RANGE1: 3.1, RANGE2: 7.022, RANGE3: 16.754, RANGE4: 41.614, RANGE5: 64.794},
        "DUI": 
        {NAME: "DUI",
        COLOR1: "#fee5d9", COLOR2: "#fcae91", COLOR3: "#fb6a4a", COLOR4: "#de2d26", COLOR5: "#a50f15", COLORDEFAULT: "#FFFFFF",
        RANGE1: 2.178, RANGE2: 4.644, RANGE3: 8.902, RANGE4: 18.74, RANGE5: 47.649}
    };

//Set mapbox required variables.
var api = 'https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw';
var attribution = 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, ' +
'<a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>'

//Implement onAdd in info.
info.onAdd = function (map) {
    this._div = L.DomUtil.create('div', 'controls');
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

//Implement onAdd in legend.
legend.onAdd = function (map) {
    //Temp catagory variable
    catagory = {NAME: "Grand Total",
        COLOR1: "#fee5d9",
        COLOR2: "#fcae91",
        COLOR3: "#fb6a4a",
        COLOR4: "#de2d26",
        COLOR5: "#a50f15",
        COLORDEFAULT: "#FFFFFF",
        RANGE1: 13.059,
        RANGE2: 27.934,
        RANGE3: 43.055,
        RANGE4: 61.751,
        RANGE5: 187.3}
    this._div = L.DomUtil.create('div', 'controls');
    this.update(catagory);
    return this._div;
};

//Updates control based on currently selected crime
//WIP
legend.update = function (catagory) {
    this._div.innerHTML = '<h4>Legend</h4>' +  (catagory ?
        '<b>' + catagory.NAME + ' Stats</b><br />' +
        '<div class="input-color"><div class="color-box" style="background-color: ' + catagory.COLOR1 + ';"></div>' +
        '<span type="text">0\t-\t' + Math.round(catagory.RANGE1) + '</span></div><br />' +
        '<div class="input-color"><div class="color-box" style="background-color: ' + catagory.COLOR2 + ';"></div>' +
        '<span type="text">' + Math.round(catagory.RANGE1) + '\t-\t' + Math.round(catagory.RANGE2) + '</span></div><br />' +
        '<div class="input-color"><div class="color-box" style="background-color: ' + catagory.COLOR3 + ';"></div>' +
        '<span type="text">' + Math.round(catagory.RANGE2) + '\t-\t' + Math.round(catagory.RANGE3) + '</span></div><br />' +
        '<div class="input-color"><div class="color-box" style="background-color: ' + catagory.COLOR4 + ';"></div>' +
        '<span type="text">' + Math.round(catagory.RANGE3) + '\t-\t' + Math.round(catagory.RANGE4) + '</span></div><br />' +
        '<div class="input-color"><div class="color-box" style="background-color: ' + catagory.COLOR5 + ';"></div>' +
        '<span type="text">' + Math.round(catagory.RANGE4) + '\t-\t' + Math.round(catagory.RANGE5) + '</span></div><br />' +
        '<div class="input-color"><div class="color-box" style="background-color: ' + catagory.COLORDEFAULT + ';"></div>' +
        '<span type="text">No Data</span></div><br />': 
        "If you can see this, somethings wrong... Whoops.");
};

viewSelector.onAdd = function (map){
    this._div = L.DomUtil.create('div', 'controls');
    this.update();
    return this._div;
}

viewSelector.update = function () {
    this._div.innerHTML = '<h4>Crime View</h4>' +
    '<button type="button">Grand Total</button><br />' +
    '<button type="button">Murder</button><br />' +
    '<button type="button">Sexual Assault</button><br />' +
    '<button type="button">Drug Total</button><br />' +
    '<button type="button">DUIs</button><br />';
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
    return d === 0 ? '#FFFFFF' :
        d < 13.059 ? '#fee5d9' :
        d < 27.934 ? '#fcae91' :
        d < 43.055 ? '#fb6a4a' :
        d < 61.751 ? '#de2d26' :
        d < 187.30 ? '#a50f15' :
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
legend.addTo(map);
viewSelector.addTo(map);

//Set mapbox overlay attributes
var geoJSON = L.tileLayer(api, {
  maxZoom: 18,
  attribution: attribution,
  id: 'mapbox.light'
}).addTo(map);


//Add geoJSON data
geoJSON = L.geoJson(countyData, {style: style, onEachFeature: onEachFeature}).addTo(map);
