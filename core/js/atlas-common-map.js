define(["d3", "jquery.min", "atlas-components"],

  function (d3, jq, components) {

    const callbacksMapTypeControl = []
    const callbacksResolutionControl = []
    const callbacksDotShapeControl = []
    let c

    function setConfig(config) {
      c = config
    }

    function createMapTypeControl(selectorControl, map, callback) {

      const allMapTypes = {
        standard: 'Standard atlas map',
        density: 'Record density',
        timeslice: 'Occurrence by year'
      }
      let mapTypes = []
      if (c.get('common.map-types')) {
        mapTypes = c.get('common.map-types').replace(/\s+/g, ' ').split(' ').filter(r => Object.keys(allMapTypes).includes(r))
      }
      if (!mapTypes.length) {
        mapTypes = Object.keys(allMapTypes)
      }
      if (mapTypes.length === 1) {
        localStorage.setItem('map-type', mapTypes[0])
        return
      }

      const $sel = $('<select>').appendTo($(selectorControl))
      $sel.attr('id', `${map}-map-type-selector`)
      $sel.addClass('atlas-control')
      $sel.addClass('map-type-selector')
      $sel.addClass('form-select')
      $sel.on('change', function() {
        // Get selected value
        const mapType = $(`#${map}-map-type-selector`).find(":selected").val()
        console.log('selected map type', mapType)
        // Store value in local storage
        localStorage.setItem('map-type', mapType)
        // Ensure that the control on other map matches this
        $(`.map-type-selector`).val(mapType)
        // Callbacks
        callbacksMapTypeControl.forEach(cb => {
          cb()
        })
      })

      mapTypes.forEach(function(t){
        const $opt = $('<option>')
        $opt.attr('value', t)
        $opt.html(allMapTypes[t]).appendTo($sel)
        if (localStorage.getItem('map-type') === t) {
          $opt.attr('selected', 'selected')
        }
      })

      callbacksMapTypeControl.push(callback)
    }

    function createResolutionControl(selectorControl, map, callback) {

      const $sel = $('<select>').appendTo($(selectorControl))
      $sel.attr('id', `${map}-resolution-selector`)
      $sel.addClass('atlas-control')
      $sel.addClass('resolution-selector')
      $sel.addClass('form-select')
      $sel.on('change', function() {
        // Get selected value
        const res = $(`#${map}-resolution-selector`).find(":selected").val()
        // Store value in local storage
        localStorage.setItem('resolution', res)
        // Ensure that the control on other map matches this
        $(`.resolution-selector`).val(res)
        // Callbacks
        callbacksResolutionControl.forEach(cb => {
          cb()
        })
      })

      const resolutions = c.get('common.resolution').replace(/\s+/g, ' ').split(' ').filter(r => ['hectad', 'quadrant', 'tetrad', 'monad'].includes(r))
      resolutions.forEach(function(r){
        const $opt = $('<option>')
        $opt.attr('value', r)
        $opt.html(r).appendTo($sel)
        if (localStorage.getItem('resolution') === r) {
          $opt.attr('selected', 'selected')
        }
      })

      callbacksResolutionControl.push(callback)
    }

    function createDotShapeControl(selectorControl, map, callback) {

      // Get current value
      const currentVal = localStorage.getItem('dot-shape')
      
      const $dotTypeDiv=$('<div>').appendTo($(selectorControl))
      $dotTypeDiv.addClass('atlas-control')
      components.makeRadio(`dot-type-${map}`, 'Circles', 'circle', currentVal === 'circle', 'dot-shape', $dotTypeDiv, callbacksDotShapeControl)
      components.makeRadio(`dot-type-${map}`, 'Squares', 'square', currentVal === 'square', 'dot-shape', $dotTypeDiv, callbacksDotShapeControl)

      callbacksDotShapeControl.push(callback)
    }

    async function genStandardMap(file) {

      const data = await d3.csv(file)
      const dataMap = data.map(d => {
        return {gr: d.gr, colour: c.get('common.dot-colour') ? c.get('common.dot-colour') : 'black'}
      })

      let precision 
      switch(getDotSize()) {
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

      let dotShape
      if (['circle', 'square'].includes(c.get('common.dot-shape'))) {
        dotShape = c.get('common.dot-shape')
      } else {
        dotShape = localStorage.getItem('dot-shape')
      }

      return new Promise((resolve) => {
        resolve({
          records: dataMap,
          precision: precision,
          shape: dotShape,
          opacity: 1,
          size: 1
        })
      })
    }

    async function genDensityMap(file) {

      const dotColour = c.get('common.dot-colour') ? c.get('common.dot-colour') : 'black'
      const data = await d3.csv(file)
      const maxn = data.reduce((a,r) => Number(r.recn) > a ? Number(r.recn) : a, 0)
      const minn = data.reduce((a,r) => Number(r.recn) < a ? Number(r.recn) : a, maxn)
      const dataMap = data.map(d => {
        return {
          gr: d.gr, 
          colour: dotColour,
          size: 0.3 + 0.7 * (Math.sqrt(Number(d.recn))-Math.sqrt(minn)) / (Math.sqrt(maxn)-Math.sqrt(minn))
        }
      })
      let precision 
      switch(getDotSize()) {
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
      let dotShape
      if (['circle', 'square'].includes(c.get('common.dot-shape'))) {
        dotShape = c.get('common.dot-shape')
      } else {
        dotShape = localStorage.getItem('dot-shape')
      }

      return new Promise((resolve) => {

        const lines = [
          {
            size: 0.3,
            text: `${minn} record${minn === 1 ? '' : 's'}`
          },
          {
            size: 1,
            text: `${maxn} record${maxn === 1 ? '' : 's'}`
          },
        ]

        if (maxn === minn) {
          lines.shift()
        }
         
        resolve({
          records: dataMap,
          precision: precision,
          shape: dotShape,
          opacity: 1,
          size: 1,
          legend: {
            title: 'Record density',
            shape: dotShape,
            colour: dotColour,
            precision: precision,
            lines: lines
          }
        })
      })
    }

    async function genTimeSliceMap(file) {

      const data = await d3.csv(file)
      const dataMap = data.map(d => {
        return {gr: d.gr, colour: c.get('common.dot-colour') ? c.get('common.dot-colour') : 'black'}
      })

      let precision 
      switch(getDotSize()) {
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

      let dotShape
      if (['circle', 'square'].includes(c.get('common.dot-shape'))) {
        dotShape = c.get('common.dot-shape')
      } else {
        dotShape = localStorage.getItem('dot-shape')
      }

      return new Promise((resolve) => {
        resolve({
          records: dataMap,
          precision: precision,
          shape: dotShape,
          opacity: 1,
          size: 1
        })
      })
    }

    function getDotSize() {
      let dotRes
      const cRes = c.get('common.resolution')
      let resolutions = []
      if (cRes) {
        resolutions = cRes.replace(/\s+/g, ' ').split(' ').filter(r => ['hectad', 'quadrant', 'tetrad', 'monad'].includes(r))
      }
      if (!cRes || resolutions.length > 1) {
        dotRes = localStorage.getItem('resolution')
      } else {
        dotRes = c.get('common.resolution')
      }

      return dotRes
    }

    return {
      setConfig: setConfig,
      createMapTypeControl: createMapTypeControl,
      createDotShapeControl: createDotShapeControl,
      createResolutionControl: createResolutionControl,
      genStandardMap: genStandardMap,
      genDensityMap: genDensityMap,
      genTimeSliceMap: genTimeSliceMap,
      getDotSize: getDotSize
    }
  }
)
