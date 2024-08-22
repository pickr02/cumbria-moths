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

      // If a VC is specified, set up the transOptsSel
      if (c.get('overview.vc')) {

        const match = c.overview.vc.match(/(gb|ir)(\d+)/)
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
          const xminBuffer = c.get('overview.vc-buffer-west') ? Number(c.overview['vc-buffer-west']) : 0
          const xmaxBuffer = c.get('overview.vc-buffer-east') ? Number(c.overview['vc-buffer-east']) : 0
          const yminBuffer = c.get('overview.vc-buffer-south') ? Number(c.overview['vc-buffer-south']) : 0
          const ymaxBuffer = c.get('overview.vc-buffer-north') ? Number(c.overview['vc-buffer-north']) : 0

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
          if (c.get('overview.hectad-grid') === true) {
            const file = `./data/vc-${match[1]}-hectad-grids/vc-${match[1]}-${match[1] === 'ir' ? 'H' : ''}${match[2]}-hectads.geojson`
            console.log('grid', file)
            mapStaticOpts.gridGjson = file
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
