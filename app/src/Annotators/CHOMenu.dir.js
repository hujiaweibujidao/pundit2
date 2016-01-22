/*global $:false */

angular.module('Pundit2.Annotators')

    .directive('choMenu', function($rootScope, NameSpace, ContextualMenu,
        Toolbar, ImageHandler, ImageAnnotator, ItemsExchange, TemplatesExchange,
        TripleComposer, EventDispatcher, Item, XpointersHelper) {

        return {
            restrict: 'C',
            scope: true,
            templateUrl: 'src/Annotators/CHOMenu.dir.tmpl.html',
            link: function(scope, element) {

                scope.element = element;
                scope.item = null;


                var createItemFromCHO = function(CHOElem) {
                    var values = {};

                    values.uri = CHOElem.attr('about');
                    values.cMenuType = "CHOHandlerItem";
                    values.label =  CHOElem.parent().text().trim();
                    values.type = values.type = [NameSpace.types.resource]; // TODO to be defined
                    values.pageContext = XpointersHelper.getSafePageContext();

                    return new Item(values.uri, values);
                };

                element.on('click',  function (evt) {
                    if (scope.item === null) {
                        // create item only once
                        scope.item = createItemFromCHO(scope.element);
                        ItemsExchange.addItemToContainer(scope.item, "createdCHO");
                    }
                    if (Toolbar.isActiveTemplateMode()) {
                        var triples = TemplatesExchange.getCurrent().triples;
                        // verify that all predicates admit images as subject
                        // all template triples must be have a predicate
                        for (var i in triples) {
                            if (triples[i].predicate.suggestedSubcjetTypes.indexOf(NameSpace.types.resource) === -1) {
                                return;
                            }
                        }

                        TripleComposer.addToAllSubject(ItemsExchange.getItemByUri(scope.item.uri));
                        TripleComposer.closeAfterOp();
                        EventDispatcher.sendEvent('Annotators.saveAnnotation');
                        return;
                    }

                    ContextualMenu.show(evt.pageX, evt.pageY, scope.item, scope.item.cMenuType);
                });

                //scope.url = attributes.pndResource;



                 //read CHO coordinate and position the directive
                var overIcon = function() {
                    scope.element.css({
                        //color: gray
                        color: '#333333',
                    });
                    scope.element.hover(
                        function() {
                            $(this).css({
                                //color: yellow
                                color: '#F5B800',
                                cursor: 'pointer'
                            });
                        },
                        function() {
                            $(this).css({
                                //color: gray
                                color: '#333333',
                            });
                        }
                    );
                };
                overIcon();


            } // link()
        };
    });