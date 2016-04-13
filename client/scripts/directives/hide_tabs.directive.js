angular
    .module('SmartiDog')
    .directive('hideTabs', hideTabs);

function hideTabs($rootScope){
    return {
        restrict: 'A',
        link: link
    }

    ////////

    function link(scope, element, attrs){
        $rootScope.hideTabs = 'tabs-item-hide';
        scope.$on('$destroy', function(){
            $rootScope.hideTabs = '';
        })
    }
}