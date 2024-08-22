define(["d3", "jquery.min"],

  function (d3, jq) {

    const callbacksResolutionControl = []
    const callbacksDotShapeControl = []
    let c

    function setConfig(config) {
      c = config
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
        console.log('selected', res)
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
      })

      callbacksResolutionControl.push(callback)
    }

    function createDotShapeControl(selectorControl, map, callback) {

      // Get current value
      const currentVal = localStorage.getItem('dot-shape')
      
      const $dotTypeDiv=$('<div>').appendTo($(selectorControl))
      $dotTypeDiv.addClass('atlas-control')
      makeRadio(`dot-type-${map}`, 'Circles', 'circle', currentVal === 'circle', $dotTypeDiv, callbacksDotShapeControl)
      makeRadio(`dot-type-${map}`, 'Squares', 'square', currentVal === 'square', $dotTypeDiv, callbacksDotShapeControl)

      callbacksDotShapeControl.push(callback)
    }

    function makeRadio(id, label, val, checked, $container, callbacks) {
    
      const $div = $('<div>').appendTo($container)
      $div.css('display', 'inline-block')
      $div.css('margin-left', '0.5em')
      $div.attr('class', 'radio')
      const $label = $('<label>').appendTo($div)
      const $radio = $('<input>').appendTo($label)
      const $span = $('<span>').appendTo($label)
      $span.text(label)
      $span.css('padding', '0 10px 0 5px')
      $radio.attr('type', 'radio')
      $radio.attr('name', `atlas-map-control-${id}`)
      $radio.attr('class', `atlas-map-control-${val}`)
      $radio.attr('value', val)
      $radio.css('margin-left', 0)
      if (checked) $radio.prop('checked', true)
  
      $radio.change(function (e) {
        // Store value in local storage
        localStorage.setItem('dot-shape', val)
        // Ensure that the control on other map matches this
        $(`.atlas-map-control-${val}`).prop("checked", true)
        // Callbacks
        callbacks.forEach(cb => {
          cb(val)
        })
      })
    }

    async function genMap(file) {

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
      createDotShapeControl: createDotShapeControl,
      createResolutionControl: createResolutionControl,
      genMap: genMap,
      getDotSize: getDotSize
    }
  }
)
