
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



#Resources

python shell
https://github.com/extrabacon/python-shell

Webpack DOC

https://stackoverflow.com/questions/42104697/how-to-set-up-web-pack-for-pug-react-and-es6
https://javascriptplayground.com/moving-to-webpack-2/

webpack4 rules
https://stackoverflow.com/questions/49203841/webpack-4-1-1-configuration-module-has-an-unknown-property-loaders
https://github.com/webpack/webpack/issues/3027


REACT with THREE 
https://www.sitepoint.com/building-a-game-reactjs-and-webgl/

for 360

panorama / equirectangular
https://github.com/mrdoob/three.js/blob/master/examples/webgl_panorama_equirectangular.html

for 360 with fish eye
panorama / dualfisheye
https://github.com/mrdoob/three.js/blob/master/examples/textures/ricoh_theta_s.jpg

Webgl Shader

https://github.com/mrdoob/three.js/blob/master/examples/webgl_shader.html
