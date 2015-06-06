angular.module('flapperNews', ['ui.router'])
.config([
    '$stateProvider',
    '$urlRouterProvider',
    function($stateProvider, $urlRouterProvider){
        $stateProvider
            .state('home',{
                url: '/home',
                templateUrl: '/home.html',
                controller: 'MainCtrl',
                resolve: {
                    postPromise: ['posts', function(posts){
                        return posts.getAll();
                    }]
                }
            })
            .state('posts', {
                url: '/posts/{id}',
                templateUrl: '/posts.html',
                controller: 'PostsCtrl',
                resolve: {
                    post: ['$stateParams', 'posts', function($stateParams, posts){
                        return posts.get($stateParams.id);
                    }]
                }
            });
        $urlRouterProvider.otherwise('home');
    }
])
.factory('posts', ['$http', function($http){
    var o = {
        posts: []
    };

    // retrieve posts
    // It's important to use the angular.copy() method to create a deep copy of the returned data. This ensures that the $scope.posts variable in MainCtrl will also be updated, ensuring the new values are reflect in our view.
    o.getAll = function(){
        return $http.get('/posts').success(function(data){
            angular.copy(data, o.posts);
        });
    };

    // retrieve single post
    o.get = function(id){
        return $http.get('/posts/' + id).then(function(res){
            return res.data;
        });
    };

    //create post
    o.create = function(post){
        return $http.post('/posts', post).success(function(data){
            o.posts.push(data);
        });
    };

    //upvote
    o.upvote = function(post){
        return $http.put('/posts/' + post._id + '/upvote')
            .success(function(data){
            post.upvotes += 1;
        });
    };

    //add a comment
    o.addComment = function(id, comment){
        return $http.post('/posts/' + id + '/comments', comment);
    };

    //upvote a comment
    o.upvoteComment = function(post, comment){
        return $http.put('/posts/' + post_id + '/comments/' + comment._id + '/upvote')
            .success(function(data){
                comment.upvotes += 1;
            });
    };

    return o;
}])
.factory('auth', ['$http', '$window', function($http, $window){
        var auth = {};

        auth.saveToken = function(token){
            $window.localStorage['flapper-news-token'] = token;
        };

        auth.getToken = function(){
            return $window.localStorage['flapper-news-token'];
        };

        auth.isLoggedIn = function(){
            var token = auth.getToken();

            if(token){
                var payload = JSON.parse($window.atob(token.split('.')[1]));

                return payload.exp > Date.now() / 1000;
            }else{
                return false;
            }
        };

        auth.currentUser = function(){
            if(auth.isLoggedIn()){
                var token = auth.getToken();
                var payload = JSON.parse($window.atob(token.split('.')[1]));

                return payload.username;
            }
        };

        auth.register = function(user){
            return $http.post('/register', user).success(function(data){
                auth.saveToken(data.token);
            });
        };

        auth.logIn = function(user){
            return $http.post('/login', user).success(function(data){
                auth.savetoken(data.token);
            });
        };

        return auth;
}])
.controller('MainCtrl', [
    '$scope', 'posts',
    function($scope, posts){
        // Now any change or modification made to $scope.posts will be stored in the service and immediately accessible by any other module that injects the posts service.
        $scope.posts = posts.posts;

        // add object into the posts array
        $scope.addPost = function(){
            if(!$scope.title || $scope.title === ''){return;}
            posts.create({
                title: $scope.title,
                link: $scope.link
            });

            $scope.title = '';
            $scope.link = '';
        };

        // increment upvotes
        // parameter post is passed by reference
        $scope.incrementUpvotes = function(post){
            posts.upvote(post);
        }
    }
])
// add controller for single posts and comments page
.controller('PostsCtrl', [
    '$scope',
    'posts',
    'post',
    function($scope, posts, post){
        $scope.post = post;

        $scope.addComment = function(){
            if($scope.body == ''){reuturn;}
            posts.addComment(post._id, {
                body: $scope.body,
                author: 'user'
            }).success(function(comment){
                $scope.post.comments.push(comment);
            });

            $scope.body = '';
        };

        $scope.incrementUpvotes = function(comment){
            posts.upvoteComment(post, comment);
        };
    }
]);
