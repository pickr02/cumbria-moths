// Global level object variable
brcLocalAtlas = {}

define(
  ["atlas-general", "atlas-components", "jquery.min", "d3", "brcatlas.umd.min"],
  // [foo bar] /*optional dependencies*/, 
  // module definition function
  // dependencies (foo and bar) are mapped to function parameters
  //function ( foo, bar ) {
  function (general, components, jq, d3_7, brcatlas) {
    // return a value that defines the module export
    // (i.e the functionality we want to expose for consumption)
    // Create module

    let d3 // Must be made a global variable for brcatlas to work
    let config, mapStatic

    components.create()
    general.loadCss('css/brcatlas.umd.css')
    d3=d3_7 // Make module level variable to work

    loadContent(general, brcatlas)

    brcLocalAtlas.atlasTaxonSelected = function () {
      const taxonId = $('#atlas-taxa-select').find(":selected").val()
      console.log('selected', taxonId)
    
      mapStatic.setIdentfier(`../user/data/hectad/${taxonId}.csv`)
      mapStatic.redrawMap()
    }

    async function loadContent(general, brcatlas) {

      // Open test config file if it exists
      config = await general.getConfig("../user/config/site.txt") 
   
      // Set site name
      if (config.name) {
        $("#atlas-site-name").text(`${config.name}` )
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
  
      // Create tabs
      if (config.tabs && config.tabs.length) {
        createTabs(config.tabs)
        populateTabs(config.tabs, brcatlas)
      } else { 
        // Default is to just show overview map
        createOverviewMap(brcatlas, "#brc-local-atlas-tabs")
      }
    }
    
    function createTabs(tabs) {
      $ul = $('<ul class="nav nav-tabs">').appendTo($('#brc-local-atlas-tabs'))
      $div = $('<div class="tab-content">').appendTo($('#brc-local-atlas-tabs'))
    
      tabs.forEach((t,i) => {
        // Tab
        $li = $('<li class="nav-item">').appendTo($ul)
        $a = $(`<a class="nav-link" data-bs-toggle="tab" href="#brc-local-atlas-tab-${t.tab}" data-tab="${t.tab}">`).appendTo($li)
        $a.on('shown.bs.tab', function (event) {
          // Show/hide associated control panel
          const tabNew = $(event.target).attr('data-tab') // newly activated tab
          const tabPrev = $(event.relatedTarget).attr('data-tab') // previous active tab
          $(`#brc-local-atlas-control-${tabPrev}`).hide()
          $(`#brc-local-atlas-control-${tabNew}`).show()
        })
        $a.text(t.caption ? t.caption : t.tab)

        // Tab pane
        $divt = $(`<div class="tab-pane container fade" id="brc-local-atlas-tab-${t.tab}">`).appendTo($div)
        $divt.css("padding", "1em")
    
        // Control pane
        $divc = $(`<div id="brc-local-atlas-control-${t.tab}">`).appendTo("#brc-local-atlas-controls")
        $divc.css('margin-top', '1em')
        $divc.text(`${t.caption ? t.caption : t.tab} controls`)
        $divc.css('display', 'none')

        // Active
        if (i === 0) {
          $a.addClass("active")
          $divt.removeClass("fade")
          $divt.addClass("active")
          $divc.css('display', '')
        }
      })
    }
    
    function populateTabs(tabs, brcatlas) {
      tabs.forEach((t,i) => {
        if (t.tab === "overview") {
          createOverviewMap(brcatlas, "#brc-local-atlas-tab-overview.tab-pane")
        } else {
          $(`#${t.tab}.tab-pane`).text(t.caption ? t.caption : t.tab)
        }
      })
    }
    
    function createOverviewMap(brcatlas, selector) {
      // Initialise map
      mapStatic = brcatlas.svgMap({
        selector: selector,
        mapTypesKey: 'Standard hectad',
        seaFill: 'white',
        expand: true,
        transOptsKey: 'BI4',
        mapTypesControl: false,
        transOptsControl: false,
        mapTypesSel: {hectad: genHecatdMap},
        mapTypesKey: 'hectad'
      })
      // Set max width if config set
      if (config.overview && config.overview['max-width']) {
        $(selector).css('max-width', `${config.overview['max-width']}px`)
      }
    }
    
    async function genHecatdMap(file) {
    
      const data = await d3.csv(file)
    
      const dataMap = data.map(d => {
        return {gr: d.gr, colour: 'black'}
      })
    
      //console.log('dataMap', dataMap)
    
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
  }
)





