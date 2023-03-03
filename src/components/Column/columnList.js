import angular from "angular";
import ColumnListHtml from './ColumnList.html';

angular.module('components')
	.directive('columnList', ColumnList);

function ColumnList() {
	return {
		restrict: 'E',
		scope: {
			mergeOptions: '=',
		},
		template: ColumnListHtml,
		link: function (scope, element, attrs) {
			scope.activeCells = [];
			scope.mergeOptionColumns = [];

			const getMergeOptionColumns = () => {
				const mergeOptionColumns = [{ options: scope.mergeOptions }];

				let currentList = scope.mergeOptions;
				for (let i = 0; i < scope.activeCells.length; i++) {
					const activeCellValue = scope.activeCells[i];
					const currentOption = currentList.find((item) => item.value === activeCellValue);

					if (currentOption && !currentOption.children) {
						return;
					}

					const subOptions = currentOption.children;
					mergeOptionColumns.push({ options: subOptions });
					currentList = subOptions;
				}

				scope.mergeOptionColumns = mergeOptionColumns;
				console.log('mergeOptionColumns', mergeOptionColumns);
			}

			scope.onPathActive = function (path) {
				scope.activeCells = path;
				getMergeOptionColumns();
			}

			scope.onSelect = function (fullPath) {
				console.log('fullPath', fullPath);
			}

			scope.$watch('mergeOptions', function (newValue) {
				if (newValue && Array.isArray(newValue)) {
					getMergeOptionColumns();
				}
			});

		}
	}
}

