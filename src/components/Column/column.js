import angular from "angular";
import ColumnHtml from './column.html';

angular.module('components')
	.directive('column', Column);

function Column() {
	return {
		restrict: 'E',
		scope: {
			options: '=',
			activeValue: '=',
			checkedSet: '=',
			halfCheckedSet: '=',
			onSelect: '&',
			onActive: '&',
		},
		template: ColumnHtml,
		link: function (scope, element, attrs) {
			scope.optionList = [];

			const getOptionList = () => {
				const optionList = scope.options.map((option) => {
					return {
						label: option.label,
						value: option.value,
						isLeaf: option.isLeaf,
						fullPath: option.fullPath,
						fullPathKey: option.fullPathKey,
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
				scope.onSelect()(item.fullPath);
			}

			scope.onCascadeItemClick = (item) => {
				scope.onActive()(item.fullPath);

				if (item.isLeaf) {
					scope.onSelect()(item.fullPath);
				}
			}
		}
	}
}