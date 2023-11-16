requirejs(["jquery.min", "marked.min", "atlas-components"], function(jq, md, components) {
  components.create()
  loadContent(md)
})

function loadContent(md) {

  const urlParams = new URLSearchParams(window.location.search)
  const userContent = urlParams.get('page')
  const tokens = userContent.split('.')
  const ext = tokens[tokens.length-1]

  if (ext === 'md' || ext === 'html') {

    $.ajax({
      url: `../user/config/${userContent}`,
      cache: false,
      success: function (data) {
        $('main').html(ext === 'md' ? md.marked.parse(data) : data)
      },
      error: function (error) {
        $('main').html(`File /user/config/${userContent} was not found.`)
      }
    })
  }
}