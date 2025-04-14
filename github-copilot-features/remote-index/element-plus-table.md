# Element Plus Table Component Documentation

This document provides a summary of the basic usage, attributes, events, slots, and exposed methods for the Element Plus Table and Table-column components, based on the official documentation.

## Basic Usage

To display a basic table, inject an array of data objects into the `el-table` element using the `data` attribute. Inside `el-table`, use `el-table-column` components. Set the `prop` attribute on `el-table-column` to correspond to the key names in your data objects to populate the cells. Use the `label` attribute to define the column header name. The `width` attribute can be used to set the column width.

Example:
```vue
<template>
  <el-table :data="tableData" style="width: 100%">
    <el-table-column prop="date" label="Date" width="180" />
    <el-table-column prop="name" label="Name" width="180" />
    <el-table-column prop="address" label="Address" />
  </el-table>
</template>

<script lang="ts" setup>
const tableData = [
  {
    date: '2016-05-03',
    name: 'Tom',
    address: 'No. 189, Grove St, Los Angeles',
  },
  // ... more data
]
</script>
```

## Table Attributes

- **data**: Table data (array, default: [])
- **height**: Table height. Default is auto height. If number, unit is px; if string, sets `style.height`. (string / number, default: —)
- **max-height**: Max height of the table. Valid values are numbers or strings with px unit. (string / number, default: —)
- **stripe**: Whether to display a striped table. (boolean, default: false)
- **border**: Whether to display a vertical border. (boolean, default: false)
- **size**: Size of the Table. (enum, default: —)
- **fit**: Whether columns should fit the container width. (boolean, default: true)
- **show-header**: Whether to display the table header. (boolean, default: true)
- **highlight-current-row**: Whether to highlight the current row. (boolean, default: false)
- **current-row-key**: Key of the current row (write-only). (string / number, default: —)
- **row-class-name**: Callback function for row class name, or a fixed string for all rows. (Function / string, default: —)
- **row-style**: Callback function for row style, or a fixed object for all rows. (Function / object, default: —)
- **cell-class-name**: Callback function for cell class name, or a fixed string for all cells. (Function / string, default: —)
- **cell-style**: Callback function for cell style, or a fixed object for all cells. (Function / object, default: —)
- **header-row-class-name**: Callback function for header row class name, or a fixed string for all header rows. (Function / string, default: —)
- **header-row-style**: Callback function for header row style, or a fixed object for all header rows. (Function / object, default: —)
- **header-cell-class-name**: Callback function for header cell class name, or a fixed string for all header cells. (Function / string, default: —)
- **header-cell-style**: Callback function for header cell style, or a fixed object for all header cells. (Function / object, default: —)
- **row-key**: Key for row data, used to optimize rendering. Required for `reserve-selection` and tree data. (function / string, default: —)
- **empty-text**: Text displayed when data is empty. Can also be set via `#empty` slot. (string, default: 'No Data')
- **default-expand-all**: Whether to expand all rows by default (for expandable rows or tree data). (boolean, default: false)
- **expand-row-keys**: Array of keys for currently expanded rows. Requires `row-key`. (array, default: —)
- **default-sort**: Default sort column (`prop`) and order (`order`). (object, default: {})
- **tooltip-effect**: Tooltip effect for overflowed content. (enum, default: 'dark')
- **tooltip-options**: Options for overflow tooltip (refer to Tooltip component). (object, default: {})
- **append-filter-panel-to**: DOM element to mount the filter panel to. (string, default: —)
- **show-summary**: Whether to display a summary row at the bottom. (boolean, default: false)
- **sum-text**: Text displayed in the first column of the summary row. (string, default: 'Sum')
- **summary-method**: Custom summary calculation method. (Function, default: —)
- **span-method**: Method for merging rows or columns. (Function, default: —)
- **select-on-indeterminate**: Behavior when clicking header checkbox in indeterminate state (multiselect). `true` selects all, `false` deselects all. (boolean, default: true)
- **indent**: Indentation size for tree data nodes. (number, default: 16)
- **lazy**: Whether to lazy load child node data. (boolean, default: false)
- **load**: Function to load child node data (used with `lazy`). (Function, default: —)
- **tree-props**: Configuration options for rendering nested data. (object, default: { hasChildren: 'hasChildren', children: 'children' })
- **table-layout**: Sets the layout algorithm for table cells, rows, and columns. (enum (`fixed`, `auto`), default: 'fixed')
- **scrollbar-always-on**: Always display scrollbars. (boolean, default: false)
- **show-overflow-tooltip**: Whether to hide extra content and show it via tooltip on hover. Affects all columns. (boolean / object, default: —)
- **flexible**: Ensures the minimum size of the main axis so that the content does not wrap or overflow. (boolean, default: false)
- **scrollbar-tabindex**: Tabindex for the scrollbar container of the table body. (string / number, default: —)
- **allow-drag-last-column**: Whether to allow dragging the last column. (boolean, default: true)
- **tooltip-formatter**: Custom formatter for `show-overflow-tooltip` content. (Function, default: —)
- **preserve-expanded-content**: Whether to keep expanded row content in the DOM after collapsing. (boolean, default: false)

## Table Events

- **select**: Triggered when a row's checkbox is manually checked. (Parameters: `(selection, row)`)
- **select-all**: Triggered when the header checkbox is manually checked. (Parameters: `(selection)`)
- **selection-change**: Triggered when the selection changes. (Parameters: `(selection)`)
- **cell-mouse-enter**: Triggered when the mouse enters a cell. (Parameters: `(row, column, cell, event)`)
- **cell-mouse-leave**: Triggered when the mouse leaves a cell. (Parameters: `(row, column, cell, event)`)
- **cell-click**: Triggered when a cell is clicked. (Parameters: `(row, column, cell, event)`)
- **cell-dblclick**: Triggered when a cell is double-clicked. (Parameters: `(row, column, cell, event)`)
- **cell-contextmenu**: Triggered when a cell is right-clicked. (Parameters: `(row, column, cell, event)`)
- **row-click**: Triggered when a row is clicked. (Parameters: `(row, column, event)`)
- **row-contextmenu**: Triggered when a row is right-clicked. (Parameters: `(row, column, event)`)
- **row-dblclick**: Triggered when a row is double-clicked. (Parameters: `(row, column, event)`)
- **header-click**: Triggered when a column header is clicked. (Parameters: `(column, event)`)
- **header-contextmenu**: Triggered when a column header is right-clicked. (Parameters: `(column, event)`)
- **sort-change**: Triggered when sorting conditions change. (Parameters: `({ column, prop, order })`)
- **filter-change**: Triggered when filter conditions change. Requires `column-key` on `el-table-column`. (Parameters: `(filters)`)
- **current-change**: Triggered when the current row changes. Requires `highlight-current-row`. (Parameters: `(currentRow, oldCurrentRow)`)
- **header-dragend**: Triggered when column width is changed by dragging the header. (Parameters: `(newWidth, oldWidth, column, event)`)
- **expand-change**: Triggered when a row is expanded or collapsed. (Parameters: `(row, expandedRows)` or `(row, expanded)` for tree data)
- **scroll**: Triggered when the table is scrolled by the user. (Parameters: `({ scrollLeft, scrollTop })`)

## Table Slots

- **default**: Customizes the default content, typically used for `el-table-column` definitions.
- **append**: Content inserted after the last row. Useful for infinite scrolling. Appears above the summary row if present.
- **empty**: Custom content displayed when data is empty.

## Table Exposes (Methods)

- **clearSelection**: Clears user selection in a multi-select table.
- **getSelectionRows**: Returns the currently selected rows.
- **toggleRowSelection**: Toggles the selection state of a specific row in a multi-select table. Can set state directly with the second argument (`selected`).
- **toggleAllSelection**: Toggles select/deselect all in a multi-select table.
- **toggleRowExpansion**: Toggles the expansion state of a row in expandable or tree tables. Can set state directly with the second argument (`expanded`).
- **setCurrentRow**: Sets a specific row as the current selected row in a single-select table. Call without arguments to clear the current selection.
- **clearSort**: Clears sorting conditions, restoring the original data order.
- **clearFilter**: Clears filter conditions for specified columns (pass array of `columnKey`). Clears all filters if called without arguments.
- **doLayout**: Recalculates table layout. Useful when table visibility changes.
- **sort**: Manually sorts the table. Parameters: `prop` (column to sort by), `order` ('ascending'/'descending').
- **scrollTo**: Scrolls to a specific coordinate `(x, y)` or `({ top, left })`.
- **setScrollTop**: Sets the vertical scroll position.
- **setScrollLeft**: Sets the horizontal scroll position.
- **columns**: Gets the context of the table columns.
- **updateKeyChildren**: Updates key children for lazy-loaded tables. Requires `rowKey`.

## Table-column Attributes

- **type**: Type of the column. `selection` for checkbox, `index` for row index (1-based), `expand` for expandable row button. (enum, default: 'default')
- **index**: Customizes the index when `type` is `index`. Can be a starting number or a function `(index: number) => number | string`. (number / Function, default: —)
- **label**: Column header text. (string, default: —)
- **column-key**: Key for the column, used for filter events. (string, default: —)
- **prop**: Field name in the data object corresponding to the column content. Alias: `property`. (string, default: —)
- **width**: Column width. (string / number, default: '')
- **min-width**: Minimum column width. Distributes remaining space proportionally among columns with `min-width`. (string / number, default: '')
- **fixed**: Whether the column is fixed to the left or right. `true` fixes to the left. (enum (`left`, `right`) / boolean, default: false)
- **render-header**: Function to render the column header label area. (Function, default: —)
- **sortable**: Whether the column is sortable. `'custom'` for remote sorting (requires `sort-change` event listener). (boolean / 'custom', default: false)
- **sort-method**: Custom sorting method function (like `Array.sort` compare function). Used only when `sortable` is `true`. (Function, default: —)
- **sort-by**: Property/properties to sort by if `sort-method` is not set. Can be a string, function, or array of strings. (Function / string / array, default: —)
- **sort-orders**: Array defining the cycle order of sorting states (`'ascending'`, `'descending'`, `null`). (array, default: ['ascending', 'descending', null])
- **resizable**: Whether the column width can be changed by dragging (requires `border` on `el-table`). (boolean, default: true)
- **formatter**: Function to format cell content `(row, column, cellValue, index) => VNode | string`. (function, default: —)
- **show-overflow-tooltip**: Whether to show a tooltip when content overflows. Can be boolean or object (tooltip options). (boolean / object, default: undefined)
- **align**: Horizontal alignment of cell content. (enum (`left`, `center`, `right`), default: 'left')
- **header-align**: Horizontal alignment of header content. Defaults to `align` if not set. (enum (`left`, `center`, `right`), default: 'left')
- **class-name**: Class name for the column's cells. (string, default: —)
- **label-class-name**: Class name for the column's header label. (string, default: —)
- **selectable**: Function to determine if a row's checkbox is selectable (only for `type='selection'`). `(row, index) => boolean`. (Function, default: —)
- **reserve-selection**: Whether to preserve selection after data refresh (only for `type='selection'`, requires `row-key`). (boolean, default: false)
- **filters**: Array of filter options. Each item needs `text` and `value` properties. (array, default: —)
- **filter-placement**: Placement of the filter popup. (enum, default: —)
- **filter-class-name**: Class name for the filter popup. (string, default: —)
- **filter-multiple**: Whether filtering options are multi-select. (boolean, default: true)
- **filter-method**: Custom filtering method `(value, row, column) => boolean`. (function, default: —)
- **filtered-value**: Array of currently selected filter values. (array, default: —)
- **tooltip-formatter**: Custom formatter for `show-overflow-tooltip` content. `(row, column, cellValue, index) => string | VNode`. (Function, default: —)

## Table-column Slots

- **default**: Customizes the content of the cells in the column. (Scope Parameters: `{ row, column, $index }`)
- **header**: Customizes the content of the header for the column. (Scope Parameters: `{ column, $index }`)
- **filter-icon**: Customizes the filter icon. (Scope Parameters: `{ column, $index }` (Available since 2.7.8))
