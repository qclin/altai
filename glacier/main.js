import $ from 'jquery';
import { OBJLoader } from '../public/Loaders/OBJLoader';
import { MTLLoader } from '../public/Loaders/MTLLoader';
import { DDSLoader } from '../public/Loaders/DDSLoader';
import { BokehShader } from '../public/shaders/BokehShader2'
import { CinematicCamera } from '../public/cameras/CinematicCamera.js';

import * as THREE from 'three';
import '../public/CurveExtras';


var container, stats;
var camera, scene, renderer;
var mouseX = 0, mouseY = 0;
var windowHalfX = window.innerWidth / 2;
var windowHalfY = window.innerHeight / 2;

// TRANS CRYSTALS
var colors = [0x05A8AA, 0xB8D5B8, 0xD7B49E, 0xDC602E, 0xBC412B, 0xF19C79, 0xCBDFBD, 0xF6F4D2, 0xD4E09B, 0xFFA8A9, 0xF786AA, 0xA14A76, 0xBC412B, 0x63A375, 0xD57A66, 0x731A33, 0xCBD2DC, 0xDBD48E, 0x5E5E5E, 0xDE89BE];
var geometry, mesh;
var verticePositions = [];
var angle = 0;
var radius = 100, theta = 0;


function initScene() {
  scene = new THREE.Scene();


  //// FAILED cinematic camera failed
  // camera = new THREE.CinematicCamera( 60, window.innerWidth / window.innerHeight, 1, 1000 );
	// camera.setLens( 5 );
	// camera.position.set( 2, 1, 500 );
  // setCameraParam();

  var aspect = window.innerWidth / window.innerHeight;
  camera = new THREE.OrthographicCamera( frustumSize * aspect / - 2, frustumSize * aspect / 2, frustumSize / 2, frustumSize / - 2, 1, 2000 );
  camera.position.y = 400;

  renderer = new THREE.WebGLRenderer({alpha: true});
  renderer.setSize( window.innerWidth, window.innerHeight );

  document.body.appendChild( renderer.domElement );
  camera.position.z = 0;
  loadTerrain();
};


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
  .setPath('/OBJ/Altai_skp_model_2/')
  .load('v1.mtl', function ( materials ) {
    materials.preload();
    new THREE.OBJLoader()
      .setMaterials( materials )
      .setPath('/OBJ/Altai_skp_model_2/')
      .load('v1.obj', function ( object ) {
        object.position.y = - 95;
        scene.add( object );
      }, onProgress, onError );
  });
}


function initLighting() {
  // so many lights
  var light = new THREE.DirectionalLight( 0xffffff, 1 );
  light.position.set( 0, 1, 0 );
  scene.add( light );

  var light = new THREE.DirectionalLight( 0xffffff, 0.5 );
  light.position.set( 0, -1, 0 );
  scene.add( light );

  var light = new THREE.DirectionalLight( 0xffffff, 1 );
  light.position.set( 1, 0, 0 );
  scene.add( light );

  var light = new THREE.DirectionalLight( 0xffffff, 0.5 );
  light.position.set( 0, 0, 1 );
  scene.add( light );
}

function initGeometry() {
  // add icosahedron
  geometry = new THREE.IcosahedronGeometry( 20 );
  for ( var i = 0; i < geometry.faces.length; i ++ ) {
      var face = geometry.faces[ i ];
      face.color.setHex(colors[i]);
  }

  mesh = new THREE.Mesh( geometry, new THREE.MeshLambertMaterial( { vertexColors: THREE.FaceColors } ));
  scene.add( mesh );
}

function render(time) {
  requestAnimationFrame( render );

  theta += 0.1;
	camera.position.x = radius * Math.sin( THREE.Math.degToRad( theta ) );
	camera.position.y = radius * Math.sin( THREE.Math.degToRad( theta ) );
	camera.position.z = radius * Math.cos( THREE.Math.degToRad( theta ) );
	camera.lookAt( scene.position );
	camera.updateMatrixWorld();



  renderer.render(scene, camera);
  geometry.verticesNeedUpdate = true;
  updateCamPosition();
};

function getOriginalVerticePositions() {
  for (var i = 0, l = geometry.vertices.length; i<l; i++) {
    verticePositions.push({x: geometry.vertices[i].x, y: geometry.vertices[i].y});
  }
}

function getNewVertices() {
  var newVertices = [];
  for (var i = 0, l = geometry.vertices.length; i<l; i++) {
    newVertices[i] = {
      x: verticePositions[i].x -5 + Math.random()*10,
      y: verticePositions[i].y -5 + Math.random()*10
    }
  }
  return newVertices;
}

function tweenIcosohedron() {
  var rotation = {x: Math.random()*3, y: Math.random()*3, z: Math.random()*3};
  TweenLite.to(mesh.rotation, 1, {x: rotation.x, y: rotation.y, z: rotation.z,
    ease: Back.easeInOut, onComplete: tweenIcosohedron});
  var newVerticePositions = getNewVertices();
  for (var i = 0; i < geometry.vertices.length; i++) {
    tweenVertice(i, newVerticePositions);
  }
}

function tweenVertice(i, newVerticePositions) {
  TweenLite.to(geometry.vertices[i], 1, {x: newVerticePositions[i].x, y: newVerticePositions[i].y, ease: Back.easeInOut});
}

function resize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize( window.innerWidth, window.innerHeight );
}

function updateCamPosition() {
	 angle = 0
  //angle -= 0.0005;
  var z = 250 * Math.cos(angle);
  var y = 100 * Math.sin(angle);

  camera.position.z = z;
  camera.position.y = y;
  camera.rotation.x = y*0.001;
}


initScene();
initLighting();
initGeometry();
resize();
getOriginalVerticePositions();
render();
window.addEventListener("resize", resize);

tweenIcosohedron();
