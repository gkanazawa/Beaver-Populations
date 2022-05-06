require([
    "esri/config", 
    "esri/Map",
    "esri/core/watchUtils",
    "esri/views/MapView", 
    "esri/widgets/BasemapGallery",
    "esri/layers/FeatureLayer",
    "esri/layers/TileLayer",
    "esri/renderers/ClassBreaksRenderer",
    "esri/widgets/LayerList",
    "esri/widgets/Legend",
    "esri/widgets/Expand",
    "esri/widgets/Swipe",
    "esri/renderers/UniqueValueRenderer"
    
], (
esriConfig,
Map,
// watchUtils,
{ whenFalseOnce },
MapView,
BasemapGallery,
FeatureLayer,
TileLayer,
ClassBreaksRenderer,
LayerList,
Legend,
Expand,
Swipe,
UniqueValueRenderer

) => {
esriConfig.apiKey = 
    "AAPKddc748adf6734aa483ba45211af9dee7DbX5uLVPrH1C-MKtNc-38ItCGkT1gMd8eh2Idg2v3jhR85jRImm2CX_bTGfMZfDu";

const defaultSym = {
    type: "simple-fill",
    outline: {
        color: [128, 128, 128, 0.2],
        width: "0px"
    }
};

function createSymbol(color){
    return {
    type: "simple-fill",
    color,
    style: "solid",
    outline: {
        width: 0.8,
        color: [0, 0, 0, 0.7]
    }
    };
}

const mapOne = new Map({
    basemap: "arcgis-streets-night"
});

const viewOne = new MapView({
    map: mapOne,
    container: "firstMap",
    zoom: 7,
    center: [-91.174, 47.316]
});

const histWet = new TileLayer ({
    url: "https://tiles.arcgis.com/tiles/HRPe58bUyBqyyiCt/arcgis/rest/services/_Historic_Wetlands/MapServer"
});
mapOne.add(histWet);

const currWet = new TileLayer ({
    url: "https://tiles.arcgis.com/tiles/HRPe58bUyBqyyiCt/arcgis/rest/services/_Current_Wetlands/MapServer"
});
mapOne.add(currWet);

const wetlandList = new LayerList({
    view: viewOne
});
const wlExpand = new Expand({
    view: viewOne,
    content: wetlandList,
    expanded: false
});
viewOne.ui.add(wlExpand, "top-right");

const swipe = new Swipe({
    view: viewOne,
    leadingLayers: [histWet],
    trailingLayers: [currWet],
    position: 35
});
viewOne.ui.add(swipe);

const expandLegendOne = new Expand({
    view: viewOne,
    content: new Legend({
    view: viewOne,
    container: document.createElement("div")
    }),
    expanded: false
});

viewOne.ui.add(expandLegendOne, "bottom-right");

const map = new Map({
    basemap: "arcgis-imagery"
});

const view = new MapView({
    map: map,
    container: "viewDiv",
    zoom: 8,
    center: [-91.174, 47.216]
});

const expandLegend = new Expand({
    view: view,
    content: new Legend({
    view: view,
    container: document.createElement("div")
    })
});

view.ui.add(expandLegend, "top-left");

const basemapExpand = new Expand({
    view: view,
    content: new BasemapGallery({
        view: view
    }),
    // container: document.createElement("div")
});
view.ui.add(basemapExpand, "top-left");

const boundaryRenderer = {
    type: "simple",
    symbol: {
        type: "simple-line",
        color: "black",
        width: 2
    }
}

const basinRenderer = new ClassBreaksRenderer({
    field: "Beaver_Potential",
    legendOptions: { title: "Potential Beaver Population" },
    defaultSymbol: {
        type: "simple-fill",
        color: "black",
        style: "backward-diagonal",
        outline: {
            width: 0.5,
            color: [50, 50, 50, 0.6]
        }
    },
    defaultLabel: "no data",
    classBreakInfos: [
        {
            minValue: 1,
            maxValue: 88,
            symbol: createSymbol("#FFFFCC"),
            label: "1 - 88"
        },
        {
            minValue: 89,
            maxValue: 153,
            symbol: createSymbol("#A1DAB4"),
            label: "89 - 153"
        },
        {
            minValue: 154,
            maxValue: 233,
            symbol: createSymbol("#41B6C4"),
            label: "154 - 233"
        },
        {
            minValue: 234,
            maxValue: 329,
            symbol: createSymbol("#2C7FB8"),
            label: "234 - 329"
        },
        {
            minValue: 330,
            maxValue: 591,
            symbol: createSymbol("#253494"),
            label: "330 - 591"
        }
    ]
});

const popupImpMN = {
    title: "<b>{NAME}</b>",
    content: "Description: {CAT_DESC}<br>Pollutant: {IMP_PARAM}"
}

const popupImpWI = {
    title: "<b>{WATERBODY_}</b>",
    content: "Description: {ALL_IMPAIR}<br>Pollutant: {IMPAIRED_1}"
}

const popupStreams = {
    title: "<b>{gnis_name}</b>",
    content: [{
        type: "fields",
        fieldInfos: [
            {
                fieldName: "lengthkm",
                label: "Segment length in km",
                format: {
                    digitSeparator: true,
                    places: 2
                }
            }]
    }]
};

const popupBasins = {
    title: "<b>{name}</b>",
    content: [{
        type: "fields",
        fieldInfos: [
            {
                fieldName: "Wetland_Acres",
                label: "Wetland Acres",
                format: {
                    digitSeparator: true,
                    places: 2
                }
            },
            {
                fieldName: "Percent_Wetlands",
                label: "Percent Wetlands",
                format: {
                    digitSeparator: true,
                    places: 2
                }
            },
            {
                fieldName: "Percent_Forest",
                label: "Percent Forest",
                format: {
                    digitSeparator: true,
                    places: 2
                }
            },
            {
                fieldName: "Percent_Dev_Ag",
                label: "Percent Developed or Agricultural",
                format: {
                    digitSeparator: true,
                    places: 2
                }
            },
            {
                fieldName: "Percent_Suitable_Veg",
                label: "Percent Beaver-Suitable or Preferred Vegetation",
                format: {
                    digitSeparator: true,
                    places: 2
                }
            },
            {
                fieldName: "Total_River_Miles",
                label: "Total River Miles",
                format: {
                    digitSeparator: true,
                    places: 2
                }
            },
            {
                fieldName: "Beaver_Potential",
                label: "Potential Beaver Population",
                format: {
                    digitSeparator: true,
                    places: 2
                }
            }
            
        ]
    }]   
};

const twi = new TileLayer({
    url: "https://tiles.arcgis.com/tiles/HRPe58bUyBqyyiCt/arcgis/rest/services/TWI/MapServer",
    opacity: 0.7,
    title: "Topographic Wetness Index",
    visible: false
});

const boundary = new FeatureLayer({
    url: "https://services.arcgis.com/HRPe58bUyBqyyiCt/arcgis/rest/services/Western_Lake_Superior_Watershed/FeatureServer",
    renderer: boundaryRenderer
});

const basins = new FeatureLayer({
    url: "https://services.arcgis.com/HRPe58bUyBqyyiCt/arcgis/rest/services/Catchments/FeatureServer",
    renderer: basinRenderer,
    popupTemplate: popupBasins,
    opacity: 0.7,
    title: "Catchment Basins"
});

const impairedMN = new FeatureLayer({
    url: "https://services.arcgis.com/HRPe58bUyBqyyiCt/arcgis/rest/services/Impaired_Streams_MN/FeatureServer",
    renderer: {
        type: "simple",
        symbol: {
            type: "simple-line",
            color: "#630606",
            width: 1
        }
    },
    title: "Impaired Streams in MN",
    popupTemplate: popupImpMN,
    visible: false
});

const impairedWI = new FeatureLayer({
    url: "https://services.arcgis.com/HRPe58bUyBqyyiCt/arcgis/rest/services/Impaired_Streams_WI/FeatureServer",
    renderer: {
        type: "simple",
        symbol: {
            type: "simple-line",
            color: "#FF1818",
            width: 1
        }
    },
    title: "Impaired Streams in WI",
    popupTemplate: popupImpWI,
    visible: false
});

const streams = new FeatureLayer ({
    url: "https://services.arcgis.com/HRPe58bUyBqyyiCt/arcgis/rest/services/Streams/FeatureServer",
    renderer: {
        type: "simple",
        symbol: {
            type: "simple-line",
            color: "#085E7D",
            width: 1
        }
    },
    title: "All Streams and Rivers",
    popupTemplate: popupStreams,
    visible: false
});

const govt = new FeatureLayer({
    url: "https://services.arcgis.com/HRPe58bUyBqyyiCt/arcgis/rest/services/Public_land/FeatureServer",
    renderer: {
        type: "simple",
        symbol: {
            type: "simple-fill",
            color: "#066163",
            style: "diagonal-cross",
            outline: {width: 0}
        }
    },
    title: "Public Lands"
});

const tribal = new FeatureLayer({
    url: "https://services.arcgis.com/HRPe58bUyBqyyiCt/arcgis/rest/services/Tribal_lands/FeatureServer",
    renderer: {
        type: "simple",
        symbol: {
            type: "simple-fill",
            color: "#E8630A",
            style: "backward-diagonal",
            outline: {width: 0.5, color: "#E8630A"}
        }
    },
    title: "Tribal Lands"
});

map.addMany([boundary, basins, streams, impairedMN, impairedWI, twi, tribal, govt]);

const layerExpand = new Expand({
    view: view,
    content: new LayerList({
        view: view
    })
});
view.ui.add(layerExpand, "top-left");

const riverBtn = document.getElementById("riverFilter");
view.ui.add(riverBtn, "top-right");

const btn = document.getElementById("wetlandFilter");
view.ui.add(btn, "top-right");

const forestBtn = document.getElementById("forestFilter");
view.ui.add(forestBtn, "top-right");

const suitableBtn = document.getElementById("suitableFilter");
view.ui.add(suitableBtn, "top-right");

const clearBtn = document.getElementById("clearBtn");
view.ui.add(clearBtn, "top-right");

// const includedEffect = "drop-shadow(0, 0px, 12px)";
const excludedEffect = "grayscale(100%) opacity(30%)";

riverBtn.addEventListener("click", async () => {
    const query = basins.createQuery();
    query.where = "Total_River_Miles > '50'";
    const lview = await view.whenLayerView(basins);
    await whenFalseOnce(lview, "updating");

    lview.featureEffect = {
        filter: {
            where: query.where
        },
        excludedEffect: excludedEffect
    };
    clearBtn.addEventListener("click", () => {
        lview.featureEffect = null;
    });
});

forestBtn.addEventListener("click", async () => {
    const query = basins.createQuery();
    query.where = "Percent_Forest > '70'";
    const lview = await view.whenLayerView(basins);
    await whenFalseOnce(lview, "updating");

    lview.featureEffect = {
        filter: {
            where: query.where
        },
        excludedEffect: excludedEffect
    };
    clearBtn.addEventListener("click", () => {
        lview.featureEffect = null;
    });
});

suitableBtn.addEventListener("click", async () => {
    const query = basins.createQuery();
    query.where = "Percent_Suitable_Veg > '60'";
    const lview = await view.whenLayerView(basins);
    await whenFalseOnce(lview, "updating");

    lview.featureEffect = {
        filter: {
            where: query.where
        },
        excludedEffect: excludedEffect
    };
    clearBtn.addEventListener("click", () => {
        lview.featureEffect = null;
    });
});

btn.addEventListener("click", async () => {
    const query = basins.createQuery();
    query.where = "Percent_Wetlands > '50'";
    const lview = await view.whenLayerView(basins);
    await whenFalseOnce(lview, "updating");

    lview.featureEffect = {
        filter: {
            where: query.where
        },
        // includedEffect: includedEffect,
        excludedEffect: excludedEffect
    };
    clearBtn.addEventListener("click", () => {
        lview.featureEffect = null;
    });
});

});
