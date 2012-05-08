/**
 * Copyright (c) 2008-2012 The Open Source Geospatial Foundation
 *
 * Published under the BSD license.
 * See http://svn.geoext.org/core/trunk/geoext/license.txt for the full text
 * of the license.
 */

/** api: example[feature-grid]
 *  Grid with Features
 *  ------------------
 *  Synchronize selection of features between a grid and a layer.
 */

var mapPanel, store, gridPanel, mainPanel;

Ext.require([
    'GeoExt.data.FeatureStore',
    'Ext.grid.GridPanel',
    'Ext.layout.container.Border'
]);

Ext.application({
    name: 'Feature Grid - GeoExt2',
    launch: function() {
        // create map instance
        var map = new OpenLayers.Map();
        var wmsLayer = new OpenLayers.Layer.WMS(
            "vmap0",
            "http://vmap0.tiles.osgeo.org/wms/vmap0",
            {layers: 'basic'}
        );

        // create vector layer
        var context = {
            getColor: function(feature) {
                if (feature.attributes.elevation < 2000) {
                    return 'green';
                }
                if (feature.attributes.elevation < 2300) {
                    return 'orange';
                }
                return 'red';
            }
        };
        var template = {
            fillOpacity: 0.5,
            fillColor: "${getColor}",
            pointRadius: 5,
            strokeWidth: 1,
            strokeOpacity: 1,
            strokeColor: "${getColor}",
            graphicName: "triangle"
        };
        var style = new OpenLayers.Style(template, {context: context});
        var vecLayer = new OpenLayers.Layer.Vector("vector", {
            styleMap: new OpenLayers.StyleMap({
                'default': style
            }),
            protocol: new OpenLayers.Protocol.HTTP({
                url: "summits.json",
                format: new OpenLayers.Format.GeoJSON()
            }),
            strategies: [new OpenLayers.Strategy.Fixed()]
        });
        map.addLayers([wmsLayer, vecLayer]);

        // create map panel
        mapPanel = Ext.create('GeoExt.panel.Map', {
            title: "Map",
            region: "center",
            height: 400,
            width: 600,
            map: map,
            center: new OpenLayers.LonLat(5, 45),
            zoom: 6
        });

        // create feature store, binding it to the vector layer
        store = Ext.create('GeoExt.data.FeatureStore', {
            layer: vecLayer,
            fields: [
                {name: 'name', type: 'string', mapping: 'attributes.name'},
                {name: 'elevation', type: 'float', mapping: 'attributes.elevation'}
            ],
            autoLoad: true
        });

        function getSymbolTypeFromFeature(feature) {
            var type;
            switch (feature.geometry.CLASS_NAME) {
                case "OpenLayers.Geometry.MultiLineString":
                case "OpenLayers.Geometry.LineString":
                    type = 'Line';
                    break;
                case "OpenLayers.Geometry.Point":
                    type = 'Point';
                    break;
                case "OpenLayers.Geometry.Polygon":
                    type = 'Polygon';
                    break;
            }
            return type;
        }

        function renderFeature(value, p, r) {
            var id = Ext.id();
            var feature = r.raw;

            Ext.defer(function() {
                var symbolizer = r.store.layer.styleMap.createSymbolizer(feature, 'default');
                var renderer = Ext.create('GeoExt.FeatureRenderer', {
                    renderTo: id,
                    width: 12,
                    height: 12,
                    symbolType: getSymbolTypeFromFeature(feature),
                    symbolizers: [symbolizer]
                });
            }, 25);
            return Ext.String.format('<div id="{0}"></div>', id);
        }

        // create grid panel configured with feature store
        gridPanel = Ext.create('Ext.grid.GridPanel', {
            title: "Feature Grid",
            region: "east",
            store: store,
            width: 320,
            columns: [{
                header: "",
                width: 30,
                renderer: renderFeature,
                dataIndex: 'fid'
            },{
                header: "Name",
                width: 200,
                dataIndex: "name"
            }, {
                header: "Elevation",
                width: 100,
                dataIndex: "elevation"
            }],
//            sm: Ext.create('GeoExt.grid.FeatureSelectionModel')
        });

        // create a panel and add the map panel and grid panel
        // inside it
        mainPanel = Ext.create('Ext.Panel', {
            renderTo: "mainpanel",
            layout: "border",
            height: 400,
            width: 920,
            items: [mapPanel, gridPanel]
        });
    }
});

