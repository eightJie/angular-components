angular.module('ui.dream.tabs', [])
	.controller('tabsetCtrl', ['$scope', function(scope) {
		var ctrl = this;

		ctrl.tabs = [];

		ctrl.addTab = function(tab){
			ctrl.push(tab);
		};

	}])
	// .directive('tabset', function(){
	// 	return {
	// 		restrict: 'EA',
	// 		templateUrl: 'src/tabs/tabset.html',
	// 		scope: {
	// 		},
	// 		controller: 'tabsetCtrl',
	// 		link: function(scope, element, attrs, ctrl){
	// 			scope.tabs = ctrl.tabs;
	// 		}
	// 	};
	// })
	.directive('tab', function(){
		return {
			restrict: 'EA',
			scope: {
				heading: '@'
			},
			require: '^?tabset',
			transclude: true,
			scope: {
				msg: '@'
			},
			templateUrl: 'src/tabs/tab.html',
			compile: function(elm, attrs, transclude){
				return function postLink(scope, element, attrs, ctrl){
					// console.log(transclude);
					// transclude(scope.$parent, function(contents, s){
					// 	console.log(s === scope.$parent)
					// 	console.log(arguments, 222222);
					// 	console.log(contents);
					// });
				};
			}
		};
	})
	.directive('tansContent', function(){
		return {

			link: function(scope, element, attrs, controller, transclude){
				console.log(transclude);
				transclude(scope, function(clone){

					element.empty();
					element.append(clone);
				})
			}
		};
	});