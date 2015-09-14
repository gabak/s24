angular.module('ionizer.serviceyoutube', ['ionizer.services'])

// This Factory provides API Calls
.factory('youtubeService', ['$http', '$q', 'APIFunctions', 'utility', function($http, $q, APIFunctions, utility) {

    var _query = '';
    var _detailID = '';
    var _URL = '';
    var _page = 0;
    var _params = '';
    var _channel = '';
    var _access_token = '';

    var getPropByString = utility.getPropByString;

    var APICallsettings = {};

    var settings = {};

    settings.APIKey = 'AIzaSyAzp8GrUxp4GWwC38xVPBtcLt1eN6KJ2jg';


    settings.method = 'JSONP'

    // Name of the search and detail Property
    settings.searchProperty = 'q';
    settings.detailProperty = '';


    // Home Properties
    settings.homeSettings = {
        URL: {
            baseURL: function() {
                return 'https://www.googleapis.com/youtube/v3/videos';
            },
            params: {
                key: function() {
                    return settings.APIKey
                },
                part: function() {
                    return 'id,snippet,contentDetails,statistics'
                },
                chart: function() {
                    return 'mostPopular'
                },
                callback: function() {
                    return 'JSON_CALLBACK'
                },
                maxResults: function() {
                    return '18'
                }
            }
        },
        Type: 'list',
        API_DataProperty: 'items',
        returnElements: {
            API_ID: function(data) {
                return getPropByString(data, 'id')
            },
            API_Title: function(data) {
                return getPropByString(data, 'snippet.title')
            },
            API_Subtext: function(data) {
                return getPropByString(data, 'snippet.channelTitle')
            },
            API_IMGURL: function(data) {
                return getPropByString(data, 'snippet.thumbnails.high.url')
            },
            API_AddText: function(data) {
                return 'Rated ' + getPropByString(data, 'snippet.description')
            },
            API_DetailText: function(data) {
                return getPropByString(data, 'synopsis')
            },
            API_Video: function(data) {
                return 'http://www.youtube.com/embed/' + getPropByString(data, 'id') + '?showinfo=0'
            },
            API_Duration: function(data) {
                return getPropByString(data, 'contentDetails.duration').replace("PT", "").replace("H", ":").replace("M", ":").replace("S", "")
            },
            API_Like: function(data) {
                return getPropByString(data, 'statistics.likeCount')
            },
            API_Dislike: function(data) {
                return getPropByString(data, 'statistics.dislikeCount')
            },
            API_ViewCount: function(data) {
                return getPropByString(data, 'statistics.viewCount')
            },
            API_Moment: function(data) {
                return moment(getPropByString(data, 'snippet.publishedAt')).fromNow()
            }
        }
    }

    // Subscriber Properties
    settings.subscriberSettings = {
        URL: {
            baseURL: function() {
                return 'https://www.googleapis.com/youtube/v3/subscriptions';
            },
            params: {
                key: function() {
                    return settings.APIKey
                },
                part: function() {
                    return 'snippet'
                },
                access_token: function() {
                    return _access_token
                },
                mine: function() {
                    return true
                },
                callback: function() {
                    return 'JSON_CALLBACK'
                },
                maxResults: function() {
                    return '18'
                }
            }
        },
        Type: 'list',
        API_DataProperty: 'items',
        returnElements: {
            API_ID: function(data) {
                return getPropByString(data, 'id')
            },
            API_Title: function(data) {
                return getPropByString(data, 'snippet.title')
            },
            API_Subtext: function(data) {
                return getPropByString(data, 'snippet.channelTitle')
            },
            API_IMGURL: function(data) {
                return getPropByString(data, 'snippet.thumbnails.high.url')
            },
            API_AddText: function(data) {
                return 'Rated ' + getPropByString(data, 'snippet.description')
            }
        }
    }

    // Channel Properties
    settings.channelSettings = {
        URL: {
            baseURL: function() {
                return 'https://www.googleapis.com/youtube/v3/channels';
            },
            params: {
                key: function() {
                    return settings.APIKey
                },
                part: function() {
                    return 'id,snippet,statistics'
                },
                id: function() {
                    return _channel
                },
                callback: function() {
                    return 'JSON_CALLBACK'
                }
            }
        },
        Type: 'detail',
        API_DataProperty: 'items.0',
        returnElements: {
            CHANNEL_ID: function(data) {
                return getPropByString(data, 'id')
            },
            CHANNEL_Subs: function(data) {
                return getPropByString(data, 'statistics.viewCount')
            },
            CHANNEL_IMG: function(data) {
                return getPropByString(data, 'snippet.thumbnails.default.url')
            }
        }
    }

    // Profile Properties
    settings.profileSettings = {
        URL: {
            baseURL: function() {
                return 'https://www.googleapis.com/plus/v1/people/me';
            },
            params: {
                key: function() {
                    return settings.APIKey
                },
                callback: function() {
                    return 'JSON_CALLBACK'
                },
                access_token: function() {
                    return _access_token
                }
            }
        },
        Type: 'detail',
        API_DataProperty: '',
        returnElements: {
            PROFILE_Name: function(data) {
                return getPropByString(data, 'displayName')
            },
            PROFILE_IMG: function(data) {
                return getPropByString(data, 'image.url').replace("?sz=50", "")
            }
        }
    }


    // Detail Properties
    settings.detailSettings = {
        URL: {
            baseURL: function() {
                return 'https://www.googleapis.com/youtube/v3/videos';
            },
            params: {
                key: function() {
                    return settings.APIKey
                },
                part: function() {
                    return 'id,snippet,contentDetails,statistics'
                },
                id: function() {
                    return _detailID
                },
                callback: function() {
                    return 'JSON_CALLBACK'
                }
            }
        },
        Type: 'detail',
        API_DataProperty: 'items.0', //Not Needed for Detail
        returnElements: {
            API_ID: function(data) {
                return getPropByString(data, 'id')
            },
            API_VideoURL: function(data) {
                return 'http://youtu.be/' + getPropByString(data, 'id')
            },
            API_Title: function(data) {
                return getPropByString(data, 'snippet.title')
            },
            API_Subtext: function(data) {
                return getPropByString(data, 'snippet.channelTitle')
            },
            API_Channel: function(data) {
                return getPropByString(data, 'snippet.channelId')
            },
            API_IMGURL: function(data) {
                return getPropByString(data, 'snippet.thumbnails.high.url')
            },
            API_AddText: function(data) {
                return 'Rated ' + getPropByString(data, 'snippet.description')
            },
            API_DetailText: function(data) {
                return getPropByString(data, 'synopsis')
            },
            API_Video: function(data) {
                return 'http://www.youtube.com/embed/' + getPropByString(data, 'id') + '?showinfo=0'
            },
            API_Duration: function(data) {
                return getPropByString(data, 'contentDetails.duration').replace("PT", "").replace("H", ":").replace("M", ":").replace("S", "")
            },
            API_Like: function(data) {
                return getPropByString(data, 'statistics.likeCount')
            },
            API_Dislike: function(data) {
                return getPropByString(data, 'statistics.dislikeCount')
            },
            API_ViewCount: function(data) {
                return getPropByString(data, 'statistics.viewCount')
            },
            API_Moment: function(data) {
                return moment(getPropByString(data, 'snippet.publishedAt')).fromNow()
            }
        }
    }

    // Search Properties
    settings.searchSettings = {
        URL: {
            baseURL: function() {
                return 'https://www.googleapis.com/youtube/v3/search'
            },
            params: {
                key: function() {
                    return settings.APIKey
                },
                q: function() {
                    return _query
                },
                part: function() {
                    return 'snippet'
                },
                pageToken: function() {
                    return _page
                },
                type: function() {
                    return 'video'
                },
                callback: function() {
                    return 'JSON_CALLBACK'
                }
            }
        },
        Type: 'list',
        API_DataProperty: 'items',
        returnElements: {
            API_ID: function(data) {
                return getPropByString(data, 'id.videoId')
            },
            API_Title: function(data) {
                return getPropByString(data, 'snippet.title')
            },
            API_Subtext: function(data) {
                return getPropByString(data, 'snippet.channelTitle')
            },
            API_IMGURL: function(data) {
                return getPropByString(data, 'snippet.thumbnails.high.url')
            },
            API_AddText: function(data) {
                return 'Rated ' + getPropByString(data, 'mpaa_rating')
            },
            API_DetailText: function(data) {
                return getPropByString(data, 'synopsis')
            },
            API_NextPage: function(data, fulldata) {
                return getPropByString(fulldata, 'nextPageToken')
            },
            API_PrevPage: function(data, fulldata) {
                return getPropByString(fulldata, 'prevPageToken')
            }
        }
    }

    return {
        // set query parameter
        setQuery: function(query) {
            _query = query;
        },
        getQuery: function() {
            return _query;
        },
        // set detail parameter
        setID: function(detailID) {
            _detailID = detailID;
        },
        setChannel: function(channelId) {
            _channel = channelId;
        },
        setAccessToken: function(AccessToken) {
            _access_token = AccessToken;
        },
        getID: function() {
            return _detailID;
        },
        setPage: function(page) {
            if (page == 0) {
                _page = 0
            } else if (!page || page.length == 0) {
                _page = '';
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
                case 'Channel':
                    APICallsettings = settings.channelSettings;
                    break;
                case 'Profile':
                    APICallsettings = settings.profileSettings;
                    break;
                case 'Subscription':
                    APICallsettings = settings.subscriberSettings;
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
