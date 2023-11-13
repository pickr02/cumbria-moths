$(document).ready(function() {

 (async function() {
    const configSite = await getConfig("../user/config/site.json") 
    const configCore = await getConfig("config/config.json") 
    
    //console.log('configSite', configSite)
    //console.log('configCore', configCore)

    generateHeader(configSite)
    generateFooter(configCore)
  })()
})

function getConfig(file) {
  return new Promise((resolve, reject) => {
    $.ajax({
      url: file,
      cache: false,
      // async:  false,
      success: function (data) {
        resolve(data)
      },
      error: function (error) {
        resolve({})
      }
    })
  })
}

function generateFooter(configCore) {
  // Footer
  const $footer = $("#brc-atlas-footer")
  $footer.attr("class", "pt-5 my-5 text-body-secondary border-top")
  $footer.html(`
    <span class="me-2">
      Created using <a href="https://github.com/BiologicalRecordsCentre/brevi-atlas-test">
      BRC configurable atlas project</a> (version <b>${configCore.version}</b>).
    </span>
    <a href="admin.html">
      <img class="pt-2 pb-2" style="width:30px" src="images/gear-icon.png"></img>
    </a>
    <div>
      <img class="pt-2 pb-2" src="images/BRC_UKCEH_logo_small.png"></img>
    </div>
  `)
}

function generateHeader(configSite) {

  const name = configSite.name ? configSite.name : "Site name configuration not specied"
  const headerLogo = configSite['header-logo']
  const logoHeight = configSite['header-logo-height']
  // Header
  const $header = $("#brc-atlas-header")
  $header.attr("class", "d-flex align-items-center pb-3 mb-5 border-bottom fs-2")

  // Site logo
  console.log(headerLogo)
  console.log('window.location', window.location)
  console.log('site root', siteRoot())
  if (headerLogo) {
    const $img = $(`<img src="../user/config/${headerLogo}">`).appendTo($header)
    if (logoHeight) {
      $img.css("height", `${logoHeight}px`)
      $img.css("margin-right", "10px")
    }
  }

  // Site name
  $('<span>').text(name).appendTo($header)
}

function siteRoot() {
  const pathElements = window.location.pathname.split('/')

  console.log(pathElements)
  if (pathElements[1] === 'core') {
    return ''
  } else {
    return `/${pathElements[1]}`
  }
}
