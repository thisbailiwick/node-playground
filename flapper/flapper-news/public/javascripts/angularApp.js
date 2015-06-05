var app = angular.module('flapperNews', ['ui.router']);
app.config([
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
                url: '/posts/:id',
                templateUrl: '/posts.html',
                controller: 'PostsCtrl'
            });
        $urlRouterProvider.otherwise('home');
    }
]);

app.factory('posts', ['$http', function(){
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

    return o;
}])

app.controller('MainCtrl', [
    '$scope', 'posts',
    function($scope, posts){
        // Now any change or modification made to $scope.posts will be stored in the service and immediately accessible by any other module that injects the posts service.
        $scope.posts = posts.posts;

        // add object into the posts array
        $scope.addPost = function(){
            if(!$scope.title || $scope.title === ''){return;};

            $scope.title = '';
            $scope.link = '';
        };

        // increment upvotes
        // parameter post is passed by reference
        $scope.incrementUpvotes = function(post){
            posts.upvote(post);
        }
    }
]);


// add controller for single posts and comments page
app.controller('PostsCtrl', [
    '$scope',
    '$stateParams',
    'posts',
    function($scope, $stateParams, posts){
        $scope.post = posts.posts[$stateParams.id];

        $scope.addComment = function(){
            if($scope.body == ''){reuturn;}
            $scope.post.comments.push({
                body: $scope.body,
                author: 'user',
                upvotes: 0
            });
            $scope.body = '';
        };
    }
]);
