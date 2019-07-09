import Vue from 'vue';
import Router from 'vue-router';
import Home from './views/Home.vue';

Vue.use(Router);

export default new Router({
	routes: [
		{
			path: '/',
			name: 'home',
			component: Home
		},
		{
			path: '/setup',
			name: 'setup',
			component: () => import('./views/setup/Setup.vue')
		},
		{
			path: '/support',
			name: 'support',
			component: () => import('./views/support/Support.vue')
        },
        {
			path: '/theming',
			name: 'theming',
			component: () => import('./views/theming/Theming.vue')
		},
		{
			path: '/icons',
			name: 'icons',
			component: () => import('./views/icons/Icons.vue')
		},
		{
			path: '/accordion',
			name: 'accordion',
			component: () => import('./views/accordion/AccordionDemo.vue')
		},
		{
			path: '/autocomplete',
			name: 'autocomplete',
			component: () => import('./views/autocomplete/AutoCompleteDemo.vue')
		},
		{
			path: '/button',
			name: 'button',
			component: () => import('./views/button/ButtonDemo.vue')
		},
		{
			path: '/calendar',
			name: 'calendar',
			component: () => import('./views/calendar/CalendarDemo.vue')
		},
		{
			path: '/card',
			name: 'card',
			component: () => import('./views/card/CardDemo.vue')
		},
		{
			path: '/chart',
			name: 'chart',
			component: () => import('./views/chart/ChartDemo.vue')
		},
		{
			path: '/chart/bar',
			name: 'barchart',
			component: () => import('./views/chart/BarChartDemo.vue')
		},
		{
			path: '/chart/combo',
			name: 'combochart',
			component: () => import('./views/chart/ComboChartDemo.vue')
		},
		{
			path: '/chart/doughnut',
			name: 'doughnutchart',
			component: () => import('./views/chart/DoughnutChartDemo.vue')
		},
		{
			path: '/chart/line',
			name: 'linechart',
			component: () => import('./views/chart/LineChartDemo.vue')
		},
		{
			path: '/chart/pie',
			name: 'piechart',
			component: () => import('./views/chart/PieChartDemo.vue')
		},
		{
			path: '/chart/polararea',
			name: 'polarareachart',
			component: () => import('./views/chart/PolarAreaChartDemo.vue')
		},
		{
			path: '/chart/radar',
			name: 'radarchart',
			component: () => import('./views/chart/RadarChartDemo.vue')
		},
		{
			path: '/checkbox',
			name: 'checkbox',
			component: () => import('./views/checkbox/CheckboxDemo.vue')
		},
		{
			path: '/chips',
			name: 'chips',
			component: () => import('./views/chips/ChipsDemo.vue')
        },
        {
			path: '/datatable',
			name: 'datatable',
			component: () => import('./views/datatable/DataTableDemo.vue')
        },
        {
			path: '/datatable/templating',
			name: 'datatabletemplating',
			component: () => import('./views/datatable/DataTableTemplatingDemo.vue')
        },
        {
			path: '/datatable/paginator',
			name: 'datatablepaginator',
			component: () => import('./views/datatable/DataTablePaginatorDemo.vue')
        },
        {
			path: '/datatable/sort',
			name: 'datatablesort',
			component: () => import('./views/datatable/DataTableSortDemo.vue')
        },
        {
			path: '/datatable/filter',
			name: 'datatablefilter',
			component: () => import('./views/datatable/DataTableFilterDemo.vue')
        },
        {
			path: '/datatable/lazy',
			name: 'datatablelazy',
			component: () => import('./views/datatable/DataTableLazyDemo.vue')
        },
        {
			path: '/datatable/selection',
			name: 'datatableselection',
			component: () => import('./views/datatable/DataTableSelectionDemo.vue')
		},
		{
			path: '/dataview',
			name: 'dataview',
			component: () => import('./views/dataview/DataViewDemo.vue')
		},
		{
			path: '/dialog',
			name: 'dialog',
			component: () => import('./views/dialog/DialogDemo.vue')
		},
		{
			path: '/dropdown',
			name: 'dropdown',
			component: () => import('./views/dropdown/DropdownDemo.vue')
		},
		{
			path: '/editor',
			name: 'editor',
			component: () => import('./views/editor/EditorDemo.vue')
		},
		{
			path: '/fieldset',
			name: 'fieldset',
			component: () => import('./views/fieldset/FieldsetDemo.vue')
		},
		{
			path: '/fileupload',
			name: 'fileupload',
			component: () => import('./views/fileupload/FileUploadDemo.vue')
		},
		{
			path: '/flexgrid',
			name: 'flexgrid',
			component: () => import('./views/flexgrid/FlexGridDemo.vue')
		},
		{
			path: '/fullcalendar',
			name: 'fullcalendar',
			component: () => import('./views/fullcalendar/FullCalendarDemo.vue')
		},
		{
			path: '/inputgroup',
			name: 'inputgroup',
			component: () => import('./views/inputgroup/InputGroupDemo.vue')
		},
		{
			path: '/inputswitch',
			name: 'inputswitch',
			component: () => import('./views/inputswitch/InputSwitchDemo.vue')
		},
		{
			path: '/inputtext',
			name: 'inputtext',
			component: () => import('./views/inputtext/InputTextDemo.vue')
		},
		{
			path: '/inplace',
			name: 'inplace',
			component: () => import('./views/inplace/InplaceDemo.vue')
		},
		{
			path: '/listbox',
			name: 'listbox',
			component: () => import('./views/listbox/ListboxDemo.vue')
        },
        {
			path: '/menu',
			name: 'menu',
			component: () => import('./views/menu/MenuDemo.vue')
        },
        {
			path: '/menumodel',
			name: 'menumodel',
			component: () => import('./views/menumodel/MenuModel.vue')
		},
		{
			path: '/message',
			name: 'message',
			component: () => import('./views/message/MessageDemo.vue')
		},
		{
			path: '/multiselect',
			name: 'multiselect',
			component: () => import('./views/multiselect/MultiSelectDemo.vue')
		},
		{
			path: '/overlaypanel',
			name: 'overlaypanel',
			component: () => import('./views/overlaypanel/OverlayPanelDemo.vue')
		},
		{
			path: '/paginator',
			name: 'paginator',
			component: () => import('./views/paginator/PaginatorDemo.vue')
		},
		{
			path: '/panel',
			name: 'panel',
			component: () => import('./views/panel/PanelDemo.vue')
		},
		{
			path: '/password',
			name: 'password',
			component: () => import('./views/password/PasswordDemo.vue')
		},
		{
			path: '/progressbar',
			name: 'progressbar',
			component: () => import('./views/progressbar/ProgressBarDemo.vue')
		},
		{
			path: '/radiobutton',
			name: 'radiobutton',
			component: () => import('./views/radiobutton/RadioButtonDemo.vue')
		},
		{
			path: '/rating',
			name: 'rating',
			component: () => import('./views/rating/RatingDemo.vue')
		},
		{
			path: '/selectbutton',
			name: 'selectbutton',
			component: () => import('./views/selectbutton/SelectButtonDemo.vue')
		},
		{
			path: '/sidebar',
			name: 'sidebar',
			component: () => import('./views/sidebar/SidebarDemo.vue')
		},
		{
			path: '/slider',
			name: 'slider',
			component: () => import('./views/slider/SliderDemo.vue')
		},
		{
			path: '/spinner',
			name: 'spinner',
			component: () => import('./views/spinner/SpinnerDemo.vue')
		},
		{
			path: '/splitbutton',
			name: 'splitbutton',
			component: () => import('./views/splitbutton/SplitButtonDemo.vue')
		},
		{
			path: '/textarea',
			name: 'textarea',
			component: () => import('./views/textarea/TextareaDemo.vue')
		},
		{
			path: '/tabview',
			name: 'tabview',
			component: () => import('./views/tabview/TabViewDemo.vue')
		},
		{
			path: '/toast',
			name: 'toast',
			component: () => import('./views/toast/ToastDemo.vue')
		},
		{
			path: '/togglebutton',
			name: 'togglebutton',
			component: () => import('./views/togglebutton/ToggleButtonDemo.vue')
		},
		{
			path: '/toolbar',
			name: 'toolbar',
			component: () => import('./views/toolbar/ToolbarDemo.vue')
		},
		{
			path: '/tristatecheckbox',
			name: 'tristatecheckbox',
			component: () => import('./views/tristatecheckbox/TriStateCheckboxDemo.vue')
		}
	],
	scrollBehavior() {
        return {x: 0, y: 0};
	}
});
