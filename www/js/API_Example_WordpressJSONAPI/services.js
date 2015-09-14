angular.module('ionizer.servicewordpressjsonapi', ['ionizer.services'])

// This Factory provides API Calls
.factory('wordpressJSONAPIService', ['$http', '$q', 'APIFunctions', 'utility', function($http, $q, APIFunctions, utility) {

    var _query = '';
    var _detailID = '';
    var _URL = '';
    var _page = 1;
    var _params = '';

    var getPropByString = utility.getPropByString;

    var APICallsettings = {};

    var settings = {};

    settings.APIKey = '85477304d6908074485ae5db6665ed2b';


    settings.method = 'JSONP'

    // Name of the search and detail Property
    settings.searchProperty = 'q';
    settings.detailProperty = '';


    getReturnData = function(data) {
        return data
    };

    // Home Properties
    settings.homeSettings = {
        URL: {
            baseURL: function() {
                return 'http://www.interfeis.com/demo/wordpress/alchemist/';
            },
            params: {
                json: function() {
                    return 'get_recent_posts'
                },
                count: function() {
                    return 9
                },
                callback: function() {
                    return 'JSON_CALLBACK'
                },
                date_format: function() {
                    return 'M j, Y'
                },
                page: function() {
                    return _page
                }
            }
        },
        Type: 'list',
        API_DataProperty: 'posts',
        returnElements: {
            API_ID: function(data) {
                return getPropByString(data, 'id')
            },
            API_Title: function(data) {
                return getPropByString(data, 'title')
            },
            API_Subtext: function(data) {
                return 'By ' + getPropByString(data, 'author.nickname') + ' at ' + getPropByString(data, 'date')
            },
            API_IMGURL: function(data) {
                return getPropByString(data, 'attachments')
            },
            API_AddText: function(data) {
                return getPropByString(data, 'excerpt')
            },
            API_DetailText: function(data) {
                return 'Site: ' + getPropByString(data, 'publisher_url')
            },
            API_Media: function(data) {
                return getPropByString(data, 'custom_fields.Media')
            }
        }
    }

    // Detail Properties
    settings.detailSettings = {
        URL: {
            baseURL: function() {
                return 'http://www.interfeis.com/demo/wordpress/alchemist/';
            },
            params: {
                json: function() {
                    return 'get_post'
                },
                id: function() {
                    return _detailID
                },
                callback: function() {
                    return 'JSON_CALLBACK'
                },
                date_format: function() {
                    return 'M j, Y'
                }
            }
        },
        Type: 'detail',
        API_DataProperty: 'post',
        returnElements: {
            API_ID: function(data) {
                return getPropByString(data, 'id')
            },
            API_Title: function(data) {
                return getPropByString(data, 'title')
            },
            API_Subtext: function(data) {
                return 'By ' + getPropByString(data, 'author.nickname') + ' at ' + getPropByString(data, 'date')
            },
            API_IMGURL: function(data) {
                return getPropByString(data, 'attachments')
            },
            API_AddText: function(data) {
                return getPropByString(data, 'excerpt')
            },
            API_DetailText: function(data) {
                return getPropByString(data, 'excerpt')
            },
            API_Media: function(data) {
                return getPropByString(data, 'custom_fields.Media')
            }
        }
    }

    // Search Properties
    settings.searchSettings = {
        URL: {
            baseURL: function() {
                return 'http://www.interfeis.com/demo/wordpress/alchemist/';
            },
            params: {
                json: function() {
                    return 'get_search_results'
                },
                count: function() {
                    return 9
                },
                callback: function() {
                    return 'JSON_CALLBACK'
                },
                date_format: function() {
                    return 'M j, Y'
                },
                page: function() {
                    return _page
                },
                search: function() {
                    return _query
                }
            }
        },
        Type: 'list',
        API_DataProperty: 'posts',
        returnElements: {
            API_ID: function(data) {
                return getPropByString(data, 'id')
            },
            API_Title: function(data) {
                return getPropByString(data, 'title')
            },
            API_Subtext: function(data) {
                return 'By ' + getPropByString(data, 'author.nickname') + ' at ' + getPropByString(data, 'date')
            },
            API_IMGURL: function(data) {
                return getPropByString(data, 'attachments')
            },
            API_AddText: function(data) {
                return getPropByString(data, 'excerpt')
            },
            API_DetailText: function(data) {
                return getPropByString(data, 'excerpt')
            },
            API_Media: function(data) {
                return getPropByString(data, 'custom_fields.Media')
            }
        }
    }

    return {
        // set query parameter
        setQuery: function(query) {
            _query = query;
        },
        // set detail parameter
        setID: function(detailID) {
            _detailID = detailID;
        },
        getID: function() {
            return _detailID;
        },
        setPage: function(page) {
            if (page == 0) {
                _page = 0
            } else if (!page || page.length == 0) {
                _page = _page + 1;
            } else {
                _page = page;
            }
        },
        getPage: function() {
            return _page;
        },
        callAPI: function(type) {
            switch (type) {
                case 'Home':
                    APICallsettings = settings.homeSettings;
                    break;
                case 'Search':
                    APICallsettings = settings.searchSettings;
                    break;
                case 'Detail':
                    APICallsettings = settings.detailSettings;
                    break;
                default:
                    return 'Not Available';
            }

            var returnURL = APIFunctions.makeURL(APICallsettings);


            var deferred = $q.defer();
            $http({
                    method: settings.method,
                    url: returnURL.URL,
                    params: returnURL.params
                })
                .success(function(data) {
                    console.log(data);
                    deferred.resolve(APIFunctions.prepareData(data, APICallsettings));
                })
                .error(function() {
                    deferred.reject('There was an error');
                })
            return deferred.promise;
        }
    }
}])
