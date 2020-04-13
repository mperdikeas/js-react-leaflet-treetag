var circleMarkerToGeoJSON = L.CircleMarker.prototype.toGeoJSON;
L.CircleMarker.include({
    toGeoJSON: function() {
        var feature = circleMarkerToGeoJSON.call(this);
        console.log( `this keys are: ${Object.keys(this)}`);
        console.log( `options are: ${Object.keys(this.options)}`);
        feature.properties = {
            targetId: this.options.targetId
        };
        return feature;
    }
});
