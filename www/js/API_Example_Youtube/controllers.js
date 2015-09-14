angular.module('ionizer.youtubecontroller', ['ionizer.services', 'ionizer.serviceyoutube'])

// Controller for the Youtube Home Page
.controller('YoutubeHomeCtrl', function($scope, $http, $localstorage, youtubeService, utility, $ionicPopup) {
    $scope.DataAPI = [];
    $scope.allData = [];
    $scope.checkedData = [];

    $scope.openDetail = function() {
        $state.go('app.youtube.home');
    }

    // Get the checked data from Cache and put into the $scope
    utility.readyCheckBoxes($scope.checkedData, $localstorage.getObject('memoryData_youtube'));

    // function run everytime a checkbox is clicked
    $scope.saveCheck = function() {

        responseData = utility.saveCheckBoxes($scope.checkedData, $scope.allData, $localstorage.getObject('memoryData_youtube'), $localstorage.getObject('ObjectData_youtube'));
        $localstorage.setObject('memoryData_youtube', responseData.data);
        $localstorage.setObject('ObjectData_youtube', responseData.dataObject);

    }

    // function to run everytime the user "pulls to refresh"
    $scope.doRefresh = function() {

        youtubeService.callAPI('Home').then(
            function(returnData) {
                $localstorage.setObject('cacheData_youtube', returnData);
                $scope.allData = returnData;
                $scope.DataAPI = utility.partition(returnData, 3);
            }
        ).finally(function() {
            $scope.$broadcast('scroll.refreshComplete')
        });

    }

    // logic for rechache, current home page data will be kept for 10 minutes unless the user initiates a refresh
    var recache = false;

    if ($localstorage.get('cacheTime_youtube')) {
        var tChache = Date.parse($localstorage.get('cacheTime_youtube'));
        var tNow = new Date().getTime();

        if (parseInt((tNow - tChache) / (60 * 1000)) > 10) {
            $localstorage.set('cacheTime_youtube', Date());
            recache = true;
        }
    } else {
        $localstorage.set('cacheTime_youtube', Date());
        recache = true;
    }

    if (!$localstorage.getObject('cacheData_youtube').length) {
        recache = true;
    }

    // call Service to get Data
    if (recache) {

        youtubeService.callAPI('Home').then(
            function(returnData) {
                $localstorage.setObject('cacheData_youtube', returnData);
                $scope.DataAPI = utility.partition(returnData, 3);
                $scope.allData = returnData;

            }
        );
    } else {
        $scope.allData = $localstorage.getObject('cacheData_youtube');
        $scope.DataAPI = utility.partition($localstorage.getObject('cacheData_youtube'), 3);
    }
})

// Controller for Detail Pages used at every Tab
.controller('YoutubeDetailCtrl', function($scope, $http, $stateParams, youtubeService, $ionicPopup) {
    $scope.data = [];
    $scope.channel = [];

    youtubeService.setID($stateParams.dataID);

    youtubeService.callAPI('Detail').then(
        function(returnData) {
            $scope.data = returnData;
            youtubeService.setChannel(returnData.API_Channel);

            console.log(returnData);

            youtubeService.callAPI('Channel').then(
                function(returnChannel) {
                    $scope.channel = returnChannel;
                }
            );
        }
    );

})

// Controller for Search Page
.controller('YoutubeSearchCtrl', function($scope, $http, $timeout, $localstorage, youtubeService, utility) {
    $scope.DataAPI = [];
    $scope.allData = [];

    $scope.checkedData = [];
    $scope.hasMoreData = false;

    // Get the checked data from Cache and put into the $scope
    utility.readyCheckBoxes($scope.checkedData, $localstorage.getObject('memoryData_youtube'));

    // function run everytime a checkbox is clicked
    $scope.saveCheck = function() {
        responseData = utility.saveCheckBoxes($scope.checkedData, $scope.DataAPI, $localstorage.getObject('memoryData_youtube'), $localstorage.getObject('ObjectData_youtube'));
        $localstorage.setObject('memoryData_youtube', responseData.data);
        $localstorage.setObject('ObjectData_youtube', responseData.dataObject);
    }

    $scope.loadMore = function() {

        youtubeService.callAPI('Search').then(
            function(returnData) {

                if (returnData.length) {
                    for (var i = 0; i < returnData.length; i++) {
                        $scope.allData.push(returnData[i]);
                    }
                    $scope.DataAPI = utility.partition($scope.allData, 3);
                    console.log(returnData)
                    youtubeService.setPage(returnData[0].API_NextPage);
                    if (returnData[0].API_NextPage) {
                        $scope.hasMoreData = true;
                    } else {
                        $scope.hasMoreData = false;
                    }
                } else {
                    $scope.hasMoreData = false;
                }
            }
        ).finally(function() {
            $scope.$broadcast('scroll.infiniteScrollComplete');
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

                youtubeService.setPage();
                youtubeService.setQuery($scope.query);
                $scope.allData = [];
                console.log('Calling Load More from Search Query');
                $scope.loadMore();

            }
        }, 1000);


    });

})

// controller for Authorization Tab
// After user initiates Login, will call InAppBrowser using ngCordova
// Also will get Username and Profile Picture using a Service Call

.controller('YoutubeAuthorizeCtrl', function($scope, $rootScope, $localstorage, $ionicPopup, $cordovaOauth, youtubeService) {

    $scope.PROFILE_IMG = $localstorage.get('YoutubeProfilePic');
    $scope.PROFILE_Name = $localstorage.get('YoutubeProfileName');
    $scope.YoutubeToken = $localstorage.get('YoutubeToken');
    $scope.YoutubeAuthExpires = $localstorage.get('YoutubeAuthExpires');

    if (typeof $localstorage.get('YoutubeToken') == 'undefined' || $localstorage.get('YoutubeToken') == '') {
        $scope.Authorized = false
    } else {
        $scope.Authorized = true
    }

    $scope.authorize = function() {
        $cordovaOauth.google("761347382364-4hk6bbgm1k3vl9m7c3kdoigovi2cf08u.apps.googleusercontent.com", ["https://www.googleapis.com/auth/urlshortener", "https://www.googleapis.com/auth/userinfo.email", "https://www.googleapis.com/auth/youtube", "https://www.googleapis.com/auth/youtube.readonly"]).then(function(result) {
            // On Success
            $localstorage.set('YoutubeToken', result.access_token);
            $localstorage.setObject('YoutubeAuth', result);

            // Lets tell the users when the Token Expires
            var timeObject = new Date()
            timeObject = new Date(timeObject.getTime() + 1000 * result.expires_in);
            $localstorage.set('YoutubeAuthExpires', timeObject);
            $scope.YoutubeAuthExpires = $localstorage.get('YoutubeAuthExpires');

            // Lets set the Template Scope Variables
            $scope.YoutubeToken = $localstorage.get('YoutubeToken');
            $scope.Authorized = true;
            $rootScope.YoutubeAuthorized = true;
            console.log($scope.Authorized);

            //Now, we can go ahead and get the ProfilePic and ProfileName
            youtubeService.setAccessToken(result.access_token);
            youtubeService.callAPI('Profile').then(
                function(returnData) {
                    $scope.PROFILE_IMG = returnData.PROFILE_IMG;
                    $scope.PROFILE_Name = returnData.PROFILE_Name;
                    $localstorage.set('YoutubeProfilePic', returnData.PROFILE_IMG);
                    $localstorage.set('YoutubeProfileName', returnData.PROFILE_Name);
                }
            );

            // Lets use a Pop Up to tell the User that the OAuth2 was a success
            // Lets create a Popup using IonicPopup
            var alertPopup = $ionicPopup.alert({
                title: 'Youtube OAUTH Success!',
                template: JSON.stringify(result)
            });

            // Now call the Popup and do some stuff at the same time
            alertPopup.then(function(res) {
                console.log(JSON.stringify(result));
            });
        }, function(error) {
            // On Error
            $scope.Authorized = false;
            $rootScope.YoutubeAuthorized = false;

            // Gotta destroy all the localStorage variables using $localstorage
            $localstorage.destroy('YoutubeToken');
            $localstorage.destroy('YoutubeProfilePic');
            $localstorage.destroy('YoutubeProfileName');
            $localstorage.destroy('YoutubeAuth');

            console.log($scope.Authorized);

            // Lets tell the user that there was an error
            var alertPopup = $ionicPopup.alert({
                title: 'Youtube OAUTH Error!',
                template: error
            });
            alertPopup.then(function(res) {
                console.log(error);
            });
        });
    }

    // This happens when the user presses the Log Off Button
    $scope.logoff = function() {
        $localstorage.destroy('YoutubeToken');
        $localstorage.destroy('YoutubeProfilePic');
        $localstorage.destroy('YoutubeProfileName');
        $localstorage.destroy('YoutubeAuth');
        $localstorage.destroy('cacheTime_youtubeSubs');
        $localstorage.destroy('cacheData_youtubeSubs');

        $scope.YoutubeToken = '';
        $scope.Authorized = false;
        $rootScope.YoutubeAuthorized = false;
    }


})

// Controller for the Subscription Page
// This is a simple example on how to use the Request Token we got
.controller('YoutubeSubscriptionCtrl', function($scope, $http, $localstorage, youtubeService, utility, $ionicPopup) {
        $scope.DataAPI = [];
        $scope.allData = [];
        $scope.checkedData = [];

        youtubeService.setAccessToken($localstorage.get('YoutubeToken'));

        $scope.openSubscription = function(video) {

            var alertPopup = $ionicPopup.alert({
                title: 'Action on Subscription!',
                template: 'Do Something here...'
            });
            alertPopup.then(function(res) {
                console.log('Do Something here...');
            });

        };


        // function to run everytime the user "pulls to refresh"
        $scope.doRefresh = function() {

            if (Date() < $localstorage.get('YoutubeAuthExpires')) {
                youtubeService.callAPI('Subscription').then(
                    function(returnData) {
                        $localstorage.setObject('cacheData_youtubeSubs', returnData);
                        $scope.allData = returnData;
                        $scope.DataAPI = utility.partition(returnData, 3);
                    }
                ).finally(function() {
                    $scope.$broadcast('scroll.refreshComplete')
                });

            } else {
                var alertPopup = $ionicPopup.alert({
                    title: 'Oops, Token Expired!',
                    template: 'Please login again'
                });
                alertPopup.then(function(res) {
                    console.log('Token Expired');
                });
                $scope.$broadcast('scroll.refreshComplete')
            }


        }

        // logic for rechache, current home page data will be kept for 10 minutes unless the user initiates a refresh
        var recache = false;

        if ($localstorage.get('cacheTime_youtubeSubs')) {
            var tChache = Date.parse($localstorage.get('cacheTime_youtubeSubs'));
            var tNow = new Date().getTime();

            if (parseInt((tNow - tChache) / (60 * 1000)) > 10) {
                $localstorage.set('cacheTime_youtubeSubs', Date());
                recache = true;
            }
        } else {
            $localstorage.set('cacheTime_youtubeSubs', Date());
            recache = true;
        }

        if (!$localstorage.getObject('cacheData_youtubeSubs').length) {
            recache = true;
        }

        // call Service to get Data
        if (recache) {

            youtubeService.callAPI('Subscription').then(
                function(returnData) {
                    $localstorage.setObject('cacheData_youtubeSubs', returnData);
                    $scope.DataAPI = utility.partition(returnData, 3);
                    $scope.allData = returnData;

                }
            );
        } else {
            $scope.allData = $localstorage.getObject('cacheData_youtubeSubs');
            $scope.DataAPI = utility.partition($localstorage.getObject('cacheData_youtubeSubs'), 3);
        }
    })
    // controller for Youtube Tabs
    .controller('YoutubeTabsPageController', function($scope, $rootScope, $localstorage) {

        $rootScope.$watch('YoutubeAuthorized', function() {
            console.log('rootScope senses changes and YoutubeAuthorized is now: ' + $rootScope.YoutubeAuthorized)

            if (typeof $localstorage.get('YoutubeToken') == 'undefined' || $localstorage.get('YoutubeToken') == '') {
                $scope.Authorized = false;
            } else {
                $scope.Authorized = true;
            }
        })
    })
