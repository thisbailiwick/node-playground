var app = angular.module('flapperNews', []);


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

        $scope.posts = [
            {title: 'post 1, upvotes: 5'},
            {title: 'post 2, upvotes: 2'},
            {title: 'post 3, upvotes: 15'},
            {title: 'post 4, upvotes: 9'},
            {title: 'post 5, upvotes: 4'}
        ]

        // add object into the posts array
        $scope.addPost = function(){
            if(!$scope.title || $scope.title === ''){return;};
            $scope.posts.push({
                title: $scope.title,
                link: $scope.link,
                upvotes: 0
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
