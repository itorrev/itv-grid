/**
 * Created by itorrev on 10/04/14.
 */
'use strict';

var itvMessagesModule = angular.module('itvMessagesModule', []);

itvMessagesModule.value('itvMessages', {
    'panelbody.search.label': 'Buscar:',
    'panelbody.search.tooltip': 'Filtro por columna activado',
    'panelbody.menu.add': 'Nuevo Registro',
    'panelbody.menu.hidecolumns': 'Ocultar Columnas',
    'panelbody.menu.filtercolumns': 'Filtrar Columnas',
    'panelbody.page.items': 'Filas por p&aacute;gina:',
    'panelbody.search.btn.tooltip': 'Buscar en todas las columnas',
    'panelbody.remove.btn.tooltip': 'Eliminar filtro por columna',
    'panelbody.options.btn.tooltip': 'Opciones',
    'panelfooter.number.items': 'Mostrando {{getItemsShown()}} objetos de {{filteredData.length}}',
    'modal.hidecolumns.label': 'Seleccionar columnas a ocultar',
    'modal.filter.label': 'Filtrar por campos',
    'modal.btn.ok': 'Aceptar',
    'modal.btn.cancel': 'Cancelar',
    'modal.btn.filter': 'Filtrar',
    'action.btn.delete.tooltip': 'Borrar registro',
    'action.btn.edit.tooltip': 'Editar registro',
    'action.btn.undo.tooltip': 'Deshacer',
    'action.btn.save.tooltip': 'Guardar',
    'action.btn.clearedit.tooltip': 'Quitar edici&oacute;n'
});