let mapStatic
let d3 // Must be made a global variable for brcatlas to work

//js/jquery.min.js

requirejs(["atlas-general", "atlas-components", "jquery.min", "d3", "brcatlas.umd.min"], function(general, components, jq, d3_7, brcatlas) {
  
  components.create()
  general.loadCss('css/brcatlas.umd.css')
  d3=d3_7 // Make global
  loadContent(general, brcatlas)
})

function loadContent(general, brcatlas) {

  // Open test config file if it exists
  general.getConfig("../user/config/site.txt") 
  .then(function( data ) {
  
    if (data.name) {
      $("#atlas-site-name").text(`${data.name}` )
    } else {
      $("#atlas-site-name").text(`No site name specified` )
    }
    // Populate taxon drop-down
    d3.csv(`../user/data/taxa.csv`).then(data => {
      data.forEach(d => {
        const $opt = $('<option>').appendTo($('#atlas-taxa-select'))
        $opt.text(d.taxon)
        $opt.attr('value', d.taxonId)
      })
    })
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
}

function atlasTaxonSelected() {
  const taxonId = $('#atlas-taxa-select').find(":selected").val()
  console.log('selected', taxonId)

  mapStatic.setIdentfier(`../user/data/hectad/${taxonId}.csv`)
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