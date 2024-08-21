define(["jquery.min", "d3", "brcatlas.umd.min", "atlas-common-map"],

  function (jq, d3, brcatlas, common) {

    let mapStatic, config
 
    function createOverviewMap(selectorTab, selectorControl, c) {

      // Set module-level config
      config = c

      // Initialise map
      const height = config.overview && config.overview.height ? config.overview.height : 500
      // Get value for map width given original height set in config
      // Need to do this with an instance of static map with expand set to false
      // Later used to set the max width of actual map.
      const $divTemp = $('<div id="brc-atlas-local-temp">').appendTo($('body'))
      const mapTemp = brcatlas.svgMap({
        selector: '#brc-atlas-local-temp',
        height: height,
        expand: false,
        transOptsKey: 'BI4',
        mapTypesControl: false,
        transOptsControl: false,
      })
      const maxWidth = mapTemp.getMapWidth()
      $divTemp.remove()

      // Now the real map
      const mapStaticOpts = {
        selector: selectorTab,
        seaFill: 'white',
        expand: true,
        height: height,
        transOptsKey: 'BI4',
        mapTypesControl: false,
        transOptsControl: false,
        mapTypesSel: {standard: genMap},
        mapTypesKey: 'standard'
      }

      // If a VC is specified, set up the transOptsSel
      if (config.overview && config.overview.vc) {

        const match = config.overview.vc.match(/(gb|ir)(\d+)/)
        if (match) {
          // Set correct projection for VC (British or Irish)
          mapStaticOpts.proj = match[1]

          // Open the lowest resolution geojson file in order
          // to get the minimum bounding box.
          const gjsonFile = `./data/vc-${match[1]}-simp-100/vc-${match[1]}-${match[1] === 'ir' ? 'H' : ''}${match[2]}.geojson`
          let gjson
          $.ajax({
            url: gjsonFile,
            cache: false,
            async:  false,
            success: function (data) {
              gjson = data
            }
          })
          const props = gjson.features[0].properties
          const xminBuffer = config.overview['vc-buffer-west'] ? Number(config.overview['vc-buffer-west']) : 0
          const xmaxBuffer = config.overview['vc-buffer-east'] ? Number(config.overview['vc-buffer-east']) : 0
          const yminBuffer = config.overview['vc-buffer-south'] ? Number(config.overview['vc-buffer-south']) : 0
          const ymaxBuffer = config.overview['vc-buffer-north'] ? Number(config.overview['vc-buffer-north']) : 0

          // Set the transOptsSel
          mapStaticOpts.transOptsSel = {
            vc: {
              id: 'vc',
              bounds: {
                xmin: props.xmin - xminBuffer,
                ymin: props.ymin - yminBuffer,
                xmax: props.xmax + xmaxBuffer,
                ymax: props.ymax + ymaxBuffer
              }
            }
          }
          mapStaticOpts.transOptsKey = 'vc'
          mapStaticOpts.boundaryGjson = gjsonFile

          // Remove default UK grid
          if (config.overview['hectad-grid'] && config.overview['hectad-grid'] === true) {
            mapStaticOpts.gridGjson = `./data/vc-${match[1]}-hectad-grids/vc-${match[1]}-${match[1] === 'ir' ? 'H' : ''}${match[2]}-hectads.geojson`
          } else {
            mapStaticOpts.gridGjson = ''
          }
        }
      }

      mapStatic = brcatlas.svgMap(mapStaticOpts)

      $(selectorTab).css('max-width', `${maxWidth}px`)

      // Map controls
      createOverviewControls(selectorControl)
    }

    function createOverviewControls(selectorControl) {
      $(selectorControl).html('')

      if (config.common['dot-shape'] === 'common') {
        common.createDotShapeControl(selectorControl, 'overview', refreshOverviewMap)
      }
    }

    function refreshOverviewMap() {
      const dotSize = config.common && config.common['default-res'] ? config.common['default-res'] : 'hectad'
      const taxonId = localStorage.getItem('taxonId')
      mapStatic.setIdentfier(`../user/data/${dotSize}/${taxonId}.csv`)
      mapStatic.redrawMap()
    }

    async function genMap(file) {

      const dotSize = config.common && config.common['default-res'] ? config.common['default-res'] : 'hectad'
      const data = await d3.csv(file)
      const dataMap = data.map(d => {
        return {gr: d.gr, colour: 'black'}
      })

      let precision 
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
      createOverviewMap: createOverviewMap,
      refreshOverviewMap: refreshOverviewMap
    }
  }
)
