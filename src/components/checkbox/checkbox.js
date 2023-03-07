import angular from "angular";
import CheckboxHtml from './checkbox.html';
import './checkbox.styl'

angular.module('components')
.directive('checkbox', Checkbox);

function Checkbox() {
	return {
		restrict: 'E',
		scope: {
			checked: '=',
			indeterminate: '=',
			onClick: '&',
		},
		template: CheckboxHtml,
		link: function (scope, element, attrs) {
			scope.handleClick = (e) => {
				e.stopPropagation();
				scope.onClick();
			}
		}
	}
}