# Site config options: user/config/site.txt
The file `site.txt` is the main site configuration page which must be created by the site admin and placed in the folder `user/config`. The format in which the configuration options are laid out (described below) is known as YAML (pronounced 'yamel'). YAML files normally have a '.yml' file extension, but this configuration file has the file extension '.txt' to make it easy to open and edit with any text editor.

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
