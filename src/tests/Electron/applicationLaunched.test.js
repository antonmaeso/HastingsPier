import "babel-polyfill";
var Application = require("spectron").Application;
var assert = require("assert");
const electronPath = require("electron");
const path = require("path");

test("Integration Lanches app, checks its visible", async () => {
  jest.setTimeout(30000);
  var app = await new Application({
    path: electronPath,
    args: [path.join(__dirname, "../../../dist/main.js")]
  });

  async function start() {
    await app.start();
    return app;
  }

  await start()
    .then(function() {
      // Check if the window is visible
      return app.browserWindow.isVisible();
    })
    .then(function(isVisible) {
      // Verify the window is visible
      assert.equal(isVisible, true);
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
      return app.stop();
    })
    .catch(function(error) {
      // Log any failures
      //console.error("Test failed", error.message);
      app.stop();
      throw error.message;
    });
});
