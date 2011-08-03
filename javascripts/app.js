/* 
* Skeleton V1.0.3
* Copyright 2011, Dave Gamache
* www.getskeleton.com
* Free to use under the MIT license.
* http://www.opensource.org/licenses/mit-license.php
* 7/17/2011
*/	
	

$(document).ready(function() {
 
  $("form").submit(function(){
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
        $("#login_area").html($(result).find("#login_area").html());
        getLocation();
        postLoginSetup();
      }, 
      error: function(result) {
        $("#info").html("<strong style='color:red'>Error</strong>");       
      }
    });
    return false;

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
function postLoginSetup() {   
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

