var app = angular.module('flapperNews', ['ui.router']);
app.config([
    '$stateProvider',
    '$urlRouterProvider',
    function($stateProvider, $urlRouterProvider){
        $stateProvider
            .state('home',{
                url: '/home',
                templateUrl: '/home.html',
                controller: 'MainCtrl'
            })
            .state('posts', {
                url: '/posts/{id}',
                templateUrl: '/posts.html',
                controller: 'PostsCtrl'
            });
        $urlRouterProvider.otherwise('home');
    }
]);

app.factory('posts', [function(){
    var o = {
        posts: []
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
            $scope.posts.push({
                title: $scope.title,
                link: $scope.link,
                upvotes: 0,
                comments: [
                    {author: 'Joe', body: 'Cool post!', upvotes: 0},
                    {author: 'Bob', body: 'Great idea but everything is wrong!', upvotes: 0}
                ]
            });
            $scope.title = '';
            $scope.link = '';
        };

        // increment upvotes
        // parameter post is passed by reference
        $scope.incrementUpvotes = function(post){
            post.upvotes += 1;
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
