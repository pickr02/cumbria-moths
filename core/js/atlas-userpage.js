requirejs(["jquery.min", "marked.min", "atlas-components", "atlas-general"], function(jq, md, components, general) {
  components.create()
  loadContent(md, general)
})

'atlas-general'

function loadContent(md, general) {

  const urlParams = new URLSearchParams(window.location.search)
  const userContent = urlParams.get('page')
  const url = `../user/config/${userContent}`
  general.file2Html(url).then(res => $('main').html(res) )
}