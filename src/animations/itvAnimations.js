/**
 * Created by Aleksandr on 5/04/14.
 */
var itvAnimationsModule = angular.module('itvAnimationsModule', []);

itvAnimationsModule.animation('.itvSlideTable', function(){
    return {
        beforeAddClass: function(element, className){
            if(className == 'ng-hide'){
                TweenMax.to(element, 1, {opacity: 0, display: 'none'});
            }
        },
        removeClass: function(element, className){
            if(className == 'ng-hide'){
                TweenMax.to(element, 1, {opacity: 1, display: 'table'});
            }
        }
    }
});

itvAnimationsModule.animation('.itvSlide', function(){
    return {
        beforeAddClass: function(element, className){
            if(className == 'ng-hide'){
                TweenMax.to(element, 1, {opacity: 0, display: 'none'});
            }
        },
        removeClass: function(element, className){
            if(className == 'ng-hide'){
                TweenMax.to(element, 1, {opacity: 1, display: 'block'});
            }
        }
    }
});