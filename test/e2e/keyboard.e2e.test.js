/*global browser*/

describe("Item interaction", function() {
    var p = browser;

    beforeEach(function(){
        p.get('/app/examples/keyboard.html');
    });

    it("should correctly register and unregister event handlers", function(){

        // Register
        element(by.id('btn-register-default')).click();

        element.all(by.css('.event-list.ng-hide')).then(function(elements) {
            expect(elements.length).toBe(0);
        });

        // Unregister
        element(by.id('btn-unregister-default')).click();

        element.all(by.css('.event-list.ng-hide')).then(function(elements) {
            expect(elements.length).toBe(1);
        });

        // Register again
        element(by.id('btn-register-default')).click();

        element.all(by.css('.event-list.ng-hide')).then(function(elements) {
            expect(elements.length).toBe(0);
        });

        // Register high priority handlers
        element(by.id('btn-register-hp')).click();

        element.all(by.css('li.hpkey.ng-hide')).then(function(elements) {
            expect(elements.length).toBe(0);
        });

    });

    it("should correctly handle keydown events", function() {

        //var window = p.driver.manage().window;

        // Register
        element(by.id('btn-register-default')).click();

        element.all(by.css('.event-list.ng-hide')).then(function(elements) {
            expect(elements.length).toBe(0);
        });

        browser.driver.executeScript("var e = jQuery.Event('keydown'); e.which = 27; e.keyCode = 27; $('.pnd-wrp').trigger(e);");
        element.all(by.css('.event-list.ng-hide')).then(function(elements) {
            expect(elements.length).toBe(1);
        });

        // Register
        element(by.id('btn-register-default')).click();

        browser.driver.executeScript("var e = jQuery.Event('keydown'); e.which = 84; e.keyCode = 84; e.shiftKey = true; $('.pnd-wrp').trigger(e);");
        element.all(by.css('input[id="st-inputfield"].ng-hide')).then(function(elements) {
            expect(elements.length).toBe(0);
        });

        // Check if Shift+T is correctly ignored on input field, then lose focus of input field.
        browser.driver.executeScript("var e = jQuery.Event('keydown'); e.which = 84; e.keyCode = 84; e.shiftKey = true; $('#st-inputfield').focus().trigger(e).blur();");
        element.all(by.css('input[id="st-inputfield"].ng-hide')).then(function(elements) {
            expect(elements.length).toBe(0);
        });

        // Check toggle of Shift+T
        browser.driver.executeScript("var e = jQuery.Event('keydown'); e.which = 84; e.keyCode = 84; e.shiftKey = true; $('.pnd-wrp').trigger(e);");
        element.all(by.css('input[id="st-inputfield"].ng-hide')).then(function(elements) {
            expect(elements.length).toBe(1);
        });

        // Ctrl+B
        browser.driver.executeScript("var e = jQuery.Event('keydown'); e.which = 66; e.keyCode = 66; e.ctrlKey = true; $('.pnd-wrp').trigger(e);");
        element(by.id('button1')).then(function(element) {
            expect(element.isEnabled()).toBe(true);
        });
        // Ctrl+B again
        browser.driver.executeScript("var e = jQuery.Event('keydown'); e.which = 66; e.keyCode = 66; e.ctrlKey = true; $('.pnd-wrp').trigger(e);");
        element(by.id('button1')).then(function(element) {
            expect(element.isEnabled()).toBe(false);
        });

        // Ctrl+F
        browser.driver.executeScript("var e = jQuery.Event('keydown'); e.which = 70; e.keyCode = 70; e.ctrlKey = true; $('.pnd-wrp').trigger(e);");
        element(by.id('button2')).then(function(element) {
            expect(element.isEnabled()).toBe(true);
        });
        // Meta+F (toggle same button of Ctrl+F)
        browser.driver.executeScript("var e = jQuery.Event('keydown'); e.which = 70; e.keyCode = 70; e.metaKey = true; $('.pnd-wrp').trigger(e);");
        element(by.id('button2')).then(function(element) {
            expect(element.isEnabled()).toBe(false);
        });

        // Alt+G
        browser.driver.executeScript("var e = jQuery.Event('keydown'); e.which = 71; e.keyCode = 71; e.altKey = true; $('.pnd-wrp').trigger(e);");
        element.all(by.css('li.dkey.ng-hide')).then(function(elements) {
            expect(elements.length).toBe(1);
        });

        // Register high priority handlers
        element(by.id('btn-register-hp')).click();

        // Ctrl+B
        browser.driver.executeScript("var e = jQuery.Event('keydown'); e.which = 66; e.keyCode = 66; e.ctrlKey = true; $('.pnd-wrp').trigger(e);");
        element(by.id('button4')).then(function(element) {
            expect(element.isEnabled()).toBe(true);
        });
        element(by.id('button1')).then(function(element) {
            expect(element.isEnabled()).toBe(true);
        });

        // Ctrl+F
        browser.driver.executeScript("var e = jQuery.Event('keydown'); e.which = 70; e.keyCode = 70; e.ctrlKey = true; $('.pnd-wrp').trigger(e);");
        element(by.id('button5')).then(function(element) {
            expect(element.isEnabled()).toBe(true);
        });
        element(by.id('button2')).then(function(element) {
            expect(element.isEnabled()).toBe(false);
        });

        // Register numeric priority handlers
        element(by.id('btn-register-hpn')).click();

        // Ctrl+E
        browser.driver.executeScript("var e = jQuery.Event('keydown'); e.which = 69; e.keyCode = 69; e.ctrlKey = true; $('.pnd-wrp').trigger(e);");
        element(by.id('button6')).then(function(element) {
            expect(element.isEnabled()).toBe(true);
            expect(element.getAttribute('class')).toContain('exec-first');
        });
        element(by.id('button7')).then(function(element) {
            expect(element.isEnabled()).toBe(true);
            expect(element.getAttribute('class')).toContain('exec-second');
        });
    });

});