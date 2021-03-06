describe("Dashboard interaction", function() {
    var p = browser;

    it('should load template and compile directive', function() {
        var panelNum = 3;

        p.get('/app/examples/dashboard.html');

        p.findElements(protractor.by.css('.pnd-dashboard-container')).then(function(elements) {
            expect(elements.length).toBe(1);
        });

        p.findElements(protractor.by.css('.pnd-dashboard-footer')).then(function(elements) {
            expect(elements.length).toBe(1);
        });
        // panel directive tag
        p.findElements(protractor.by.css('dashboard-panel')).then(function(elements) {
            expect(elements.length).toBe(panelNum);
        });
        // panel compiled div class
        p.findElements(protractor.by.css('.pnd-dashboard-panel')).then(function(elements) {
            expect(elements.length).toBe(panelNum);
        });

    });

    it('should toggle dashboard', function() {

        p.get('/app/examples/dashboard.html');

        p.findElements(protractor.by.css('.pnd-dashboard-container.ng-hide')).then(function(elements) {
            expect(elements.length).toBe(0);
        });

        p.findElement(protractor.by.css('.pnd-dashboard-toggle-btn')).click();

        p.findElements(protractor.by.css('.pnd-dashboard-container.ng-hide')).then(function(elements) {
            expect(elements.length).toBe(1);
        });

    });

    it('should resize dashboard height (drag)', function() {

        p.get('/app/examples/dashboard.html');

        // find footer element 
        var footer = p.findElement(protractor.by.css('.pnd-dashboard-container .pnd-dashboard-footer-handler'));

        // panels
        var container = p.findElement(protractor.by.css('.pnd-dashboard-container'));

        container.getSize().then(function(size){

            // drag up
            var offset = 40;
            p.actions().dragAndDrop(footer, {x:0, y:-offset}).perform();

            // check height (decreased)
            container.getSize().then(function(newSize){
                expect(newSize.height).toBeLessThan(size.height);
                expect(newSize.height).toBe(size.height - offset);
            });

        });
        
    });

    it('should collapse one specific dashboard panel', function() {

        p.get('/app/examples/dashboard.html');

        // find panel-expanded element contained in dashboard-panel tag with attribute paneltitle=
        p.findElements(protractor.by.css('dashboard-panel[paneltitle=lists] .pnd-dashboard-panel-expanded')).then(function(elements) {
            expect(elements.length).toBe(1);
        });

        // click collapse button
        p.findElement(protractor.by.css('dashboard-panel[paneltitle=lists] .btn.btn-default')).click();

        // check if now the element have ng-hide attribute
        p.findElements(protractor.by.css('dashboard-panel[paneltitle=lists] .pnd-dashboard-panel-expanded.ng-hide')).then(function(elements) {
            expect(elements.length).toBe(1);
        });

    });

    it('should collapse two specific dashboard panel', function() {

        p.get('/app/examples/dashboard.html');

        // find panel-expanded element contained in dashboard-panel tag with attribute paneltitle=
        p.findElements(protractor.by.css('dashboard-panel[paneltitle=lists] .pnd-dashboard-panel-expanded')).then(function(elements) {
            expect(elements.length).toBe(1);
        });
        p.findElements(protractor.by.css('dashboard-panel[paneltitle=tools] .pnd-dashboard-panel-expanded')).then(function(elements) {
            expect(elements.length).toBe(1);
        });

        // click collapse
        p.findElement(protractor.by.css('dashboard-panel[paneltitle=lists] .btn.btn-default')).click();
        p.findElement(protractor.by.css('dashboard-panel[paneltitle=tools] .btn.btn-default')).click();

        // check if the element have ng-hide attribute
        p.findElements(protractor.by.css('dashboard-panel[paneltitle=lists] .pnd-dashboard-panel-expanded.ng-hide')).then(function(elements) {
            expect(elements.length).toBe(1);
        });
        p.findElements(protractor.by.css('dashboard-panel[paneltitle=tools] .pnd-dashboard-panel-expanded.ng-hide')).then(function(elements) {
            expect(elements.length).toBe(1);
        });

    });

    it('should try to collapse three dashboard panel', function() {

        p.get('/app/examples/dashboard.html');
        p.driver.manage().window().setSize(1200, 960);

        // find panel-expanded element contained in dashboard-panel tag with attribute paneltitle=
        p.findElements(protractor.by.css('dashboard-panel .pnd-dashboard-panel-expanded')).then(function(elements) {
            expect(elements.length).toBe(3);
        });

        // click collapse
        p.findElement(protractor.by.css('dashboard-panel[paneltitle=lists] .btn.btn-default')).then(function(b) {
            b.click();
            p.findElement(protractor.by.css('dashboard-panel[paneltitle=tools] .btn.btn-default')).then(function(b1) {
                b1.click();
                p.findElement(protractor.by.css('dashboard-panel[paneltitle=details] .btn.btn-default')).then(function(b2) {
                    expect(b2.isEnabled()).toBe(false);
                });
            });
        });

        // check if the elements have ng-hide attribute
        p.findElements(protractor.by.css('dashboard-panel .pnd-dashboard-panel-expanded.ng-hide')).then(function(elements) {
            expect(elements.length).toBe(2);
        });

    });

    it('should drag (increase width) of first dashboard panel', function() {

        p.driver.manage().window().setSize(1200, 960);

        p.get('/app/examples/dashboard.html');

        // find separator element contained in dashboard-panel tag with attribute paneltitle=
        var sep = p.findElement(protractor.by.css('dashboard-panel[paneltitle=lists] .pnd-dashboard-panel-separator'));

        // panels
        var leftPanel = p.findElement(protractor.by.css('dashboard-panel[paneltitle=lists] .pnd-dashboard-panel'));
        var rightPanel = p.findElement(protractor.by.css('dashboard-panel[paneltitle=tools] .pnd-dashboard-panel'));

        leftPanel.getSize().then(function(leftSize){
            rightPanel.getSize().then(function(rightSize){

                // drag right
                var offset = 20;
                p.actions().dragAndDrop(sep, {x:offset, y:0}).perform();

                // check left width (increased)
                leftPanel.getSize().then(function(newSize){
                    expect(leftSize.width).toBeLessThan(newSize.width);
                    expect(newSize.width).toBe(leftSize.width + offset);
                });

                // check right width (decreased)
                rightPanel.getSize().then(function(newSize){
                    expect(rightSize.width).toBeGreaterThan(newSize.width);
                    expect(newSize.width).toBe(rightSize.width - offset);
                });

            });

        });

        rightPanel.getCssValue('left').then(function(left){
            left = parseInt(left.substring(0, left.length-2), 10);

            // drag left
            var offset = 33;
            p.actions().dragAndDrop(sep, {x:-offset, y:0}).perform();

            // check left 
            rightPanel.getCssValue('left').then(function(newLeft){
                newLeft = parseInt(newLeft.substring(0, newLeft.length-2), 10);
                expect(newLeft).toBeLessThan(left);
                expect(newLeft).toBe(left - offset);
            });

        });
        
    });


});