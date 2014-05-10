/**
 * Created by itorrev on 4/04/14.
 */
var markdownModule = angular.module('itvMarkdownModule', []);

markdownModule.directive('itvMarkdown', function(){
    var converter = new Showdown.converter();
    return {
        restrict: 'E',
        replace: true,
        link: function(scope, element, attrs){
            var convertedText = converter.makeHtml(element.text());
            element.html(convertedText);
        }
    }
});

