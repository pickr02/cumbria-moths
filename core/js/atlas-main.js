// Global level object variable
brcLocalAtlas = {}

define(
  ["atlas-general", "atlas-components", "jquery.min", "d3", 
    "brcatlas.umd.min", "brccharts.umd.min", 
    "lightgallery.umd", "lg-zoom.umd", "lg-thumbnail.umd"],
  // [foo bar] /*optional dependencies*/, 
  // module definition function
  // dependencies (foo and bar) are mapped to function parameters
  //function ( foo, bar ) {
  function (general, components, jq, d3, brcatlas, brccharts, lightGallery, lgZoom, lgThumbnail) {
    // return a value that defines the module export
    // (i.e the functionality we want to expose for consumption)
    // Create module

    general.loadCss('css/brcatlas.umd.css')
    general.loadCss('css/brccharts.umd.css')
    general.loadCss('css/leaflet.css')
    general.loadCss('css/lightgallery-bundle.min.css')
    general.loadCss('css/atlas-css.css')

    let config, images, mapStatic, mapSlippy, chartByYear, chartByWeek, inlineGallery
    components.create()

    loadContent()

    $(window).resize(function() {
      resizeSlippyMap()
    })

    brcLocalAtlas.atlasTaxonSelected = async function () {
      const taxonId = $('#atlas-taxa-select').find(":selected").val()
      //general.setCookie('taxonId', taxonId, 365)
      localStorage.setItem('taxonId', taxonId)

      // There's always a static map
      mapStatic.setIdentfier(`../user/data/${config.overview['default-res']}/${taxonId}.csv`)
      mapStatic.redrawMap()
    
      if (config.tabs) {
        if (config.tabs.find(t => t.tab === 'zoom')) {
          mapSlippy.setIdentfier(`../user/data/${config.overview['default-res']}/${taxonId}.csv`)
          mapSlippy.redrawMap()
        }
        if (config.tabs.find(t => t.tab === 'details')) {
          const url = `../user/data/captions/${taxonId}.md`
          general.file2Html(url).then(res => $(`#brc-tab-details.tab-pane`).html(res) )
        }
        if (config.tabs.find(t => t.tab === 'charts')) {
          if (chartByWeek) {
            d3.csv(`../user/data/weekly/${taxonId}.csv`, d => {
              return {
                taxon: d.taxon,
                count: Number(d.count),
                period: Number(d.period)
              }
            }).then(data => {
              chartByWeek.setChartOpts({data: data})
            })
          }
          if (chartByYear) {
            d3.csv(`../user/data/yearly/${taxonId}.csv`, d => {
              return {
                taxon: d.taxon,
                count: Number(d.count),
                period: Number(d.period)
              }
            }).then(data => {
              chartByYear.setChartOpts({data: data})
            })
          }
        }
        if (config.tabs.find(t => t.tab === 'gallery')) {
          refreshGallery(taxonId)
        }
      }
    }

    async function loadContent() {

      // Open site config files
      config = await general.getConfig("../user/config/site.txt") 
      images = await general.getConfig("../user/config/images.txt") 

      // Set site name
      if (config.name) {
        $("#atlas-site-name").text(`${config.name}` )
      } else {
        $("#atlas-site-name").text(`No site name specified` )
      }

      // Populate taxon drop-down
      //const prevTaxonId = general.getCookie('taxonId')
      const prevTaxonId = localStorage.getItem('taxonId')
      d3.csv(`../user/data/taxa.csv`).then(data => {
        data.forEach(d => {
          const $opt = $('<option>').appendTo($('#atlas-taxa-select'))
          $opt.text(d.taxon)
          $opt.attr('value', d.taxonId)

          //general.getCookie('taxonId')

          if (prevTaxonId === d.taxonId) {
            $opt.attr('selected', 'selected')
          }
        })
        if (prevTaxonId) {
          brcLocalAtlas.atlasTaxonSelected()
        }
      })
  
      // Overview map is always displayed but not on a tab if no tabs specified
      // If tabs are specified, but overview map is not included, then add it to tabs.
      if (config.tabs && config.tabs.length && !config.tabs.find(t => t.tab === 'overview')) {
        config.tabs.push({
          tab: 'overview',
          caption: 'Overview'
        })
      }
      // Create tabs
      if (config.tabs && config.tabs.length) {
        createTabs(config.tabs)
        populateTabs(config.tabs)
      } else { 
        // Default is to just show overview map
        createOverviewMap("#brc-tabs", "#brc-controls")
      }
    }
    
    function createTabs(tabs) {
      $ul = $('<ul class="nav nav-tabs">').appendTo($('#brc-tabs'))
      $div = $('<div class="tab-content">').appendTo($('#brc-tabs'))
    
      tabs.forEach((t,i) => {
        // Tab
        $li = $('<li class="nav-item">').appendTo($ul)
        $a = $(`<a class="nav-link" data-bs-toggle="tab" href="#brc-tab-${t.tab}" data-tab="${t.tab}">`).appendTo($li)
        $a.on('shown.bs.tab', function (event) {
          // Show/hide associated control panel
          const tabNew = $(event.target).attr('data-tab') // newly activated tab
          const tabPrev = $(event.relatedTarget).attr('data-tab') // previous active tab
          $(`#brc-control-${tabPrev}`).hide()
          $(`#brc-control-${tabNew}`).show()
        
          resizeSlippyMap()
        })
        $a.text(t.caption ? t.caption : t.tab)

        // Tab pane
        $divt = $(`<div class="tab-pane container fade" id="brc-tab-${t.tab}">`).appendTo($div)
        $divt.css("padding", "0.5em")

        // Control pane
        $divc = $(`<div id="brc-control-${t.tab}">`).appendTo("#brc-controls")
        $divc.css('margin-top', '1em')
        $divc.html(`TODO - controls for ${t.caption ? t.caption : t.tab} tab`)
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
    
    function populateTabs(tabs) {

      tabs.forEach((t,i) => {
        if (t.tab === "overview") {
          createOverviewMap("#brc-tab-overview", "#brc-control-overview")
        } else if (t.tab === "zoom") {
          createSlippyMap("#brc-tab-zoom", "#brc-control-zoom")
        } else if (t.tab === "details") {
          // No action needed here
        } else if (t.tab === "charts") {
          createCharts("#brc-tab-charts", "#brc-control-charts")
        } else if (t.tab === "gallery") {
          createGallery()
        } else {
          $(`#brc-tab-${t.tab}.tab-pane`).text(`${t.caption ? t.caption : t.tab} content`)
        }
      })
    }
    
    function createCharts(selectorTab, selectorControl) {
      //$(selectorTab).text('Create the temporal charts')

      const width =  600
      const ar = config.charts && config.charts['aspect-ratio'] ? config.charts['aspect-ratio'] : 0.5
      let whichCharts = config.charts && config.charts['include'] ? config.charts['include'] : 'weekly yearly'
      whichCharts = whichCharts.split(' ')
      
      const $labelWeeklyChart = $('<div>Records by week</div>').appendTo($(selectorTab))
      $(selectorTab)
      const optsByDay = {
        selector: selectorTab,
        // title: 'Records by week',
        // titleFontSize: 14,
        data: [],
        taxa: ['taxon'],
        metrics: [
          { prop: 'count', label: 'count', colour: 'rgb(0,128,0)', fill: 'rgb(221,255,221)'},
        ],
        showLegend: false,
        showTaxonLabel: false,
        interactivity: 'none',
        width: width,
        //height: height,
        height: width * ar,
        perRow: 1,
        expand: true,
        missingValues: 0, 
        metricExpression: '',
        minMaxY: null,
        minY: 0,
        lineInterpolator: 'curveMonotoneX',
        chartStyle: 'area',
        periodType: 'week',
        axisLeftLabel: 'Record count',
        margin: {left: 40, right: 0, top: 0, bottom: 15},
      }
      if (whichCharts.includes('weekly')) {
        chartByWeek = brccharts.temporal(optsByDay)
      } else {
        $labelWeeklyChart.hide()
      }

      const $labelYearlyChart = $('<div>Records by year</div>').appendTo($(selectorTab))
      const optsByYear = {
        selector: selectorTab,
        // title: 'Records by year',
        // titleFontSize: 14,
        data: [],
        taxa: ['taxon'],
        metrics: [
          { prop: 'count', colour: 'grey'},
        ],
        showLegend: false,
        showTaxonLabel: false,
        interactivity: 'none',
        width: width,
        height: width * ar,
        perRow: 1,
        expand: true,
        metricExpression: '',
        minMaxY: null,
        minY: 0,
        periodType: 'year',
        chartStyle: 'bar',
        axisLeftLabel: 'Record count',
        margin: {left: 40, right: 0, top: 0, bottom: 15},
      }

      // Set min and/or max year if configured by admin
      const minYear = config.charts && config.charts['yearly-min'] ? config.charts['yearly-min'] : 0
      const maxYear = config.charts && config.charts['yearly-max'] ? config.charts['yearly-max'] : 0
      if (minYear) {
        optsByYear.minPeriod = minYear
      }
      if (maxYear) {
        optsByYear.maxPeriod = maxYear
      }
      
      if (whichCharts.includes('yearly')) {
        chartByYear = brccharts.temporal(optsByYear)
      } else {
        $labelYearlyChart.hide()
      }
    }

    function createOverviewMap(selectorTab, selectorControl) {
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
          console.log(gjsonFile)
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

      //const width = mapStatic.getMapWidth()
      // $(selectorControl).text('') // Clear
      // createSlider (selectorControl, "Map size:", "80px", function(v) {
      //   $(selectorTab).css('max-width', `${width*v/100}px`)
      // })
    }

    function createSlippyMap(selectorTab, selectorControl) {

      // Initialise map
      mapSlippy = brcatlas.leafletMap({
        selector: selectorTab,
        height: 500,
        mapTypesSel: {standard: genMap},
        mapTypesKey: 'standard'
      })

      resizeSlippyMap() // Required here in case slipply map is first tab

      // $(selectorControl).text('') // Clear
      // createSlider (selectorControl, "Map size:", "80px", function(v) {
      //   mapSlippy.setSize($("#brc-tab-zoom").width(), v*5)
      //   mapSlippy.invalidateSize()
      // })
    }

    function resizeSlippyMap() {
      if (mapSlippy) {
        const height = config.zoom && config.zoom.height ? config.zoom.height : 500
        mapSlippy.setSize($("#brc-tab-zoom").width(), height)
        mapSlippy.invalidateSize()
      }
    }

    function createSlider (selector, label, labelWidth, callback ) {
      const $divOuter = $(`<div style="display: grid; grid-template-columns: ${labelWidth} auto; grid-gap: 0px">`).appendTo($(selector))
      $divLabel = $('<div class="grid-child green">').appendTo($divOuter)
      $divLabel.text(label)
      const $divSlider = $('<div class="grid-child glue">').appendTo($divOuter)
      const $slider = $('<input type="range" class="form-range" min="40" value="100">').appendTo($divSlider)
      $slider.on("change", () => callback($slider.val()))
    }
    
    async function genMap(file) {

      const data = await d3.csv(file)
    
      const dataMap = data.map(d => {
        return {gr: d.gr, colour: 'black'}
      })
    
      //console.log('dataMap', dataMap)

      let precision 
      switch(config.overview['default-res']) {
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
          shape: 'circle',
          opacity: 1,
          size: 1
        })
      })
    }

    function createGallery() {

      const selectorTab = "#brc-tab-gallery"
      $(selectorTab).css('height', 0)
      $(selectorTab).css('width', '100%')
      $(selectorTab).css('padding-bottom', '65%')

      const lgContainer = $(selectorTab)[0]

      // After https://www.lightgalleryjs.com/demos/inline/ & https://codepen.io/sachinchoolur/pen/zYZqaGm
      inlineGallery = lightGallery(lgContainer, { // eslint-disable-line no-undef
        container: lgContainer,
        dynamic: true,
        // Turn off hash plugin in case if you are using it
        // as we don't want to change the url on slide change
        hash: false,
        // Do not allow users to close the gallery
        closable: false,
        // Hide download button
        download: false,
        // Add maximize icon to enlarge the gallery
        showMaximizeIcon: true,
        // Append caption inside the slide item
        // to apply some animation for the captions (Optional)
        appendSubHtmlTo: '.lg-item',
        // Delay slide transition to complete captions animations
        // before navigating to different slides (Optional)
        // You can find caption animation demo on the captions demo page
        slideDelay: 400,
        plugins: [lgZoom, lgThumbnail], // eslint-disable-line no-undef
        dynamicEl: [{src: `./images/no-image.jpg`}],
        thumbWidth: 90,
        thumbHeight: "60px",
        thumbMargin: 4
      })
      setTimeout(() => {inlineGallery.openGallery()}, 200)
    }

    function refreshGallery(taxonId){

      let dynamicEl
      if (images[taxonId] && Array.isArray(images[taxonId])) {

        dynamicEl = images[taxonId].map(i => {
        
          let captionHtml
          if (i.caption) {
            captionHtml = `
              <div class="lightGallery-captions">
                <div style="background-color: black; opacity: 0.7; margin: 0.3em; font-size: 1em">${i.caption}<div>
              </div>`
          } else {
            captionHtml = ''
          }
          return {
            alt: i.caption,
            src: `../user/data/images/${i.file}`,
            thumb: `../user/data/images/${i.thumb ? i.thumb : i.file}`,
            subHtml: captionHtml
          }
        })
      } else {
        dynamicEl = [{src: `./images/no-image.jpg`, thumb: `./images/no-image.jpg`}]
      }
      inlineGallery.updateSlides(dynamicEl,0)

      // Workaround for appendSubHtmlTo problem 25/07/2024
      // For some reason, setting appendSubHtmlTo: '.lg-item'
      // on gallery control places the caption behind the thumb
      // strip. Doesn't do this in other implementations I've made.
      // Couldn't get to the bottom of it, so this is a workaround
      // to move it. Can't just target '.lightGallery-captions' in
      // CSS because then it's always shifted even for single images
      // when no thumb strip displayed. Can't use JS/d3 here to update
      // the caption directly because it seems to be recreated by
      // gallery, e.g. when image changes, and so loses styling.
      // Instead target #brc-tab-gallery.shift-caption .lightGallery-captions
      // in CSS and add/remove the 'shoft-caption' class on #brc-tab-gallery
      // which is always available.
      // Note setting appendSubHtmlTo to '.lg-sub-html' positions the 
      // caption correctly, but does not change the caption when 
      // the gallery images are reloaded.
      if (dynamicEl.length > 1) {
        d3.select('#brc-tab-gallery').classed('shift-caption', true)
      } else {
        d3.select('#brc-tab-gallery').classed('shift-caption', false)
      }
    }
  }
)





