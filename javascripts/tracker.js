var socket = io.connect('http://192.168.0.6:8000'),
    myLoc, myGraphic, myPos,
    graphics={},
    geo = esri.geometry,
    esym = esri.symbol,
    sym = new esym.PictureMarkerSymbol('images/me.png', 13, 24),
    otherSym= new esym.PictureMarkerSymbol('images/someone.png', 13, 24);
socket.on('message', function(data){
    data = JSON.parse(data);
    if (data.action === "position") {
      var pt = geo.geographicToWebMercator(new geo.Point(data.lng, data.lat));
      addLocToMap(pt, otherSym, {nickname:data.nickname});
    }
  console.dir(data);
});
socket.emit(JSON.stringify({
  action: 'speak',
  text: "connected" 
  }));
function sendPosition() {
  var coords = myPos.coords;
  socket.send(JSON.stringify({
      action: 'position',
      nickname: $("#nickname").val(),
      lat: coords.latitude,
      lng: coords.longitude
      }));
}
function sendLocation(position){
  myPos = position; 
  var coords = myPos.coords;

  myLoc = geo.geographicToWebMercator(new geo.Point(coords.longitude, coords.latitude), sym);
  if ($('#nickname').val() !== ''){
    sendPosition();
    if(map.loaded ) addLocToMap(myLoc, sym, {nickname:"Me"});
  }
}
function getLocation(){
  if (navigator.geolocation){
    navigator.geolocation.getCurrentPosition(sendLocation);
  }
}
function addLocToMap(loc, symbol, attr){
  var newg, txtg, g, txtsym,txtbg, 
      g = graphics[attr.nickname];
  if (g) {
    map.graphics.remove(g[0]);
    map.graphics.remove(g[1]);
  } else {
    $('<li>', {
      id: "li_" + attr.nickname,
      text: attr.nickname
    }).appendTo($('#clients'));
  }
  //Added three graphics per person, one for name, one for name background.
  // ArcGIS jsapi needs to handle this
  newg = new esri.Graphic(loc,symbol, attr );
  txtsym = new esym.TextSymbol(attr.nickname);
  txtsym.yoffset = -25;
  txtsym.color = '#F00';
  txtsym.setFont(new esym.Font("18px", esym.Font.STYLE_NORMAL, esym.Font.VARIANT_NORMAL, esym.WEIGHT_LIGHTER, "Arial"));
  txtg = new esri.Graphic(loc, txtsym);
  txtbg = new esym.TextSymbol(attr.nickname);
  txtbg.yoffset = -25;
  txtbg.color = '#F00';
  txtbg.setFont(new esym.Font("18px", esym.Font.STYLE_NORMAL, esym.Font.VARIANT_NORMAL, esym.WEIGHT_BOLDER, "Arial"));
  txtbg.color="#FFF";
  txtg = new esri.Graphic(loc, txtsym);
  graphics[attr.nickname] =[newg, txtg];
    map.graphics.add(newg);
    map.graphics.add(new esri.Graphic(loc, txtbg));
    map.graphics.add(txtg);
}
getLocation();
function showCoordinates(evt) {
        //get mapPoint from event
        //The map is in web mercator - modify the map point to display the results in geographic
        //var mp = esri.geometry.webMercatorToGeographic(evt.mapPoint);
        var mp = (evt.mapPoint);
        //display mouse coordinates
        dojo.byId("info").innerHTML = mp.x + ", " + mp.y;
      }

var map;
dojo.addOnLoad(function(){
     
  var initExtent = new esri.geometry.Extent({"xmin":-15122738.766504481 ,"ymin":2519982.865068336,"xmax":-3342875.463422532,"ymax":6433558.7132683,"spatialReference":{"wkid":102100}});
  map = new esri.Map("map",{extent:initExtent});
  //Add the world street map layer to the map. View the ArcGIS Online site for services http://arcgisonline/home/search.html?t=content&f=typekeywords:service    
  var basemap = new esri.layers.ArcGISTiledMapServiceLayer("http://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer");
  map.addLayer(basemap);  
  //resize the map when the browser resizes - view the 'Resizing and repositioning the map' section in 
  //the following help topic for more details http://help.esri.com/EN/webapi/javascript/arcgis/help/jshelp_start.htm#jshelp/inside_guidelines.htm
  var resizeTimer;
  dojo.connect(map, 'onLoad', function(theMap) {
    dojo.connect(dijit.byId('map'), 'resize', function() {  //resize the map if the div is resized
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout( function() {
        map.resize();
        map.reposition();
      }, 500);
    });
    dojo.connect(map, "onMouseMove", showCoordinates);
  });

$("#nickname").bind("change", function(){
addLocToMap(myLoc, sym, {nickname:"Me"});
sendPosition();
  });

});

