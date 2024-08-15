# Minimum Viable Product
This is a description of the minimum functionality required for a useful product - the Minimum Viable Product (MVP).
The MVP will be the first official release of the atlas.

Two types of 'users' are mentioned below: *admins* and *users*. Admins are people who fork this GitHub project 
and configure it to create an atlas website for other people - their users - to use.

## General website configuration
- [x] Config option for admins to set the background colour for the website banner.
- [x] Config option for admins to set the website banner text.
- [x] Config option for admins to set the colour of the website banner text.
- [x] Config option for admins to set set a logo for the website banner.
- [x] Config option to allow admins to add html and/or markdown pages (to be accessed from) a menu displayed on the website banner.

## General functionality
- [x] A taxon selector that enables users to switch between taxa.

## Both overview map and explore map
- [ ] Map resolution selector. Allows  user to switch between different map resolutions: hectad (10 km), quadrant (5 km), tetrad (2 km) or monad (1 km). Config options for admins to specify what resolutions are available. If the admin only specifies one resolution, do not show the resolution selector to users.
- [ ] Config option to allow admins to specify whether atlas dots are shown as circles or squares.
- [ ] Config option to allow admins to specify the colour of atlas dots for standard map display.
- [ ] A map type selector which provides different views of the dot map. Possible map types are: dots coloured to indicate record number; dots coloured to indicate temporal bands (as used on the [iRecord species details map](https://irecord.org.uk/species-details?taxa_taxon_list_id=250358)). Config options for admins to specify what map types are available to users.
- [ ] Other controls - to be displayed conditionally - required for the operation of additional map types (e.g. those for specifying temporal bands).

## Overview map
- [x] A classic atlas overview map.
- [x] Config option for admins to specify the maximum height of the overview map.
- [x] Config option for admins to specify atlas area as a Vice County boundary (Britain or Ireland). These boundaries supplied with the core software.
- [x] Config option for admins to specify whether or not a 10 km grid is to be show with a VC boundary. These grids supplied with the core software.
- [ ] Config options for admins to specify atlas area as a country boundary (Ireland, Northern Ireland, GB and Ireland, GB, Scotland, England, Wales). Currently only GB and Ireland available.
- [x] Config option for admins to specify a buffer around the atlas area boundary.
- [ ] Config option for admins to specify how Channel Islands and Hebrides are displayed for GB and Ireland view.
- [ ] Config option for admins to specify a add-hoc atlas area by uploading a geojson boundary file.
- [ ] Config option for admins to specify a add-hoc atlas grid by uploading a geojson file.
- [ ] Config option for admins to set the colour of land areas.
- [ ] Config option for admins to set the colour of sea areas.
- [ ] Config option for amins to specify a georeferenced raster image to act as a basemap for the atlas overview.
- [ ] A download button to allow users to download an image of the currently displayed overview map. Config options to allow admins to specify whether or not to show this button.

## Zoomable map
- [x] Zoomable map for users to explore the mapped data in more detail.
- [x] Config option for admins to specify whether or not to show the zoomable map.
- [x] Config option for admins to specify the height of the zoomable map.

## Info pages
- [x] Ability for admins to add html or markdown pages for each taxon which will be displayed on *info* tab when user selects taxon.
- [x] Config option for admins to specify whether or not to show the info pages.

## Temporal charts
- [x] A config option for admins to indicate which of the two temporal charts to include.
- [x] A config option for admins to indicate a year range for the *Records by year* chart.
- [x] Config option for admins to specify the height of the temporal charts.
- [x] Config option for admins to specify whether or not to show the temporal charts.

## Gallery
- [x] An image gallery to show images associated with each taxon.
- [x] Config options for admins to specify images and captions and associate with a taxon.
- [x] Config option for admins to specify whether or not to show the gallery.

## Admin utilities
- [x] Utility for admins to generate map files from a CSV of records.
- [x] Utility for admins to generate map files from a CSV of records.
- [x] Utility for admins to generate temporal data files from a CSV of records.
- [x] Utility for admins to generate taxon list from a CSV of records.
- [x] Utility for admins to generate taxon information stubs fro a CSV of records.
- [ ] Utility for admins to generate grid files from imported geojson boundary.
- [ ] Utility for admins to generate generalised boundary files from imported geojson (for potential use with zoomable map at different resolutions).
- [ ] Utility for admins to generate hectad grid from imported geojson boundary file.
- [ ] Utility for admins to check and report potential problems on a CSV of records, e.g. for highlighting invalid GRs or unrecognised date formats.

## Documentation
- [ ] Detailed documentation to take an admin through the process of setting up an atlas website. This will be implemented as a series of readme files in this repository.
- [ ] Technical documentation explaining the architecture of the website - aimed at coders developing or maintaining site functionlity.

## Bugs/issues
- When user moves from Home page to another other configured page and then back again - taxon selection is cleared. Needs to remember and reset taxon selection.
- If the zoomable map is specified as the first tab option, the map is not initially sized correctly.
- If the zoomable map is specified without the overview map option, the software falls over. Best option to fix is to always make the overiew map available.




