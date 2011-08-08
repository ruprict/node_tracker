var App, AppController, LoginView, RegisterView, User;
var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };
User = Backbone.Model.extend;
AppController = Backbone.Router.extend({
  _users: null,
  routes: {
    "": "index",
    "/login": "login",
    "/register": "register"
  },
  index: function() {},
  login: function() {
    return new LoginView();
  },
  register: function() {
    return new RegisterView();
  },
  initialize: function() {
    if (!(typeof _users !== "undefined" && _users !== null)) {
      console.log("no users");
    }
    return Backbone.history.start();
  }
});
RegisterView = Backbone.View.extend({
  el: $("#login_area"),
  events: {
    "submit": "register"
  },
  initialize: function() {
    return this.el.load("/register .container");
  },
  register: function() {}
});
LoginView = Backbone.View.extend({
  el: $("#login_area"),
  events: {
    "submit": "login"
  },
  _compiledView: null,
  initialize: function() {
    if (!this._compiledView) {
      return this.el.load("/login .container");
    }
  },
  login: function(e) {
    var email, form, inputs, pass;
    form = $(e.target);
    inputs = form.find("input");
    email = $(inputs[0]);
    pass = $(inputs[1]);
    if (!(typeof email.val === "function" ? email.val() : void 0) || !(typeof pass.val === "function" ? pass.val() : void 0)) {
      alert('Please provide user and password');
      return false;
    }
    $.ajax({
      url: form.attr("action"),
      type: form.attr("method"),
      data: form.serialize(),
      success: __bind(function(result) {
        var res;
        res = $(result);
        if (res.find("form").length > 0) {
          return $("#info").html("Login Failed");
        } else {
          this.el.html(res.find("#login_area").html());
          getLocation();
          return postLoginSetup();
        }
      }, this),
      error: function(result) {
        return $("#info").html("<strong style='color:red'>Error</strong>");
      }
    });
    return false;
  }
});
App = new AppController();