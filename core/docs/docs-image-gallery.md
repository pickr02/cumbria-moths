# Configuring gallery images
If you iunclude the gallery tab on your atlas, you will also need to configure the gallery images. This is done in a dedicated configuration file called *images.txt* in the *user/config*, so first create that file. The format in which the configuration options are laid out (described below) is known as YAML (pronounced 'yamel'). YAML files normally have a '.yml' file extension, but this configuration file has the file extension '.txt' to make it easy to open and edit with any text editor.

## General format
Each taxon for which you wish to display images is represented in this file as collection (array). The identifier for the collection matches the taxon identifier as specified in the [taxon list file](*TODO - link to taxon list file doc*). Example:
- `aporrectodea_caliginosa:`

Each image in the collection is represented by three properties: *file*, *thumb* and *caption*.
