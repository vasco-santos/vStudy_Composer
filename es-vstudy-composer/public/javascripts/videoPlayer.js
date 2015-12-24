/**
 Aveiro University
 MIECT - Services Engineering

 @authors: Vasco Santos (64191)
          João Rodrigues ()

 Service Composition for vStudy Application
 */

/**
 * Directive to use for video player, adding a method necessary to link the stream.
 */

app.directive('videoPlayer', function ($sce) {
        return {
            template: '<div style="width:100%;"><video style="width:100%;" ng-src="{{trustSrc()}}" autoplay></video></div>',
            restrict: 'E',
            replace: true,
            scope: {
                vidSrc: '@'
            },
            link: function (scope) {
                console.log('Initializing video-player');
                scope.trustSrc = function () {
                    if (!scope.vidSrc) {
                        return undefined;
                    }
                    return $sce.trustAsResourceUrl(scope.vidSrc);
                };
            }
        };
    });