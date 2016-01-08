angular.module('app', [
    'ngResource',
    'ui.router',
    'ngStorage',
    'authorization',
    'authorization.services',
    'ngCookies'
]);

angular.module('app').config(['$stateProvider', '$urlRouterProvider', '$locationProvider',function ($stateProvider, $urlRouterProvider,$locationProvider) {
    $urlRouterProvider.otherwise("/")
    $stateProvider
        .state('index', {
        url: "/",
        templateUrl: "app/index.tpl.html",
        controller: 'AppCtrl'
    });
}]);


angular.module('app').controller('AppCtrl', ['$scope','$cookieStore','$location','AuthService','$rootScope','$localStorage', function($scope,$cookieStore,$location,AuthService,$rootScope,$localStorage) {
  
    $scope.myInit = function(){
        if($localStorage.token){
            AuthService.currentUser(function(result){
                
            });
        }
    };
    
    
    var accessLevels = {
        'user': ['user'],
        'admin': ['admin','user']
    };

    $rootScope.hasAccess = function(level){
        if($rootScope.currentUser && accessLevels[$rootScope.currentUser['role']]){
            if(accessLevels[$rootScope.currentUser['role']].indexOf(level) > -1)
                return true;
            else
                return false;
        }else
            return false;
    }
}]);

angular.module('app').controller('HeaderCtrl', ['$scope','$rootScope','$location','AuthService', function($scope,$rootScope,$location,AuthService) { 
    
    $scope.logout = function(){
        AuthService.logout(function(result){
            console.log("Response after logout: "+JSON.stringify(result));
            $rootScope.currentUser = null;
            $location.path('/login/');
        });
    } 
}]);
