# brevi-atlas-test
A test repo for developing/testing ideas around customisable atlas.

## TODO
- **Map controls**. Add user controls (will apply to both overview and explore maps) with associated config options:
  - Map resolution selector (Hectad, quadrant, tetrad, monad) plus config option to specify which of these is available.
  - Add config option to specify either squares, circles or a user control to allow switching between.
  - Map type selector  plus config to specify which of the available map types will be selectable. Possible map types include:
    - Plain dots single colour (plus config options to specify colour and opacity).
    - Coloured to show record density.
    - Temporal bands - as per the iRecord species page - plus the addition user controls required for that.
    - Actual record display (explore map only).

- **Overview map config options**. Add further configuration options for overview map:
  - Config to specify display of Channel Islands and Northern Ilses.
  - Config for background colour.

- **Geographical areas**. Add configuration and functionality to configuraion of goegraphical areas for local atlases:
  - Config option to specify a particular VC or country. Boundaries, grids and backgrounds for these areas will be pre-included.
  - Config option to specify a add-hoc atlas area e.g. by uploading a geojson boundary file and specifying it in config.

- **Temporal charts**.
  - Add config option to say which of the two, or both, charts to include.
  - Add config option to specify the year range (or none to derive dynamically from data).

- **Gallery**.
  - Sort out probelm with caption display.

- **Admin utilities**. Add new admin utilities:
  - Generate grid files from imported geojson boundary.
  - Generate generalised boundary files from imported geojson - for potential use with leaflet.
  - Generated grids from imported geojson boundary file.
  - Records CSV record check and report, e.g. for highlighting invalid GRs or unrecognised date formats.
  - Option to generate raw record data file so that actual records (as opposed to altas aggregations) can be viewed on explore map.

  **General**
    - When user moves from Home page to another other configured page and then back again - taxon selection is cleared. Needs to remember and reset taxon selection.




