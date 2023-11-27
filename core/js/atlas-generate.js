let d3 // Must be made a global variable for brcatlas to work

requirejs(["atlas-general", "atlas-components", "d3", "jszip.min", "bigr.min.umd"], function(general, components, d3_7, jszip, bigr) {
  d3 = d3_7
  general.loadCss('css/atlas-css.css')
  components.create()
  $('#brc-local-atlas-csv-load').on('change', function() {biologicalRecordsCsvOpened(event, jszip, bigr)})
})

function biologicalRecordsCsvOpened(event, JSZip, bigr) {

  $("#biologicalRecordsCsvLoad").removeClass("invisible")

  if (event.target.files[0] !== undefined) {

    const reader = new FileReader()
    reader.addEventListener('load', (event) => {

      d3.csv(event.target.result)
        .then(function(json) {
          $("#biologicalRecordsCsvLoad").addClass("invisible")
          //generateData(json, JSZip, bigr)
          // Enable buttons which require the data
        })
    })
    reader.readAsDataURL(event.target.files[0])
  }
}

function generateData(json, JSZip, bigr) {
  // For test evaluation, working with NBN download of national
  // earthworm data
  // Cols for eval: 'Scientific name', 'OSGR' and 'Start date'
  // For eval, produce hectad, quandrant, tetrad and monad altas files for each taxon
  // Each CSV to have: gr, yearStart, yearEnd, recn
  
  const allData = []

  json.forEach(d => {
    
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
          hectadData: [],
          quandrantData: [],
          tetradData: [],
          monadData: [],
        }
        allData.push(taxonData)
      } 

      updateDataArray(taxonData.hectadData, grs.p10000)
      updateDataArray(taxonData.tetradData, grs.p2000)
      updateDataArray(taxonData.monadData, grs.p1000)
      if (grs.p5000 && grs.p5000.length === 1) {
        updateDataArray(taxonData.quandrantData, grs.p5000[0])
      }
    }

    function updateDataArray(dataArray, gr) {
      if (gr) {
        foundGr = dataArray.find(h => gr === h.gr)

        if (foundGr) {
          const startYear = getYear(d['Start date'], true)
          // if (!startYear) {
          //   console.log('invalid start date', d)
          // }
          let endYear = getYear(d['End date'], false)
          endYear = endYear ? endYear : startYear

          foundGr.recn += 1
          foundGr.yearStart = foundGr.yearStart > startYear ? startYear : foundGr.yearStart
          foundGr.yearEnd = foundGr.yearEnd < endYear ? endYear : foundGr.yearEnd
        } else {
          dataArray.push({
            gr: gr,
            recn: 1,
            yearStart: getYear(d['Start date'], true),
            yearEnd: getYear(d['End date'], false)
          })
        }
      }
    }
  })

  console.log(json.columns)
  console.log(json)
  console.log(allData)

  // Create the map data and add to zip file
  const zip = new JSZip()
  allData.forEach(d => {
    zip.folder("hectad").file(`${d.taxonId}.csv`, createMapCsvDataStr(d.hectadData))
    zip.folder("quadrant").file(`${d.taxonId}.csv`, createMapCsvDataStr(d.quandrantData))
    zip.folder("tetrad").file(`${d.taxonId}.csv`, createMapCsvDataStr(d.tetradData))
    zip.folder("monad").file(`${d.taxonId}.csv`, createMapCsvDataStr(d.monadData))
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

function taxonToSafeName(taxon) { 
  return `${taxon.replace(/[^a-z0-9]/gi, '_').toLowerCase()}` 
} 