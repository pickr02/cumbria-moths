# General site configuration
The file `site.txt` is the main site configuration page which you must be create and place in the folder `user/config`. The format in which the configuration options are laid out (described below) is known as YAML (pronounced 'yamel'). YAML files normally have a '.yml' file extension, but this configuration file has the file extension '.txt' to make it easy to open and edit with any text editor.

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

**Important note**: In YAML format, the indentation is all important. The number of characters you use for an indentation is not that important as long as you are consistent in your usage. Items should line up as shown in the example above. If the software cannot read your *site.txt* configuration file because of a YAML formatting error, the error will be reported to you on the page and that should help you track down the problem.

## Site banner configuration
These options are used to tailor the overall look of the site banner.
- **name**: specifies the name of the atlas website which is displayed in the site banner. If the option is not specified, the banner text will say 'Site name configuration not specified'. Example:
  - `name: Shropshire Earthworm Atlas`
- **header-background-colour**: specifies the background colour of the website banner. Will accept any of the colour formats understood by HTML/CSS. If the option is not specified, the banner will be white. Examples:
  - `header-background-colour: red` (HTML colour name)
  - `header-background-colour: rgb(100,120,30)` (red, green blue format)
  - `header-background-colour: "#EF9766"` (hex colour format - double-quotes required)
- **header-text-colour**: specifies the colour of text on the website banner. Will accept any of the colour formats understood by HTML/CSS. If the option is not specified, the banner text will be black. Example:
  - `header-text-colour: white`
- **header-logo**: specifies the name of an image file to use as a site logo on the banner. The image must be uploaded to the *user/config* folder. If the option is not specified, no image is displayed. Example:
  - `header-logo: badge-circle.png`
- **header-logo-height**: A number indicating the height (in pixels) to be used to display the header-logo image. The width of the image will be automatically calculated, preserving the aspect ratio of the original image. If the option is not specified, the image is shown at its original size. Example:
  - `header-logo-height: 80`

## Navigation bar configuration
A navigation bar appears at the base of the site banner if you have configured additional HTML and/or markdown pages to be added to the site. The navigation bar provides users with the means to navigate to to pages. A typical use of this would be to add various information pages.

There is a separate help page with guidance on [setting up additional HTML or Markdown pages](./docs-additional-pages.md). Here we are only concerned with configuring the navigation bar to provide links to them.

- **nav**: the collection name under which navigation items are configured.
- **caption**: the text that will appear in the navigation bar for the link.
- **page**: the file path and name of the HTML/Markdown page to be displayed when the link is clicked. This path is relative to the *user/config* folder. Typically you would add information pages in a subfolder you create in the *user/config* folder, e.g. *user/config/pages*, as in the example below:
```
nav:
  - caption: Info
    page: pages/info.html
  - caption: About
    page: pages/about.md
```
The example above will display two navigation links in the navigation bar with the text *Info* and *About*. The first one is linking to an HMTL page called *info.html* in a subfolder of the *user/config* folder called *pages*. The second one is linking to a Markdown page called *about.md*, also in a subfolder of the *user/config* folder called *pages*. 

## Main tabs configuration
The main body of the atlas web page is split into two regions: 1) a toolpane on the left of the page where the taxon selector and other user-interface elements are placed and 2) the main display area on the right where the various atlas visualisations are displayed. There are five visualisations which can be included in your atlas: the classic atlas map, a zoomable map, temporal charts, an image gallery and taxon information pages. The classic atlas map is always included, but the other four are optional. 

When more than one of these visualisations is made available, the user can switch between them using a tab control. You specify which of the visualisations (tabs) is available using these options:

- **tabs**: the collection name under which tab items are configured.
- **tab**: a label identifying the visualisation - must be one of *overview* (classic atlas map), *zoom* (zoomable map), *details* (taxon info pages), *charts* (temporal charts), *gallery* (image gallery).
- **caption**: the text that will appear on the tab control.

An example that would display all five tabs is shown below:
```
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
```
If you do not specify the *tabs* option, the classic atlas map is shown without any tab control. If you don't specify the *caption* option for any of the tabs, then the text shown on the tab defaults to the identifying label, e.g. 'overview'. If you specify a tab with an identifier that is not one of the five recognised types then a tab will be created but nothing shown on it. The order in which you specify the tabs specifies the order they appear on the page. The first tab you specify is always selected by default.

To exclude a visualisation from your atlas, e.g. the temporal charts, simply do not specify it in the tabs collection.

## Configuring the main atlas map
These options are used to tailor the appearance and behaviour of the classic atlas map. These are specified as a group of options with the group name *overview*.
- **height**: specifies the maximum height of the atlas map in pixels. The nominal width of the map is calculated from the height you specify and the aspect ratio of your atlas area. If the nominal width exceeds the area available to display it (e.g. on small devices), then the width is reduced to fit it in and the height is also reduced to maintain the aspect ratio. Therefore the height you speciy here should be regarded as a maximum height that will not be exceeded. Example:
  - `height: 800`
- **vc**: specifies a British or Irish vice-county to use as the atlas area. Values are of the format 'gb*n*' or 'ir*n*' where *n* is the vice-county number, e.g. gb40 (Shropshire), gb1 (West Cornwall with Scilly) or ir21 (Dublin). Vice-county boundaries for Britain and Ireland are supplied with the core software. If uspecified, then the atlas area covers the whole of Britain and Ireland.
  - `vc: gb40`
- **hectad-grid**: if set to 'true', this indicates that a hectad grid is to be drawn over the map boundary if a vice-county is used to specify the map extent and boundary. Hectad grids for all the vice-counties are supplied with the core software. If not specified or specified and set to any value other than 'true', a grid is not drawn. Example:
  - `hectad-grid: true`
- **vc-buffer-west**: specifies a value in metres by which to extend the real-world extent of the map (as calculated from the map boundary) in the *westward* direction. This can be useful when specifying a vice-county map with a hectad grid - it enables the map to be extended so that the whole grid is visible. Example:
  - `vc-buffer-west: 10000`
- **vc-buffer-east**: specifies a value in metres by which to extend the real-world extent of the map (as calculated from the map boundary) in the *eastward* direction. This can be useful when specifying a vice-county map with a hectad grid - it enables the map to be extended so that the whole grid is visible. Example:
  - `vc-buffer-east: 10000`
- **vc-buffer-south**: specifies a value in metres by which to extend the real-world extent of the map (as calculated from the map boundary) in the *southward* direction. This can be useful when specifying a vice-county map with a hectad grid - it enables the map to be extended so that the whole grid is visible. Example:
  - `vc-buffer-south: 10000`
- **vc-buffer-north**: specifies a value in metres by which to extend the real-world extent of the map (as calculated from the map boundary) in the *northward* direction. This can be useful when specifying a vice-county map with a hectad grid - it enables the map to be extended so that the whole grid is visible. Example:
  - `vc-buffer-north: 10000`

A full example:
```
overview:
  height: 800
  vc: gb40
  hectad-grid: true
  vc-buffer-west: 10000
  vc-buffer-east: 10000
  vc-buffer-south: 10000
  vc-buffer-north: 10000
```
Data for the atlas map are stored in subfolders of the *user/data* folder as described in the documentation on [admin utilities](./docs-admin-utilities.md).

## Configuring the zoomable map
These options are used to tailor the appearance and behaviour of the zoomable map. These are specified as a group of options with the group name *zoom*.
- **height**: specifies the height of the zoomable map in pixels. The width of the zoomable map is always set to fill the available display area. If not specified, a value of 500 is used. Example:
  - `height: 800`

A full example:
```
zoom:
  height: 800
```

Data for the zoomable map are stored in subfolders of the *user/data* folder as described in the documentation on [admin utilities](./docs-admin-utilities.md).

## Configuration common to both map types
These options are used to configure features that are common to both the atlas and zoom maps. These are specified as a group of options with the group name *common*.

- **resolution**: indicates which resolutions to use for the dots. Values can be any combination of 'hectad', 'quadrant', 'tetrad' and 'monad'. If more than one is specified, separate them with spaces. If more that one is specified, then the user is able to select between them using a drop-down selection control. If only one is specified, the control does not appear. Example:
  - `resolution: tetrad monad`
- **dot-shape**: indicates whether or not to offer the user a control to switch between squares and circles and, if not, what the shape should be. Value should be one of 'control' (to display the control to user), 'square' or 'circle'.  If not specified, then 'circle' is used. Example:
  - `dot-shape: square`

A full example:
```
common:
  dot-shape: control
  resolution: hectad quadrant tetrad
```

## Configuring the temporal charts
These options are used to tailor the appearance and behaviour of the temporal charts. These are specified as a group of options with the group name *charts*.
- **aspect-ratio**: a numeric value between 0 and 1 that indicates the height of each chart as a fraction of its width. The width of the charts is always set to fill the available display area. If not specified, a value of 0.5 is used. Example:
  - `aspect-ratio: 0.4`
- **yearly-min**: a year indicating the earliest year to show on the x axis of the *yearly* chart showing record accumulation over time. If not specified, the earliest year present in the data is used. Example:
  - `yearly-min: 1980`
- **yearly-max**: a year indicating the latest year to show on the x axis of the *yearly* chart showing record accumulation over time. If not specified, the latest year present in the data is used. Example:
  - `yearly-max: 2020`
- **include**: indicates which of the charts to show. Values can be *weekly*, *yearly* or *weekly yearly*. If not specified, a value of *weekly yearly* is used and both charts are displayed. Example:
  - `include: weekly yearly`

A full example:
```
charts:
  aspect-ratio: 0.4
  yearly-min: 1980
  yearly-max: 2020
  include: weely yearly
```

Data for the temporal are stored in subfolders of the *user/data* folder as described in the documentation on [admin utilities](./docs-admin-utilities.md).

## Configuring the image gallery
These options are used to tailor the appearance and behaviour of the image gallery. These are specified as a group of options with the group name *gallery*. (No options as yet.)

The available images and their captions are configured separately in a file called *images.txt* which also sits in the *user/config* folder. There is a separate help page with guidance on [setting up an image gallery](./docs-image-gallery.md). The images themselves are placed in the *user/data/images* folder (also described in the [setting up an image gallery](./docs-image-gallery.md) document).

## Configuring the taxon details
These options are used to tailor the appearance and behaviour of the taxon details pages. These are specified as a group of options with the group name *details*. (No options as yet.)

Taxon details are Markdown pages placed in the  *user/data/captions* folder. Each file is named after the identifier used for the taxon in the taxon list file (*TODO - link to taxon list file doc*). The pages can contain any information and be laid out in whatever way you wish. There is an admin utility to generate stub details pages for each of your taxa if you wish to use it (see [documentation on admin utilities](./docs-admin-utilities.md)).

## Example site.txt config file
```
name: Shropshire Earthworm Atlas
header-background-colour: "#EF9766"
header-text-colour: white
header-logo: badge-circle.png
header-logo-height: 80
nav:
  - caption: Info
    page: pages/info.html
  - caption: About
    page: pages/about.md
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
  height: 800
  vc: gb40
  hectad-grid: true
  vc-buffer-west: 10000
  vc-buffer-east: 10000
  vc-buffer-south: 10000
  vc-buffer-north: 10000
zoom:
  height: 800
common:
  default-res: tetrad
charts:
  aspect-ratio: 0.4
  yearly-min: 1980
  yearly-max: 2020
  include: weekly yearly
```

