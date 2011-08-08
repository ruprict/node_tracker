User = require("../lib/user").User
describe "User", ->
  user = null
  beforeEach ->
    user = new User()

  it "should be valid with valid attributes", ->
    user.email ="test@test.com"
    user.password = "dafas"
    expect(user.validate()).toBeTruthy()

  describe "when adding a location", ->
    it "should not add the location if it hasn't changed", ->
      loc =
        created_on: new Date()
        latitude: 35.00
        longitude: -85.00

      user.addLocation loc
      expect(user.locations.length).toEqual 1
      user.addLocation loc
      expect(user.locations.length).toEqual 1

    it "should add the new location if it's 10 minutes after the last location", ->
      d1 = new Date()
      d2 = d1.clone().add {minutes: 11}
      loc =
        created_on: d1 
        latitude: 35.00
        longitude: -85.00
      loc1 =
        created_on: d2
        latitude: 35.00
        longitude: -85.00

      user.addLocation loc
      expect(user.locations.length).toEqual 1
      user.addLocation loc1
      expect(user.locations.length).toEqual 2

    it "should not add the new location if it's 9 minutes after the last location", ->
      d1 = new Date()
      loc =
        created_on: d1 
        latitude: 35.00
        longitude: -85.00
      loc1 =
        created_on: d1.add {minutes: 9}
        latitude: 35.00
        longitude: -85.00

      user.addLocation loc
      expect(user.locations.length).toEqual 1
      user.addLocation loc
      expect(user.locations.length).toEqual 1

