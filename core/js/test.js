let mapStatic

$(document).ready(function() {

  // Open test config file if it exists
  $.ajax({
    url: "user/config/site.json",
    cache: false
  })
  .done(function( json ) {
    console.log(json)
    $("#atlas-site-name").text(`${json.name}` )
 
    // Populate taxon drop-down
    d3.csv(`user/data/taxa.csv`).then(data => {
      data.forEach(d => {
        const $opt = $('<option>').appendTo($('#atlas-taxa-select'))
        $opt.text(d.taxon)
        $opt.attr('value', d.taxonId)
      })
    })

  })
  .fail(function () {
    $("#atlas-site-name").text(`No site name specified` )
  })

  

  // Initialise map
  mapStatic = brcatlas.svgMap({
    selector: "#atlas-static-map",
    mapTypesKey: 'Standard hectad',
    seaFill: 'white',
    //expand: true,
    transOptsKey: 'BI4',
    mapTypesControl: false,
    transOptsControl: false,
    mapTypesSel: {hectad: genHecatdMap},
    mapTypesKey: 'hectad'
  })
})

function atlasTaxonSelected() {
  const taxonId = $('#atlas-taxa-select').find(":selected").val()
  console.log('selected', taxonId)

  mapStatic.setIdentfier(`user/data/hectad/${taxonId}.csv`)
  mapStatic.redrawMap()
}

async function genHecatdMap(file) {

  const data = await d3.csv(file)

  const dataMap = data.map(d => {
    return {gr: d.gr, colour: 'black'}
  })

  console.log('dataMap', dataMap)

  return new Promise((resolve) => {
    resolve({
      records: dataMap,
      precision: 10000,
      shape: 'circle',
      opacity: 1,
      size: 1
    })
  })
}