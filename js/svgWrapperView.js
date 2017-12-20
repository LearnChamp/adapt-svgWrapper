define([
    'core/js/adapt',
    'core/js/views/componentView',
    'velocity',
    'libraries/snap.svg-min'
], function(Adapt, ComponentView, Velocity, Snap) {
    'use strict';
    
    var SvgWrapper = ComponentView.extend({

        events: {
            "click .next-button": "onClick"
        },

        preRender: function() {
            this.checkIfResetOnRevisit();
            this.svgDoc = null;
            this._orientation = Adapt.device.orientation;
            this.model.set('_index', 0);
            var buttonText = this.model.get('button');
            if (!buttonText.length) {
                this.$el.addClass('no-button');
            }

            _.bindAll(this, "onObjectLoaded", "onAnimationComplete", "inview");
        },
        
        postRender: function() {
            this.objElm = this.$('iframe')[0];
            this.$nextBtn = this.$('.next-button');
            this.listenTo(Adapt, 'device:resize', this.onDeviceResize);
            this.setupEvents();
            this.setSrc();
            this.updateButtonText(0);
            this.checkOnScreenTrigger();
        },

        checkOnScreenTrigger: function() {
            if (this.model.has('_triggerOnScreen')) {
                var triggerConfig = this.model.get('_triggerOnScreen');
                if (triggerConfig._isEnabled) {
                    this.$('.component-widget').on('onscreen', this.inview);
                }
            }
        },

        inview: function(event, measurement) {
            if (!measurement.onscreen) {
                return;
            }
            var triggerViewVertical = this.model.get('_triggerOnScreen')._percentInviewVertical
            if (measurement.percentInviewVertical >= triggerViewVertical) {
                this.onClick();
                this.$('.component-widget').off('onscreen', this.inview);
            }
        },

        checkIfResetOnRevisit: function() {
            var isResetOnRevisit = this.model.get('_isResetOnRevisit');
            // If reset is enabled set defaults
            if (isResetOnRevisit) {
                this.model.reset(isResetOnRevisit);
            }
        },

        onDeviceResize: function() {
            if (this._orientation === Adapt.device.orientation) {
                return;
            }

            this._orientation = Adapt.device.orientation;
            this.setSrc();
            this.resetAnimation();
        },

        setupEvents: function() {
            this.objElm.addEventListener('load', this.onObjectLoaded);
        },
        
        removeEvents: function() {
            this.objElm.removeEventListener('load', this.onObjectLoaded);
            this.$('.component-widget').off('onscreen', this.inview);
        },

        setSrc: function() {
            var src = "";
            var ratio;

            // landscape is required, if portrait is not defined use landscape 
            if (this.model.getByOrientation('portrait') === false) {
                src = this.model.getByOrientation('landscape')._src;
                ratio = this.model.calculateRatioByOrientation('landscape');
                this.model.setupItems('landscape');
            } else {
                src = this.model.getByOrientation(this._orientation)._src;
                this.model.setupItems(this._orientation);
                ratio = this.model.calculateRatioByOrientation(this._orientation);
            }

            this.$('.spacer').css('paddingTop', ratio+'%');

            this.objElm.setAttribute('src', src);
        },

        resetAnimation: function() {
            this.model.set('_index', 0);
            this.disableButton(false);
            this.updateButtonText(0);
        },

        onObjectLoaded: function(event) {
            this.svgDoc = event.target.getSVGDocument();
            this.snap = Snap(this.svgDoc);
            window._snap = this.snap;
            this.setInitialState();
            this.setReadyStatus();
        },

        setInitialState: function() {
            var items = this.model.get('_initial');
            if (!items) return;

            for (var i = 0; i < items.length; i++) {
                this.applyStyle(items[i]);
            }
        },

        applyStyle: function(item) {
            var elm = this.snap.selectAll(item._selector);
            elm.attr(item._properties);
        },

        onClick: function(event) {
            var index = this.model.get('_index');
            var items = this.model.getByIndex(index);
            this.animateItems(items);
            this.disableButton(true);
        },

        updateButtonText: function (index) {
            var buttonText = this.model.get('button');
            if (buttonText[index]) {
                this.$nextBtn.text(buttonText[index]);
            }
        },

        animateItems:  function(items) {
            for (var i = 0; i < items.length; i++) {
                this.animate(items[i]);
            }
        },

        animate: function(item) {
            var self = this;
            var cb = function(elements) {
                self.onAnimationComplete(elements, item);
            }
            var elm = this.snap.selectAll(item._selector);
            
            if (item._delay) {
                _.delay(function() {
                    elm.animate(item._animation, item._duration, mina[item._easing], cb);
                }, item._delay);    
            } else {
                elm.animate(item._animation, item._duration, mina[item._easing], cb);
            }
        },

        onAnimationComplete:  function(elements, item) {
            var index = this.model.get('_index');
            var maxIndex = this.model.get('_maxIndex');
            item._isComplete = true;
            this.checkIndexComplete();
        },

        checkIndexComplete: function() {
            // all items for index completed?
            var index = this.model.get('_index');
            var items = this.model.getByIndex(index);
            var completed = this.model.getCompletedItemsByIndex(index);

            if (completed.length < items.length) return;

            this.model.increment();
            this.updateButtonText(index+1);
            this.disableButton(false);

            // check if all items are complete 
            var maxIndex = this.model.get('_maxIndex');
            if (index >= maxIndex) {
                this.setCompletionStatus();
                this.disableButton(true);
            }
        },

        disableButton: function(isDisabled) {
            if (isDisabled) {
                this.$nextBtn.prop("disabled", true);
            } else {
                this.$nextBtn.prop("disabled", false);
            }
        },

        remove: function() {
            this.removeEvents();

            ComponentView.prototype.remove.apply(this, arguments);
        }

    },
    {
        template: 'svgWrapper'
    });

    return SvgWrapper;

});