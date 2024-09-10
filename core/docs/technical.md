# Technical documentation
Documentation intended for coders and contributors to this project. There follow some brief notes that explain some of the technical architecture of the project.

## General architecture
There is no server-side architecture for the project - it runs entirely on the client-side via HTML, CSS and javascript that runs in the user's browser. That makes it possible to implement atlas sites via any internet service provider that can host static files.

There are two main folders in the project: core and user. All of the project software is contained in the *core* folder - administrators are not expected to change the files in this folder. If they do, they may find merge conflicts when they try to update their forked repositories with code changes made by the BRC. On the other hand, the project is open source so it is possible that some people might make changes to this code and raise a merge request (pull request) on the BRC repository. Others may just do so and take their forked project in a new direction without raising a merge request on the original project.

There is actually one core file which is in the root directory rather than the *core* folder - index.html - but this simply redirects to the *core/main.html* file. This is one of four template HTML pages which host the content of the 

There are four HTML template pages that host the content from this site. All are found in *core* folder:


## Require JS
This project uses the Require JS module dependency framework (https://www.tutorialspoint.com/requirejs/)

TODO
- Make a note of how configuration is read in code, e.g. c.get('overview.option') as a shortcut to seeing if the option is set, but once established that it is, it may be accessed by c.overview.option.