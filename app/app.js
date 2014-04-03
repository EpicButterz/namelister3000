var app = angular.module('angApp', ['ngRoute']);

app.config(function ($routeProvider) {
    $routeProvider
        .when('/',
            {
                controller: 'homeController',
                templateUrl: 'app/partials/home.html'
            })
        .when('/home',
        {
            controller: 'homeController',
            templateUrl: 'app/partials/home.html'
        })
        .otherwise({ redirectTo: '/home.html' });
});