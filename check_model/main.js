import $ from 'jquery';

import * as THREE from 'three';
import { OrbitControls } from '../public/Controls/OrbitControls'
import { Detector } from '../public/Detector'
import { OBJLoader } from '../public/Loaders/OBJLoader';
import { MTLLoader } from '../public/Loaders/MTLLoader';
import { DDSLoader } from '../public/Loaders/DDSLoader';
import { FBXLoader } from '../public/Loaders/FBXLoader';



// if ( ! Detector.webgl ) Detector.addGetWebGLMessage();
var camera, controls, scene, renderer;
var mouseX = 0, mouseY = 0;
var windowHalfX = window.innerWidth / 2;
var windowHalfY = window.innerHeight / 2;

var clock = new THREE.Clock();
var mixers = [];

init();
//render(); // remove when using next line for animation loop (requestAnimationFrame)
animate();

function init() {
	scene = new THREE.Scene();
	scene.background = new THREE.Color( 0xcccccc );
	// scene.fog = new THREE.FogExp2( 0xcccccc, 0.002 );
	renderer = new THREE.WebGLRenderer( { antialias: true } );
	renderer.setPixelRatio( window.devicePixelRatio );
	renderer.setSize( window.innerWidth, window.innerHeight );
	document.body.appendChild( renderer.domElement );
	camera = new THREE.PerspectiveCamera( 60, window.innerWidth / window.innerHeight, 1, 1000 );
	camera.position.set( 0, 0, 0 );

  loadControl();
  loadLights();
  loadTerrain();

	// loadAgent();
	loadFbxAgnet();

	window.addEventListener( 'resize', onWindowResize, false );
	document.addEventListener( 'mousemove', onDocumentMouseMove, false );

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

function loadLights(){
  // lights
  var light = new THREE.DirectionalLight( 0xffffff );
  light.position.set( 1, 1, 1 );
  scene.add( light );
  var light = new THREE.DirectionalLight( 0x002288 );
  light.position.set( - 1, - 1, - 1 );
  scene.add( light );
  var light = new THREE.AmbientLight( 0x222222 );
  scene.add( light );
  //
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
  .setPath('/OBJ/Agents/Recognition/')
  .load('Recognition.mtl', function ( materials ) {
    materials.preload();
    new THREE.OBJLoader()
      .setMaterials( materials )
      .setPath('/OBJ/Agents/Recognition/')
      .load('Recognition.obj', function ( object ) {
        object.position.y = - 95;
        scene.add( object );
      }, onProgress, onError );
  });
}


var agent;
function loadAgent(){

	var loadingManager = new THREE.LoadingManager( function() {
		scene.add( agent );
	});

	var loader = new THREE.ColladaLoader( loadingManager );
		loader.load( '/OBJ/Agents/Sensor/Sensor_Blender.dae', function ( collada ) {
			agent = collada.scene;
		});
}


function loadFbxAgnet(){
	// model
	var loader = new THREE.FBXLoader();
	loader.load( '/OBJ/Agents/Sensor/sensor_local.fbx', function ( object ) {
		object.mixer = new THREE.AnimationMixer( object );
		mixers.push( object.mixer );
		var action = object.mixer.clipAction( object.animations[ 0 ] );
		action.play();
		object.traverse( function ( child ) {
			if ( child.isMesh ) {
				child.castShadow = true;
				child.receiveShadow = true;
			}
		} );
		scene.add( object );
	} );
}


function onWindowResize() {
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();
	renderer.setSize( window.innerWidth, window.innerHeight );
}

function onDocumentMouseMove( event ) {
	mouseX = event.clientX - windowHalfX;
	mouseY = event.clientY - windowHalfY;
}
function animate() {
	requestAnimationFrame( animate );

	if ( mixers.length > 0 ) {
		for ( var i = 0; i < mixers.length; i ++ ) {
			mixers[ i ].update( clock.getDelta() );
		}
	}

	controls.update(); // only required if controls.enableDamping = true, or if controls.autoRotate = true
	render();
}
function render() {
	renderer.render( scene, camera );
}
