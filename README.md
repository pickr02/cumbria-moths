# https://github.com/BiologicalRecordsCentre/brevi-atlas-test

A repository for developing/testing ideas around customisable atlas.

## BRC Recording Schemes Meeting 2024
The main steps to create your own local atlas, hosted on GitHub, from a spreadsheet of biological records are:
1. Fork the BRC GitHub project repository ('repo') into your own GitHub account.
2. Set up 'GitHub pages' on your forked repo.
3. Create, add and edit text configuration files to tailor the look of your website.
4. Add any required resources, eg. a logo image.
5. Use the utility on your new site to convert a spreadsheet of records into the mapping and charting data required by the site.
6. Upload these data to your GitHub repo.
7. Add any further configuration and  files required for your site, taxon images, species accounts, web pages.

Whilst some of these steps were briefly described at the BRC recording schemes meeting, they are not yet documented. The intention is to document them fully here when a first release is nearing completion. At the time of writing (06/03/2024), this 'proof of concept' 
project only contains the most basic functionality. For example there is currently only hectad mapping on a national scale, but a
first proper release will provide facilities to create atlases based on VC boundaries or custom boundaries and provide mapping at 
hectad, quadrant, tetrad and monad scales (conditional on site configuration).

Some links used at the recording schemes meeting:

<ul>
 <li>
      <a target="_blank" href="https://www.fscbiodiversity.uk/fullscreen/springtailatlas">
          FSC Tomorrow's Biodiversity atlases
      </a>
  </li>
  <li>
      <a target="_blank" href="https://www.github.com">
          GitHub platform
      </a>
  </li>
  <li>
      <a target="_blank" href="https://github.com/BiologicalRecordsCentre/brevi-atlas-test">
          BRC brevi-atlas-test repo
      </a>
  </li>
  <li>
      <a target="_blank" href="https://github.com/burkmarr/brevi-atlas-test">
          Burkmar brevi-atlas-test forked repo
      </a>
  </li>
  <li>
      <a target="_blank" href="https://burkmarr.github.io/brevi-atlas-test/">
          Burkmar brevi-atlas-test forked repo - 'GitHub pages' website
      </a>
  </li>
</ul>

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




