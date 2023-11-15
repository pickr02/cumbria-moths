function getConfig(file) {
  // Reads YAML format config file and returns
  // JSON object.
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
}