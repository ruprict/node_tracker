(function() {
  var checkLoggedIn, postLoginSetup, replay, setupLoginForm;
  $(function() {
    checkLoggedIn();
    $("a[href='/logout']").live("click", function() {
      console.log("sending disconnect");
      return socket.send(JSON.stringify({
        action: 'logout',
        id: $("#user_id").html()
      }));
    });
    return true;
  });
  checkLoggedIn = function() {
    var u_id;
    u_id = $("#user_id");
    if (u_id.length > 0 && u_id.html()) {
      return postLoginSetup();
    } else {
      return setupLoginForm();
    }
  };
  setupLoginForm = function() {
    return $("#login_area form").submit(function() {
      var email, inputs, pass;
      inputs = $(this).find("input");
      email = $(inputs[0]);
      pass = $(inputs[1]);
      if (!(typeof email.val === "function" ? email.val() : void 0) || !(typeof pass.val === "function" ? pass.val() : void 0)) {
        alert('Please provide user and password');
        return false;
      }
      $.ajax({
        url: this.action,
        type: this.method,
        data: $(this).serialize(),
        success: function(result) {
          var res;
          res = $(result);
          if (res.find("form").length > 0) {
            return $("#info").html("Login Failed");
          } else {
            $("#login_area").html(res.find("#login_area").html());
            getLocation();
            return postLoginSetup();
          }
        },
        error: function(result) {
          return $("#info").html("<strong style='color:red'>Error</strong>");
        }
      });
      return false;
    });
  };
  postLoginSetup = function() {
    return $("#replay").click(replay);
  };
  replay = function() {
    var info, lastg;
    info = $("#info");
    lastg = null;
    return $.getJSON("/crumbs", function(result) {
      var cnt, currTimeout, num, _addG;
      num = result.length;
      cnt = 0;
      _addG = function() {
        var curr, currTimeout, pt;
        curr = result[cnt];
        info.html("Showing crumb " + (cnt + 1) + " of " + num);
        if (lastg) {
          map.graphics.remove(lastg);
        }
        pt = geo.geographicToWebMercator(new geo.Point(curr.longitude, curr.latitude));
        if (!map.extent.contains(pt)) {
          map.centerAndZoom(pt, 16);
        }
        lastg = new esri.Graphic(pt, crumbSym);
        map.graphics.add(lastg);
        cnt++;
        if (cnt < num) {
          return currTimeout = setTimeout(_addG, 1000);
        } else {
          return setTimeout(function() {
            map.graphics.remove(lastg);
            return info.html("Done");
          });
        }
      };
      return currTimeout = setTimeout(_addG, 1000);
    });
  };
}).call(this);
