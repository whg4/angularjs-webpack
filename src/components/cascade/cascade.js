import angular from "angular";
import CascadeHtml from './cascade.html';
import { SEARCH_MARK, VALUE_SPLIT } from '../../config/const';
import { isLeaf, toPathKey } from "../../utils";
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
		link: function (scope) {
			scope.mergeOptions = [];
			scope.checkedSet = new Set();
			scope.halfCheckedSet = new Set();
			scope.selectedPath = new Set();
			scope.selectedItem = [];
			scope.isShowAllClear = false;
			scope.isShowCascadePanel = false;
			
			const CascadeOptionMap = new Map();

			// ==================> Change
			scope.$watch('options', function (newValue) {
				if (newValue && Array.isArray(newValue)) {
					scope.mergeOptions = generateSearchMark(newValue, []);
					console.log('mergeOptions', scope.mergeOptions);
				}
			});

			const unsubscribe = scope.$watch('value', function (newValue) {
				if (newValue && Array.isArray(newValue) && newValue.length > 0) {
					initStatus(newValue);
					unsubscribe();
				}
			});

			// ==================> Methods
			const generateSearchMark = function (options, prevPath) {
				return options.map((item, index) => {
					const currentPath = [...prevPath, item];
					if (item.children && Array.isArray(item.children)) {
						item.children = generateSearchMark(item.children, currentPath);
					}

					const fullPath = currentPath.map(path => path.value);
					const fullPathKey = toPathKey(fullPath);

					const option = {
						...item,
						[SEARCH_MARK]: currentPath,
						isLeaf: isLeaf(item),
						fullPath,
						fullPathKey,
					}

					CascadeOptionMap.set(fullPathKey, option);
					return option;
				});
			}

			const initStatus = (value) => {
				value.forEach((fullPath) => {
					markSelectedPath(fullPath);
				});
				getSelectedItem();
			}

			const getOption = (fullPath) => {
				return CascadeOptionMap.get(toPathKey(fullPath));
			}

			const bfs = (options, callback) => {
				const optionList = [...options];
				while (optionList.length > 0) {
					const currentOption = optionList.shift();

					callback(currentOption);

					if (currentOption.children && Array.isArray(currentOption.children)) {
						optionList.push(...currentOption.children);
					}
				}
			}

			const checkParent = (fullPath, checkedSet, halfCheckedSet) => {
				const currentPath = [...fullPath];
				const _checkedSet = new Set([...checkedSet]);
				const _halfCheckedSet = new Set([...halfCheckedSet]);

				while (currentPath.length > 1) {
					currentPath.pop();
					const parentPathKey = toPathKey(currentPath);
					const parentOption = getOption(currentPath);
					const parentChildren = parentOption.children;
					const parentChecked = parentChildren.every(child => _checkedSet.has(child.fullPathKey));
					const parentHalfChecked = parentChildren.some(child => _checkedSet.has(child.fullPathKey) || _halfCheckedSet.has(child.fullPathKey));

					if (parentChecked) {
						_checkedSet.add(parentPathKey);
						_halfCheckedSet.delete(parentPathKey);
					} else if (parentHalfChecked) {
						_checkedSet.delete(parentPathKey);
						_halfCheckedSet.add(parentPathKey);
					} else {
						_checkedSet.delete(parentPathKey);
						_halfCheckedSet.delete(parentPathKey);
					}
				}

				return [_checkedSet, _halfCheckedSet];
			}

			const markSelectedPath = function (fullPath) {
				let checkedSet = new Set([...scope.checkedSet]);
				let halfCheckedSet = new Set([...scope.halfCheckedSet]);
				let selectedPath = new Set([...scope.selectedPath]);

				const pathKey = toPathKey(fullPath);
				const option = getOption(fullPath);

				// 叶子节点
				if (option.isLeaf) {
					if (checkedSet.has(pathKey)) {
						checkedSet.delete(pathKey);
						selectedPath.delete(pathKey);
					} else {
						checkedSet.add(pathKey);
						selectedPath.add(pathKey);
					}
					// 更新父节点
					[checkedSet, halfCheckedSet] = checkParent(fullPath, checkedSet, halfCheckedSet);
				} else {
					// 全选 => 取消全选
					if (checkedSet.has(pathKey)) {
						checkedSet.delete(pathKey);
						selectedPath.delete(pathKey);
						// 更新子节点
						bfs(option.children, (option) => {
							checkedSet.delete(option.fullPathKey);
							halfCheckedSet.delete(option.fullPathKey);
							selectedPath.delete(option.fullPathKey);
						});
						// 更新父节点
						[checkedSet, halfCheckedSet] = checkParent(fullPath, checkedSet, halfCheckedSet);
					} else {
						// 半选/空 => 全选
						checkedSet.add(pathKey);
						halfCheckedSet.delete(pathKey);
						// 更新子节点
						bfs(option.children, (option) => {
							checkedSet.add(option.fullPathKey);
							halfCheckedSet.delete(option.fullPathKey);

							if (option.isLeaf) {
								selectedPath.add(option.fullPathKey);
							}
						});

						// 更新父节点
						[checkedSet, halfCheckedSet] = checkParent(fullPath, checkedSet, halfCheckedSet);
					}

				}

				scope.checkedSet = checkedSet;
				scope.halfCheckedSet = halfCheckedSet;
				scope.selectedPath = selectedPath;

				// 更新外部的值
				scope.value = [...selectedPath].map((path) => path.split(VALUE_SPLIT));
			}

			const getSelectedItem = () => {
				scope.selectedItem = [...scope.selectedPath].map((path) => {
					const fullPath = path.split(VALUE_SPLIT);
					const option = getOption(fullPath);
					const searchMarks = option[SEARCH_MARK];

					return {
						label: searchMarks.map(item => item.label).join(' / '),
						key: option.fullPathKey,
						fullPath: option.fullPath,
					}
				});
				console.log('selectedItem', scope.selectedItem);
			}

			scope.onSelect = (fullPath) => {
				markSelectedPath(fullPath);
				getSelectedItem();
			}

			scope.onRemove = (fullPath) => {
				markSelectedPath(fullPath);
				getSelectedItem();
			}

			// 重置值
			scope.handleAllClear = (event) => {
				event.stopPropagation();
				scope.checkedSet = new Set();
				scope.halfCheckedSet = new Set();
				scope.selectedPath = new Set();
				scope.selectedItem = [];
				scope.value = [];
				scope.isShowAllClear = false;
			}

			scope.handleMouseEnter = (event) => {
				if(scope.selectedPath.size) {
					scope.isShowAllClear = true;
				}
			}

			scope.handleMouseLeave = (event) => {
				scope.isShowAllClear = false;
			}

			scope.handleCascadeClick = () => {
				scope.isShowCascadePanel = !scope.isShowCascadePanel;
			}
		}
	}
}