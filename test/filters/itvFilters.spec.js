/**
 * Created by itorrev on 4/04/14.
 */
describe('itvFilters', function(){
    beforeEach(module('itvFilters'));

    describe('pagination filter', function(){
        it('should return an subset of an array', inject(function(paginationFilterFilter){
            var dataInput = [];
            for(i = 0; i < 113; i++){
                dataInput.push(i + '');
            }
            var dataResult = [];
            for(j = 0; j < 10; j++){
                dataResult.push(j + '');
            }
            expect(paginationFilterFilter(dataInput, 1, "10")).toEqual(dataResult);

            dataResult = [];
            for(j = 110; j < 113; j++){
                dataResult.push(j + '');
            }
            expect(paginationFilterFilter(dataInput, 12, "10")).toEqual(dataResult);

            dataResult = [];
            for(j = 50; j < 100; j++){
                dataResult.push(j + '');
            }
            expect(paginationFilterFilter(dataInput, 2, "50")).toEqual(dataResult);
        }));
    });

    describe('capitalize filter', function(){
        it('should capitalize words', inject(function(capitalizeFilter){
            expect(capitalizeFilter('testing')).toEqual('Testing');
            expect(capitalizeFilter('')).toEqual('');
            expect(capitalizeFilter('Testing')).toEqual('Testing');
            expect(capitalizeFilter('another test')).toEqual('Another test');
        }));
    });

    describe('messages filter', function(){
        it('should return message', inject(function(messageFilterFilter, itvMessages){
            expect(messageFilterFilter({})).toEqual({});
            expect(messageFilterFilter('nonexist.key')).toEqual('nonexist.key');
            expect(messageFilterFilter([])).toEqual([]);
            itvMessages['nonexist.key'] = 'new message';
            expect(messageFilterFilter('nonexist.key')).toEqual('new message');
        }))
    });

    describe('selection filter', function(){
        var input = [
            {$id: function(){ return '1'}},
            {$id: function(){ return '2'}},
            {$id: function(){ return '3'}},
            {$id: function(){ return '4'}},
            {$id: function(){ return '5'}},
            {$id: function(){ return '6'}},
            {$id: function(){ return '7'}},
            {$id: function(){ return '8'}},
            {$id: function(){ return '9'}}
        ];
        var selected = ['1', '5', '8'];

        it('should return input unfiltered if select view is not active', inject(function(selectionModeFilter){
            expect(selectionModeFilter(input, false, selected)).toEqual(input);
        }));

        it('should return filtered results', inject(function(selectionModeFilter){
            var result = selectionModeFilter(input, true, selected);
            expect(result.length).toEqual(3);
            expect(result[0].$id()).toEqual('1');
            expect(result[1].$id()).toEqual('5');
            expect(result[2].$id()).toEqual('8');
        }))
    })
});