User = Backbone.Model.extend
  initialize: ->
    @locations = []
  currentPosition: ->
    @locations.last[@locations.length-1]

UserCollection = Backbone.Collection.extned
  model: User
  
