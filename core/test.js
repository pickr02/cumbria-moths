$(document).ready(function() {

  // Open test config file if it exists
  $.ajax({
    url: "user/config/test.json",
    cache: false
  })
  .done(function( json ) {
    console.log(json)
    $("#atlas-site-content").append(`<h1>${json.name}</h1>` )
  })
  .fail(function () {
    $("#atlas-site-content").append(`<h1>No site name specified</h1>` )
  })
})