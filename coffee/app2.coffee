$ ->
  checkLoggedIn()

  $("a[href='/logout']").live "click", -> 
      console.log "sending disconnect"
      socket.send(JSON.stringify(
        {
          action: 'logout'
          id: $("#user_id").html()
        } 
      ))
  true

checkLoggedIn = ->
  u_id = $("#user_id")
  if u_id.length > 0 and u_id.html()
    postLoginSetup()
  else
    setupLoginForm()

setupLoginForm = ->
  $("#login_area form").submit ->
    inputs = $(this).find "input"
    email = $(inputs[0])
    pass = $(inputs[1])

    if not email.val?() or not pass.val?()
      alert('Please provide user and password')
      return false

    $.ajax
      url: this.action
      type: this.method
      data: $(this).serialize()
      success: (result) ->
        res = $(result)
        if res.find("form").length > 0
          $("#info").html "Login Failed"
        else
          $("#login_area").html res.find("#login_area").html()
          getLocation()
          postLoginSetup()
      error: (result) ->
        $("#info").html "<strong style='color:red'>Error</strong>"
    
    false

postLoginSetup = ->
  $("#replay").click replay

replay = ->
  info = $("#info")
  lastg = null
  $.getJSON "/crumbs", (result) ->
    num = result.length
    cnt = 0
    _addG = ->
      curr = result[cnt]
      info.html "Showing crumb #{cnt + 1} of #{num}"
      if lastg
        map.graphics.remove(lastg)
      pt = geo.geographicToWebMercator new geo.Point(curr.longitude, curr.latitude)
      if not map.extent.contains pt
        map.centerAndZoom(pt, 16)
      lastg = new esri.Graphic(pt, crumbSym)
      map.graphics.add(lastg)
      cnt++
      if cnt < num
        currTimeout = setTimeout(_addG, 1000)
      else 
        setTimeout(->
          map.graphics.remove lastg
          info.html "Done"
        )
    currTimeout =  setTimeout _addG,1000
  
