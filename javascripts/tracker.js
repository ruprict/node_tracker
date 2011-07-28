var socket = io.connect(),
    myLoc, myGraphic, myPos,
    graphics={},
    geo = esri.geometry,
    esym = esri.symbol,
    sym = new esym.PictureMarkerSymbol('images/me.png', 13, 24),
    otherSym= new esym.PictureMarkerSymbol('images/someone.png', 13, 24);
socket.on('message', function(data){
    data = JSON.parse(data);
    if (data.action === "position" && (data.nickname !== $("nickname").val())) {
      var pt = geo.geographicToWebMercator(new geo.Point(data.lng, data.lat));
      addLocToMap(pt, otherSym, {id: data.id, nickname:data.nickname});
    }
    if (data.action === "close"){
      removeUser(data.id);
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
    if(map.loaded ) addLocToMap(myLoc, sym, {id: "me", nickname:"Me"});
  }
}
function getLocation(){
  if (navigator.geolocation){
    navigator.geolocation.watchPosition(sendLocation);
  }
}
function removeUser(id) {
  var g = graphics[id];
  if (g) {
    map.graphics.remove(g[0]);
    map.graphics.remove(g[1]);
    $('#li_' + id).remove();
  }
}
function addLocToMap(loc, symbol, attr){
  var newg, txtg, g, txtsym,
      g = graphics[attr.id];
  if (g) {
    map.graphics.remove(g[0]);
    map.graphics.remove(g[1]);
    $('#goto_' + attr.id).text(attr.nickname);
  } else {
    var li = $('<li>', {
      id: "li_" + attr.id
    }),
      a = $("<a>", {
        href:"#",
        id: "goto_" + attr.id,
        text: attr.nickname
      });
    li.appendTo($('#clients'));
    
    a.appendTo(li);
  }
  //Added three graphics per person, one for name, one for name background.
  // ArcGIS jsapi needs to handle this
  newg = new esri.Graphic(loc,symbol, attr );
  txtsym = new esym.TextSymbol(attr.nickname);
  txtsym.yoffset = -25;
  txtsym.color = '#F00';
  txtsym.setFont(new esym.Font("18px", esym.Font.STYLE_NORMAL, esym.Font.VARIANT_NORMAL, esym.WEIGHT_LIGHTER, "Arial"));
  txtg = new esri.Graphic(loc, txtsym);
  txtg = new esri.Graphic(loc, txtsym);
  graphics[attr.id] =[newg, txtg];
    map.graphics.add(newg);
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
  addLocToMap(myLoc, sym, {id:"me", nickname:"Me"});
  sendPosition();
});

$("#clients").click(function(e){
  var $this = $(this), nick
    target = e.target;
  if (!$(target).is("a")) return false;
  nick = target.id.split("_")[1];
  $.each(map.graphics.graphics, function(idx, gr){
    if (gr.attributes && gr.attributes.id === nick){
      map.centerAndZoom(gr.geometry, 16);
    }
  });
   
});
});

