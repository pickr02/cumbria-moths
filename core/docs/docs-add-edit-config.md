# Using GitHub to add/edit files
To configure your atlas, you add and edit files in the *user* folder of your forked repo. Other pages tell you how to create data files and what to add to configuration files, but this page will tell you how to add them to your repo and edit configuration files in your repo.

Note that when files are added, removed or edited in your GitHub repo, the changes are not instantly propagated to your website. *It can take a few minutes for changes to your repo to be reflected on your linked GitHub pages website.*

## Adding a configuration file
There are two ways of creating a new file in your repo:

1. Create it first on your computer and then upload it.
2. Create it directly in the repo.

### Creating first and then uploading
To use the first method, first create a configuration file, e.g. *site.txt* on your own computer and, optionally, edit it with a plain text editor (e.g. Notepad on Windows) to include some configuration options.

Next, navigate to the place where you wish to upload the file in your GitHub repo. For the *site.txt* folder, this will be the *user/config* folder - simply click on the *user* folder from the homepage of your GitHub repo and then click again on the *config* folder: that opens the *config* folder. You will see a button near the top right of the page like this:

![GitHub add button](./images/add-button.png)

When you click that button, you will see two options: *Create a new file* and *Upload files*. Click on *Upload files*. An upload page appears where you can either drag your new file to or, by clicking on the *Choose your files* link, select your file with the file system select dialog.

Your file won't actually be added to the repo until you hit the 'Commit changes' button. If you have not used a versioning repository tool like GitHub before, then this step will be unfamiliar to you. It's what allows GitHub to track changes to files and, if necessary, revert changes at a later date. 

You can usually just keep the default commit message - *Add files via upload* - but you may wish to add a more descriptive message and, optionally a full description of the addition or changes you've made. For our purposes, keeping the default is okay and it certainly speeds things up a bit.

### Creating directly in GitHub
To use the second method, navigate to the folder as before, but click the *Create new file* option after you've clicked the *Add file* button. You will see something like this:

![Add file page](./images/add-file-page.png)

In the *Name your file* box, enter the name of the file you wish to create, e.g. *site.txt*, and optionally add some text to the body of the file (where it says *Etner file contents here*). Then click the green *Commit changes...* button. You will see a commit dialog appear. As with the previous method you can added a commit message and/or description or just accept the default commit message before clicking the green *Commit changes* button.

## Editing a file
To edit a file, e.g. a configuration file like *site.txt*, navigate to the folder that contains the file and then click on the file name (which will show as a blue link when your mouse moves over it). Now on the right near the top of the screen you will see a set of buttons like this:

![Edit buttons](./images/edit-buttons.png)

## Adding other resources

## Deleting config files and resources

# Using Git
If you are a seasoned user of Git, it will likely be much more convenient for you to update your repo by using the Git command line rather than the GitHub interface. This can also overcome GitHub's limit on the number of files that can be uploaded in one go.

If you are not a Git user but would like to learn how to use it to modify and upload files in your repo rather than using the Git interface, then this section will give you some useful information and guidance on learning how to do that. But note that this is enirely optional - it is possible to manage your website entirely through the GitHub interface without using the Git command line.

TODO - instructions