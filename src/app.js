import angular from "angular";

const App = function ($scope) {

}

App.$inject = ['$scope'];
angular.module('app', ['components'])
	.controller("AppController", App);