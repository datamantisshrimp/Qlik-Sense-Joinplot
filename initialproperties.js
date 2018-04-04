define([], function () {
    'use strict';
    return {
        qHyperCubeDef: {
            qDimensions: [],
            qMeasures: [{
                qDef: {
                    qFallbackTitle: "Count instances",
                    qDef: "=Count(1)"
                }
            }],
            qInitialDataFetch: [{
                qWidth: 4,
                qHeight: 2500
            }]
        }
    };
});