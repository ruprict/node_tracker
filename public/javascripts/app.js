/* 
* Skeleton V1.0.3
* Copyright 2011, Dave Gamache
* www.getskeleton.com
* Free to use under the MIT license.
* http://www.opensource.org/licenses/mit-license.php
* 7/17/2011
*/	
	

$(document).ready(function() {

  checkLoggedIn();
  $("a[href='/logout']").live("click", function(){
    console.log("sending disconnect");
    socket.send(JSON.stringify({action:'logout', id:$("#user_id").html()}));
  });
  
  /* Tabs Activiation
  ================================================== */
  var tabs = $('ul.tabs');
  
  tabs.each(function(i) {
          //Get all tabs
          var tab = $(this).find('> li > a');
          tab.click(function(e) {
                  
                  //Get Location of tab's content
                  var contentLocation = $(this).attr('href') + "Tab";
                  
                  //Let go if not a hashed one
                  if(contentLocation.charAt(0)=="#") {
                  
                          e.preventDefault();
                  
                          //Make Tab Active
                          tab.removeClass('active');
                          $(this).addClass('active');
                          
                          //Show Tab Content & add active class
                          $(contentLocation).show().addClass('active').siblings().hide().removeClass('active');
                          
                  } 
          });
  }); 
	
});
function checkLoggedIn() {
  var u_id = $("#user_id");
  if ((u_id.length > 0) && u_id.html() !== '') {
    postLoginSetup();
    return;
  }
  $("#login_area form").submit(function(){
    var inputs = $(this).find("input"),
        email = $(inputs[0]), 
        pass = $(inputs[1]);

    if (email.val() === '' || pass.val() === ''){
      alert('Please login');
      return false;
    }
    $.ajax({
      url: this.action,
      type: this.method,
      data: $(this).serialize(),
      success: function (result) {
        var res = $(result);
        if (res.find("form").length > 0) { //Login failed 
          $("#info").html("LOGIN FAILED");
        } else {
          $("#login_area").html(res.find("#login_area").html());
          getLocation();
          postLoginSetup();
        }
      }, 
      error: function(result) {
        $("#info").html("<strong style='color:red'>Error</strong>");       
      }
    });
    return false;

  });

}
function postLoginSetup() {   
  $("#replay").click(replay);
  return;
  $("#showCrumbs").change(function(){
    if ($(this).attr("checked")) {
      $.getJSON("/crumbs",  function(result) {
          var frag = document.createDocumentFragment();
          $.each(result, function(idx, ele, arr) {
            console.dir(ele);
          }); 
          
        });
    }
  });
}
function replay() {
  var lastg;
  $.getJSON("/crumbs",  function(result) {
    var num = result.length, cnt=0,
        pt, curr, currTimeout;
   function _addG() { 
      curr = result[cnt]; 
	$("#info").html("Showing crumb " + cnt + " of " + num);
      if (lastg) map.graphics.remove(lastg);
      pt = geo.geographicToWebMercator(new geo.Point(curr.longitude, curr.latitude));
      if (!map.extent.contains(pt)) map.centerAndZoom(pt, 16);
      lastg = new esri.Graphic(pt, crumbSym);
      map.graphics.add(lastg);
      cnt++;
      if (cnt < num) currTimeout = setTimeout( _addG, 1000); 
      else setTimeout(function() {map.graphics.remove(lastg); $("#info").html("Done");}, 3000);
    }
    currTimeout = setTimeout(_addG, 1000) ;
      
  });


}
