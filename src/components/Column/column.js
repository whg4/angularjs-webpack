import angular from "angular";
import ColumnHtml from './column.html';
import { SEARCH_MARK } from '../../config/const';

angular.module('components')
	.directive('column', Column);

function Column() {
	return {
		restrict: 'E',
		scope: {
			options: '=',
			activeValue: '=',
			onSelect: '&',
			onActive: '&',
		},
		template: ColumnHtml,
		link: function (scope, element, attrs) {
			scope.optionList = [];

			const getOptionList = () => {
				const optionList = scope.options.map((option) => {

					const fullPath = option[SEARCH_MARK]
						.map((item) => item.value);

					return {
						label: option.label,
						value: option.value,
						fullPath,
					}
				});

				scope.optionList = optionList;
			}

			scope.$watch('options', function (newValue) {
				if (newValue && Array.isArray(newValue)) {
					getOptionList();
				}
			});

			scope.onCheckboxClick = (item) => {

			}

			scope.onCascadeItemClick = (item) => {
				scope.onActive()(item.fullPath);
			}
		}
	}
}