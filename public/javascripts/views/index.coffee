User = Backbone.Model.extend

AppController  = Backbone.Router.extend
  _users: null
  routes: 
    "":             "index"
    "/login":       "login" 
    "/register":    "register"

  index: ->
  login: ->
    new LoginView()
  register: ->
    new RegisterView()
  initialize: ->
    if not _users?
      console.log "no users"
    Backbone.history.start()

RegisterView = Backbone.View.extend
  el: $ "#login_area"
  events: 
    "submit" : "register"

  initialize: ->
    @el.load("/register .container")
  register: ->

LoginView = Backbone.View.extend
  el: $("#login_area")
  events: 
    "submit" : "login" 
  _compiledView: null
  initialize: ->
    if not @_compiledView
      @el.load "/login .container"
  login: (e) ->
    form = $ e.target
    inputs = form.find "input"
    email = $(inputs[0])
    pass = $(inputs[1])

    if not email.val?() or not pass.val?()
      alert('Please provide user and password')
      return false

    $.ajax
      url: form.attr("action")
      type: form.attr("method")
      data: form.serialize()
      success: (result) =>
        res = $(result)
        if res.find("form").length > 0
          $("#info").html "Login Failed"
        else
          @el.html res.find("#login_area").html()
          getLocation()
          postLoginSetup()
      error: (result) ->
        $("#info").html "<strong style='color:red'>Error</strong>"
    
    false

App = new AppController()
