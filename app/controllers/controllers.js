app.controller('homeController', function($scope, $http, myService) {
    $http.get('/api/users')
        .success(function(data) {
            $scope.users = data;
        })
        .error(function(data) {
            console.log('Error: ' +data);
        });
    $scope.addUser = function() {
        $http.post('/api/users', $scope.user)
            .success(function(data) {
                $scope.user.firstName = '';
                $scope.user.lastName = '';
                $scope.users = data;
            })
            .error(function(data) {
                console.log('Error: ' + data);
            })
    };

    $scope.deleteUser = function() {
        $http.delete('/api/users')
            .success(function(data) {
                $scope.users = data;
            })
            .error(function(data) {
                console.log('Error: ' + data);
            });
    }
});