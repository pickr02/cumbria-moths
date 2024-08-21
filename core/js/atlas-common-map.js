define(["jquery.min"],

  function (jq) {

    const callbacksDotShapeControl = []

    function createDotShapeControl(selectorControl, map, callback) {

      // Get current value
      const currentVal = localStorage.getItem('dot-shape')
      
      const $dotTypeDiv=$('<div>').appendTo($(selectorControl))
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

    return {
      createDotShapeControl: createDotShapeControl,
    }
  }
)
