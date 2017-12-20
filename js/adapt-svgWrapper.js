define([
    'core/js/adapt',
    './svgWrapperView',
    './svgWrapperModel'
], function(Adapt, SvgWrapperView, SvgWrapperModel) {

    Adapt.register('svgWrapper', {
        view: SvgWrapperView, 
        model: SvgWrapperModel
    });

    return Text;
});
