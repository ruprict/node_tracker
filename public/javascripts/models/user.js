var User, UserCollection;
User = Backbone.Model.extend({
  initialize: function() {
    return this.locations = [];
  },
  currentPosition: function() {
    return this.locations.last[this.locations.length - 1];
  }
});
UserCollection = Backbone.Collection.extned({
  model: User
});