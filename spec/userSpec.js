var User;
User = require("../lib/user").User;
describe("User", function() {
  var user;
  user = null;
  beforeEach(function() {
    return user = new User();
  });
  it("should be valid with valid attributes", function() {
    user.email = "test@test.com";
    user.password = "dafas";
    return expect(user.validate()).toBeTruthy();
  });
  return describe("when adding a location", function() {
    it("should not add the location if it hasn't changed", function() {
      var loc;
      loc = {
        created_on: new Date(),
        latitude: 35.00,
        longitude: -85.00
      };
      user.addLocation(loc);
      expect(user.locations.length).toEqual(1);
      user.addLocation(loc);
      return expect(user.locations.length).toEqual(1);
    });
    it("should add the new location if it's 10 minutes after the last location", function() {
      var d1, d2, loc, loc1;
      d1 = new Date();
      d2 = d1.clone().add({
        minutes: 11
      });
      loc = {
        created_on: d1,
        latitude: 35.00,
        longitude: -85.00
      };
      loc1 = {
        created_on: d2,
        latitude: 35.00,
        longitude: -85.00
      };
      user.addLocation(loc);
      expect(user.locations.length).toEqual(1);
      user.addLocation(loc1);
      return expect(user.locations.length).toEqual(2);
    });
    return it("should not add the new location if it's 9 minutes after the last location", function() {
      var d1, loc, loc1;
      d1 = new Date();
      loc = {
        created_on: d1,
        latitude: 35.00,
        longitude: -85.00
      };
      loc1 = {
        created_on: d1.add({
          minutes: 9
        }),
        latitude: 35.00,
        longitude: -85.00
      };
      user.addLocation(loc);
      expect(user.locations.length).toEqual(1);
      user.addLocation(loc);
      return expect(user.locations.length).toEqual(1);
    });
  });
});