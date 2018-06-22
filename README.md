
##How to start

**1. Install dependencies**
`npm install` *run once*

**2. Build bundle script**
`npm run build` *run whenever you pull code*

**3. Run Server**
`npm run start`


## How to load model (for Daria)

**Locally, add to assets**

add obj to `assets/OBJ/` directory
change the url of the model in the .js file to the project path
`ctrl+shift+F` to look for either MTLLoader, OBJLoader or "// ** CHANGE Parameter HERE"  


## How to add Three JS Sketches (for Paul)
**1. Import**
 - Download sketch in the same directory as Main.js
 - Add `import * as THREE from 'three';` on the top of the file
 - Download sketch dependencies inside `public/` where all the Three utilities are, see Control/, Effects/, Loaders/
 - ALSO Add `import * as THREE from 'three';` on the top of the dependency files

#NOTES FOR DEPLOYMENT

### NLP SETTING
`export LC_ALL=en_US.UTF-8`
`export LANG=en_US.UTF-8`


## MAKE SURE ALL OBJ MATERIAL IS LINKED
`assets/OBJ/Prairie_Rhino/HIGH~HZ5.JPGZ`



##### DEPLOYMENT SETTINGS

Python need NTKL
Spacy, export utc etc.

# coding: utf-8
#if doesn't work in terminal, type following commands
#export LC_ALL=en_US.UTF-8
#export LANG=en_US.UTF-8


pip install pattern
pip install -U nltk
pip install -U numpy

download Wordnet for nltk
http://www.nltk.org/data.html


update AJAX from localhost to Amazon


FS recursive walk thru for the assets
https://stackoverflow.com/questions/2727167/how-do-you-get-a-list-of-the-names-of-all-files-present-in-a-directory-in-node-j



https://forum.processing.org/two/discussion/17332/using-instance-mode-to-create-multiple-sketches-on-the-same-page
