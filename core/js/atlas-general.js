define(
  ['jquery.min', 'js-yaml.min', 'marked.min'],
  // [foo bar] /*optional dependencies*/, 
  // module definition function
  // dependencies (foo and bar) are mapped to function parameters
  //function ( foo, bar ) {
  function (jq, jsyaml, md) {
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
              let json = {}
              try {
                json = jsyaml.load(data)
              } catch (e) {
                json = {
                  errName: e.name,
                  errMessage: e.message
                }
              }
              resolve(json)
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
      },
      file2Html: async function(file) {
        const tokens = file.split('.')
        const ext = tokens[tokens.length-1]
        let ret
        if (ext === 'md' || ext === 'html') {
          try {
            ret = await $.ajax({
              url: file,
              cache: false
            }).then(data => {
              return ext === 'md' ? md.marked.parse(data) : data
            })
          } catch(e) {
            ret = `There was an error reading file '${file}'.`
          }
        } else {
          ret = `File '${file}' does not have an .md or .html extension.`
        }
        return ret
      },
      setCookie: function setCookie(cname, cvalue, exdays) {
        const d = new Date();
        d.setTime(d.getTime() + (exdays*24*60*60*1000));
        let expires = "expires="+ d.toUTCString();
        document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
      },
      getCookie: function getCookie(cname) {
        let name = cname + "=";
        let decodedCookie = decodeURIComponent(document.cookie);
        let ca = decodedCookie.split(';');
        for(let i = 0; i <ca.length; i++) {
          let c = ca[i];
          while (c.charAt(0) == ' ') {
            c = c.substring(1);
          }
          if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
          }
        }
        return "";
      }
    }
    // Return module
    return general
  }
)