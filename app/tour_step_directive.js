/* global angular: false */

(function angularBootstrapTour(app) {
    'use strict';

    function directive() {
        return ['TourHelpers', 'TourConfig', function (TourHelpers, TourConfig) {

            return {
                restrict: 'EA',
                scope: true,
                require: '^tour',
                link: function (scope, element, attrs, ctrl) {

                    //Assign required options
                    var step = {
                            element: element
                        },
                        events = 'onShow onShown onHide onHidden onNext onPrev onPause onResume'.split(' '),
                        options = 'content title path animation container placement backdrop redirect orphan reflex'.split(' ');

                    //Pass interpolated values through
                    TourHelpers.attachInterpolatedValues(attrs, step, options);
                    attrs.$observe(TourHelpers.getAttrName('order'), function (order) {
                        step.order = !isNaN(order*1) ? order*1 : 0;
                        ctrl.refreshTour();
                    });

                    //Attach event handlers
                    TourHelpers.attachEventHandlers(scope, attrs, step, events);

                    //Compile templates
                    TourHelpers.attachTemplate(scope, attrs, step);

                    //Check whether or not the step should be skipped
                    function stepIsSkipped() {
                        var skipped;
                        if (attrs[TourHelpers.getAttrName('skip')]) {
                            skipped = scope.$eval(attrs[TourHelpers.getAttrName('skip')]);
                        }
                        if (!skipped) {
                            skipped = !!step.path || element.is(':hidden');
                        }
                        return skipped;
                    }
                    scope.$watch(stepIsSkipped, function (skip) {
                        if (skip) {
                            ctrl.removeStep(step);
                        } else {
                            ctrl.addStep(step);
                        }
                    });

                    //If there is an options argument passed, just use that instead
                    if (attrs[TourHelpers.getAttrName('options')]) {
                        angular.extend(step, scope.$eval(attrs[TourHelpers.getAttrName('options')]));
                    }

                    //set up redirects
                    if (attrs[TourHelpers.getAttrName('path')]) {
                        step.path = document.location.pathname + '#' + scope.$eval(TourHelpers.getAttrName('path'));
                    }
                    if (attrs[TourHelpers.getAttrName('abspath')]) {
                        step.path = scope.$eval(TourHelpers.getAttrName('abspath'));
                    }

                    //Add step to tour
                    ctrl.addStep(step);

                }
            };

        }];
    }

    app.directive('tourStep', directive());
    app.directive('bsTourStep', directive());

}(angular.module('bm.bsTour')));
