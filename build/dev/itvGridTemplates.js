angular.module('itvGrid').run(['$templateCache', function($templateCache) {
  'use strict';

  $templateCache.put('itvGridTemplates/src/templates/advancedFilterModal.html',
    "<div class=\"modal-header\">\r" +
    "\n" +
    "    <h3 itv-message=\"modal.filter.label\"></h3>\r" +
    "\n" +
    "</div>\r" +
    "\n" +
    "<div class=\"modal-body\">\r" +
    "\n" +
    "    <form class=\"form-horizontal\" role=\"form\">\r" +
    "\n" +
    "        <div class=\"form-group\" ng-repeat=\"name in headerNames\">\r" +
    "\n" +
    "            <label class=\"col-sm-2 control-label\" for=\"{{name}}\">{{name | capitalize}}</label>\r" +
    "\n" +
    "            <div class=\"col-sm-8\">\r" +
    "\n" +
    "                <input type=\"text\" class=\"form-control\" ng-model=\"advancedFilterObj[name]\" id=\"{{name}}\">\r" +
    "\n" +
    "            </div>\r" +
    "\n" +
    "        </div>\r" +
    "\n" +
    "    </form>\r" +
    "\n" +
    "</div>\r" +
    "\n" +
    "<div class=\"modal-footer\">\r" +
    "\n" +
    "    <button class=\"btn btn-primary\" ng-click=\"ok()\" itv-message=\"modal.btn.filter\"></button>\r" +
    "\n" +
    "    <button class=\"btn btn-warning\" ng-click=\"cancel()\" itv-message=\"modal.btn.cancel\"></button>\r" +
    "\n" +
    "</div>"
  );


  $templateCache.put('itvGridTemplates/src/templates/hideColumnModal.html',
    "<div class=\"modal-header\">\r" +
    "\n" +
    "    <h3 itv-message=\"modal.hidecolumns.label\"></h3>\r" +
    "\n" +
    "</div>\r" +
    "\n" +
    "<div class=\"modal-body\">\r" +
    "\n" +
    "    <form class=\"form-horizontal\" role=\"form\">\r" +
    "\n" +
    "        <div class=\"form-group\">\r" +
    "\n" +
    "            <ul>\r" +
    "\n" +
    "                <li ng-repeat=\"name in headerNames\">\r" +
    "\n" +
    "                    <div class=\"checkbox\">\r" +
    "\n" +
    "                        <label><input type=\"checkbox\" value=\"{{name}}\" itv-checkboxlist=\"columnsToHide\"> {{ name | capitalize}}</label>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                    </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                </li>\r" +
    "\n" +
    "            </ul>\r" +
    "\n" +
    "\r" +
    "\n" +
    "        </div>\r" +
    "\n" +
    "    </form>\r" +
    "\n" +
    "</div>\r" +
    "\n" +
    "<div class=\"modal-footer\">\r" +
    "\n" +
    "    <button class=\"btn btn-primary\" ng-click=\"ok()\" itv-message=\"modal.btn.ok\"></button>\r" +
    "\n" +
    "    <button class=\"btn btn-warning\" ng-click=\"cancel()\" itv-message=\"modal.btn.cancel\"></button>\r" +
    "\n" +
    "</div>"
  );


  $templateCache.put('itvGridTemplates/src/templates/itvGrid.html',
    "<div class=\"panel panel-default\">\r" +
    "\n" +
    "    <itv-Panelheader></itv-Panelheader>\r" +
    "\n" +
    "    <div class=\"animated-panel itvSlide\" ng-hide=\"isCollapsed\">\r" +
    "\n" +
    "        <itv-Panelbody></itv-Panelbody>\r" +
    "\n" +
    "        <table class=\"table table-striped table-bordered table-condensed table-hover\" id=\"tableTest\">\r" +
    "\n" +
    "            <thead>\r" +
    "\n" +
    "            <tr>\r" +
    "\n" +
    "                <th ng-repeat=\"header in headers\" ng-click=\"setOrderBy(header.name)\" class=\"headerStyle itvFade\" ng-hide=\"header.isHidden\">\r" +
    "\n" +
    "                    {{ header.name | capitalize}}\r" +
    "\n" +
    "                    <i ng-class=\"{'fa-sort-asc': orderBy.asc, 'fa-sort-desc': !orderBy.asc}\" ng-show=\"orderBy.headerName == header.name\" class=\"fa rightFloater\"></i>\r" +
    "\n" +
    "                    <i class=\"fa fa-sort rightFloater\" ng-show=\"orderBy.headerName != header.name\"></i>\r" +
    "\n" +
    "                </th>\r" +
    "\n" +
    "                <th class=\"col-xs-1\" itv-message=\"table.header.action\" ng-show=\"allowCUD\"></th>\r" +
    "\n" +
    "            </tr>\r" +
    "\n" +
    "            </thead>\r" +
    "\n" +
    "            <tbody>\r" +
    "\n" +
    "            <tr ng-show=\"insertMode\">\r" +
    "\n" +
    "                <td ng-repeat=\"header in headers\" ng-hide=\"header.isHidden\" class=\"itvFade\">\r" +
    "\n" +
    "                    <div ng-show=\"header.isInsertable\"><input class=\"form-control\" type=\"text\" ng-model=\"insertRow[header.name]\"></div>\r" +
    "\n" +
    "                </td>\r" +
    "\n" +
    "                <td>\r" +
    "\n" +
    "                    <div class=\"btn-group\">\r" +
    "\n" +
    "                        <button class=\"btn btn-default btn-sm\" ng-click=\"insertData()\" itv-tooltipfade tooltip=\"{{ 'action.btn.save.tooltip' | messageFilter }}\">\r" +
    "\n" +
    "                            <i class=\"fa fa-save fa-lg\"></i>\r" +
    "\n" +
    "                        </button>\r" +
    "\n" +
    "                        <button class=\"btn btn-default btn-sm\" ng-click=\"setInsertMode()\" itv-tooltipfade tooltip=\"{{ 'action.btn.undo.tooltip' | messageFilter }}\">\r" +
    "\n" +
    "                            <i class=\"fa fa-reply fa-lg\"></i>\r" +
    "\n" +
    "                        </button>\r" +
    "\n" +
    "                    </div>\r" +
    "\n" +
    "                </td>\r" +
    "\n" +
    "            </tr>\r" +
    "\n" +
    "            <tr ng-repeat=\"row in filteredData | orderBy:orderBy.headerName:!orderBy.asc | paginationFilter:pagina:itemsPorPagina\">\r" +
    "\n" +
    "                <td ng-repeat=\"header in headers\" ng-hide=\"header.isHidden\"  class=\"itvFade\">\r" +
    "\n" +
    "                    <div ng-show=\"row.editMode == null || row.editMode == false || !header.isEditable\">{{ row[header.name] }}</div>\r" +
    "\n" +
    "                    <div ng-show=\"row.editMode == true && header.isEditable\"><input class=\"form-control\" type=\"text\" ng-model=\"copiedEditingRow[header.name]\"></div>\r" +
    "\n" +
    "                </td>\r" +
    "\n" +
    "                <td ng-show=\"allowCUD\">\r" +
    "\n" +
    "                    <div class=\"btn-group\" ng-show=\"row.editMode == null || row.editMode == false\">\r" +
    "\n" +
    "                        <button class=\"btn btn-default btn-sm\" ng-click=\"deleteData(row)\" itv-tooltipfade tooltip=\"{{ 'action.btn.delete.tooltip' | messageFilter }}\">\r" +
    "\n" +
    "                            <i class=\"fa fa-trash-o fa-lg\"></i>\r" +
    "\n" +
    "                        </button>\r" +
    "\n" +
    "                        <button class=\"btn btn-default btn-sm\" ng-click=\"setRowEditable(row)\" itv-tooltipfade tooltip=\"{{ 'action.btn.edit.tooltip' | messageFilter }}\">\r" +
    "\n" +
    "                            <i class=\"fa fa-edit fa-lg\"></i>\r" +
    "\n" +
    "                        </button>\r" +
    "\n" +
    "                    </div>\r" +
    "\n" +
    "                    <div class=\"btn-group\" ng-show=\"row.editMode == true\">\r" +
    "\n" +
    "                        <button class=\"btn btn-default btn-sm\" ng-click=\"setRowEditable(row)\" itv-tooltipfade tooltip=\"{{ 'action.btn.undo.tooltip' | messageFilter }}\">\r" +
    "\n" +
    "                            <i class=\"fa fa-reply fa-lg\"></i>\r" +
    "\n" +
    "                        </button>\r" +
    "\n" +
    "                        <button class=\"btn btn-default btn-sm\" ng-click=\"updateData(copiedEditingRow)\" ng-show=\"row.editMode == true\"\r" +
    "\n" +
    "                                itv-tooltipfade tooltip=\"{{ 'action.btn.save.tooltip' | messageFilter }}\">\r" +
    "\n" +
    "                            <i class=\"fa fa-save fa-lg\"></i>\r" +
    "\n" +
    "                        </button>\r" +
    "\n" +
    "                    </div>\r" +
    "\n" +
    "                </td>\r" +
    "\n" +
    "            </tr>\r" +
    "\n" +
    "            </tbody>\r" +
    "\n" +
    "        </table>\r" +
    "\n" +
    "        <itv-Panelfooter></itv-Panelfooter>\r" +
    "\n" +
    "    </div>\r" +
    "\n" +
    "</div>"
  );


  $templateCache.put('itvGridTemplates/src/templates/panelBody.html',
    "<div class=\"panel-body\">\r" +
    "\n" +
    "    <form class=\"form-inline\" role=\"form\">\r" +
    "\n" +
    "        <div class=\"form-group\" ng-hide=\"advancedFilterActive\">\r" +
    "\n" +
    "            <label for=\"buscar\" itv-message=\"panelbody.search.label\"></label>\r" +
    "\n" +
    "            <input class=\"form-control\" type=\"text\" id=\"buscar\" ng-model=\"genericSearchFilter\"\r" +
    "\n" +
    "                   ng-disabled=\"advancedFilterActive\" itv-enterkey=\"doGenericFilter()\" itv-blur=\"doGenericFilter()\">\r" +
    "\n" +
    "        </div>\r" +
    "\n" +
    "        <div class=\"form-group\" tooltip=\"{{'panelbody.search.tooltip' | messageFilter }}\"\r" +
    "\n" +
    "             itv-tooltipfade ng-show=\"advancedFilterActive\">\r" +
    "\n" +
    "            <label for=\"buscardisabled\" itv-message=\"panelbody.search.label\"></label>\r" +
    "\n" +
    "            <input class=\"form-control\" type=\"text\" id=\"buscardisabled\" ng-disabled=\"advancedFilterActive\">\r" +
    "\n" +
    "        </div>\r" +
    "\n" +
    "        <div class=\"form-group\">\r" +
    "\n" +
    "            <button class=\"btn btn-default btn-sm form-control\" ng-hide=\"advancedFilterActive\" itv-tooltipfade\r" +
    "\n" +
    "                    ng-click=\"doGenericFilter()\" tooltip=\"{{ 'panelbody.search.btn.tooltip' | messageFilter }}\">\r" +
    "\n" +
    "                <i class=\"fa fa-filter fa-lg\"></i>\r" +
    "\n" +
    "            </button>\r" +
    "\n" +
    "            <button class=\"btn btn-default btn-sm form-control\" ng-show=\"advancedFilterActive\" itv-tooltipfade\r" +
    "\n" +
    "                    ng-click=\"clearAdvancedFilter()\" tooltip=\"{{ 'panelbody.remove.btn.tooltip' | messageFilter }}\">\r" +
    "\n" +
    "                <i class=\"fa fa-times fa-lg\"></i>\r" +
    "\n" +
    "            </button>\r" +
    "\n" +
    "        </div>\r" +
    "\n" +
    "        <div class=\"form-group dropdown rightFloater options-btn\">\r" +
    "\n" +
    "            <button class=\"btn btn-default btn-sm dropdown-toggle form-control rightFloater\" itv-tooltipfade\r" +
    "\n" +
    "                    tooltip=\"{{ 'panelbody.options.btn.tooltip' | messageFilter }}\">\r" +
    "\n" +
    "                <i class=\"fa fa-cog fa-lg\"></i>\r" +
    "\n" +
    "                <i class=\"fa fa-sort-down\"></i>\r" +
    "\n" +
    "            </button>\r" +
    "\n" +
    "            <ul class=\"dropdown-menu\">\r" +
    "\n" +
    "                <li class=\"clickable menuItem\" ng-click=\"setInsertMode()\" ng-show=\"allowCUD\">\r" +
    "\n" +
    "                    <i class=\"fa fa-plus fa-lg\"></i> <span itv-message=\"panelbody.menu.add\"></span>\r" +
    "\n" +
    "                </li>\r" +
    "\n" +
    "                <li class=\"clickable menuItem\" ng-click=\"openHideColumnModal()\">\r" +
    "\n" +
    "                    <i class=\"fa fa-columns fa-lg\"></i> <span itv-message=\"panelbody.menu.hidecolumns\"></span>\r" +
    "\n" +
    "                </li>\r" +
    "\n" +
    "                <li class=\"clickable menuItem\" ng-click=\"openAdvancedFilterModal()\">\r" +
    "\n" +
    "                    <i class=\"fa fa-filter fa-lg\"></i> <span itv-message=\"panelbody.menu.filtercolumns\"></span>\r" +
    "\n" +
    "                </li>\r" +
    "\n" +
    "            </ul>\r" +
    "\n" +
    "        </div>\r" +
    "\n" +
    "        <div class=\"form-group rightFloater\">\r" +
    "\n" +
    "            <label for=\"itemsPorPagina\" itv-message=\"panelbody.page.items\"></label>\r" +
    "\n" +
    "            <select class=\"form-control\" id=\"itemsPorPagina\" ng-model=\"itemsPorPagina\" ng-change=\"updateLiteral()\">\r" +
    "\n" +
    "                <option>10</option>\r" +
    "\n" +
    "                <option>25</option>\r" +
    "\n" +
    "                <option>50</option>\r" +
    "\n" +
    "            </select>\r" +
    "\n" +
    "        </div>\r" +
    "\n" +
    "    </form>\r" +
    "\n" +
    "</div>"
  );


  $templateCache.put('itvGridTemplates/src/templates/panelFooter.html',
    "<div class=\"panel-footer\">\r" +
    "\n" +
    "    <div class=\"leftFloater\" itv-message=\"panelfooter.number.items\" itv-message-param=\"{{ firstLastTotalObj }}\">\r" +
    "\n" +
    "    </div>\r" +
    "\n" +
    "    <div class=\"rightFloater\">\r" +
    "\n" +
    "        <pagination boundary-links=\"true\" total-items=\"itemsTotales\" page=\"pagina\" items-per-page=\"itemsPorPagina\" class=\"pagination-sm\" max-size=\"5\" rotate=\"false\"\r" +
    "\n" +
    "                    on-select-page=\"cambioPagina(page)\" previous-text=\"&lsaquo;\" next-text=\"&rsaquo;\" first-text=\"&laquo;\" last-text=\"&raquo;\"></pagination>\r" +
    "\n" +
    "    </div>\r" +
    "\n" +
    "    <div class=\"clearBoth\"></div>\r" +
    "\n" +
    "</div>"
  );


  $templateCache.put('itvGridTemplates/src/templates/panelHeader.html',
    "<div class=\"panel-heading\">\r" +
    "\n" +
    "    <div>\r" +
    "\n" +
    "        <div class=\"leftFloater\"><i class=\"fa fa-table\"></i> {{title}}</div>\r" +
    "\n" +
    "        <div class=\"rightFloater clickable\">\r" +
    "\n" +
    "            <i class=\"fa\" ng-class=\"{'fa-chevron-up': !isCollapsed, 'fa-chevron-down': isCollapsed}\" ng-click=\"collapse()\"></i>\r" +
    "\n" +
    "        </div>\r" +
    "\n" +
    "        <div class=\"clearBoth\"></div>\r" +
    "\n" +
    "    </div>\r" +
    "\n" +
    "</div>"
  );

}]);
