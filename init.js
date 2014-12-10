
app = angular.module('ui.dream', ['ui.router', 'ui.bootstrap.transition', 'ui.dream.collapse', 'ui.dream.tabs', 'ui.dream.expander', 'ui.dream.slider']);

app.config(['$stateProvider', '$urlRouterProvider', '$locationProvider', function(stateProvider, urlRouterProvider, locationProvider) {
	urlRouterProvider.otherwise("/dream");
	locationProvider.hashPrefix('!');

	stateProvider
	.state('dream', {
		url: '/dream',
		templateUrl: 'views/base/index.html'
	})
	.state('collapseDemo', {
		url: '/collapse',
		templateUrl: 'views/collapse/index.html',
		controller: 'collapseDemo'
	})
	.state('tabsDemo', {
		url: '/tabs',
		templateUrl: 'views/tabs/demo.html'
	})
	.state('expanderDemo', {
		url: '/expander',
		templateUrl: 'views/expander/demo.html'
	})
	.state('sliderDemo', {
		url: '/slider',
		templateUrl: 'views/slider/demo.html',
		controller: 'sliderDemo'
	})
}]);

require('./src/transition/index');
require('./src/collapse/index');
require('./src/tabs/index');
require('./src/expander/index');
require('./src/slider/index')


require('./views/collapse/index');
require('./views/slider/demo')