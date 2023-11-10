$(document).ready(function() {

  // Open test config file if it exists
  $.ajax({
    url: "user/config/site.json",
    cache: false
  })
  .done(function( json ) {
    console.log(json)
    $("#atlas-site-name").text(`${json.name}` )
  })
  .fail(function () {
    $("#atlas-site-name").text(`No site name specified` )
  })

})