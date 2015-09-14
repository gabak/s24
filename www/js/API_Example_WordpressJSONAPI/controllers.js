angular.module('ionizer.wordpressjsonapicontroller', ['ionizer.services', 'ionizer.servicewordpressjsonapi'])

// Controller for the Home Page
.controller('WordpressJSONAPIHomeCtrl', function($scope, $http, $localstorage, wordpressJSONAPIService, utility) {
    $scope.DataAPI = [];
    $scope.allData = [];
    $scope.checkedData = [];
    $scope.hasMoreData = false;


    // Get the checked data from Cache and put into the $scope
    utility.readyCheckBoxes($scope.checkedData, $localstorage.getObject('memoryData_WordpressJSONAPI'));

    // function run everytime a checkbox is clicked
    $scope.saveCheck = function() {

        responseData = utility.saveCheckBoxes($scope.checkedData, $scope.allData, $localstorage.getObject('memoryData_WordpressJSONAPI'), $localstorage.getObject('ObjectData_WordpressJSONAPI'));
        $localstorage.setObject('memoryData_WordpressJSONAPI', responseData.data);
        $localstorage.setObject('ObjectData_WordpressJSONAPI', responseData.dataObject);

    }

    $scope.loadMore = function() {
        console.log('Loadmore');

        wordpressJSONAPIService.setPage();
        wordpressJSONAPIService.callAPI('Home').then(
            function(returnData) {

                if (returnData.length) {
                    for (var i = 0; i < returnData.length; i++) {
                        $scope.allData.push(returnData[i]);
                    }
                    $scope.DataAPI = utility.partition($scope.allData, 3);
                    $scope.hasMoreData = true;

                } else {
                    $scope.hasMoreData = false;
                }
            }
        ).finally(function() {
            $scope.$broadcast('scroll.infiniteScrollComplete')
        });
    };

    // function to run everytime the user "pulls to refresh"
    $scope.doRefresh = function() {

        wordpressJSONAPIService.setPage(1);
        wordpressJSONAPIService.callAPI('Home').then(
            function(returnData) {
                $localstorage.setObject('cacheData_WordpressJSONAPI', returnData);

                if (returnData.length) {
                    for (var i = 0; i < returnData.length; i++) {
                        $scope.allData.push(returnData[i]);
                    }
                    $scope.DataAPI = utility.partition($scope.allData, 3);
                    $scope.hasMoreData = true;

                } else {
                    $scope.hasMoreData = false;
                }
            }
        ).finally(function() {
            $scope.$broadcast('scroll.refreshComplete')
        });

    }

    // logic for rechache, current home page data will be kept for 10 minutes unless the user initiates a refresh
    var recache = false;

    if ($localstorage.get('cacheTime_WordpressJSONAPI')) {
        var tChache = Date.parse($localstorage.get('cacheTime_WordpressJSONAPI'));
        var tNow = new Date().getTime();

        if (parseInt((tNow - tChache) / (60 * 1000)) > 10) {
            $localstorage.set('cacheTime_WordpressJSONAPI', Date());
            recache = true;
        }
    } else {
        $localstorage.set('cacheTime_WordpressJSONAPI', Date());
        recache = true;
    }

    if (!$localstorage.getObject('cacheData_WordpressJSONAPI').length) {
        recache = true;
    }

    // call Service to get Data
    if (recache) {

        wordpressJSONAPIService.callAPI('Home').then(
            function(returnData) {
                $localstorage.setObject('cacheData_WordpressJSONAPI', returnData);
                $scope.DataAPI = utility.partition(returnData, 3);
                $scope.allData = returnData;

            }
        );
    } else {
        $scope.allData = $localstorage.getObject('cacheData_WordpressJSONAPI');
        $scope.DataAPI = utility.partition($localstorage.getObject('cacheData_WordpressJSONAPI'), 3);
    }
})

// Controller for Detail Pages used at every Tab
.controller('WordpressJSONAPIDetailCtrl', function($scope, $http, $stateParams, wordpressJSONAPIService) {
    $scope.data = [];

    wordpressJSONAPIService.setID($stateParams.dataID);

    wordpressJSONAPIService.callAPI('Detail').then(
        function(returnData) {
            $scope.data = returnData;
        }
    );

})

// Controller for Search Page
.controller('WordpressJSONAPISearchCtrl', function($scope, $http, $timeout, $localstorage, wordpressJSONAPIService, utility) {
    $scope.DataAPI = [];
    $scope.allData = [];

    $scope.checkedData = [];
    $scope.hasMoreData = false;

    // Get the checked data from Cache and put into the $scope
    utility.readyCheckBoxes($scope.checkedData, $localstorage.getObject('memoryData_WordpressJSONAPI'));

    // function run everytime a checkbox is clicked
    $scope.saveCheck = function() {
        responseData = utility.saveCheckBoxes($scope.checkedData, $scope.DataAPI, $localstorage.getObject('memoryData_WordpressJSONAPI'), $localstorage.getObject('ObjectData_WordpressJSONAPI'));
        $localstorage.setObject('memoryData_WordpressJSONAPI', responseData.data);
        $localstorage.setObject('ObjectData_WordpressJSONAPI', responseData.dataObject);
    }

    $scope.loadMore = function() {
        console.log('Loadmore');

        wordpressJSONAPIService.setPage();
        wordpressJSONAPIService.callAPI('Search').then(
            function(returnData) {

                if (returnData.length) {
                    for (var i = 0; i < returnData.length; i++) {
                        $scope.allData.push(returnData[i]);
                    }
                    $scope.DataAPI = utility.partition($scope.allData, 3);
                    $scope.hasMoreData = true;

                } else {
                    $scope.hasMoreData = false;
                }
            }
        ).finally(function() {
            $scope.$broadcast('scroll.infiniteScrollComplete')
        });
    };

    // using watch so that APICall will not be sent unless the users has stopper typing for 1000ms
    $scope.$watch('query', function(tmpStr) {

        // if the search query is empty, do nothing
        if (!tmpStr || tmpStr.length == 0) {
            return 0;
        }


        setTimeout(function() {

            // if searchStr is still the same..
            // go ahead and retrieve the data
            if (tmpStr === $scope.query) {

                wordpressJSONAPIService.setPage(0);
                wordpressJSONAPIService.setQuery($scope.query);
                $scope.allData = [];
                console.log('Calling Load More from Search Query');
                $scope.loadMore();

            }
        }, 1000);


    });

})

// controller for bookmark page, shows data based on local storage
.controller('WordpressJSONAPIBookmarkCtrl', function($scope, $localstorage) {
    $scope.DataAPI = $localstorage.getObject('ObjectData_WordpressJSONAPI');
});
