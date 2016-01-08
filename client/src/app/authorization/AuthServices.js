var module = angular.module('authorization.services',['ngResource','ngCookies','ngStorage']);

module.factory("AuthHttpRequestInterceptor", 
               function ($localStorage) {
             return {
                    request: function (config) {
             if($localStorage.token)
                  config.headers["Authorization"] = 'bearer '+ $localStorage.token; 
             return config;
            }
          };
});


module.factory('AuthService',function($resource,$rootScope,$location,$cookieStore,$localStorage){

    module.factory('BlogService',function($resource){
        return $resource('/auth/test', 
        {
            'get': { method: 'GET', isArray: false }
        },
        {
            'post': { method: 'POST'}
        }
       );
    }); 
    
    
    
  var LoginResource = $resource('/auth/login');
  var LogoutResource = $resource('/auth/logout');
  var SignupResource = $resource('/auth/signup'); 
 
   var TestResource = $resource('/auth/test', 
        {
            'get': {
                method: 'GET',
                isArray: false
            }
        },
        {
            'post': { method: 'POST'
        }
    });


  // The public API of the service
  var service = {
      currentUser : function(callback){
          var testResource = new  TestResource();
          testResource.$get(function(result){
                console.log("Inside test resource : "+JSON.stringify(result));
              $rootScope.currentUser = result;
              callback(result);
          });
      },
      login: function(user,callback){
	var loginResource = new LoginResource();
	loginResource.email = user.email;
	loginResource.password = user.password;
	loginResource.$save(function(result){
        if(typeof result !== 'undefined'){
            if(result.type){
                $localStorage.token = result.token;
                var user = parseToken(result.token);
                console.log(" data after login : "+JSON.stringify(user));
                //$cookieStore.put('user',user);
                $rootScope.currentUser = user;
            }
        }
		callback(result);
	}); 
      },
      logout : function(callback){
	var logoutResource = new LogoutResource();
	logoutResource.$save(function(result){
			$rootScope.currentUser = null;
			$cookieStore.remove('user');
			delete $localStorage.token;
			callback(result);
	});
      },
      signup: function(user,callback){
	var signupResource = new SignupResource();
	signupResource.email = user.email;
	signupResource.password = user.password;
    signupResource.name = user.name;
	signupResource.$save(function(result){
        if(typeof result !== 'undefined'){
            if(result.type){
                $localStorage.token = result.token;
                console.log(" data after sign up : "+JSON.stringify(result));
                var user = parseToken(result.token);
               // $cookieStore.put('user',user);
                $rootScope.currentUser = user;
            }
        }
		callback(result);
	});
      }
  }//service
  
  function urlBase64Decode(str) {
      var output = str.replace('-', '+').replace('_', '/');
      switch (output.length % 4) {
          case 0:
              break;
          case 2:
              output += '==';
              break;
          case 3:
              output += '=';
              break;
          default:
              throw 'Illegal base64url string!';
      }
      return window.atob(output);
  }

    function getUserFromToken() {
        var token = $localStorage.token;
        var user = {};
        if (typeof token !== 'undefined') {
            var encoded = token.split('.')[1];
            user = JSON.parse(urlBase64Decode(encoded));
        }
        return user;
    }

    function parseToken(token){
        var user = {};
        if(token){
            var encoded = token.split('.')[1];
            user = JSON.parse(urlBase64Decode(encoded));
        }
        return user;  
    }
  
  return service;
  
});
