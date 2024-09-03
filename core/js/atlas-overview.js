define(["jquery.min", "d3", "brcatlas.umd.min", "atlas-common-map"],

  function (jq, d3, brcatlas, common) {

    let mapStatic, c
 
    function createOverviewMap(selectorTab, selectorControl, config) {

      // Set module-level config
      c = config
      common.setConfig(c)

      // Initialise map
      const height =  c.get('overview.height') ? c.get('overview.height') : 500
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
        mapTypesSel: {standard: common.genMap},
        mapTypesKey: 'standard'
      }

      // Configure insets
      if (c.get('overview.insets')) {
        if (c.overview.insets === 'none') {
          mapStaticOpts.transOptsKey = 'BI1'
        } else if (c.overview.insets === 'ci') {
          mapStaticOpts.transOptsKey = 'BI2'
        } else if (c.overview.insets === 'ni') {
          mapStaticOpts.transOptsKey = 'BI3'
        } else {
          mapStaticOpts.transOptsKey = 'BI4'
        }
      } else {
        mapStaticOpts.transOptsKey = 'BI4'
      }

      // Configure styles
      if (c.get('overview.land-colour')) {
        mapStaticOpts.boundaryFill = c.get('overview.land-colour')
      }
      if (c.get('overview.sea-colour')) {
        mapStaticOpts.seaFill = c.get('overview.sea-colour')
      }
      if (c.get('overview.boundary-colour')) {
        mapStaticOpts.boundaryColour = c.get('overview.boundary-colour')
      }
      if (c.get('overview.grid-colour')) {
        mapStaticOpts.gridLineColour = c.get('overview.grid-colour')
      }
      if (c.get('overview.inset-colour')) {
        mapStaticOpts.insetColour = c.get('overview.inset-colour')
      }
      if (c.get('overview.boundary-width')) {
        mapStaticOpts.boundaryLineWidth = c.get('overview.boundary-width')
      }
      if (c.get('overview.grid-width')) {
        mapStaticOpts.gridLineWidth = c.get('overview.grid-width')
      }
      
      // If a boundary is specified, set up the transOptsSel
      if (c.get('overview.boundary')) {

        const vc = c.overview.boundary.match(/(gb|ir)(\d+)/)
        const country = c.overview.boundary.match(/(ireland|northern-ireland|scotland|england|wales)/)
        let gjsonFile, grid
        if (vc) {
          // Set correct projection for VC (British or Irish)
          mapStaticOpts.proj = vc[1]
          // Open the geojson file in order to get the minimum bounding box
          gjsonFile = `./data/vc-${vc[1]}-simp-100/vc-${vc[1]}-${vc[1] === 'ir' ? 'H' : ''}${vc[2]}.geojson`
          // Specify the grid file
          grid = `./data/vc-${vc[1]}-hectad-grids/vc-${vc[1]}-${vc[1] === 'ir' ? 'H' : ''}${vc[2]}-hectads.geojson`
        } else if (country) {
          // Set correct projection 
          mapStaticOpts.proj = c.overview.boundary.includes('ireland') ? 'ir' : 'gb'
          // Open the geojson file in order to get the minimum bounding box
          gjsonFile = `./data/countries-simp/country-${c.overview.boundary}-simp.geojson`
          // Specify the grid file
          grid = `./data/countries-grids/country-${c.overview.boundary}-100km.geojson`
        }
          
        if (vc || country) {
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
          const xminBuffer = c.get('overview.buffer-west') ? Number(c.overview['buffer-west']) : 0
          const xmaxBuffer = c.get('overview.buffer-east') ? Number(c.overview['buffer-east']) : 0
          const yminBuffer = c.get('overview.buffer-south') ? Number(c.overview['buffer-south']) : 0
          const ymaxBuffer = c.get('overview.buffer-north') ? Number(c.overview['buffer-north']) : 0

          // Set the transOptsSel
          mapStaticOpts.transOptsSel = {
            boundary: {
              id: 'boundary',
              bounds: {
                xmin: props.xmin - xminBuffer,
                ymin: props.ymin - yminBuffer,
                xmax: props.xmax + xmaxBuffer,
                ymax: props.ymax + ymaxBuffer
              }
            }
          }

          console.log('mapStaticOpts.transOptsSel', mapStaticOpts.transOptsSel)
          mapStaticOpts.transOptsKey = 'boundary'
          mapStaticOpts.boundaryGjson = gjsonFile

          // Set grid
          if (c.get('overview.grid-display') === 'solid' || c.get('overview.grid-display') === 'dashed') {
            mapStaticOpts.gridGjson = grid
          } else {
            mapStaticOpts.gridGjson = ''
          }
        }
      } else {
        // If no boundary is specified, the grid lines are always shown unless
        // admin specifically turns them off in config.
        if (c.get('overview.grid-display') === false) {
          console.log('no grid')
          mapStaticOpts.gridLineStyle = 'none'
        } else {
          console.log('yes grd')
        }
      }

      // Grid style
      if (c.get('overview.grid-display')) {
        mapStaticOpts.gridLineStyle = c.get('overview.grid-display')
      }
      
      mapStatic = brcatlas.svgMap(mapStaticOpts)

      console.log('mapStaticOpts', mapStaticOpts)

      $(selectorTab).css('max-width', `${maxWidth}px`)

      // Map controls
      createOverviewControls(selectorControl)
    }

    function createOverviewControls(selectorControl) {
      $(selectorControl).html('')


      // Resolution selection
      if (c.get('common.resolution')) {
        resolutions = c.get('common.resolution').replace(/\s+/g, ' ').split(' ').filter(r => ['hectad', 'quadrant', 'tetrad', 'monad'].includes(r))
        if (resolutions.length > 1) {
          common.createResolutionControl(selectorControl, 'overview', refreshOverviewMap)
        }
      }
      // Dot shape selection
      if (c.get('common.dot-shape') === 'control') {
        common.createDotShapeControl(selectorControl, 'overview', refreshOverviewMap)
      }
    }

    function refreshOverviewMap() {
      const dotSize = common.getDotSize()
      const taxonId = localStorage.getItem('taxonId')
      mapStatic.setIdentfier(`../user/data/${dotSize}/${taxonId}.csv`)
      mapStatic.redrawMap()
    }

    return {
      createOverviewMap: createOverviewMap,
      refreshOverviewMap: refreshOverviewMap
    }
  }
)
