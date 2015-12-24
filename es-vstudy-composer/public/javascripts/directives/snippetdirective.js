

app.directive('snippet', ['$timeout', '$interpolate', function ($timeout, $interpolate) {
    "use strict";
    return {
        restrict: 'E',
        template: '<pre><code ng-transclude class="code_render"></code></pre>',
        replace: true,
        transclude: true,
        link: function (scope, elm) {
            var tmp = $interpolate(elm.find('code').text())(scope);
            elm.find('code').html(hljs.highlightAuto(tmp).value);
        }
    };
}]);