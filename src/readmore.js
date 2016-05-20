'use strict';

angular
	.module('hm.readmore', ['ngAnimate', 'ngSanitize'])
	.directive('hmReadMore', readMore)

/** @ngInject */
function readMore($templateCache) {
	var directive = {
		restrict: 'AE',
		scope: {
			hmText: '@',
			hmLimit: '@',
			hmMoreText: '@',
			hmLessText: '@',
			hmDotsClass: '@',
			hmLinkClass: '@'
		},
		template: $templateCache.get('readmore.template.html'),
		controller: hmReadMoreController,
		controllerAs: 'vm',
		bindToController: true
	};

	return directive;

	/** @ngInject */
	// "bindToController: true" binds scope variables to Controller
	function hmReadMoreController($filter, $scope, $log) {
		var vm = this;
		vm.toggle = {
			dots: '...',
			dotsClass: vm.hmDotsClass,
			linkClass: vm.hmLinkClass
		}

		// Toggle functions
		function setToggleMoreText() {
			vm.toggle.moreText = vm.hmMoreText || 'Read more';
		}

		function setToggleLessText() {
			vm.toggle.lessText = vm.hmLessText || 'Read less';
		}

		function setCurrentToggleText() {
			vm.toggle.text = vm.toggle.state ? vm.toggle.lessText : vm.toggle.moreText;
		}

		function setShowToggle() {
			vm.toggle.show = vm.moreText && vm.moreText.length > 0;
		}

		vm.doToggle = function () {
			vm.toggle.state = !vm.toggle.state;
			vm.showMoreText = !vm.showMoreText;
			setCurrentToggleText();
		}

		$scope.$watch('vm.hmMoreText', function (newValue, oldValue) {
			if (newValue != oldValue) {
				setToggleMoreText();
				setCurrentToggleText();
			}
		});

		$scope.$watch('vm.hmLessText', function (newValue, oldValue) {
			if (newValue != oldValue) {
				setToggleLessText();
				setCurrentToggleText();
			}
		});

		$scope.$watch('vm.hmDotsClass', function (newValue, oldValue) {
			if (newValue != oldValue) {
				vm.toggle.dotsClass = vm.hmDotsClass;
			}
		});

		$scope.$watch('vm.hmLinkClass', function (newValue, oldValue) {
			if (newValue != oldValue) {
				vm.toggle.linkClass = vm.hmLinkClass;
			}
		});

		// ----------

		// If negative number, set to undefined
		function validateLimit() {
			vm.hmLimit = (vm.hmLimit && vm.hmLimit <= 0) ? undefined : vm.hmLimit;
		}

		function getMoreTextLimit() {
			return vm.hmLimit && vm.hmLimit < vm.hmText.length ? vm.hmLimit - vm.hmText.length : 0;
		}

		function setLessAndMoreText() {
			vm.lessText = $filter('limitTo')(vm.hmText, vm.hmLimit);
			vm.moreText = $filter('limitTo')(vm.hmText, getMoreTextLimit());	
		}

		function initialize() {
			setToggleMoreText();
			setToggleLessText();
			validateLimit();
			setLessAndMoreText();
			setShowToggle();
			setCurrentToggleText();
		}

		initialize();

		$scope.$watch('vm.hmText', function (newValue, oldValue) {
			if (newValue != oldValue) {
				validateLimit();
				setLessAndMoreText();
				setShowToggle();
			}
		});

		$scope.$watch('vm.hmLimit', function (newValue, oldValue) {
			if (newValue != oldValue) {
				validateLimit();
				setLessAndMoreText();
				setShowToggle();
			}
		});
	}
};
