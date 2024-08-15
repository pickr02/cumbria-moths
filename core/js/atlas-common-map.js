define(["jquery.min"],

  function (jq) {

    function createDotShapeControl(selectorControl, config, map, callback) {

      const $dotTypeDiv=$('<div>').appendTo($(selectorControl))
      makeRadio(`dot-type-${map}`, 'Circle', 'circle', true, $dotTypeDiv, callback)
      makeRadio(`dot-type-${map}`, 'Square', 'square', false, $dotTypeDiv, callback)
    }

    function makeRadio(id, label, val, checked, $container, callback) {
    
      const $div = $('<div>').appendTo($container)
      $div.css('display', 'inline-block')
      $div.css('margin-left', '0.5em')
      $div.attr('class', 'radio')
      const $label = $('<label>').appendTo($div)
      const $radio = $('<input>').appendTo($label)
      const $span = $('<span>').appendTo($label)
      $span.text(label)
      $span.css('padding', '0 15px 0 5px')
      $radio.attr('type', 'radio')
      $radio.attr('name', `atlas-map-control-${id}`)
      $radio.attr('class', `atlas-map-control-${val}`)
      $radio.attr('value', val)
      $radio.css('margin-left', 0)
      if (checked) $radio.prop('checked', true)
  
      $radio.change(function (e) {

        const currentVal = $(`input[name="atlas-map-control-${id}"]:checked`).val()
        console.log('currentVal, val', currentVal, val)
        // Ensure that the control on other map matches this
        //$(`.atlas-map-control-${val}`).prop("checked", true).trigger('change')
        callback(val)
      })
    }

    return {
      createDotShapeControl: createDotShapeControl,
    }
  }
)
