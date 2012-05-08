Ext.define('GeoExt.data.FeatureStore', {
    extend: 'Ext.data.Store',
    requires: [

    ],
    statics: {
        LAYER_TO_STORE: 1,
        STORE_TO_LAYER: 2
    },

    proxy: {
        type: 'memory',
        reader: {
            type: 'json'
        }
    },

    // openlayers.layer.vector or layer record
    layer: null,

    /**
     * @cfg {Number} initDir
     *  Bitfields specifying the direction to use for the initial sync between
     *  the layer and the store, if set to 0 then no initial sync is done.
     *  Defaults to ``GeoExt.data.FeatureStore.LAYER_TO_STORE|GeoExt.data.FeatureStore.STORE_TO_LAYER``
     */

    /**
     * @config {Object} Creation parameters
     * @private
     */
    constructor: function(config) {
        config = Ext.apply({}, config);

        var layer = config.layer;
        delete config.layer;

        if (config.features) {
            config.data = config.features;
        }
        delete config.features;

        this.callParent([config]);

        var options = {initDir: config.initDir};
        delete config.initDir;

        if (layer) {
            this.bind(layer, options);
        }
    },

    bind: function(layer, options) {
        if (this.layer) {
            // already bound
            return;
        }
        var initDir = options.initDir;
        if (initDir == undefined) {
            initDir = GeoExt.data.FeatureStore.LAYER_TO_STORE |
                GeoExt.data.FeatureStore.STORE_TO_LAYER;
        }
        this.layer = layer;
        this.layer.events.on({
            'featuresadded': this.onFeaturesAdded,
            'featuresremoved': this.onFeaturesRemoved,
            'featuresmodified': this.onFeaturesModified,
            scope: this
        });
        this.on({
            'load': this.onLoad,
            'clear': this.onClear,
            'add': this.onAdd,
            'remove': this.onRemove,
            'update': this.onUpdate,
            scope: this
        });
        this.data.on({
            'replace': this.onReplace,
            scope: this
        });

        this.fireEvent("bind", this, this.layer);
    },

    unbind: function() {
        if (this.layer) {
            this.layer.events.un({
                'featuresadded': this.onFeaturesAdded,
                'featuresremoved': this.onFeaturesRemoved,
                'featuresmodified': this.onFeaturesModified,
                scope: this
            });
            this.un({
                'load': this.onLoad,
                'clear': this.onClear,
                'add': this.onAdd,
                'remove': this.onRemove,
                'update': this.onUpdate,
                scope: this
            });
            this.data.un({
                'replace': this.onReplace,
                scope: this
            });
            this.layer = null;
        }
    },

    onFeaturesAdded: function(evt) {

    },

    onFeaturesRemoved: function(evt) {

    },

    onFeaturesModified: function(evt) {

    },

    onLoad: function(store, records, successful) {

    },

    onClear: function(store) {

    },

    onAdd: function(store, records, index) {

    },

    onRemove: function(store, record, index) {

    },

    onUpdate: function(store, record, operation) {

    },

    onReplace: function() {

    }
});
