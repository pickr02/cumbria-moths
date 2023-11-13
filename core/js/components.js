$(document).ready(function() {

  // Footer
  const $footer = $("#brc-atlas-footer")
  $footer.attr("class", "pt-5 my-5 text-body-secondary border-top")
  $footer.html(`
    Created using <a href="https://github.com/BiologicalRecordsCentre/brevi-atlas-test">
    BRC configurable atlas project</a> (version <b><span id="brc-atlas-footer-version"></span></b>.)
    <img class="pt-2" src="images/BRC_UKCEH_logo_small.png"></img>
  `)

  // Set version in footer
  $.ajax({
    url: "config/config.json",
    cache: false
  })
  .done(function( json ) {
    console.log(json)
    $("#brc-atlas-footer-version").text(`${json.version}` )
  })
})
