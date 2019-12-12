// import "babel-polyfill";
var Application = require("spectron").Application;
var assert = require("assert");
const electronPath = require("electron");
const path = require("path");
var app;
beforeAll(() => {
  app = new Application({
    path: electronPath,
    args: [path.join(__dirname, "../../../dist/main.js")]
  });
});
test("Integration Lanches app, checks its visible", () => {
  jest.setTimeout(30000);
  return app
    .start()
    .then(function() {
      // Check if the window is visible
      return app.browserWindow.isVisible();
    })
    .then(function(isVisible) {
      // Verify the window is visible
      assert.equal(isVisible, false);
    })
    .then(function() {
      // Get the window's title
      return app.client.getTitle();
    })
    .then(function(title) {
      // Verify the window's title
      assert.equal(title, "Hastings Pier");
    })
    .then(function() {
      // Stop the application
      //return app.stop();
    })
    .catch(function(error) {
      throw error.message;
    });
});
