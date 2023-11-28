let d3 // Must be made a global variable for brcatlas to work

requirejs(["atlas-general", "atlas-components", "atlas-dates", "d3", "jszip.min", "bigr.min.umd"], function(general, components, dateFns, d3_7, jszip, bigr) {
  d3 = d3_7
  general.loadCss('css/atlas-css.css')
  components.create()

  let jsonCsv

  // Add file load handler
  $('#brc-csv-load').on('change', function() {biologicalRecordsCsvOpened(event)})

  // Add enableDisable event handler to controls
  $('.form-check-input').change(enableDisable)
  $('.brc-data-select').change(enableDisable)

  // Add specific event handlers to controls
  $('#brc-gen-sp').on('click', function() {generateSpData(jszip)})
  $('#brc-gen-map').on('click', function() {generateMapData(jszip, bigr)})
  $('#brc-gen-chart').on('click', function() {generateChartData(jszip, dateFns)})

  onchange="brcLocalAtlas.atlasTaxonSelected()"

  const taxonId = $('#atlas-taxa-select').find(":selected").val()

  function biologicalRecordsCsvOpened(event) {

    $("#biologicalRecordsCsvLoad").removeClass("invisible")

    if (event.target.files[0] !== undefined) {

      const reader = new FileReader()
      reader.addEventListener('load', (event) => {

        d3.csv(event.target.result)
          .then(function(json) {
            $("#biologicalRecordsCsvLoad").addClass("invisible")
            jsonCsv = json
            // Populate the selection dropdowns with field names
            jsonCsv.columns.forEach(f => {
              ['taxon', 'gr', 'sdate', 'edate'].forEach(id => {
                const $opt = $('<option>').appendTo($(`#brc-data-${id}-select`))
                $opt.text(f)
                $opt.attr('value', f)
              })
            })
            // Enable buttons which require the data
            enableDisable()
          })
      })
      reader.readAsDataURL(event.target.files[0])
    }
  }

  function enableDisable() {

    if (jsonCsv) {
      $('.brc-data-select').removeAttr('disabled')
    } else {
      $('.brc-data-select').attr('disabled', '')
    }

    const fldTaxon = $('#brc-data-taxon-select').find(":selected").val()
    const fldGridRef = $('#brc-data-gr-select').find(":selected").val()
    const flDateStart = $('#brc-data-sdate-select').find(":selected").val()
    const fldDateEnd = $('#brc-data-edate-select').find(":selected").val()
    
    // Species list generation
    if (jsonCsv && fldTaxon) {
      $('#brc-gen-sp').removeClass('disabled')
    } else {
      $('#brc-gen-sp').addClass('disabled')
    }

    // Map atlas resolution checkboxes
    if (jsonCsv && fldTaxon && fldGridRef && flDateStart) {
      $('.brc-gen-map-chk').removeAttr('disabled')
    } else {
      $('.brc-gen-map-chk').attr('disabled', '')
      $('.brc-gen-map-chk').prop('checked', false)
    }

    // Chart type checkboxes
    if (jsonCsv && fldTaxon && flDateStart) {
      $('.brc-gen-chart-chk').removeAttr('disabled')
    } else {
      $('.brc-gen-chart-chk').attr('disabled', '')
      $('.brc-gen-chart-chk').prop('checked', false)
    }

    // Map generation button
    if (jsonCsv && fldTaxon && fldGridRef && flDateStart && 
        isChecked('brc-gen-hectads') || isChecked('brc-gen-quadrants') || 
        isChecked('brc-gen-tetrads') || isChecked('brc-gen-monads')) {
      $('#brc-gen-map').removeClass('disabled')
    } else {
      $('#brc-gen-map').addClass('disabled')
    }

    // Charts generation button
    if (jsonCsv && fldTaxon && fldGridRef && flDateStart && 
        isChecked('brc-gen-weekly') || isChecked('brc-gen-yearly')) {
      $('#brc-gen-chart').removeClass('disabled')
    } else {
      $('#brc-gen-chart').addClass('disabled')
    }
  }

  function isChecked (id) {
    return $(`#${id}`).is(':checked')
  }

  function getYear(date, bStart) {
    // For testing, assume all dates of form yyyy-mm-dd
    // Ignore bStart argument - that will be to deal with formats such as nnnn-mm-dd - nnnn-mm-dd
    if (date.match(/^\d{4}\-(0[1-9]|1[012])\-(0[1-9]|[12][0-9]|3[01])$/)) {
      return Number(date.substr(0,4))
    } else {
      return null
    }
  }

  function createMapCsvDataStr(data) {
    const recs = data.map(d => {
      return `${d.gr},${d.recn},${d.yearStart},${d.yearStart}` 
    })
    let dataString = `gr,recn,yearStart,yearEnd\r\n${recs.join("\r\n")}`
    return dataString
  }

  function createTemporalCsvDataStr(data) {
    const recs = data.map(d => {
      return `${d.taxon},${d.period},${d.count}` 
    })
    let dataString = `taxon,period,count\r\n${recs.join("\r\n")}`
    return dataString
  }

  function taxonToSafeName(taxon) { 
    return `${taxon.replace(/[^a-z0-9]/gi, '_').toLowerCase()}` 
  }

  function generateSpData(JSZip) {
    
    console.log('Generate species list')

    const fldTaxon = $('#brc-data-taxon-select').find(":selected").val()
    const allData = []

    jsonCsv.forEach(d => {
      const taxonId = taxonToSafeName(d[fldTaxon])
      if (taxonId) {
        let taxonData = allData.find(d => d.taxonId === taxonId)
        if (!taxonData) {
          taxonData = {
            taxonId: taxonId,
            taxon: d[fldTaxon],
          }
          allData.push(taxonData)
        }
      }
    })

    console.log('sp data', allData)

    // Create the map data and add to zip file
    const zip = new JSZip()

    // Create the species list CSV and add to zip file
    const taxaListData = allData.map(d => {
      return `${d.taxonId},${d.taxon}` 
    }).sort()
    zip.file("taxa.csv", `taxonId,taxon\r\n${taxaListData.join("\r\n")}`)

    // Download the zip file
    zip.generateAsync({type:"base64"}).then(function (base64) {
      window.location = "data:application/zip;base64," + base64
    }, function (err) {
        console.log('error', err)
    })
  }

  function generateMapData(JSZip, bigr) {
    // For test evaluation, working with NBN download of national
    // earthworm data
    // Cols for eval: 'Scientific name', 'OSGR' and 'Start date'
    // For eval, produce hectad, quandrant, tetrad and monad altas files for each taxon
    // Each CSV to have: gr, yearStart, yearEnd, recn
    
    const bHec = isChecked('brc-gen-hectads')
    const bQua = isChecked('brc-gen-quadrants')
    const bTet = isChecked('brc-gen-tetrads')
    const bMon = isChecked('brc-gen-monads')

    const allData = []

    jsonCsv.forEach(d => {
      
      let bValidGr = true
      try {
        bigr.checkGr(d['OSGR'])
      } catch (e) {
        bValidGr = false
      }

      if (bValidGr) {

        const taxonId = taxonToSafeName(d['Scientific name'])
        const grs = bigr.getLowerResGrs(d['OSGR'])

        let taxonData = allData.find(d => d.taxonId === taxonId)
        if (!taxonData) {
          taxonData = {
            taxonId: taxonId,
            taxon: d['Scientific name'],
          }
          if (bHec) taxonData.hectadData = []
          if (bQua) taxonData.quandrantData = []
          if (bTet) taxonData.tetradData = []
          if (bMon) taxonData.monadData = []

          allData.push(taxonData)
        } 

        if (bHec) updateDataArray(taxonData.hectadData, grs.p10000)
        if (bTet) updateDataArray(taxonData.tetradData, grs.p2000)
        if (bMon) updateDataArray(taxonData.monadData, grs.p1000)
        if (grs.p5000 && grs.p5000.length === 1) {
          if (bQua) updateDataArray(taxonData.quandrantData, grs.p5000[0])
        }
      }

      function updateDataArray(dataArray, gr) {
        if (gr) {
          const parsedDates = dateFns.resolveYearsWeek(dateFns.parseDate(d['Start date']), dateFns.parseDate(d['End date']))
          const startYear = parsedDates[0]
          const endYear = parsedDates[1]

          foundGr = dataArray.find(h => gr === h.gr)
          if (foundGr) {
            foundGr.recn += 1
            foundGr.yearStart = foundGr.yearStart && foundGr.yearStart > startYear ? startYear : foundGr.yearStart
            foundGr.yearEnd = foundGr.yearEnd && foundGr.yearEnd < endYear ? endYear : foundGr.yearEnd
          } else {
            dataArray.push({
              gr: gr,
              recn: 1,
              yearStart: startYear,
              yearEnd: endYear
            })
          }
        }
      }
    })

    // console.log(jsonCsv.columns)
    // console.log(jsonCsv)
    console.log(allData)

    // Create the map data and add to zip file
    const zip = new JSZip()

    allData.forEach(d => {
      if (bHec) zip.folder("hectad").file(`${d.taxonId}.csv`, createMapCsvDataStr(d.hectadData))
      if (bQua) zip.folder("quadrant").file(`${d.taxonId}.csv`, createMapCsvDataStr(d.quandrantData))
      if (bTet) zip.folder("tetrad").file(`${d.taxonId}.csv`, createMapCsvDataStr(d.tetradData))
      if (bMon) zip.folder("monad").file(`${d.taxonId}.csv`, createMapCsvDataStr(d.monadData))
    })

    // Create the species list CSV and add to zip file
    const taxaListData = allData.map(d => {
      return `${d.taxonId},${d.taxon}` 
    }).sort()
    zip.file("taxa.csv", `taxonId,taxon\r\n${taxaListData.join("\r\n")}`)

    // Download the zip file
    zip.generateAsync({type:"base64"}).then(function (base64) {
      window.location = "data:application/zip;base64," + base64
    }, function (err) {
        console.log('error', err)
    })
  }

  function generateChartData(JSZip, dateFns) {
    // For test evaluation, working with NBN download of national
    // earthworm data
    // Cols for eval: 'Scientific name', 'OSGR' and 'Start date'
    // For eval, produce hectad, quandrant, tetrad and monad altas files for each taxon
    // Each CSV to have: gr, yearStart, yearEnd, recn
    
    console.log('Generate chart data')

    const bWk = isChecked('brc-gen-weekly')
    const bYr = isChecked('brc-gen-yearly')

    const allData = []

    jsonCsv.forEach(d => {

      const taxonId = taxonToSafeName(d['Scientific name'])
      const parsedDates = dateFns.resolveYearsWeek(dateFns.parseDate(d['Start date']), dateFns.parseDate(d['End date']))

      //console.log(d['Start date'], d['End date'], parsedDates)

      let taxonData = allData.find(d => d.taxonId === taxonId)
      if (!taxonData) {
        taxonData = {
          taxonId: taxonId,
        }
        if (bYr) taxonData.yearly = []
        if (bWk) taxonData.weekly = []
 
        allData.push(taxonData)
      }

      if (bYr) updateDataArray(taxonData.yearly, parsedDates[0])
      if (bWk) updateDataArray(taxonData.weekly, parsedDates[2])

      function updateDataArray(dataArray, period) {
        if (period) {
          foundPeriod = dataArray.find(d => period === d.period)
          if (foundPeriod) {
            foundPeriod.count += 1
          } else {
            dataArray.push({
              taxon: 'taxon',
              period: period,
              count: 1
            })
          }
        }
      }
    })
    //console.log(allData)

    // Create the map data and add to zip file
    const zip = new JSZip()

    allData.forEach(d => {
      if (bWk) zip.folder("weekly").file(`${d.taxonId}.csv`, createTemporalCsvDataStr(d.weekly))
      if (bYr) zip.folder("yearly").file(`${d.taxonId}.csv`, createTemporalCsvDataStr(d.yearly))
    })

    // Download the zip file
    zip.generateAsync({type:"base64"}).then(function (base64) {
      window.location = "data:application/zip;base64," + base64
    }, function (err) {
        console.log('error', err)
    })
  }
})