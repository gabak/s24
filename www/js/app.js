angular.module('ionizer-chat', ['ionic', 'ngCordova', 'firebase', 'monospaced.elastic', 'angularMoment', 'ionizer-chat.controllers', 'ionizer-chat.services', 'ionizer-chat.firebaseController', 'ionizer-chat.servicefirebase'])

.run(function($ionicPlatform, firebaseservice, $state, $rootScope, $localstorage) {
    $ionicPlatform.ready(function() {
        // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
        // for form inputs)
        if (window.cordova && window.cordova.plugins.Keyboard) {
            cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
        }
        if (window.StatusBar) {
            // org.apache.cordova.statusbar required
            StatusBar.styleDefault();
        }

    });

})


.config(function($stateProvider, $urlRouterProvider) {
    $stateProvider

        .state('login', {
        url: '/login',
        templateUrl: 'templates/auth/login.html',
        controller: 'LoginCtrl'
    })

    .state('register', {
        url: '/register',
        templateUrl: 'templates/auth/register.html',
        controller: 'RegisterCtrl'
    })

    .state('forgot', {
        url: '/forgot',
        templateUrl: 'templates/auth/forgot.html',
        controller: 'ForgotCtrl'
    })

    .state('intro', {
        url: '/intro',
        templateUrl: 'templates/intro.html',
        controller: 'IntroCtrl'
    })

    .state('app', {
        url: "/app",
        abstract: true,
        templateUrl: "templates/menu.html",
        controller: 'AppCtrl'
    })


    .state('app.profile', {
        url: '/profile',
        abstract: true,
        views: {
            'menuContent': {
                templateUrl: 'templates/Profile/profile-main.html',
                controller: 'TabsPageController'
            }
        }
    })

    .state('app.profile.personal', {
        url: '/personal',
        views: {
            'tab-personal': {
                templateUrl: 'templates/Profile/profile-personal.html',
                controller: 'profilePersonalCtrl'
            }
        }
    })

    .state('app.profile.social', {
        url: '/social',
        views: {
            'tab-social': {
                templateUrl: 'templates/Profile/profile-social.html',
                controller: 'profileSocialCtrl'
            }
        }
    })

    .state('app.home', {
        url: "/home",
        views: {
            'menuContent': {
                templateUrl: "templates/Chat/home.html",
                controller: 'HomeCtrl'
            }
        }
    })
        .state('app.browse', {
            url: "/browse",
            views: {
                'menuContent': {
                    templateUrl: "templates/browse.html",
                    controller: 'WordpressJSONAPIHomeCtrl'
                }
            }
        })
    .state('app.room', {
        url: "/room/:roomId",
        views: {
            'menuContent': {
                templateUrl: "templates/Chat/room.html",
                controller: 'RoomCtrl'
            }
        }
    })
        // state for the Home Page
        .state('app.wordpressjsonapi.home', {
            url: '/home',
            views: {
                'tab-home': {
                    templateUrl: 'templates/API_Example_WordpressJSONAPI/wordpressjsonapi-home.html',
                    controller: 'WordpressJSONAPIHomeCtrl'
                }
            }
        })

        // state for the detail page of Home Page using an reusable Controller & Template
        .state('app.wordpressjsonapi.detail-home', {
            url: '/home-detail/:dataID',
            views: {
                'tab-home': {
                    templateUrl: 'templates/API_Example_WordpressJSONAPI/wordpressjsonapi-detail.html',
                    controller: 'WordpressJSONAPIDetailCtrl'
                }
            }
        })

        // state for the search page
        .state('app.wordpressjsonapi.search', {
            url: '/search',
            views: {
                'tab-search': {
                    templateUrl: 'templates/API_Example_WordpressJSONAPI/wordpressjsonapi-search.html',
                    controller: 'WordpressJSONAPISearchCtrl'
                }
            }
        })

        // state for the detail page of Search Page using an reusable Controller & Template
        .state('app.wordpressjsonapi.detail-search', {
            url: '/search-detail/:dataID',
            views: {
                'tab-search': {
                    templateUrl: 'templates/API_Example_WordpressJSONAPI/wordpressjsonapi-detail.html',
                    controller: 'WordpressJSONAPIDetailCtrl'
                }
            }
        })

        //state for the bookmark page
        .state('app.wordpressjsonapi.bookmark', {
            url: '/bookmark',
            views: {
                'tab-bookmark': {
                    templateUrl: 'templates/API_Example_WordpressJSONAPI/wordpressjsonapi-bookmark.html',
                    controller: 'WordpressJSONAPIBookmarkCtrl'
                }
            }
        })

        // state for the detail page of Bookmark Page using an reusable Controller & Template
        .state('app.wordpressjsonapi.detail-bookmark', {
            url: '/bookmark-detail/:dataID',
            views: {
                'tab-bookmark': {
                    templateUrl: 'templates/API_Example_WordpressJSONAPI/wordpressjsonapi-detail.html',
                    controller: 'WordpressJSONAPIDetailCtrl'
                }
            }
        })
        // This state is for the Youtube  example, using Tabs
        .state('app.youtube', {
            url: '/youtube',
            abstract: true,
            views: {
                'menuContent': {
                    templateUrl: 'templates/API_Example_Youtube/youtube-main.html',
                    controller: 'YoutubeTabsPageController'
                }
            }
        })

        // Each tab has its own nav history stack:

        // state for the Youtube Home Page
        .state('app.youtube.home', {
            url: '/home',
            views: {
                'tab-home': {
                    templateUrl: 'templates/API_Example_Youtube/youtube-home.html',
                    controller: 'YoutubeHomeCtrl'
                }
            }
        })

        // state for the detail page of Home Page using an reusable Controller & Template
        .state('app.youtube.detail-home', {
            url: '/home-detail/:dataID',
            views: {
                'tab-home': {
                    templateUrl: 'templates/API_Example_Youtube/youtube-detail.html',
                    controller: 'YoutubeDetailCtrl'
                }
            }
        })

        // state for the Search Page
        .state('app.youtube.search', {
            url: '/search',
            views: {
                'tab-search': {
                    templateUrl: 'templates/API_Example_Youtube/youtube-search.html',
                    controller: 'YoutubeSearchCtrl'
                }
            }
        })

        // state for the Search Detail Page
        .state('app.youtube.detail-search', {
            url: '/search-detail/:dataID',
            views: {
                'tab-search': {
                    templateUrl: 'templates/API_Example_Youtube/youtube-detail.html',
                    controller: 'YoutubeDetailCtrl'
                }
            }
        })

        // state for the Youtube Authorize Tab
        .state('app.youtube.authorize', {
            url: '/authorize',
            views: {
                'tab-authorize': {
                    templateUrl: 'templates/API_Example_Youtube/youtube-authorize.html',
                    controller: 'YoutubeAuthorizeCtrl'
                }
            }
        })

        // state for the Youtube see Subscriptions Tab
        .state('app.youtube.subscription', {
            url: '/subscription',
            views: {
                'tab-subscription': {
                    templateUrl: 'templates/API_Example_Youtube/youtube-subscription.html',
                    controller: 'YoutubeSubscriptionCtrl'
                }
            }
        })

        // state for the detail page of Home Page using an reusable Controller & Template
        .state('app.youtube.detail-subscription', {
            url: '/subscription-detail/:dataID',
            views: {
                'tab-subscription': {
                    templateUrl: 'templates/API_Example_Youtube/youtube-detail.html',
                    controller: 'YoutubeDetailCtrl'
                }
            }
        });


        // if none of the above states are matched, use this as the fallback
    if (window.localStorage['showTutorial'] === "false") {
        if (window.localStorage['uid'] !== undefined) {
            $urlRouterProvider.otherwise('/app/home');
        } else {
            $urlRouterProvider.otherwise('/login');
        }
    } else {
        $urlRouterProvider.otherwise('/login');
    }
});
