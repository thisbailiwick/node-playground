// public/js/services/NerdService.js
angular.module('NerdService', []).factory('Nerd', ['$http', function($http){
    return{
        // call to get all nerds
        get : function() {
            return $http.get('/api/nerds');
        },

        //These will work when more api routes are defined on the Node side of things
        //call to POST and create a nerd
        create : function(nerdData){
            return $http.post('/api/nerds', nerdData);
        },

        // call to DELETE a nerd
        delete : function(id){
            return $http.delete('/api/nerds/' + id);
        }

    }
}])