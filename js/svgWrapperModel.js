define([
    'core/js/adapt',
    'core/js/models/componentModel'
], function(Adapt, ComponentModel) {
    'use strict';
    
    var SvgWrapperModel = ComponentModel.extend({

        defaults: function() {
            return _.extend({
                '_index': 0,
                '_isAnimating': false,
                '_items': []
            }, ComponentModel.prototype.defaults);
        },

        calculateRatioByOrientation: function(orientation) {
            var string = '_'+orientation;
            if (!this.has(string)) return false;

            var item = this.get(string);
			var ratio = 100 * item._height / item._width;
			this.set('_ratio', ratio);

            return ratio;
        },

        getByOrientation: function(orientation) {
            var string = '_'+orientation;
            if (!this.has(string)) return false;

            var item = this.get(string);
            if (!item._src) return false;

            return item;
        },

        getByIndex: function(index) {
            return _.filter(this.get('_items'), function(item) {
                return item._index === index;
            });
        },
        
        getCompletedItemsByIndex: function(index) {
            var items = this.getByIndex(index);
            return _.filter(items, function(item) {
                return item._isComplete === true;
            });
        },

        setupItems: function(orientation) {
            var config = this.getByOrientation(orientation);
            var initial = config._initial;
            var states = config._states;
            var items = [];
            var maxIndex = -1;

            for (var i = 0; i < states.length; i++) {
                states[i]._isComplete = false;
                items.push(states[i]);
                if (states[i]._index > maxIndex) {
                    maxIndex = states[i]._index;
                }
            }

            this.set('_items', items);
            this.set('_initial', initial);
            this.set('_maxIndex', maxIndex);
        },

        getItemsByIndex: function(index) {
            return this.get('_byIndex')[index];
        },

        getNextItems: function() {
            var index = this.get('_index');
            return  this.getItemsByIndex(index);
        },

        increment: function() {
            var index = this.get('_index');
            this.set('_index', index+=1);
        }

    });

    return SvgWrapperModel;

});