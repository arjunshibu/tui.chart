/**
 * @fileoverview AreaTypeCustomEvent is event handle layer for line type chart.
 * @author NHN Ent.
 *         FE Development Team <dl_javascript@nhnent.com>
 */

'use strict';

var CustomEventBase = require('./customEventBase'),
    AreaTypeDataModel = require('./areaTypeDataModel'),
    chartConst = require('../const');

var AreaTypeCustomEvent = tui.util.defineClass(CustomEventBase, /** @lends AreaTypeCustomEvent.prototype */ {
    /**
     * AreaTypeCustomEvent is custom event for line type chart.
     * @param {object} params parameters
     * @constructs AreaTypeCustomEvent
     * @extends CustomEventBase
     */
    init: function(params) {
        CustomEventBase.call(this, params);

        /**
         * previous found data
         * @type {null | object}
         */
        this.prevFoundData = null;
    },

    /**
     * Initialize data of custom event
     * @param {Array.<object>} seriesInfos series infos
     * @override
     */
    initCustomEventData: function(seriesInfos) {
        var seriesInfo = seriesInfos[0];
        this.dataModel = new AreaTypeDataModel(seriesInfo);
        CustomEventBase.prototype.initCustomEventData.call(this, seriesInfos);
    },

    /**
     * On mousemove.
     * @param {MouseEvent} e - mouse event
     * @private
     * @override
     */
    _onMousemove: function(e) {
        var target = e.target || e.srcElement,
            bound = target.getBoundingClientRect(),
            layerX = e.clientX - chartConst.SERIES_EXPAND_SIZE - bound.left,
            layerY = e.clientY - bound.top,
            groupIndex = this.tickBaseCoordinateModel.findIndex(layerX),
            foundData = this.dataModel.findData(groupIndex, layerY);

        if (!this._isChangedSelectData(this.prevFoundData, foundData)) {
            return;
        }

        if (foundData) {
            this.fire('showTooltip', foundData);
        } else if (this.prevFoundData) {
            this.fire('hideTooltip', this.prevFoundData);
        }
        this.prevFoundData = foundData;
    },

    /**
     * On mouseout.
     * @private
     * @override
     */
    _onMouseout: function() {
        if (this.prevFoundData) {
            this.fire('hideTooltip', this.prevFoundData);
            this.prevFoundData = null;
        }
    }
});

module.exports = AreaTypeCustomEvent;