/**
 * Created by itorrev on 4/04/14.
 */
describe('itvUtilsDirectives', function(){
    beforeEach(module('itvUtilDirectives'));

    var parent, scope, $rootScope, $compile, element;
    beforeEach(inject(function(_$compile_, _$rootScope_){
        $rootScope = _$rootScope_;
        $compile = _$compile_;
    }));

    describe('itvCheckboxlist', function(){
        var names = ['zero', 'one', 'two', 'three', 'four', 'five'];
        var checked = ['one', 'five'];
        beforeEach(function (){
            scope = $rootScope.$new();
            scope.selected = checked;
            scope.names = names;
            var html = '<ul><li ng-repeat="name in names"><input type="checkbox" value="{{name}}" itv-checkboxlist="selected"></li></ul>';
            var linkingFn = $compile(html);
            parent = linkingFn(scope);
            $rootScope.$digest();
        });

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
    });

    describe('itvEnterKey', function(){
        beforeEach(function(){
            scope = $rootScope.$new();
            scope.returnFn = function(){
                angular.noop();
            };

            var html = '<input type="text" itv-enterkey="returnFn()">';
            var linkingFn = $compile(html);
            element = linkingFn(scope);
            $rootScope.$digest();
        });

        it('should execute a function on enter key', function(){
            spyOn(scope, 'returnFn');
            expect(scope.returnFn).not.toHaveBeenCalled();
            var event = new CustomEvent('keypress');
            event.which = 13;
            element[0].dispatchEvent(event);
            expect(scope.returnFn).toHaveBeenCalled();
        })
    });

    describe('itvBlur', function(){
        beforeEach(function(){
            scope = $rootScope.$new();
            scope.returnFn = function(){
                angular.noop();
            };

            var html = '<input type="text" itv-blur="returnFn()">';
            var linkingFn = $compile(html);
            element = linkingFn(scope);
            $rootScope.$digest();
        });

        it('should execute a function on blur', function(){
            spyOn(scope, 'returnFn');
            expect(scope.returnFn).not.toHaveBeenCalled();
            var event = new CustomEvent('blur');
            element[0].dispatchEvent(event);
            expect(scope.returnFn).toHaveBeenCalled();
        })
    });

    describe('itvMessages', function(){
        beforeEach(inject(function(itvMessages){
            scope = $rootScope.$new();
            scope.interpolatedValue = 'interpolated';
            itvMessages['test.message'] = 'the interpolated value is: {{ interpolatedValue }}';
            var html = '<div itv-message="test.message" itv-message-param="{{ interpolatedValue }}"></div>';
            var linkingFn = $compile(html);
            element = linkingFn(scope);
            $rootScope.$digest();
        }));

        it('should return a message with an interpolated value', function(){
            expect(element.text()).toBe('the interpolated value is: interpolated');
        });

        it('should change message when interpolated value changes', function(){
            scope.interpolatedValue = 'changed';
            $rootScope.$digest();
            expect(element.text()).toBe('the interpolated value is: changed');
        })
    });

    describe('itvTooltipfade', function(){
        beforeEach(function(){
            scope = $rootScope.$new();
            scope.tt_isOpen = true;
            var html ='<button type="button" itv-tooltipfade></button>';
            var linkingFn = $compile(html);
            element = linkingFn(scope);
            $rootScope.$digest();
        });

        it('should change scope property value to false on mouseover', inject(function($timeout){
            expect(scope.tt_isOpen).toBe(true);
            var event = new CustomEvent('mouseover');
            element[0].dispatchEvent(event);
            $timeout.flush();
            expect(scope.tt_isOpen).toBe(false);
        }))
    });
});