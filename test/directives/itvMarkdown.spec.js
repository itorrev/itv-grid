/**
 * Created by itorrev on 4/04/14.
 */
ddescribe('itvMarkdown', function(){
    beforeEach(module('itvMarkdownModule'));

    var parent, scope, $rootScope, $compile, element;
    beforeEach(inject(function(_$compile_, _$rootScope_){
        $rootScope = _$rootScope_;
        $compile = _$compile_;
    }));

    describe('itvMarkdown directive', function(){

        it('should create html title from markdown', function(){
            scope = $rootScope.$new();
            var html ='<itv-markdown>#Titulo h1</itv-markdown>';
            var linkingFn = $compile(html);
            element = linkingFn(scope);
            $rootScope.$digest();
            expect(element.find('h1').length).toBe(1);
        });

        it('should create a list item from markdown', function(){
            scope = $rootScope.$new();
            var html ='<itv-markdown>- listItem\n- listItem\n- listItem</itv-markdown>';
            var linkingFn = $compile(html);
            element = linkingFn(scope);
            $rootScope.$digest();
            expect(element.find('li').length).toBe(3);
        })
    })
});