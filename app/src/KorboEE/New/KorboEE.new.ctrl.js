angular.module('KorboEE')
    .controller('KeeNewCtrl', function($scope, $modal, KorboCommunicationService, $q, KorboCommunicationFactory, korboConf, $timeout, $modal) {

        $scope.tabs = [];
        $scope.disactiveLanguages = [];
        $scope.disactiveLanguagesPopoverTemplate = 'src/KorboEE/New/KorboEE.languagesPopover.tmpl.html';
        $scope.imageUrl = "";
        $scope.saveClicked = false;
        $scope.activeFilter = false;
        $scope.isSaving = false;
        $scope.topAreaMessage = "You are creating a new entity";
        var korboComm = new KorboCommunicationFactory();

        // tooltip message for image url
        $scope.imageUrlErrorMessage = "Invalid URL";
        $scope.imageUrlTooltipeMessage = "Depiction URL";
        $scope.imageUrlHasError = false;
        var urlPattern = new RegExp('(http|ftp|https)://[a-z0-9\-_]+(\.[a-z0-9\-_]+)+([a-z0-9\-\.,@\?^=%&;:/~\+#]*[a-z0-9\-@\?^=%&;/~\+#])?', 'i');

        // tooltip messages for languages
        var tooltipMessageTitle = "Insert title of the entity in ";
        var tooltipMessageDescription = "Insert description of the entity in ";
        var errorMandatory = "The Title field is mandatory and must be filled";
        var errorLabelTooShort = " The Title must be contain at least " + $scope.conf.labelMinLength +" characters";

        // build types
        $scope.types = angular.copy($scope.conf.type);
        $scope.typesHasError = false;
        $scope.typesErrorMessage = "You must select at least one type";
        $scope.typesTooltipeMessage = "Select at least one type";

        // Setting checked defaults copying state
        for (var i in $scope.types) {
            $scope.types[i].checked = $scope.types[i].state || false;
        }

        console.log("controller run (!!!)");
        //build languages tabs
        for(var i=0; i< $scope.conf.languages.length; i++){

            var title = angular.uppercase($scope.conf.languages[i].value);
            var name = angular.lowercase($scope.conf.languages[i].name);
            var lang = {
                'title': title,
                'name' : $scope.conf.languages[i].name,
                'description': "",
                'label': "",
                'mandatory': true,
                'hasError': false,
                'tooltipMessageTitle': tooltipMessageTitle + name,
                'tooltipMessageDescription': tooltipMessageDescription + name,
                'tooltipMessageError': "message",
                'tooltipMessageErrorTab': "There are some errors in the "+name+" languages fields"
            };

            if($scope.conf.languages[i].state){
                $scope.tabs.push(lang);
            } else {
                $scope.disactiveLanguages.push(lang);
            }

        }

    // check if language field are all right filled
    var checkLanguages = function(){
        var allLangAreOk = true;
        for(var l=0; l<$scope.tabs.length; l++){

            (function(index) {
                if(typeof($scope.tabs[index].label) === 'undefined' || $scope.tabs[index].label === ''){
                    $scope.tabs[index].hasError = true;
                    allLangAreOk = false;
                    $scope.tabs[index].tooltipMessageError = errorMandatory;
                } else if($scope.tabs[index].label.length < $scope.conf.labelMinLength){
                    $scope.tabs[index].hasError = true;
                    allLangAreOk = false;
                    $scope.tabs[index].tooltipMessageError = errorLabelTooShort;
                } else
                {
                    $scope.tabs[index].hasError = false;
                }

            })(l);

        }

        return allLangAreOk;
    };

    $scope.updateTypes = function(){
        var count = 0;
        for (var i in $scope.types) {
            if ($scope.types[i].checked){
                count++;
            }
        }
        if($scope.saveClicked){
            if(count === 0){
                $scope.typesHasError = true;
            } else {
                $scope.typesHasError = false;
            }
        }

        return count;
    };

    // return true if url is valid, false otherwise
    $scope.checkUrl = function(){
        if($scope.imageUrl === '' || urlPattern.test($scope.imageUrl)){
            if($scope.saveClicked){
                $scope.imageUrlHasError = false;
            }

            return true;
        } else {
            if($scope.saveClicked){
                $scope.imageUrlHasError = true;
            }

            return false;
        }
    };

   $scope.updateTitleField = function(index){

       if($scope.tabs[index].label === ''){
           $scope.tabs[index].tooltipMessageError = errorMandatory;
       }

       else if($scope.tabs[index].label !== '' && $scope.tabs[index].label.length < $scope.conf.labelMinLength){
           $scope.tabs[index].tooltipMessageError = errorLabelTooShort;
       }

       else if($scope.tabs[index].label !== '' && $scope.tabs[index].label.length >= $scope.conf.labelMinLength){
           $scope.tabs[index].hasError = false;
       }

   };


    $scope.save = function(){
        $scope.saveClicked = true;

        var checkLang = checkLanguages();
        $scope.updateTypes();
        $scope.checkUrl();

        if(!$scope.imageUrlHasError && !$scope.typesHasError && checkLang){

            $scope.isSaving = true;
            $scope.topAreaMessage = "Saving entity...";

            // get checked types
            var newTypes = [];
            for(var i=0; i<$scope.types.length; i++){
                if ($scope.types[i].checked){
                    newTypes.push($scope.types[i].URI);
                }
            }
            var lang = angular.lowercase($scope.tabs[0].title);

            var entityToSave = {
                "label": $scope.tabs[0].label,
                "abstract": $scope.tabs[0].description,
                "depiction": $scope.imageUrl,
                "type": newTypes
            };

            var promise = korboComm.save(entityToSave, lang, $scope.conf.endpoint, $scope.conf.basketID );
            promise.then(function(res){

                // get id from location of entity just created// All other label types, take the last part
                var id = res.substring(res.lastIndexOf('/') + 1);
                var location = res;

                // check if there are more than 1 languages
                if($scope.tabs.length > 1){
                    var allPromises = [];
                    for(var i=1; i<$scope.tabs.length; i++){

                        (function(index) {

                            var lang = angular.lowercase($scope.tabs[index].title);
                            var entityToEdit = {
                                "id": id,
                                "label": $scope.tabs[index].label,
                                "abstract": $scope.tabs[index].description
                            };
                            var langPromise = korboComm.save(entityToEdit, lang, $scope.conf.endpoint, $scope.conf.basketID );
                            allPromises.push(langPromise);
                        })(i);

                    }

                    $q.all(allPromises).then(function(res){
                        $scope.isSaving = false;
                        $scope.directiveScope.location = location;
                        $scope.directiveScope.elemToSearch = $scope.tabs[0].label;
                        $scope.directiveScope.label = $scope.tabs[0].label;
                        $scope.topAreaMessage = "Entity saved!";
                        $timeout(function(){
                            KorboCommunicationService.closeModal();
                            // set modal as close in configuration
                            korboConf.setIsOpenModal(false);
                        }, 1000);
                    },
                    function(err){
                        $scope.topAreaMessage = "Entity saving error because: "+err;
                    });

                } else {
                    // non ho altre lingue da aggiungere, quindi posso chiudere la modale
                    $scope.directiveScope.location = location;
                    $scope.directiveScope.elemToSearch = $scope.tabs[0].label;
                    $scope.directiveScope.label = $scope.tabs[0].label;
                    $scope.isSaving = false;
                    $scope.topAreaMessage = "Entity saved!";
                    // close modal
                    $timeout(function(){
                        KorboCommunicationService.closeModal();
                        // set modal as close in configuration
                        korboConf.setIsOpenModal(false);
                    }, 1000);

                }
            },
            function(err){
                $scope.topAreaMessage = "Entity saving error because: "+err;
            });



        } else {
            console.log("ci sono errori");
        }

    };

    $scope.clearForm = function(){
        $scope.saveClicked = false;
        // reset all title and description for each languages
        for(var l=0; l<$scope.tabs.length; l++){
            (function(index) {
                $scope.tabs[index].label = "";
                $scope.tabs[index].description = "";

            })(l);
        } // end for

        // Reset types
        $scope.types = angular.copy($scope.conf.type);
        for (var i in $scope.types) {
            $scope.types[i].checked = $scope.types[i].state || false;
        }

        // reset image url
        $scope.imageUrl = "";
    };

    $scope.previewImage = "";
    var timer;

    //TODO controllare che l'image url risponda con un contenuto valido oppure no
    $scope.$watch('imageUrl', function(val){
        if(val !== '' && urlPattern.test(val)){
            $timeout.cancel(timer);
            timer = $timeout(function(){
                $scope.showImg = true;
                $scope.previewImage = val;
                console.log(val);
            }, 1000);
            // if input type is empty
        } else {
            $scope.showImg = false;
        }
    });

    $scope.removeImage = function(){
        $scope.showImg = false;
        $scope.previewImage = "";
        $scope.imageUrl = "";
    };

    $scope.addLanguage = function(lang) {
        var langIndex = $scope.disactiveLanguages.indexOf(lang);
        $scope.disactiveLanguages.splice(langIndex, 1);
        $scope.tabs.push(lang);
    };


});

