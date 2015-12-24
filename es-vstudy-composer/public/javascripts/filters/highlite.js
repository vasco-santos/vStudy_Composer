
app.filter('highlight', function($sce) {
    return function(input, lang) {

        if (input) return hljs.highlightAuto(input).value;
        return input;
    }
}).filter('unsafe', function($sce) { return $sce.trustAsHtml; })