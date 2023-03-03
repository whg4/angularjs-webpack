import angular from "angular";
import CascadeHtml from './cascade.html';
import { SEARCH_MARK } from '../../config/const';
import './cascade.styl';

angular.module('components')
	.directive('cascade', Cascade);

function Cascade() {
	return {
		restrict: 'E',
		scope: {
			options: '=',
			value: '=',
		},
		template: CascadeHtml,
		link: function (scope, element, attrs) {
			scope.mergeOptions = [];

			const generateSearchMark = function (options, prevPath) {
				return options.map((item, index) => {
					const option = { ...item }
					const currentPath = [...prevPath, option];
					if (option.children && Array.isArray(option.children)) {
						option.children = generateSearchMark(option.children, currentPath);
					}

					return {
						...option,
						[SEARCH_MARK]: currentPath,
					};
				});
			}

			scope.$watch('options', function (newValue) {
				if (newValue && Array.isArray(newValue)) {
					scope.mergeOptions = generateSearchMark(newValue, []);
					console.log('mergeOptions', scope.mergeOptions);
				}
			});

			scope.$watch('value', function (newValue) {
				console.log('value changed', newValue);
			});
		}
	}
}