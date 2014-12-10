(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){

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
},{"./src/collapse/index":2,"./src/expander/index":3,"./src/slider/index":4,"./src/tabs/index":5,"./src/transition/index":6,"./views/collapse/index":7,"./views/slider/demo":8}],2:[function(require,module,exports){
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
},{}],3:[function(require,module,exports){
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
},{}],4:[function(require,module,exports){
angular.module('ui.dream.slider', [])
	.directive('slider', ['$timeout', function(timeout) {
		return {
			restrict: 'EA',
			templateUrl: 'src/slider/index.html',
			scope: {
				min: '=',
				max: '=',
				value: '=',
				stepOptions: '=',
				disabledValue: '=',
				mouseupFunc: '&'
			},
			link: function(scope, element, attrs) {
				var sliderWidth = element[0].offsetWidth;
				var curStep; //当前value所在step

				timeout(function() {
					reset();
				}, 100);

				scope.unmove = true;

				/**
				 * 通过value计算宽度
				 */
				function getWidByVal(val) {
					var stepOptions = scope.stepOptions;
					var wid = 0;
					var perTotal = 0;

					if (!val) {
						return 0;
					} else if (val == scope.max) {
						return sliderWidth;
					}

					if (stepOptions) {
						stepOptions.some(function(step) {
							if (step.max >= val) {
								wid = (perTotal + (val - step.min) / (step.max - step.min) * step.per) / 100 * sliderWidth
								return true;
							} else {
								perTotal += step.per;
							}
						});
					} else {
						wid = val / scope.max * sliderWidth;
					}
					return wid;
				}

				/**
				 * 通过宽度计算value
				 */
				function getValByWidth(wid) {
					if (wid >= sliderWidth) {
						return scope.max;
					} else if (wid <= 0) {
						return scope.min;
					}

					var val = 0;
					var perTotal = 0;

					scope.stepOptions.some(function(step, index) {
						perTotal += step.per;

						if (perTotal / 100 * sliderWidth >= wid) {
							curStep = step;
							val = step.min + (wid - (perTotal - step.per) / 100 * sliderWidth) / (step.per / 100 * sliderWidth) * (step.max - step.min)
							return true;
						}
					});

					var unit = curStep.unit;

					if (unit < 1) {
						val = val.toFixed(unit.toString().split('.')[1].length);
					} else {
						val = Math.ceil(val);
					}
					return val;
				}

				/**
				 * 获取当前value被校验之后的值
				 */
				function getCorrectVal() {
					var curVal = scope.value;
					var disVal = scope.disabledValue;
					var unit = curStep.unit || 1;

					if (disVal && curVal < disVal) {
						return disVal;
					}

					var val = Math.ceil((curVal - curStep.min) / unit) * unit + curStep.min;

					if (val > curStep.max) {
						val = curStep.max;
					}
					return val;
				}

				/**
				 * 重置slider
				 */
				function reset() {
					if (!sliderWidth) {
						sliderWidth = element[0].offsetWidth;
					}
					if (!sliderWidth) {
						return;
					}

					var wid = getWidByVal(scope.value);
					var disWid = getWidByVal(scope.disabledValue);

					scope.curWidth = {
						width: wid + 'px'
					};
					scope.barLeft = {
						left: wid - 8 + 'px'
					}
					scope.disabledWidth = {
						width: (wid < disWid ? wid : disWid) + 'px'
					}
					scope.stepOptions.forEach(function(step) {
						step._width = {
							width: step.per / 100 * (sliderWidth - 16) + 'px'
						}
					});
				}

				scope.$watch('value', function(newV) {
					reset();
				});

				scope.$watch('stepOptions', function(stepOptions) {
					reset();
				});

				scope.$watch('disabledValue', function(newV) {
					reset();
				});

				scope.down = function(e) {
					var eleOffsetLeft = element[0].offsetLeft;
					var wid = e.pageX - eleOffsetLeft;

					scope.value = getValByWidth(wid);

					angular.element(document.body).bind('mousemove', function(e) {
						var _wid = e.pageX - eleOffsetLeft;

						scope.$apply(function() {
							scope.unmove = false;
							scope.value = getValByWidth(_wid);
						});

					});

					angular.element(document.body).bind('mouseup', function(e) {
						angular.element(document.body).unbind('mousemove');
						angular.element(document.body).unbind('mouseup');

						scope.$apply(function() {
							scope.value = getCorrectVal();
							scope.unmove = true;
							scope.mouseupFunc && scope.mouseupFunc(scope.value);
						});
					});
					e.preventDefault();
				};

			}
		};
	}]);
},{}],5:[function(require,module,exports){
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
},{}],6:[function(require,module,exports){
angular.module('ui.bootstrap.transition', [])

/**
 * $transition service provides a consistent interface to trigger CSS 3 transitions and to be informed when they complete.
 * @param  {DOMElement} element  The DOMElement that will be animated.
 * @param  {string|object|function} trigger  The thing that will cause the transition to start:
 *   - As a string, it represents the css class to be added to the element.
 *   - As an object, it represents a hash of style attributes to be applied to the element.
 *   - As a function, it represents a function to be called that will cause the transition to occur.
 * @return {Promise}  A promise that is resolved when the transition finishes.
 */
.factory('$transition', ['$q', '$timeout', '$rootScope', function($q, $timeout, $rootScope) {

  var $transition = function(element, trigger, options) {
    options = options || {};
    var deferred = $q.defer();
    var endEventName = $transition[options.animation ? 'animationEndEventName' : 'transitionEndEventName'];

    var transitionEndHandler = function(event) {
      $rootScope.$apply(function() {
        element.unbind(endEventName, transitionEndHandler);
        deferred.resolve(element);
      });
    };

    if (endEventName) {
      element.bind(endEventName, transitionEndHandler);
    }

    // Wrap in a timeout to allow the browser time to update the DOM before the transition is to occur
    $timeout(function() {
      if ( angular.isString(trigger) ) {
        element.addClass(trigger);
      } else if ( angular.isFunction(trigger) ) {
        trigger(element);
      } else if ( angular.isObject(trigger) ) {
        element.css(trigger);
      }
      //If browser does not support transitions, instantly resolve
      if ( !endEventName ) {
        deferred.resolve(element);
      }
    });

    // Add our custom cancel function to the promise that is returned
    // We can call this if we are about to run a new transition, which we know will prevent this transition from ending,
    // i.e. it will therefore never raise a transitionEnd event for that transition
    deferred.promise.cancel = function() {
      if ( endEventName ) {
        element.unbind(endEventName, transitionEndHandler);
      }
      deferred.reject('Transition cancelled');
    };

    return deferred.promise;
  };

  // Work out the name of the transitionEnd event
  var transElement = document.createElement('trans');
  var transitionEndEventNames = {
    'WebkitTransition': 'webkitTransitionEnd',
    'MozTransition': 'transitionend',
    'OTransition': 'oTransitionEnd',
    'transition': 'transitionend'
  };
  var animationEndEventNames = {
    'WebkitTransition': 'webkitAnimationEnd',
    'MozTransition': 'animationend',
    'OTransition': 'oAnimationEnd',
    'transition': 'animationend'
  };
  function findEndEventName(endEventNames) {
    for (var name in endEventNames){
      if (transElement.style[name] !== undefined) {
        return endEventNames[name];
      }
    }
  }
  $transition.transitionEndEventName = findEndEventName(transitionEndEventNames);
  $transition.animationEndEventName = findEndEventName(animationEndEventNames);
  return $transition;
}]);

},{}],7:[function(require,module,exports){
app.controller('collapseDemo', ['$scope', function(scope){

}]);
},{}],8:[function(require,module,exports){
app.controller('sliderDemo', ['$scope', function(scope){

	scope.testV = 50;

	scope.options = {
		min: 0,
		max: 100,
		disabledValue: 20,
		stepOptions:[
		{
			min: 0,
			max: 0.2,
			unit: 0.1,
			per: 10
		},
		{
			min: 0,
			max:44,
			unit: 5,
			per: 80
		},{
			min: 40,
			max: 100,
			unit: 10,
			per: 10
		}]
	};
}]);
},{}]},{},[1])