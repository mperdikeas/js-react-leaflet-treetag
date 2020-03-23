const assert = require('chai').assert;

export function numOfLayersInLayerGroup(layerGroup) {
    return layerGroup.getLayers().length;
}

export function theOneAndOnlyLayerInLayerGroup(layerGroup) {
    const n = numOfLayersInLayerGroup(layerGroup);
    assert.isStrictEqual(n, 1);
    return layerGroup.getLayers()[0];
}
