angular.module('ui.dream.collapse', [])
	.directive('collapse', ['$transition', function(transition) {

		return {
			link: function(scope, element, attrs) {
				var isInit = true;
				var currentTransition;

				function doTransition(change){
					if(currentTransition){
						currentTransition.cancel();
					}
					currentTransition = transition(element, change);

					return currentTransition;
				}

				function collapse() {
					if(isInit){
						isInit = false;
						collapseDone();
					}else{
						element.css({
							height: element[0].scrollHeight + 'px'
						});
						var x = element[0].offsetWidth;

						element.removeClass('collapse show').addClass('collapsing');

						doTransition({'height': 0}).then(function(){
							collapseDone();
						});
					}
				}

				function collapseDone(){
					element.removeClass('collapsing').addClass('collapse');
				}

				function expand() {
					if(isInit){
						isInit = false;
						expandDone();
					}else{
						element.removeClass('collapse').addClass('collapsing');
						doTransition({height: element[0].scrollHeight + 'px'}).then(function(){
							expandDone();
						});
					}
				}

				function expandDone(){
					element.removeClass('collapsing').addClass('collapse show').css('height', 'auto');
				}


				scope.$watch(attrs.collapse, function(shouldCollapse) {
					if (shouldCollapse) {
						collapse();
					} else {
						expand();
					}
				});

			}
		}

	}]);