$(document).ready(function() {

  // Open test config file if it exists
  $.ajax({
    url: "user/config/test.json",
    cache: false
  })
  .done(function( json ) {
    console.log(json)
    $("#atlas-site-name").text(`${json.name}` )
  })
  .fail(function () {
    $("#atlas-site-name").text(`No site name specified` )
  })

  // // Test adding a drop-down list
  // const $div = $('<div class="dropdown">')
  // $div.appendTo($("#atlas-site-content"))
  // const $button = $('<button class="btn btn-primary dropdown-toggle" type="button" data-toggle="dropdown">')
  // $button.html('Dropdown Example&nbsp;<span class="caret"></span>')
  // $button.appendTo($div)
  // const $ul = $('<ul class="dropdown-menu">').appendTo($div)
  // $('<li><a href="#">HTML</a></li>').appendTo($ul)
  // $('<li><a href="#">CSS</a></li>').appendTo($ul)

})