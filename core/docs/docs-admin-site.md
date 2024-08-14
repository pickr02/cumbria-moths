# Site config options: user/config/site.txt
The file `site.txt` is the main site configuration page which must be created by the site admin and placed in the folder `user/config`. The format in which the configuration options are laid out (described below) is known as YAML (pronounced 'yamel'). YAML files normally have a '.yml' file extension, but this configuration file has the file extension '.txt' to make it easy to open and edit with any text editor.

## General format
The general format for configuration options is:
```
option_name: option_value
```
An example is:
```
name: Shropshire Earthworm Atlas
```

Some options are nested indicating a related group of options like this:
```
group_name:
  group_option_1_name: group_option_1_value
  group_option_2_name: group_option_2_value
```
And example is:
```
overview:
  height: 900
  vc: gb40
  hectad-grid: true
```
In the preceding example, the options *height*, *vc* and *hectad-grid all* relate to the *overview* map. In code - and in this documentation - these are referenced like this: *overview.height*, *overview.vc* and *overview.hectad-grid*.

Some options reference a collection, or array, of sets of option values like this:
```
collection_name:
  - set1_option1_name: set1_option1_value
    set1_option2_name: set1_option2_value
  - set2_option1_name: set2_option1_value
    set2_option2_name: set2_option2_value
```

For example:
```
nav:
  - caption: Info
    page: info.html
  - caption: About
    page: about.md
```
In code, this would translate to a collection of two nav items, each with a *caption* and *page* property.

## Site banner options
These options are used to tailor the overall look of the site banner.
- **name**: specifies the name of the atlas website which is displayed in the site banner. Example:
  - `name: Shropshire Earthworm Atlas`
If no name option is provided, the banner text will say 'Site name configuration not specified'.
- **header-background-colour**: specifies the background colour of the website banner. Will accept any of the colour formats understood by HTML/CSS. Examples:
  - `header-background-colour: red` (HTML colour name)
  - `header-background-colour: rgb(100,120,30)` (red, green blue format)
  - `header-background-colour: "#EF9766"` (hex colour format - double-quotes required)
- **header-text-colour**: specifies the colour of text on the website banner. Will accept any of the colour formats understood by HTML/CSS. Example:
  - `header-text-colour: white`
- **header-logo**: specifies the name of an image file to use as a site logo on the banner. The image must be uploaded to the *user/config* folder. Example:
  - `header-logo: badge-circle.png`
- **header-logo-height**: A number indicating the height (in pixels) to be used to display the header-logo image. The width of the image will be automatically calculated, preserving the aspect ratio of the original image. Example:
  - `header-logo-height: 80`

## Navigation menu bar configuration
The navigation menu appears at the base of the site banner and provides users with the means to navigate to HTML or Markdown pages that the admin has added to the local atlas. A typical use of this would be to add various information pages.


## Example site.txt config file
```
name: Shropshire Earthworm Atlas
header-background-colour: "#EF9766"
header-text-colour: white
header-logo: badge-circle.png
header-logo-height: 80
nav:
  - caption: Info
    page: info.html
  - caption: About
    page: about.md
tabs:
  - tab: overview
    caption: Overview
  - tab: zoom
    caption: Explore
  - tab: details
    caption: Info
  - tab: charts
    caption: Temporal
  - tab: gallery
    caption: Gallery
overview:
  height: 900
  vc: gb40
  vc-buffer-xmin: 10000
  vc-buffer-xmax: 10000
  vc-buffer-ymin: 10000
  vc-buffer-ymax: 10000
  hectad-grid: true
  default-res: tetrad
zoom:
  height: 700
charts:
  height: 500
gallery:
  height: 500
```

