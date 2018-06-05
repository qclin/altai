import $ from 'jquery';
import { OBJLoader } from '../public/Loaders/OBJLoader';
import { MTLLoader } from '../public/Loaders/MTLLoader';
import { DDSLoader } from '../public/Loaders/DDSLoader';
import { BokehShader } from '../public/shaders/BokehShader2'
import { CinematicCamera } from '../public/cameras/CinematicCamera';
import GPUComputationRenderer from '../public/GPUComputationRenderer';

import TWEEN from '../public/libs/Tween';
import * as THREE from 'three';
import '../public/CurveExtras';
import config from '../public/config/aws-s3-assets.json'


if (process.env.NODE_ENV == 'production') {
	var assets = {
		terrain: config.bucket + config.terrain.glacier
	}
}else{
	var assets = {
		terrain: '/OBJ/Altai_skp_model_2/'
	}
}


var container, stats;
var camera, scene, renderer;
var mouseX = 0, mouseY = 0;

var windowHalfX = window.innerWidth / 2;
var windowHalfY = window.innerHeight / 2;

var clock = new THREE.Clock();

var isoGons = [];
var particle;
var effectController;


function initScene() {
  scene = new THREE.Scene({alpha:true});

  // scene.background = new THREE.Color( 0xefd1b5 );
	scene.fog = new THREE.FogExp2( 0xffffff, 0.002 );

  camera = new THREE.CinematicCamera( 60, window.innerWidth / window.innerHeight, 1, 1000 );
	camera.setLens( 5 );
	camera.position.set( 2, 1, 500 );

  renderer = new THREE.WebGLRenderer({alpha: true});
  renderer.setSize( window.innerWidth, window.innerHeight );

  document.body.appendChild( renderer.domElement );
  window.addEventListener("resize", resize);

  camera.position.z = 0;

  loadTerrain();
  setCameraParam();

  // PROTO PLANET SECTION
  effectController = {
		// Can be changed dynamically
		gravityConstant: 100.0,
		density: 0.45,
		// Must restart simulation
		radius: 300,
		height: 8,
		exponent: 0.4,
		maxMass: 15.0,
		velocity: 70,
		velocityExponent: 0.2,
		randVelocity: 0.001
	};


  createParticles(); /// HERE is SPRITES particle sys
};


// add icosahedron
setInterval(createIso, 5000);

function createIso(){
  console.log("createIso :::: ", isoGons.length);
  var geometry = new THREE.IcosahedronGeometry( 10 );
  for ( var i = 0; i < geometry.faces.length; i ++ ) {
      var face = geometry.faces[ i ];
      face.color.setHex(colors[0]);
  }

  var mesh = new THREE.Mesh( geometry, new THREE.MeshLambertMaterial( { vertexColors: THREE.FaceColors } ));
  scene.add( mesh );

  isoGons.push(mesh);
}

function createParticles(){

  var material = new THREE.SpriteMaterial( {
  	map: new THREE.CanvasTexture( generateSprite() ),
  	blending: THREE.AdditiveBlending
  } );
  for ( var i = 0; i < 1000; i++ ) {
  	particle = new THREE.Sprite( material );
  	initParticle( particle, i * 10 );
  	scene.add( particle );
  }

}

function initParticle( particle, delay ) {
  var particle = this instanceof THREE.Sprite ? this : particle;
  var delay = delay !== undefined ? delay : 0;
  particle.position.set( 0, 0, 0 );
  particle.scale.x = particle.scale.y = Math.random() * 8 + 2; // * 4 + 16;
  new TWEEN.Tween( particle )
  	.delay( delay )
  	.to( {}, 10000 )
  	.onComplete( initParticle )
  	.start();
  new TWEEN.Tween( particle.position )
  	.delay( delay )
  	.to( { x: Math.random() * 4000 - 2000, y: Math.random() * 1000 - 500, z: Math.random() * 4000 - 2000 }, 100000 )
  	.start();
  new TWEEN.Tween( particle.scale )
  	.delay( delay )
  	.to( { x: 0.01, y: 0.01 }, 10000 )
  	.start();
}

function generateSprite() {
  var canvas = document.createElement( 'canvas' );
  canvas.width = 4;
  canvas.height = 4;
  var context = canvas.getContext( '2d' );
  var gradient = context.createRadialGradient( canvas.width / 2, canvas.height / 2, 0, canvas.width / 2, canvas.height / 2, canvas.width / 2 );
  gradient.addColorStop( 0, 'rgba(255,255,255, .3)' );
  gradient.addColorStop( 0.2, 'rgba(0,255,255,.8)' );
  gradient.addColorStop( 0.4, 'rgba(253,199,255,.8)' );
  gradient.addColorStop( 1, 'rgba(0,0,0,0)' );
  context.fillStyle = gradient;
  context.fillRect( 0, 0, canvas.width, canvas.height );
  return canvas;
}

function setCameraParam(){
  var effectController  = {
    	focalLength: 15,
    	// jsDepthCalculation: true,
    	// shaderFocus: false,
    	//
    	fstop: 2.8,
    	// maxblur: 1.0,
    	//
    	showFocus: false,
    	focalDepth: 3,
    	// manualdof: false,
    	// vignetting: false,
    	// depthblur: false,
    	//
    	// threshold: 0.5,
    	// gain: 2.0,
    	// bias: 0.5,
    	// fringe: 0.7,
    	//
    	// focalLength: 35,
    	// noise: true,
    	// pentagon: false,
    	//
    	// dithering: 0.0001
    };
    var matChanger = function( ) {
    	for ( var e in effectController ) {
    		if ( e in camera.postprocessing.bokeh_uniforms ) {
    			camera.postprocessing.bokeh_uniforms[ e ].value = effectController[ e ];
    		}
    	}
    	camera.postprocessing.bokeh_uniforms[ 'znear' ].value = camera.near;
    	camera.postprocessing.bokeh_uniforms[ 'zfar' ].value = camera.far;
    	camera.setLens( effectController.focalLength, camera.frameHeight, effectController.fstop, camera.coc );
    	effectController[ 'focalDepth' ] = camera.postprocessing.bokeh_uniforms[ 'focalDepth' ].value;
    };
    matChanger();

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
  new THREE.MTLLoader()
  .setPath(assets.terrain).setCrossOrigin(true)
  .load('v1.mtl', function ( materials ) {
    materials.preload();
    new THREE.OBJLoader()
      .setMaterials( materials )
      .setPath(assets.terrain)
      .load('v1.obj', function ( object ) {
        object.position.y = - 95;
        scene.add( object );
      }, onProgress, onError );
  });
}


function initLighting() {
  // so many lights
  var light = new THREE.DirectionalLight( 0xffffff, 0.8 );
  light.position.set( 0, 1, 0 );
  scene.add( light );

  var light = new THREE.DirectionalLight( 0xffffff, 0.5 );
  light.position.set( 0, -1, 0 );
  scene.add( light );
}



// TRANS CRYSTALS
// var colors = [0x05A8AA, 0xB8D5B8, 0xD7B49E, 0xDC602E, 0xBC412B, 0xF19C79, 0xCBDFBD, 0xF6F4D2, 0xD4E09B, 0xFFA8A9, 0xF786AA, 0xA14A76, 0xBC412B, 0x63A375, 0xD57A66, 0x731A33, 0xCBD2DC, 0xDBD48E, 0x5E5E5E, 0xDE89BE];
var colors = [0xFDC7FF, 0xF0F0f0];

var geometry, mesh;
var verticePositions = [];
var angle = 0;
var radius = 100, theta = 0;



var previousShadowMap = false;

function render(time) {
  requestAnimationFrame( render );

  theta += 0.1;
	camera.position.x = radius * Math.sin( THREE.Math.degToRad( theta ) );
	camera.position.y = radius * Math.sin( THREE.Math.degToRad( theta ) );
	camera.position.z = radius * Math.cos( THREE.Math.degToRad( theta ) );
	camera.lookAt( scene.position );
	camera.updateMatrixWorld();

  renderGons();
  TWEEN.update();

  renderer.render( scene, camera );

};

var t = 0;
function renderGons(){
  var time = performance.now() * 0.001;
  t += 0.01; // this will update at every render call
  for( var i = 0; i < isoGons.length; i++){

    // isoGons[i].position.x = (i * 8) +  Math.sin( time * 0.6 ) * 9 + 5*i;
    // isoGons[i].position.y = Math.cos( time * 0.7 ) * 9 + i;
    // isoGons[i].position.z = Math.sin( time * 0.8 ) * 9;

    isoGons[i].rotation.y += 0.03;

    isoGons[i].position.x = 20*Math.cos(t) + 0;
    isoGons[i].position.z = 20*Math.sin(t) + 0;

    isoGons[i].rotation.x = time;
    isoGons[i].rotation.z = time;
    time += 1000000;
  }
}

function resize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize( window.innerWidth, window.innerHeight );
}


initScene();
initLighting();


render();
