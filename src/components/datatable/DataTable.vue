<template>
    <div :class="containerClass">
        <slot></slot>
        <div class="p-datatable-loading" v-if="loading">
            <div class="p-datatable-loading-overlay p-component-overlay"></div>
            <div class="p-datatable-loading-content">
                <i :class="loadingIconClass"></i>
            </div>
        </div>
        <div class="p-datatable-wrapper">
            <div class="p-datatable-header" v-if="$scopedSlots.header">
                <slot name="header"></slot>
            </div>
            <DTPaginator v-if="paginatorTop" :rows="rows" :first="first" :totalRecords="totalRecordsLength" :pageLinkSize="pageLinkSize" :template="paginatorTemplate" :rowsPerPageOptions="rowsPerPageOptions"
					:currentPageReportTemplate="currentPageReportTemplate" class="p-paginator-top" @page="onPage($event)" :alwaysShow="alwaysShowPaginator">
                <template #left v-if="$scopedSlots.paginatorLeft">
                    <slot name="paginatorLeft"></slot>
                </template>
                <template #right v-if="$scopedSlots.paginatorRight">
                    <slot name="paginatorRight"></slot>
                </template>
            </DTPaginator>
            <table>
                <thead class="p-datatable-thead">
                    <tr>
                        <th v-for="(col,i) of columns" :key="col.columnKey||col.field||i" :style="col.headerStyle" :class="getColumnHeaderClass(col)" @click="onColumnHeaderClick($event, col)">
                            <ColumnSlot :column="col" type="header" v-if="col.$scopedSlots.header" />
                            <span class="p-column-title" v-if="col.header">{{col.header}}</span>
                            <span v-if="col.sortable" :class="getSortableColumnIcon(col)"></span>
                            <ColumnSlot :column="col" type="filter" v-if="col.$scopedSlots.filter" />
                        </th>
                    </tr>
                </thead>
                <tfoot class="p-datatable-tfoot" v-if="hasFooter">
                    <tr>
                        <td v-for="(col,i) of columns" :key="col.columnKey||col.field||i" :style="col.footerStyle" :class="col.footerClass">
                            <ColumnSlot :column="col" type="footer" v-if="col.$scopedSlots.footer" />
                            {{col.footer}}
                        </td>
                    </tr>
                </tfoot>
                <tbody class="p-datatable-tbody">
                    <template v-if="!empty">
                        <tr :class="getRowClass(rowData)" v-for="(rowData, index) of dataToRender" :key="getRowKey(rowData, index)" 
                            @click="onRowClick($event, rowData, index)" @touchend="onRowTouchEnd($event)" @keydown="onRowKeyDown($event, rowData, index)" :tabindex="selectionMode ? '0' : null">
                            <td v-for="(col,i) of columns" :key="col.columnKey||col.field||i" :style="col.bodyStyle" :class="col.bodyClass">
                                <ColumnSlot :data="rowData" :column="col" type="body" v-if="col.$scopedSlots.body" />
                                <template v-else-if="col.selectionMode">
                                    <DTRadioButton :value="rowData" :checked="isSelected(rowData)" @change="toggleRowWithRadio" />
                                </template>
                                <template v-else>{{resolveFieldData(rowData, col.field)}}</template>
                            </td>
                        </tr>
                    </template>
                    <tr v-else class="p-datatable-emptymessage">
                        <td :colspan="columns.length">
                            <slot name="empty"></slot>
                        </td>
                    </tr>
                </tbody>
            </table>
            <DTPaginator v-if="paginatorBottom" :rows="rows" :first="first" :totalRecords="totalRecordsLength" :pageLinkSize="pageLinkSize" :template="paginatorTemplate" :rowsPerPageOptions="rowsPerPageOptions"
					:currentPageReportTemplate="currentPageReportTemplate" class="p-paginator-bottom" @page="onPage($event)" :alwaysShow="alwaysShowPaginator">
                <template #left v-if="$scopedSlots.paginatorLeft">
                    <slot name="paginatorLeft"></slot>
                </template>
                <template #right v-if="$scopedSlots.paginatorRight">
                    <slot name="paginatorRight"></slot>
                </template>
            </DTPaginator>
            <div class="p-datatable-footer" v-if="$scopedSlots.footer">
                <slot name="footer"></slot>
            </div>
        </div>
    </div>
</template>

<script>
import ObjectUtils from '../utils/ObjectUtils';
import FilterUtils from '../utils/FilterUtils';
import DomHandler from '../utils/DomHandler';
import Paginator from '../paginator/Paginator';
import RowRadioButton from './RowRadioButton';

const ColumnSlot = {
    functional: true,
    props: {
        column: {
            type: null,
            default: null
        },
        data: {
            type: null,
            default: null
        },
        type: {
            type: String,
            default: null
        }
    },
    render(createElement, context) {
        const content = context.props.column.$scopedSlots[context.props.type]({
            'data': context.props.data,
            'column': context.props.column
        });
        return [content];
    }
};

export default {
    props: {
        value: {
            type: Array,
            default: null
        },
        dataKey: {
            type: String,
            default: null
        },
        rows: {
            type: Number,
            default: 0
        },
        first: {
            type: Number,
            default: 0
        },
        totalRecords: {
            type: Number,
            default: 0
        },
        paginator: {
            type: Boolean,
            default: false
        },
        paginatorPosition: {
            type: String,
            default: 'bottom'
        },
        alwaysShowPaginator: {
            type: Boolean,
            default: true
        },
        paginatorTemplate: {
            type: String,
            default: 'FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown'
        },
        pageLinkSize: {
            type: Number,
            default: 5
        },
        rowsPerPageOptions: {
            type: Array,
            default: null
        },
        currentPageReportTemplate: {
            type: String,
            default: '({currentPage} of {totalPages})'
        },
        lazy: {
            type: Boolean,
            default: false
        },
        loading: {
            type: Boolean,
            default: false
        },
        loadingIcon: {
            type: String,
            default: 'pi pi-spinner'
        },
        sortField: {
            type: String,
            default: null
        },
        sortOrder: {
            type: Number,
            default: null
        },
        defaultSortOrder: {
            type: Number,
            default: 1
        },
        multiSortMeta: {
            type: Array,
            default: null
        },
        sortMode: {
            type: String,
            default: 'single'
        },
        filters: {
            type: Object,
            default: null
        },
        selection: {
            type: [Array,Object],
            default: null
        },
        selectionMode: {
            type: String,
            default: null
        },
        compareSelectionBy: {
            type: String,
            default: 'deepEquals'
        },
        metaKeySelection: {
            type: Boolean,
            default: true
        },
        rowHover: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {
            allChildren: null,
            d_first: this.first,
            d_rows: this.rows,
            d_sortField: this.sortField,
            d_sortOrder: this.sortOrder,
            d_multiSortMeta: this.multiSortMeta ? [...this.multiSortMeta] : [],
            d_selectionKeys: null
        };
    },
    rowTouched: false,
    anchorRowIndex: null,
    rangeRowIndex: null,
    watch: {
        first(newValue) {
            this.d_first = newValue;
        },
        rows(newValue) {
            this.d_rows = newValue;
        },
        sortField(newValue) {
            this.d_sortField = newValue;
        },
        sortOrder(newValue) {
            this.d_sortOrder = newValue;
        },
        multiSortMeta(newValue) {
            this.d_multiSortMeta = newValue;
        },
        selection(newValue) {
            if (this.dataKey) {
                this.updateSelectionKeys(newValue);
            }
        }
    },
    mounted() {
        this.allChildren = this.$children;
    },
    methods: {
        resolveFieldData(rowData, field) {
            return ObjectUtils.resolveFieldData(rowData, field);
        },
        onPage(event) {
            this.d_first = event.first;
            this.d_rows = event.rows;

            this.$emit('update:first', this.d_first);
            this.$emit('update:rows', this.d_rows);
            this.$emit('page', event);
        },
        onColumnHeaderClick(event, column) {
            if (column.sortable) {
                const targetNode = event.target;
                const columnField = column.field || column.sortField;

                if (DomHandler.hasClass(targetNode, 'p-sortable-column') || DomHandler.hasClass(targetNode, 'p-column-title') 
                    || DomHandler.hasClass(targetNode, 'p-sortable-column-icon') || DomHandler.hasClass(targetNode.parentElement, 'p-sortable-column-icon')) {
                    
                    DomHandler.clearSelection();
                    
                    this.d_sortOrder = (this.d_sortField === columnField) ? this.d_sortOrder * -1 : this.defaultSortOrder;
                    this.d_sortField = columnField;

                    if(this.sortMode === 'multiple') {
                        let metaKey = event.metaKey || event.ctrlKey;
                        if (!metaKey) {
                            this.d_multiSortMeta = [];
                        }

                        this.addSortMeta({field: this.d_sortField, order: this.d_sortOrder});   
                    }    

                    this.$emit('update:sortField', this.d_sortFied);
                    this.$emit('update:sortOrder', this.d_sortOrder);
                    this.$emit('update:multiSortMeta', this.d_multiSortMeta);

                    this.$emit('sort', {
                        originalEvent: event,
                        sortField: this.d_sortField,
                        sortOrder: this.d_sortOrder,
                        multiSortMeta: this.d_multiSortMeta
                    });
                }
            }
        },
        sortSingle(value) {
            let data = [...value];

            data.sort((data1, data2) => {
                let value1 = ObjectUtils.resolveFieldData(data1, this.d_sortField);
                let value2 = ObjectUtils.resolveFieldData(data2, this.d_sortField);
                let result = null;

                if (value1 == null && value2 != null)
                    result = -1;
                else if (value1 != null && value2 == null)
                    result = 1;
                else if (value1 == null && value2 == null)
                    result = 0;
                else if (typeof value1 === 'string' && typeof value2 === 'string')
                    result = value1.localeCompare(value2, undefined, { numeric: true });
                else
                    result = (value1 < value2) ? -1 : (value1 > value2) ? 1 : 0;

                return (this.d_sortOrder * result);
            });

            return data;
        },
        sortMultiple(value) {
            let data = [...value];

            data.sort((data1, data2) => {
                return this.multisortField(data1, data2, 0);
            });

            return data;            
        },
        multisortField(data1, data2, index) {
            const value1 = ObjectUtils.resolveFieldData(data1, this.d_multiSortMeta[index].field);
            const value2 = ObjectUtils.resolveFieldData(data2, this.d_multiSortMeta[index].field);
            let result = null;

            if (typeof value1 === 'string' || value1 instanceof String) {
                if (value1.localeCompare && (value1 !== value2)) {
                    return (this.d_multiSortMeta[index].order * value1.localeCompare(value2, undefined, { numeric: true }));
                }
            }
            else {
                result = (value1 < value2) ? -1 : 1;
            }

            if (value1 === value2)  {
                return (this.d_multiSortMeta.length - 1) > (index) ? (this.multisortField(data1, data2, index + 1)) : 0;
            }

            return (this.d_multiSortMeta[index].order * result);
        },
        getMultiSortMetaIndex(column) {
            let index = -1;

            for (let i = 0; i < this.d_multiSortMeta.length; i++) {
                let meta = this.d_multiSortMeta[i];
                if (meta.field === (column.field || column.sortField)) {
                    index = i;
                    break;
                }
            }

            return index;
        },
        getColumnHeaderClass(column) {
            const sorted = this.sortMode === 'single' ? (this.d_sortField === (column.field || column.sortField)) : this.getMultiSortMetaIndex(column) > -1;

            return [column.headerClass, 
                    {'p-sortable-column': column.sortable}, 
                    {'p-highlight': sorted}
            ];
        },
        getSortableColumnIcon(column) {
            let sorted = false;
            let sortOrder = null;

            if (this.sortMode === 'single') {
                sorted =  this.d_sortField === (column.field || column.sortField);
                sortOrder = sorted ? this.d_sortOrder: 0;
            }
            else if (this.sortMode === 'multiple') {
                let metaIndex = this.getMultiSortMetaIndex(column);
                if (metaIndex > -1) {
                    sorted = true;
                    sortOrder = this.d_multiSortMeta[metaIndex].order;
                }
            }
   
            return [
                'p-sortable-column-icon pi pi-fw',
                {'pi-sort': !sorted},
                {'pi-sort-up': sorted && sortOrder > 0},
                {'pi-sort-down': sorted && sortOrder < 0},
            ];
        },
        addSortMeta(meta) {
            let index = -1;
            for (let i = 0; i < this.d_multiSortMeta.length; i++) {
                if (this.d_multiSortMeta[i].field === meta.field) {
                    index = i;
                    break;
                }
            }

            if(index >= 0)
                this.d_multiSortMeta[index] = meta;
            else
                this.d_multiSortMeta.push(meta);

            this.d_multiSortMeta = [...this.d_multiSortMeta];
        },
        filter(data) {
            let filteredValue = [];

            for(let i = 0; i < data.length; i++) {
                let localMatch = true;
                let globalMatch = false;

                for(let j = 0; j < this.columns.length; j++) {
                    let col = this.columns[j];
                    let columnField = col.field;
                    
                    //local
                    if (this.filters.hasOwnProperty(columnField)) {
                        let filterValue = this.filters[columnField];
                        let dataFieldValue = ObjectUtils.resolveFieldData(data[i], columnField);
                        let filterConstraint = FilterUtils[col.filterMatchMode];

                        if (!filterConstraint(dataFieldValue, filterValue)) {
                            localMatch = false;
                        }

                        if (!localMatch) {
                            break;
                        }
                    }

                    if (!col.excludeGlobalFilter && this.hasGlobalFilter && !globalMatch) {
                        globalMatch = FilterUtils.contains(ObjectUtils.resolveFieldData(data[i], columnField), this.filters['global']);
                    }
                }

                let matches = localMatch;
                if(this.hasGlobalFilter) {
                    matches = localMatch && globalMatch;
                }

                if(matches) {
                    filteredValue.push(data[i]);
                }
            }

            if (filteredValue.length === data.length) {
                filteredValue = data;
            }

            return filteredValue;
        },
        onRowClick(event, rowData, rowIndex) {
            if (this.selectionMode) {
                let target = event.target;
                let targetNode = target.nodeName;
                let parentNode = target.parentElement && target.parentElement.nodeName;

                if (targetNode == 'INPUT' || targetNode == 'BUTTON' || targetNode == 'A' || 
                    parentNode == 'INPUT' || parentNode == 'BUTTON' || parentNode == 'A' ||
                    (DomHandler.hasClass(target, 'p-clickable'))) {
                    return;
                }

                if (this.isMultipleSelectionMode() && event.shiftKey && this.anchorRowIndex != null) {
                    DomHandler.clearSelection();
                    this.rangeRowIndex = rowIndex;
                    this.selectRange(event);
                }
                else {
                    const selected = this.isSelected(rowData);
                    const metaSelection = this.rowTouched ? false : this.metaKeySelection;
                    this.anchorRowIndex = rowIndex;
                    this.rangeRowIndex = rowIndex;

                    if (metaSelection) {
                        let metaKey = event.metaKey || event.ctrlKey;
                        
                        if (selected && metaKey) {
                            if(this.isSingleSelectionMode()) {
                                this.$emit('update:selection', null);
                            }
                            else {
                                const selectionIndex = this.findIndexInSelection(rowData);
                                const _selection = this.selection.filter((val,i) => i != selectionIndex);
                                this.$emit('update:selection', _selection);
                            }
                            
                            this.$emit('row-unselect', {originalEvent: event, data: rowData, type: 'row'});
                        }
                        else {
                            if(this.isSingleSelectionMode()) {
                                this.$emit('update:selection', rowData);
                            }
                            else if (this.isMultipleSelectionMode()) {
                                let _selection = metaKey ? (this.selection || []) : [];
                                _selection = [..._selection, rowData];
                                this.$emit('update:selection', _selection);
                            }

                            this.$emit('row-select', {originalEvent: event, data: rowData, type: 'row'});
                        }
                    }
                    else {
                        if (this.selectionMode === 'single') {
                            if (selected) {
                                this.$emit('update:selection', null);
                                this.$emit('row-unselect', {originalEvent: event, data: rowData, type: 'row'});
                            }
                            else {
                                this.$emit('update:selection', rowData);
                                this.$emit('row-select', {originalEvent: event, data: rowData, type: 'row'});
                            }
                        }
                        else if (this.selectionMode === 'multiple') {
                            if (selected) {
                                const selectionIndex = this.findIndexInSelection(rowData);
                                const _selection = this.selection.filter((val, i) => i != selectionIndex);
                                this.$emit('update:selection', _selection);
                                this.$emit('row-unselect', {originalEvent: event, data: rowData, type: 'row'});
                            }
                            else {
                                const _selection = this.selection ? [...this.selection, rowData] : [rowData];
                                this.$emit('update:selection', _selection);
                                this.$emit('row-select', {originalEvent: event, data: rowData, type: 'row'});
                            }
                        }
                    }
                }
            }
            
            this.rowTouched = false;
        },
        onRowTouchEnd() {
            this.rowTouched = true;
        },
        onRowKeyDown(event, rowData, rowIndex) {
            if (this.selectionMode) {
                const row = event.target;

                switch (event.which) {
                    //down arrow
                    case 40:
                        var nextRow = this.findNextSelectableRow(row);
                        if (nextRow) {
                            nextRow.focus();
                        }
        
                        event.preventDefault();
                    break;
        
                    //up arrow
                    case 38:
                        var prevRow = this.findPrevSelectableRow(row);
                        if (prevRow) {
                            prevRow.focus();
                        }
        
                        event.preventDefault();
                    break;
        
                    //enter
                    case 13:
                        this.onRowClick(event, rowData, rowIndex);
                    break;
        
                    default:
                        //no op
                    break;
                }
            }
        },
        findNextSelectableRow(row) {
            let nextRow = row.nextElementSibling;
            if (nextRow) {
                if (DomHandler.hasClass(nextRow, 'p-datatable-row'))
                    return nextRow;
                else
                    return this.findNextSelectableRow(nextRow);
            }
            else {
                return null;
            }
        },
        findPrevSelectableRow(row) {
            let prevRow = row.previousElementSibling;
            if (prevRow) {
                if (DomHandler.hasClass(prevRow, 'p-datatable-row'))
                    return prevRow;
                else
                    return this.findPrevSelectableRow(prevRow);
            }
            else {
                return null;
            }
        },
        toggleRowWithRadio(event) {
            const rowData = event.data;

            if (this.isSelected(rowData)) {
                this.$emit('update:selection', null);
                this.$emit('row-unselect', {originalEvent: event, data: rowData, type: 'radiobutton'});
            }
            else {
                this.$emit('update:selection', rowData);
                this.$emit('row-select', {originalEvent: event, data: rowData, type: 'radiobutton'});
            }
        },
        isSingleSelectionMode() {
            return this.selectionMode === 'single';
        },
        isMultipleSelectionMode() {
            return this.selectionMode === 'multiple';
        },
        isSelected(rowData) {
            if (rowData && this.selection) {
                if (this.dataKey) {
                    return this.d_selectionKeys ? this.d_selectionKeys[ObjectUtils.resolveFieldData(rowData, this.dataKey)] !== undefined : false;
                }
                else {
                    if (this.selection instanceof Array)
                        return this.findIndexInSelection(rowData) > -1;
                    else
                        return this.equals(rowData, this.selection);
                }
            }

            return false;
        },
        findIndexInSelection(rowData) {
            let index = -1;
            if (this.selection && this.selection.length) {
                for (let i = 0; i < this.selection.length; i++) {
                    if (this.equals(rowData, this.selection[i])) {
                        index = i;
                        break;
                    }
                }
            }

            return index;
        },
        updateSelectionKeys(selection) {
            this.d_selectionKeys = {};
            if (Array.isArray(selection)) {
                for (let data of selection) {
                    this.d_selectionKeys[String(ObjectUtils.resolveFieldData(data, this.dataKey))] = 1;
                }
            }
            else {
                this.d_selectionKeys[String(ObjectUtils.resolveFieldData(selection, this.dataKey))] = 1;
            }
        },
        equals(data1, data2) {
            return this.compareSelectionBy === 'equals' ? (data1 === data2) : ObjectUtils.equals(data1, data2, this.dataKey);
        },
        getRowKey(rowData, index) {
            return this.dataKey ? ObjectUtils.resolveFieldData(rowData, this.dataKey): index;
        },
        getRowClass(rowData) {
            if (this.selection) {
                return ['p-datatable-row', {
                    'p-highlight': this.isSelected(rowData)
                }];
            }
            else {
                return 'p-datatable-row';
            }
        },
        selectRange(event) {
            let rangeStart, rangeEnd;
            
            if (this.rangeRowIndex > this.anchorRowIndex) {
                rangeStart = this.anchorRowIndex;
                rangeEnd = this.rangeRowIndex;
            }
            else if(this.rangeRowIndex < this.anchorRowIndex) {
                rangeStart = this.rangeRowIndex;
                rangeEnd = this.anchorRowIndex;
            }
            else {
                rangeStart = this.rangeRowIndex;
                rangeEnd = this.rangeRowIndex;
            }
            
            if (this.lazy && this.paginator) {
                rangeStart -= this.first;
                rangeEnd -= this.first;
            }

            const filteredValue = this.processedData;
            let _selection = [];
            for(let i = rangeStart; i <= rangeEnd; i++) {
                let rangeRowData = filteredValue ? filteredValue[i] : this.value[i];
                _selection.push(rangeRowData);
                this.$emit('row-select', {originalEvent: event, data: rangeRowData, type: 'row'});
            }

            this.$emit('update:selection', _selection);
        }
    },
    computed: {
        containerClass() {
            return [
                'p-datatable p-component', {
                    'p-datatable-hoverable-rows': (this.rowHover || this.selectionMode)
                }
            ];
        },
        columns() {
            if (this.allChildren) {
                return this.allChildren.filter(child =>  child.$options._propKeys.indexOf('columnKey') !== -1);
            }
            return [];
        },
        processedData() {
            if (this.value && this.value.length) {
                let data = this.value;

                if (this.sorted) {
                    if(this.sortMode === 'single')
                        data = this.sortSingle(data);
                    else if(this.sortMode === 'multiple')
                        data = this.sortMultiple(data);
                }

                if (this.hasFilters) {
                    data = this.filter(data);
                }

                return data;
            }
            else {
                return null;
            }
        },
        dataToRender() {
            const data = this.processedData;

            if (this.paginator) {
                const first = this.lazy ? 0 : this.d_first;
                return data.slice(first, first + this.d_rows);
            }
            else {
                return data;
            }
        },
        totalRecordsLength() {
            if (this.lazy) {
                return this.totalRecords;
            }
            else {
                const data = this.hasFilters ? this.processedData : this.value;
                return data ? data.length : 0;
            }
        },
        empty() {
            return (!this.value || this.value.length === 0);
        },
        paginatorTop() {
            return this.paginator && (this.paginatorPosition !== 'bottom' || this.paginatorPosition === 'both');
        },
        paginatorBottom() {
            return this.paginator && (this.paginatorPosition !== 'top' || this.paginatorPosition === 'both');
        },
        sorted() {
            return this.d_sortField || (this.d_multiSortMeta && this.d_multiSortMeta.length > 0);
        },
        hasFooter() {
            let hasFooter = false;

            for (let col of this.columns) {
                if (col.footer || col.$scopedSlots.footer) {
                    hasFooter = true;
                    break;
                }
            }

            return hasFooter;
        },
        hasFilters() {
            return this.filters && Object.keys(this.filters).length > 0 && this.filters.constructor === Object;
        },
        hasGlobalFilter() {
            return this.filters && this.filters.hasOwnProperty('global');
        },
        loadingIconClass() {
            return ['p-datatable-loading-icon pi-spin', this.loadingIcon];
        }
    },
    components: {
        'ColumnSlot': ColumnSlot,
        'DTPaginator': Paginator,
        'DTRadioButton': RowRadioButton
    }
}
</script>

<style>
.p-datatable {
    position: relative;
}

.p-datatable table {
    border-collapse: collapse;
    width: 100%;
    table-layout: fixed;
}

.p-datatable .p-datatable-thead > tr > th,
.p-datatable .p-datatable-tbody > tr > td,
.p-datatable .p-datatable-tfoot > tr > td {
    padding: .25em .5em;
}

.p-datatable .p-sortable-column {
    cursor: pointer;
}

.p-datatable .p-sortable-column-icon {
    vertical-align: middle;
}

.p-datatable-auto-layout > .p-datatable-wrapper {
    overflow-x: auto;
}

.p-datatable-auto-layout > .p-datatable-wrapper > table {
    table-layout: auto;
}

/* Sections */
.p-datatable-header,
.p-datatable-footer {
    padding: .25em .5em;
    text-align: center;
    font-weight: bold;
}

.p-datatable-header {
    border-bottom: 0 none;
}

.p-datatable-footer {
    border-top: 0 none;
}

/* Paginator */
.p-datatable .p-paginator-top {
    border-bottom: 0 none;
}

.p-datatable .p-paginator-bottom {
    border-top: 0 none;
}

/* Scrollable */
.p-datatable-scrollable-wrapper {
    position: relative;
}
.p-datatable-scrollable-header,
.p-datatable-scrollable-footer {
    overflow: hidden;
    border: 0 none;
}

.p-datatable-scrollable-body {
    overflow: auto;
    position: relative;
}

.p-datatable-scrollable-body > table > .p-datatable-tbody > tr:first-child > td {
    border-top: 0 none;
}

.p-datatable-virtual-table {
    position: absolute;
}

/* Frozen Columns */
.p-datatable-frozen-view .p-datatable-scrollable-body {
    overflow: hidden;
}

.p-datatable-frozen-view > .p-datatable-scrollable-body > table > .p-datatable-tbody > tr > td:last-child {
    border-right: 0 none;
}

.p-datatable-unfrozen-view {
    position: absolute;
    top: 0px;
}

/* Filter */
.p-column-filter {
    width: 100%;
}

/* Resizable */
.p-datatable-resizable > .p-datatable-wrapper {
    overflow-x: auto;
}

.p-datatable-resizable .p-datatable-thead > tr > th,
.p-datatable-resizable .p-datatable-tfoot > tr > td,
.p-datatable-resizable .p-datatable-tbody > tr > td {
    overflow: hidden;
}

.p-datatable-resizable .p-resizable-column {
    background-clip: padding-box;
    position: relative;
}

.p-datatable-resizable-fit .p-resizable-column:last-child .p-column-resizer {
    display: none;
}

.p-datatable .p-column-resizer {
    display: block;
    position: absolute !important;
    top: 0;
    right: 0;
    margin: 0;
    width: .5em;
    height: 100%;
    padding: 0px;
    cursor:col-resize;
    border: 1px solid transparent;
}

.p-datatable .p-column-resizer-helper {
    width: 1px;
    position: absolute;
    z-index: 10;
    display: none;
}

/* Edit */
.p-datatable .p-datatable-tbody > tr > td.p-cell-editing .p-component {
    width: 100%;
}

/* Reorder */
.p-datatable-reorder-indicator-up,
.p-datatable-reorder-indicator-down {
    position: absolute;
    display: none;
}

/* Responsive */
.p-datatable-responsive .p-datatable-tbody > tr > td .p-column-title {
    display: none;
}

@media screen and (max-width: 40em) {
    .p-datatable-responsive .p-datatable-thead > tr > th,
    .p-datatable-responsive .p-datatable-tfoot > tr > td {
        display: none !important;
    }

    .p-datatable-responsive .p-datatable-tbody > tr > td {
        text-align: left;
        display: block;
        border: 0 none;
        width: 100% !important;
		float: left;
		clear: left;
    }

    .p-datatable-responsive .p-datatable-tbody > tr > td .p-column-title {
        padding: .4em;
        min-width: 30%;
        display: inline-block;
        margin: -.4em 1em -.4em -.4em;
        font-weight: bold;
    }
}

/* Loader */
.p-datatable .p-datatable-loading-overlay {
    position: absolute;
    width: 100%;
    height: 100%;
    -ms-filter: "progid:DXImageTransform.Microsoft.Alpha(Opacity=10)";
    opacity: 0.1;
    z-index: 1;
}

.p-datatable .p-datatable-loading-content {
    position: absolute;
    left: 50%;
    top: 50%;
    z-index: 2;
    margin-top: -1em;
    margin-left: -1em;
}

.p-datatable .p-datatable-loading-icon {
    font-size: 2em;
}

</style>
