angular.module('Pundit2.Vocabularies')
.constant('SELECTORMANAGERDEFAULTS', {

    /**
     * @module punditConfig
     * @ngdoc property
     * @name modules#SelectorsManager
     *
     * @description
     * `object`
     *
     * Configuration object for SelectorsManager service. This object contains the part of the configuration
     * common to all selectors and defines: at which dashboard panel add the VocabulariesContainer directive,
     * the type of the context menu opened on items, the directive template path and a some others properties.
     *
     * All selectors shown its items by VocabulariesContainer directive.
     */

    /**
     * @module punditConfig
     * @ngdoc property
     * @name modules#SelectorsManager.clientDashboardTemplate
     *
     * @description
     * `string`
     *
     * Path of template containing myItemsContainer directive, client will append the content of this template 
     * to the DOM (inside dashboard directive) to bootstrap this component
     *
     * Default value:
     * <pre> clientDashboardTemplate: "src/Lists/Vocabularies/VocabulariesContainer/ClientVocabulariesContainer.tmpl.html" </pre>
     */
    clientDashboardTemplate: "src/Lists/Vocabularies/VocabulariesContainer/ClientVocabulariesContainer.tmpl.html",
    
    /**
     * @module punditConfig
     * @ngdoc property
     * @name modules#SelectorsManager.clientDashboardPanel
     *
     * @description
     * `string`
     *
     * Name of the panel where append the VocabulariesContainer directive (legal value to default are: 'lists', 'tools' and 'details')
     *
     * Default value:
     * <pre> clientDashboardPanel: "lists" </pre>
     */
    clientDashboardPanel: "lists",
    
    /**
     * @module punditConfig
     * @ngdoc property
     * @name modules#SelectorsManager.clientDashboardTabTitle
     *
     * @description
     * `string`
     *
     * Tab title inside panel dashboard tabs.
     *
     * Default value:
     * <pre> clientDashboardTabTitle: "Vocab" </pre>
     */
    clientDashboardTabTitle: "Vocab",

    /**
     * @module punditConfig
     * @ngdoc property
     * @name modules#SelectorsManager.cMenuType
     *
     * @description
     * `string`
     *
     * Contextual menu type showed by items contained inside VocabulariesContainer directive.
     *
     * Default value:
     * <pre> cMenuType: 'vocabItems' </pre>
     */
    cMenuType: 'vocabItems',

    /**
     * @module punditConfig
     * @ngdoc property
     * @name modules#SelectorsManager.debug
     *
     * @description
     * `boolean`
     *
     * Active debug log.
     *
     * Default value:
     * <pre> debug: false </pre>
     */
    debug: false,

    /**
     * @module punditConfig
     * @ngdoc property
     * @name modules#SelectorsManager.order
     *
     * @description
     * `string`
     *
     * Default items property used to sort items list inside VocabulariesContainer directive (legal value are: 'label' and 'type').
     *
     * Default value:
     * <pre> order: 'label' </pre>
     */
    order: 'label',

    /**
     * @module punditConfig
     * @ngdoc property
     * @name modules#SelectorsManager.reverse
     *
     * @description
     * `boolean`
     *
     * Default items ordering inside VocabulariesContainer directive (true: ascending, false: descending).
     *
     * Default value:
     * <pre> reverse: false </pre>
     */
    reverse: false,

    /**
     * @module punditConfig
     * @ngdoc property
     * @name modules#SelectorsManager.initialActiveTab
     *
     * @description
     * `number`
     *
     * Default displayed tab
     *
     * Default value:
     * <pre> initialActiveTab: 0 </pre>
     */
    initialActiveTab: 0,

    /**
     * @module punditConfig
     * @ngdoc property
     * @name modules#SelectorsManager.inputIconSearch
     *
     * @description
     * `string`
     *
     * Icon shown in the search input when it's empty.
     *
     * Default value:
     * <pre> inputIconSearch: 'pnd-icon-search' </pre>
     */
    inputIconSearch: 'pnd-icon-search',

    /**
     * @module punditConfig
     * @ngdoc property
     * @name modules#SelectorsManager.inputIconClear
     *
     * @description
     * `string`
     *
     * Icon shown in the search input when it has some content.
     *
     * Default value:
     * <pre> inputIconClear: 'pnd-icon-times' </pre>
     */
    inputIconClear: 'pnd-icon-times'

})
.service('SelectorsManager', function(BaseComponent, SELECTORMANAGERDEFAULTS, $injector, $q) {

    var selectorsManager = new BaseComponent('SelectorsManager', SELECTORMANAGERDEFAULTS);

    // registered selectors
    var selectors = {};
    // active selectors factory instances
    var selectorInstances = [];

    selectorsManager.getItems = function(term){
        
        // a promise resolved when all selectors complete
        // the http query request
        var promise = $q.defer(),
            pendingRequest = selectorInstances.length;

        // get items from actives selectors
        for (var j in selectorInstances) {
            selectorInstances[j].getItems(term).then(function(){
                pendingRequest--;
                if (pendingRequest <= 0 && promise!== null) {
                    promise.resolve();
                    promise = null;
                }
            });
        }

        return promise.promise;

    };

    // inject all selector factory then read config 
    // and instantiate the various instance of the selectors
    // when the init run others factory must to be call the "addSelector" method
    selectorsManager.init = function(){

        selectorInstances = [];

        for (var key in selectors) {

            // selector factory constructor
            var Factory = $injector.get(selectors[key].name);

            // initialize one selector instance
            // for each element in the array
            for (var j in selectors[key].options.instances) {
                var sel = new Factory(selectors[key].options.instances[j]);
                selectorInstances.push(sel);
            }
        }
        selectorsManager.log('Init, add selectors instances', selectorInstances);
    };

    // when the selector factory is load run this method
    // another component (client) should inject the singles selector factory 
    // to start the initialization process
    selectorsManager.addSelector = function(selector){
        selectors[selector.name] = selector;
        selectorsManager.log("Add selector ", selector.name);
    };

    // return all active selectors instances
    selectorsManager.getActiveSelectors = function(){
        return selectorInstances;
    };

    return selectorsManager;

});