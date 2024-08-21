define(["jquery.min", "d3", "brcatlas.umd.min", "atlas-common-map"],

  function (jq, d3, brcatlas, common) {

    let mapZoom, config

    $(window).resize(function() {
      resizeZoomMap()
    })

    function createZoomMap(selectorTab, selectorControl, c) {

      // Set config
      config = c

      // Initialise map
      mapZoom = brcatlas.leafletMap({
        selector: selectorTab,
        height: 500,
        mapTypesSel: {standard: genMap},
        mapTypesKey: 'standard'
      })

      resizeZoomMap() // Required here in case slipply map is first tab

      // Map controls
      createZoomControls(selectorControl)
    }

    function createZoomControls(selectorControl) {
      $(selectorControl).html('')

      if (config.common['dot-shape'] === 'common') {
        common.createDotShapeControl(selectorControl, 'zoom', refreshZoomMap)
      }
    }

    function refreshZoomMap() {
      const dotSize = config.common && config.common['default-res'] ? config.common['default-res'] : 'hectad'
      const taxonId = localStorage.getItem('taxonId')
      mapZoom.setIdentfier(`../user/data/${dotSize}/${taxonId}.csv`)
      mapZoom.redrawMap()
    }

    function resizeZoomMap() {
      if (mapZoom) {
        const height = config.zoom && config.zoom.height ? config.zoom.height : 500
        mapZoom.setSize($("#brc-tab-zoom").width(), height)
        mapZoom.invalidateSize()
      }
    }

    async function genMap(file) {

      const data = await d3.csv(file)
    
      const dataMap = data.map(d => {
        return {gr: d.gr, colour: 'black'}
      })

      let precision 
      const dotSize = config.common && config.common['default-res'] ? config.common['default-res'] : 'hectad'
      switch(dotSize) {
        case 'hectad':
          precision = 10000
          break
        case 'quadrant':
          precision = 5000
          break
        case 'tetrad':
          precision = 2000
          break
        case 'monad':
          precision = 1000
      }
    
      return new Promise((resolve) => {
        resolve({
          records: dataMap,
          precision: precision,
          shape: localStorage.getItem('dot-shape'),
          opacity: 1,
          size: 1
        })
      })
    }

    return {
      createZoomMap: createZoomMap,
      refreshZoomMap: refreshZoomMap,
      resizeZoomMap: resizeZoomMap
    }
  }
)
