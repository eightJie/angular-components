angular.module('ui.dream.expander', [])
	.controller('accordionCtrl', function() {
		console.log('------------controller');

		var ctrl = this;
		var expanders = [];

		ctrl.addExpander = function(expander){
			expanders.push(expander);
		};

		ctrl.show = function(expander){
			expanders.forEach(function(item){
				if(expander === item){
					item.isShow = true;
				}else{
					item.isShow = false;
				}
			});
		};

		ctrl.showDefault = function(){
			if(expanders.length > 0){
				expanders[0].isShow = true;
			}
		};

	})
	.directive('accordion', function() {
		return {
			restrict: 'EA',
			transclude: true,
			replace: true,
			controller: 'accordionCtrl',
			templateUrl: 'src/expander/accordion.html',
			link: function(scope, element, attrs, ctrl){
				console.log('-------accordion');
				ctrl.showDefault();
			}
		};
	})
	.directive('expander', function() {
		return {
			restrict: 'EA',
			transclude: true,
			replace: true,
			require: '^?accordion',
			scope: {
				title: '@expanderTitle'
			},
			templateUrl: 'src/expander/expander.html',
			link: function(scope, element, attrs, ctrl) {
				console.log('--------expander');

				ctrl.addExpander(scope);

				scope.show = function(){
					ctrl.show(scope);
				}
			}
		};
	});