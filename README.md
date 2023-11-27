# brevi-atlas-test
A test repo for developing/testing ideas around customisable atlas (Rich Burkmar).

## TODO
- Utilities
  - Create blank information pages (md or html) for all taxa (sample headers and text)
  - Generate temporal chart data files
  - Generate grid files from imported geojson boundary
  - Generate generalised boundary files from imported geojson - for potential use with leaflet
  - Records CSV record check and report, e.g. for highlighting invalid GRs or unrecognised date formats
  - Generate record summary data files for use with explore map
- Temporal charts
  - Generate the data and change on species selection
  - Config to say which of the two, or both, charts to include
  - Config the height of the charts
  - Config the year range (or none to extract from the data)
- Gallery
- Combined map controls
  - Map res selector (Hectad, quadrant, tetrad, monad - config)
  - Squares/circles (config)
  - Map type selector (config)
    - Plain dots
    - Record density
    - Temporal bands (like iRecord species page)
- Explore map
  - Update brc-atlas library to deal with user-specified boundaries
  - Option to display actual records (needs config switch)
- Overview map
- Config options for static map
  - Insets
  - Background colour
  - Boundary spec - UK, countries, VCs should able to be named
  - Boundary spec - should be able to specify a geojson boundary file


