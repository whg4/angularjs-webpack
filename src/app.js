import angular from "angular";

/** @type { angular.IModule } */

const App = function ($scope) {
	$scope.options = [
		{
			label: '广东',
			value: 'guangdong',
			children: [
				{
					label: '广州',
					value: 'guangzhou',
					children: [
						{ label: '天河', value: 'tianhe' },
						{ label: '白云', value: 'baiyun' },
						{ label: '越秀', value: 'yuexiu' },
					]
				},
				{
					label: '深圳', value: 'shenzhen',
					children: [
						{ label: '南山', value: 'nanshan' },
						{ label: '福田', value: 'futian' },
						{ label: '罗湖', value: 'luohu' },
					]
				},
				{ label: '东莞', value: 'dongguan' },
				{ label: '佛山', value: 'foshan' },
			],
		},
		{
			label: '广西',
			value: 'guangxi',
			children: [
				{ label: '南宁', value: 'nanning' },
				{ label: '桂林', value: 'guilin' },
				{ label: '柳州', value: 'liuzhou' },
			],
		},
		{
			label: '湖南',
			value: 'hunan',
			children: [
				{ label: '长沙', value: 'changsha' },
				{ label: '株洲', value: 'zhuzhou' },
			]
		},
		{
			label: '湖北',
			value: 'hubei',
		},
	];

	$scope.value = [['guangdong', 'guangzhou', 'tianhe']];
}

App.$inject = ['$scope'];
angular.module('app', ['components'])
	.controller("AppController", App);