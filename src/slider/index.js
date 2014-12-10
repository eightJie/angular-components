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