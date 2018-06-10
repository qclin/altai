import * as THREE from 'three';
import { OBJLoader } from '../public/Loaders/OBJLoader';
import { MTLLoader } from '../public/Loaders/MTLLoader';
import { DDSLoader } from '../public/Loaders/DDSLoader';
import { OrbitControls } from '../public/Controls/OrbitControls'
import { FBXLoader } from '../public/Loaders/FBXLoader';


import { EffectComposer } from '../public/postprocessing/EffectComposer';
import { RenderPass } from '../public/postprocessing/RenderPass';
import { ShaderPass } from '../public/postprocessing/ShaderPass';
import { FilmPass } from '../public/postprocessing/FilmPass';
import { TexturePass } from '../public/postprocessing/TexturePass';
import { GlitchPass } from '../public/postprocessing/GlitchPass';

import { CopyShader } from '../public/shaders/CopyShader';
import { FilmShader } from '../public/shaders/FilmShader';
import { VignetteShader } from '../public/shaders/VignetteShader';
import { BleachBypassShader } from '../public/shaders/BleachBypassShader';

import '../public/lights/RectAreaLightUniformsLib.js'
import Vector from './vector'
import config from '../public/config/aws-s3-assets.json'
import './subtitle';
// import '../public/src/download';
// import '../public/src/CCapture';
// import './screen_grab';

// webpack doesn't work with process.env
// if (process.env.NODE_ENV == 'production') {
	var assets = {
		smoke: config.bucket + config.texture.smoke,
		// agent: config.bucket + config.agent.couple,
		agent: config.bucket + config.agent.recognition,
		agent2: config.bucket + config.agent.couple,
		terrain: config.bucket + config.terrain.tundra
	}
// }else{
// 	var assets = {
// 		smoke: '/textures/Smoke-Element.png',
// 		agent: '/OBJ/Agents/couple/',
// 		terrain: '/OBJ/Tundra/'
// 	}
// }

// var capturer = new CCapture( {
//   verbose: true,
//   framerate: 60,
//   motionBlurFrames: 16,
//   quality: 90,
//   name: 'screen_grab_couple_recognition',
//   format: "webm",
//   // workersPath: 'js/',
//   onProgress: function( p ) { progress.style.width = ( p * 100 ) + '%' }
// } );





var camera, scene, renderer, composer;
var object, light, controls;

var couple, couple2, depMat;
var flower;
// rect light
var clock = new THREE.Clock();
var origin = new THREE.Vector3();
var rectLight;
// helpers
var fnh, vnh;

var glitchPass;
var effectFilmBW;

var pointLight, pointLight2;

var mixers = [];


function updateOptions() {
	var wildGlitch = document.getElementById('wildGlitch');
	glitchPass.goWild=wildGlitch.checked;
}


/// LOREnz attractors Initializer  -----------------------------
var LORgeometry, LORmaterial;
var LORENZ_POS_INITIAL = new Vector(rand(10), rand(10), rand(10)),
		LORENZ_SIGMA = 10,
		LORENZ_RHO = 48,  // Increase SIZE HERE ?
		LORENZ_BETA = 8 / 3,
		LORENZ_DELTA = 0.001;

var pos = LORENZ_POS_INITIAL,
		oldPos = pos,
		elapsedTime = 0;

var lorenzSystem = function (pos, sigma, rho, beta) {
		var x = sigma * (pos.y - pos.x),
				y = pos.x * (rho - pos.z) - pos.y,
				z = pos.x * pos.y - (beta * pos.z);
		return new Vector(x, y, z);
};

var nextPoint = function (x) {
		return lorenzSystem(x, LORENZ_SIGMA, LORENZ_RHO, LORENZ_BETA);
};

function rand(n) {
		return Math.floor(Math.random() * n) + 1;
}

function colorScale(n) {
		// Cheesy math to change the material color
		return Math.abs(n)/40;
}

//// ----------------------------------------------------------

var canvas;

init();
animate();
function init() {

	renderer = new THREE.WebGLRenderer({antialias:true, alpha:true});
	renderer.setPixelRatio( window.devicePixelRatio );
	renderer.setSize( 1920, 1080 );
  // here for lights
  renderer.shadowMap.enabled = true;
	renderer.shadowMap.type = THREE.PCFSoftShadowMap;
	renderer.gammaInput = true;
	renderer.gammaOutput = true;

	// renderer.autoClear = false;
  // renderer.setClearColor(0x000000, 0.0);

	document.body.appendChild( renderer.domElement );

	canvas = renderer.domElement;

	//camera
	camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 1, 1000 );
  // camera.position.x = -332.9952324747626
  camera.position.x = -400
  camera.position.y = 2.20391003375047
  camera.position.z = -139.23943796197457
	 /// DOES THIS LOOK AT LORENZ?
  camera.lookAt(new THREE.Vector3(0, 0, 0));


	scene = new THREE.Scene();
	// scene.background = new THREE.Color( 0xeb6d9d );
	// scene.fog = new THREE.FogExp2( 0xefd1b5, 0.0025 );
	// scene.fog = new THREE.Fog( 0xffffff, 1, 10000 );
	object = new THREE.Object3D();
	scene.add( object );

  // geometry TO REPLACE
	var geometry = new THREE.SphereBufferGeometry( 1, 4, 4 );
	// var material = new THREE.MeshPhongMaterial( { color: 0xffffff, flatShading: true } );
  var material = new THREE.MeshStandardMaterial( { color: 0xA00000, roughness: 0, metalness: 0 } );

	// for ( var i = 0; i < 2; i ++ ) {
	// 	var mesh = new THREE.Mesh( geometry, material );
	// 	mesh.position.set( Math.random() - 0.5, Math.random() - 0.5, Math.random() - 0.5 ).normalize();
	// 	mesh.position.multiplyScalar( Math.random() * 100 );
	// 	mesh.rotation.set( Math.random() * 2, Math.random() * 2, Math.random() * 2 );
	// 	mesh.scale.x = mesh.scale.y = mesh.scale.z = Math.random() * 20 + 5;
  //   console.log(mesh.position, mesh.scale)
  //   /// here's for the lights
  //   mesh.castShadow = true;
	// 	mesh.receiveShadow = true;
	// 	object.add( mesh );
	// }

  // light
	scene.add( new THREE.AmbientLight( 0xffffff ) );
	light = new THREE.DirectionalLight( 0xffffff );
	light.position.set( 1, 1, 1 );
	scene.add( light );
  var ambientLight = new THREE.AmbientLight( 0xcccccc, 0.4 );
	scene.add( ambientLight );

  loadRectLight();
  // loadHelperLight();
  loadTerrain();
  addEffects();
	addSmoke();

	initLorenz();
	loadPointLight();
  loadControl();
	loadFlower();
  loadAgent2();

	// window.addEventListener( 'resize', onWindowResize, false );
  // document.addEventListener( 'mousemove', onDocumentMouseMove, false );
  // document.addEventListener( 'click', onDocumentMouseClick, false );
	// loadFbxAgnet();

	// capturer.start();
}

// function loadFbxAgnet(){
// 	// model
// 	var loader = new THREE.FBXLoader();
// 	loader.load( '/OBJ/Agents/Sensor/sensor_txt.fbx', function ( object ) {
// 		object.mixer = new THREE.AnimationMixer( object );
// 		mixers.push( object.mixer );
// 		var action = object.mixer.clipAction( object.animations[ 0 ] );
// 		action.play();
// 		console.log( " mixxeerrr----- ", object.mixer, object.animations, action);
// 		object.traverse( function ( child ) {
// 			if ( child.isMesh ) {
// 				child.castShadow = true;
// 				child.receiveShadow = true;
// 			}
// 		} );
// 		scene.add( object );
// 	} );
// }



var smokeParticles;

function addSmoke(){

	var loader = new THREE.TextureLoader();
	loader.crossOrigin = '';
	THREE.ImageUtils.crossOrigin = 'anonymous'; //Need this to pull in crossdomain images from AWS
	// var smokeTexture = THREE.ImageUtils.loadTexture(texture.smoke);
	var smokeTexture = loader.load(assets.smoke);
	var smokeMaterial = new THREE.MeshLambertMaterial({color: 0xF5e3e6, map: smokeTexture, transparent: true, opacity: 0.5});
	smokeMaterial.side = THREE.DoubleSide;

	smokeParticles = [];


	for (var p = 0; p < 150; p++) {
		var unit = Math.random()*500-300
			var smokeGeo = new THREE.PlaneGeometry(unit, unit);

			var particle = new THREE.Mesh(smokeGeo,smokeMaterial);
			particle.position.set(Math.random()*500-250, Math.random()*500-50, Math.random()*1500-100);
			// particle.rotation.z = Math.random() * 360;
			scene.add(particle);
			smokeParticles.push(particle);
	}
}

function loadPointLight(){
  pointLight = createLight( 0x0088ff );
  scene.add( pointLight );
  pointLight2 = createLight( 0xff8888 );
  scene.add( pointLight2 );
}

function initLorenz(){
	// Material will be lines connecting each point of the lorenz system
	LORmaterial = new THREE.LineBasicMaterial({
			linewidth: 50,
			color: 0x000000
	});

	LORgeometry = new THREE.Geometry();
	LORgeometry.dynamic = true;
}

var oldPointPosition;
// lights
function createLight( color ) {
	var intensity = 1.5;
	var pointLight = new THREE.PointLight( color, intensity, 20 );
	pointLight.castShadow = true;
	pointLight.shadow.camera.near = 1;
	pointLight.shadow.camera.far = 60;
	pointLight.shadow.bias = - 0.005; // reduces self-shadowing on double-sided objects

	oldPointPosition = pointLight.position;

  var radius = Math.random() * 10;
	var geometry = new THREE.SphereBufferGeometry( radius, 12, 6 );
	var material = new THREE.MeshBasicMaterial( { color: color } );
	material.color.multiplyScalar( intensity );
	var sphere = new THREE.Mesh( geometry, material );
	pointLight.add( sphere );
	var texture = new THREE.CanvasTexture( generateTexture() );
	texture.magFilter = THREE.NearestFilter;
	texture.wrapT = THREE.RepeatWrapping;
	texture.wrapS = THREE.RepeatWrapping;
	texture.repeat.set( 1, 3.5 );

  var radius = Math.random() * 50;
	var geometry = new THREE.SphereBufferGeometry( radius, 32, 8 );
	var material = new THREE.MeshPhongMaterial( {
		side: THREE.DoubleSide,
		alphaMap: texture,
		alphaTest: 0.5
	} );
	var sphere = new THREE.Mesh( geometry, material );
	sphere.castShadow = true;
	sphere.receiveShadow = true;
	pointLight.add( sphere );
	// custom distance material
	var distanceMaterial = new THREE.MeshDistanceMaterial( {
		alphaMap: material.alphaMap,
		alphaTest: material.alphaTest
	} );
	sphere.customDistanceMaterial = distanceMaterial;
	return pointLight;
}

function generateTexture() {
	var canvas = document.createElement( 'canvas' );
	canvas.width = 2;
	canvas.height = 2;
	var context = canvas.getContext( '2d' );
	context.fillStyle = 'white';
	context.fillRect( 0, 1, 2, 1 );
	return canvas;
}

function loadAgent2(){
  var onProgress = function ( xhr ) {
    if ( xhr.lengthComputable ) {
      var percentComplete = xhr.loaded / xhr.total * 100;
      console.log( Math.round( percentComplete, 2 ) + '% downloaded' );
		}
  };
  var onError = function ( xhr ) { };
  THREE.Loader.Handlers.add( /\.dds$/i, new THREE.DDSLoader() );
	new THREE.MTLLoader().setPath(assets.agent2).setCrossOrigin(true)
	.load('Couple_1.mtl', function ( materials ) {
	    materials.preload();
  new THREE.OBJLoader().setPath(assets.agent2).setMaterials( materials )
    .load('Couple_1.obj', function ( object ) {
			//
			// var s =  (Math.random() * 5) + 2;
			var s = 1.2
			object.scale.set( s, s, s );
			object.castShadow = true;
			object.receiveShadow = true;
			couple = object.clone();
      scene.add( couple );


    }, onProgress, onError ); });

		new THREE.MTLLoader().setPath(assets.agent2).setCrossOrigin(true)
		.load('Couple_2.mtl', function ( materials ) {
		    materials.preload();
	  new THREE.OBJLoader().setPath(assets.agent2).setMaterials( materials )
	    .load('Couple_2.obj', function ( object ) {
				//
				// var s =  (Math.random() * 5) + 2;
				var s = 1.2
				object.scale.set( s, s, s );
				object.castShadow = true;
				object.receiveShadow = true;
				//

				couple2 = object.clone();
	      scene.add( couple2 );

	    }, onProgress, onError ); });

}



function loadFlower(){
  var onProgress = function ( xhr ) {
    if ( xhr.lengthComputable ) {
      var percentComplete = xhr.loaded / xhr.total * 100;
      console.log( Math.round( percentComplete, 2 ) + '% downloaded' );
		}
  };
  var onError = function ( xhr ) { };
  THREE.Loader.Handlers.add( /\.dds$/i, new THREE.DDSLoader() );
	new THREE.MTLLoader().setPath(assets.agent).setCrossOrigin(true)
	.load('Recognition.mtl', function ( materials ) {
	    materials.preload();
  new THREE.OBJLoader().setPath(assets.agent).setMaterials( materials )
    .load('Recognition.obj', function ( object ) {

			var s =  2;
			object.scale.set( s, s, s );
			object.castShadow = true;
			object.receiveShadow = true;

			flower = object.clone();
			flower.position.x -= 225;
			flower.position.y -= 75;
			flower.position.z -= 70;
			flower.position.multiplyScalar( -1);
      scene.add( flower );

    }, onProgress, onError ); });

}

function loadRectLight(){

  rectLight = new THREE.RectAreaLight( 0xffffff, 1, 100, 100 );
  rectLight.position.set( 500, 500, 0 );
  scene.add( rectLight );
  var rectLightMesh = new THREE.Mesh( new THREE.PlaneBufferGeometry(), new THREE.MeshBasicMaterial() );
  rectLightMesh.scale.x = rectLight.width;
  rectLightMesh.scale.y = rectLight.height;
  rectLight.add( rectLightMesh );
  var rectLightMeshBack = new THREE.Mesh( new THREE.PlaneBufferGeometry(), new THREE.MeshBasicMaterial( { color: 0x080808 } ) );

  rectLightMeshBack.rotation.y = Math.PI;
  rectLightMesh.add( rectLightMeshBack );
}

function loadHelperLight(){
  light = new THREE.PointLight();
	light.position.set( 200, 100, 150 );
	scene.add( light );
	scene.add( new THREE.PointLightHelper( light, 15 ) );
}


function loadTerrain(){

  var onProgress = function ( xhr ) {
    if ( xhr.lengthComputable ) {
      var percentComplete = xhr.loaded / xhr.total * 100;
      console.log( Math.round( percentComplete, 2 ) + '% downloaded' );
    }
  };
  var onError = function ( xhr ) { };
  THREE.Loader.Handlers.add( /\.dds$/i, new THREE.DDSLoader() );
  new THREE.MTLLoader().setPath(assets.terrain).setCrossOrigin(true)
  .load('Tundra_9.mtl', function ( materials ) {
    materials.preload();
    new THREE.OBJLoader()
      .setMaterials( materials )
      .setPath(assets.terrain)
      .load('Tundra_9.obj', function ( object ) {
				// initial camera view
        camera.rotation.x = -3.141592653589793
        camera.rotation.y = -0.5147038250471647
        camera.rotation.z = -3.1269909777467713

        scene.add( object );
      }, onProgress, onError );
  });

	new THREE.MTLLoader().setPath(assets.terrain).setCrossOrigin(true)
  .load('Tundra_10.mtl', function ( materials ) {
    materials.preload();
    new THREE.OBJLoader()
      .setMaterials( materials )
      .setPath(assets.terrain)
      .load('Tundra_10.obj', function ( object ) {
        scene.add( object );
      }, onProgress, onError );
  });
}

function loadControl(){
  // controls
  controls = new THREE.OrbitControls( camera, renderer.domElement );
  //controls.addEventListener( 'change', render ); // call this only in static scenes (i.e., if there is no animation loop)
  controls.enableDamping = true; // an animation loop is required when either damping or auto-rotation are enabled
  controls.dampingFactor = 0.25;
  controls.screenSpacePanning = false;
  controls.minDistance = 0;
  controls.maxDistance = 1000
  controls.maxPolarAngle = Math.PI / 2;
}
function addEffects(){
  var effectFilm = new THREE.FilmPass( 0.35, 0.025, 648, false );
	effectFilmBW = new THREE.FilmPass( 0.35, 0.5, 2048, true );
  var shaderVignette = THREE.VignetteShader;
  var effectVignette = new THREE.ShaderPass( shaderVignette );

  effectVignette.uniforms[ "offset" ].value = 0.1;
  effectVignette.uniforms[ "darkness" ].value = 0.1;
  effectVignette.renderToScreen = true;
  // postprocessing
  composer = new THREE.EffectComposer( renderer );

  composer.addPass( new THREE.RenderPass( scene, camera ) );

	// composer.addPass(effectFilmBW); /// NEEDS TIMING

  var effect = new THREE.ShaderPass( THREE.BleachBypassShader );
  effect.uniforms[ "opacity" ].value = 0.1;
  composer.addPass( effect );

  var effect = new THREE.ShaderPass( THREE.VignetteShader );
  effect.uniforms[ "offset" ].value = 0.1;
  effect.uniforms[ "darkness" ].value = 0.1;
  effect.renderToScreen = true;
  composer.addPass( effect );
}
// function onWindowResize() {
// 	camera.aspect = window.innerWidth / window.innerHeight;
// 	camera.updateProjectionMatrix();
// 	renderer.setSize( window.innerWidth, window.innerHeight );
// 	composer.setSize( window.innerWidth, window.innerHeight );
// }
// function onDocumentMouseMove( event ) {
//   console.log(':::: CAMERA POSITON:::: ', camera.rotation, camera);
// }


function animate() {
	requestAnimationFrame( animate );
	moveCamera();
  moveRectLight();
	drawLorenz();
	movePointLights()
	evolvecouple();
	composer.render();
	evolveSmoke();

	if ( mixers.length > 0 ) {
		for ( var i = 0; i < mixers.length; i ++ ) {
			mixers[ i ].update( clock.getDelta() );
		}
	}
	// capturer.capture( canvas );
	var delta = clock.getDelta();
	if(flower){

		flower.rotation.y += 0.001;

	}

}

//
// function saveVideo(){
// 	console.log(" SAVEVIDEO ---- ", capturer)
// 	// capturer.stop();
//
// 	// default save, will download automatically a file called {name}.extension (webm/gif/tar)
// 	capturer.save();
// }

function evolveSmoke() {
	var delta = clock.getDelta();
  var sp = smokeParticles.length;
  while(sp--) {
      smokeParticles[sp].rotation.x += (delta * 0.02);
  }
}

var goLeft = true;
var goRight = false;
var multiplier = 0;

// setTimeout(function(){
// 	composer.render();
// 	console.log("here add pass here ");
// }, 3000);

function moveCamera() {
	if(goLeft){
		if(camera.position.x < 200 ){
			camera.position.x += .1 + multiplier;
		}else{
			//stop moving & rotate
			camera.rotation.y += .01

			if(camera.rotation.y > 0 ){
				camera.rotation.y = 0;
				goRight = true; goLeft = false;
				multiplier += .1;
			}
		}
	}
	if(goRight){
		if(camera.position.x > -400 ){
			camera.position.x -= .1 + multiplier;
		}else{
			//stop moving & rotate
			camera.rotation.y -= .01
			if(camera.rotation.y < - 1 ){
				camera.rotation.y = 0;
				goRight = false; goLeft = true;
				multiplier += .1;
			}
		}
	}
}

function drawLorenz(){
	oldPos = pos;
	// Vector.rk4 uses Runge-Kutta method
	pos = pos.rk4(LORENZ_DELTA, nextPoint);
	elapsedTime += LORENZ_DELTA;

	var geo = new THREE.Geometry();
	geo.vertices.push(new THREE.Vector3(oldPos.x, oldPos.y, oldPos.z));
	geo.vertices.push(new THREE.Vector3(pos.x, pos.y, pos.z));
	var col = new THREE.Color(colorScale(pos.x), colorScale(pos.y), colorScale(pos.z));
	LORmaterial.color = col;
	var line = new THREE.Line(geo, LORmaterial);
	scene.add(line);
}

function evolvecouple(){
	if(couple){ /// lol so dirty overhere
		couple.position.x = pos.x
		couple.position.y = pos.y
		couple.position.z = pos.z

		couple.rotation.x += 0.005;
		couple.rotation.y += 0.01;
	}
		var t = ( Date.now() / 8000 );
	if(couple2){ /// lol so dirty overhere
		couple2.position.x = pos.x * Math.cos( t );
		couple2.position.y = pos.y * Math.sin( t );
		couple2.position.z = pos.z * 2

		couple2.rotation.x += 0.003;
		couple2.rotation.y += 0.001;
	}

}

function moveRectLight(){
  // if ( param.motion ) {
		var t = ( Date.now() / 8000 );
		// move light in circle around center
		// change light height with sine curve
		var r = 400.0;
		var lx = r * Math.cos( t );
		var lz = r * Math.sin( t );
		var ly = 78.0 + 50.0 * Math.sin( t / 3.0 );
		rectLight.position.set( lx, ly, lz );
		rectLight.lookAt( origin );
	// }
}

function movePointLights(){
  var time = performance.now() * 0.001;
	oldPointPosition.copy(pointLight.position)
	// pointLight.position.x = Math.sin( time * 0.6 ) * 90;
	// pointLight.position.y = Math.sin( time * 0.7 ) * 90 + 5;
	// pointLight.position.z = Math.sin( time * 0.8 ) * 90;
	//
	// pointLight.position.x = pos.x
	// pointLight.position.y = pos.y
	// pointLight.position.z = pos.z
	pointLight.position.x = object.x
	pointLight.position.y = object.y
	pointLight.position.z = object.z



	var geo = new THREE.Geometry();
	geo.vertices.push(new THREE.Vector3(oldPointPosition.x, oldPointPosition.y, oldPointPosition.z));
	geo.vertices.push(pointLight.position);


	var col = new THREE.Color(colorScale(pos.x), colorScale(pos.y), colorScale(pos.z));
	LORmaterial.color = col;

	var line = new THREE.Line(geo, LORmaterial);
	scene.add(line);

	pointLight.rotation.x = time;
	pointLight.rotation.z = time;

	time += 10000;

	// // change to pos.x, pos.y, pos.z for position
	// pointLight2.position.x = Math.sin( time * 0.6 ) * 90;
	// pointLight2.position.y = Math.sin( time * 0.7 ) * 90 + 5;
	// pointLight2.position.z = Math.sin( time * 0.8 ) * 90;
	// pointLight2.rotation.x = time;
	// pointLight2.rotation.z = time;
}
