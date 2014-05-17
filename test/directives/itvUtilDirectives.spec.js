/**
 * Created by itorrev on 4/04/14.
 */
describe('itvUtilsDirectives', function(){
    beforeEach(module('itvUtilDirectives'));

    var parent, scope, $rootScope;

    describe('itvCheckboxlist', function(){
        var names = ['zero', 'one', 'two', 'three', 'four', 'five'];
        var checked = ['one', 'five'];
        beforeEach(inject(function ($compile, _$rootScope_) {
            var html = '';
            $rootScope = _$rootScope_;
            scope = $rootScope.$new();
            scope.selected = checked;
            scope.names = names;
            html = '<ul><li ng-repeat="name in names"><input type="checkbox" value="{{name}}" itv-checkboxlist="selected"></li></ul>';
            var linkingFn = $compile(html);
            parent = linkingFn(scope);
            $rootScope.$digest();
        }));

        it('should have 6 elements', function(){
            expect(parent.find('input').length).toBe(6);
        });

        it('should have elements checked', function(){
            var checkboxes = parent.find('input');
            expect((checkboxes.eq(0)).prop('checked')).toBe(false);
            expect((checkboxes.eq(1)).prop('checked')).toBe(true);
            expect((checkboxes.eq(2)).prop('checked')).toBe(false);
            expect((checkboxes.eq(3)).prop('checked')).toBe(false);
            expect((checkboxes.eq(4)).prop('checked')).toBe(false);
            expect((checkboxes.eq(5)).prop('checked')).toBe(true);
        });

        it('should update list when checkbox checked', function(){
            var checkboxes = parent.find('input');
            expect((checkboxes.eq(0)).prop('checked')).toBe(false);
            browserTrigger(checkboxes.eq(0), 'click');
            expect((checkboxes.eq(0)).prop('checked')).toBe(true);
            expect(scope.selected).toEqual(['one', 'five', 'zero']);
        });

        it('should update list when checkbox unchecked', function(){
            var checkboxes = parent.find('input');
            expect((checkboxes.eq(5)).prop('checked')).toBe(true);
            browserTrigger(checkboxes.eq(5), 'click');
            expect((checkboxes.eq(5)).prop('checked')).toBe(false);
            expect(scope.selected).toEqual(['one', 'zero']);
        });
    })
});