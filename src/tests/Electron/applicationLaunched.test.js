test("Lanches app, checks its visible", () => {
    var Application = require('spectron').Application
    var assert = require('assert')
    const electronPath = require('electron')
    const path = require('path')

    var app = new Application({
        path: electronPath,
        args: [path.join(__dirname, "../../../dist/main.js")]
    })

    app.start().then(function() {
        // Check if the window is visible
        const started = app.browserWindow.isVisible();
        console.log("App Started: " + started)
        return started
    }).then(function(isVisible) {
        // Verify the window is visible
        console.log("App visible: " + isVisible)
        assert.equal(isVisible, true)
    }).then(function() {
        // Get the window's title
        return app.client.getTitle()
    }).then(function(title) {
        // Verify the window's title
        console.log("App title: " + title)
        assert.equal(title, 'Hastings Pier')
    }).then(function() {
        // Stop the application
        return app.stop()
    }).catch(function(error) {
        // Log any failures
        console.error('Test failed', error.message)
    })
})