define(["jquery.min", "d3", "brcatlas.umd.min", "atlas-common-map"],

  function (jq, d3, brcatlas, common) {

    let mapZoom, c

    $(window).resize(function() {
      resizeZoomMap()
    })

    function createZoomMap(selectorTab, selectorControl, config) {

      // Set config
      c = config

      // Initialise map
      mapZoom = brcatlas.leafletMap({
        selector: selectorTab,
        height: 500,
        mapTypesSel: {standard: common.genStandardMap, density: common.genDensityMap, timeslice: common.genTimeSliceMap},
        mapTypesKey: 'standard'
      })

      // Boundaries
      if (c.get('zoom.boundaries')) {
        if (c.zoom.boundaries === 'countries') {
          mapZoom.setShowCountries(true) 
        } else if (c.zoom.boundaries === 'vcs') {
          mapZoom.setShowVcs(true) 
        }
      }

      resizeZoomMap() // Required here in case slipply map is first tab

      // Map controls
      createZoomControls(selectorControl)
    }

    
    function createZoomControls(selectorControl) {
      $(selectorControl).html('')

      // Map type selection 
      common.createMapTypeControl(selectorControl, 'zoom', refreshZoomMap)

      // Resolution selection
      if (c.get('common.resolution')) {
        resolutions = c.get('common.resolution').replace(/\s+/g, ' ').split(' ').filter(r => ['hectad', 'quadrant', 'tetrad', 'monad'].includes(r))
        if (resolutions.length > 1) {
          common.createResolutionControl(selectorControl, 'zoom', refreshZoomMap)
        }
      }

      // Dot shape selection
      if (c.get('common.dot-shape') === 'control') {
        common.createDotShapeControl(selectorControl, 'zoom', refreshZoomMap)
      }
    }

    function refreshZoomMap() {
      const dotSize = common.getDotSize()
      const taxonId = localStorage.getItem('taxonId')
      const mapType = localStorage.getItem('map-type')
      mapZoom.setMapType(mapType)
      mapZoom.setIdentfier(`../user/data/${dotSize}/${taxonId}.csv`)
      mapZoom.redrawMap()
    }

    function resizeZoomMap() {
      if (mapZoom) {
        const height = c.get('zoom.height') ? c.zoom.height : 500
        mapZoom.setSize($("#brc-tab-zoom").width(), height)
        mapZoom.invalidateSize()
      }
    }

    return {
      createZoomMap: createZoomMap,
      refreshZoomMap: refreshZoomMap,
      resizeZoomMap: resizeZoomMap
    }
  }
)
