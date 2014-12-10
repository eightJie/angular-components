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