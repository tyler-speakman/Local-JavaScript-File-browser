Local-JavaScript-File-browser
=============================

Local JavaScript File browser

The purpose of this project is to provide a JavaScript system to view local files from a web browser. This will allow a browser to the basis for local applications (i.e., movie players, audio players, image viewers, etc.). 

Currently Chrome is the target browser because it supports most modern browser capabilities. It also provides a simple way to bypass it's own security. Add the following flag to the Chrome to allow directory listing on your local file system:

"C:\..\chrome.exe" --allow-file-access-from-files

Firefox support is coming via one of the following methods:

http://kb.mozillazine.org/index.php?title=Links_to_local_pages_do_not_work&printable=yes