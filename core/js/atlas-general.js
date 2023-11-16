define(
  ['jquery.min', 'js-yaml.min'],
  // [foo bar] /*optional dependencies*/, 
  // module definition function
  // dependencies (foo and bar) are mapped to function parameters
  //function ( foo, bar ) {
  function (jq, jsyaml) {
    // return a value that defines the module export
    // (i.e the functionality we want to expose for consumption)
    // Create module

    const general = {

      getConfig: function(file){
        return new Promise((resolve, reject) => {
          $.ajax({
            url: file,
            cache: false,
            // async:  false,
            success: function (data) {
              resolve(jsyaml.load(data))
            },
            error: function (error) {
              resolve({})
            }
          })
        })
      },
      loadCss: function(file) {
        var link = document.createElement("link")
        link.type = "text/css"
        link.rel = "stylesheet"
        link.href = file
        document.getElementsByTagName("head")[0].appendChild(link)
      }
    }
    // Return module
    return general
  }
)