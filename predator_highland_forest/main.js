import * as THREE from 'three';
import { OBJLoader } from '../public/Loaders/OBJLoader';
import { MTLLoader } from '../public/Loaders/MTLLoader';
import { DDSLoader } from '../public/Loaders/DDSLoader';

import { SEA3D } from '../public/Loaders/sea3d/SEA3D';
import { SEA3DLZMA } from '../public/Loaders/sea3d/SEA3DLZMA';
import { SEA3DLoader } from '../public/Loaders/sea3d/SEA3DLoader';

import { EffectComposer } from '../public/postprocessing/EffectComposer';
import { RenderPass } from '../public/postprocessing/RenderPass';
import { ShaderPass } from '../public/postprocessing/ShaderPass';
import { MaskPass } from '../public/postprocessing/MaskPass';


var camera, scene, renderer;
var predator;

var pos;
var prev;
var windowHalfX = window.innerWidth / 2;
var windowHalfY = window.innerHeight / 2;

/// sea3d loader
var turtleLoader, myTurtle;
var slimTree;

init();
// animate(); // I guess can wait until the turtle is loader
loadTurtle();

function loadTurtle(){

	turtleLoader = new THREE.SEA3D( {
		autoPlay : true, // Auto play animations
		container : scene // Container to add models
	} );

	turtleLoader.onComplete = function( e ) {
		// Get camera from SEA3D Studio
		// use turtleLoader.get... to get others objects
		console.log (' FINISH LOADING TURTLE YASS ')
		var cam = turtleLoader.getCamera( "Camera007" );

		myTurtle = turtleLoader.getMesh( 'Mascot' );
		myTurtle.scale.set(.15, .15, .15); // TURTLE was too big :(
		console.log( myTurtle.position,  );
		// camera.position.copy( cam.position );
		// camera.rotation.copy( cam.rotation );
		animate();
		render();
	};

	turtleLoader.load('/OBJ/Agents/mascot.tjs.sea');
}




function init() {

	camera = new THREE.PerspectiveCamera( 60, window.innerWidth / window.innerHeight, 1, 1000 );
	camera.position.z = 500;

	// world

	scene = new THREE.Scene();
	scene.background = new THREE.Color( 0xcccccc );
	scene.fog = new THREE.FogExp2( 0xcccccc, 0.002 );

	//TODO:// REPLACE the TREES;
	var geometry = new THREE.CylinderBufferGeometry( 0, 10, 30, 4, 1 );
	var material = new THREE.MeshPhongMaterial( { color: 0xffffff, flatShading: true } );

	// for ( var i = 0; i < 500; i ++ ) {
	// 	var mesh = new THREE.Mesh( geometry, material );
	// 	mesh.position.x = ( Math.random() - 0.5 ) * 1000;
	// 	mesh.position.y = ( Math.random() - 0.5 ) * 1000;
	// 	mesh.position.z = ( Math.random() - 0.5 ) * 1000;
	// 	mesh.updateMatrix();
	// 	mesh.matrixAutoUpdate = false;
	// 	scene.add( mesh );
	// }
	// lights

	var light = new THREE.DirectionalLight( 0xffffff );
	light.position.set( 1, 1, 1 );
	scene.add( light );

	var light = new THREE.DirectionalLight( 0x002288 );
	light.position.set( -1, -1, -1 );
	scene.add( light );

	var light = new THREE.AmbientLight( 0x222222 );
	scene.add( light );


	// renderer
	renderer = new THREE.WebGLRenderer( { antialias: true } );
	renderer.setPixelRatio( window.devicePixelRatio );
	renderer.setSize( window.innerWidth, window.innerHeight );
	document.body.appendChild( renderer.domElement );
	window.addEventListener( 'resize', onWindowResize, false );

	loadTree();


	createPredator();

}


function createPredator(){
	var geometry = new THREE.BoxBufferGeometry( 33, 33, 33 );
	var material = new THREE.MeshBasicMaterial( {color: 0x00ff00} );
	predator = new THREE.Mesh( geometry, material );

	pos = new THREE.Vector3( 0, 0, -50)
	prev = pos;

	predator.position.copy(pos);
	/// set position
	// copy position to prev

	scene.add( predator );
}



function onWindowResize() {
	// perspective cam
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.rotation.y = Math.PI;
	camera.updateProjectionMatrix();
	renderer.setSize( window.innerWidth, window.innerHeight );
	render();
}

var clock = new THREE.Clock();

function animate() {

	var delta = clock.getDelta();
	requestAnimationFrame( animate );
				// Update SEA3D Animations
	THREE.SEA3D.AnimationHandler.update( delta );
}


function loadTree(){

  var onProgress = function ( xhr ) {
    if ( xhr.lengthComputable ) {
      var percentComplete = xhr.loaded / xhr.total * 100;
      console.log( Math.round( percentComplete, 2 ) + '% downloaded' );
    }
  };
  var onError = function ( xhr ) { };
  THREE.Loader.Handlers.add( /\.dds$/i, new THREE.DDSLoader() );
  new THREE.MTLLoader()
  .setPath('/OBJ/Highland_Forest/')
  .load('Tree.mtl', function ( materials ) {
    materials.preload();
    new THREE.OBJLoader()
      .setMaterials( materials )
      .setPath('/OBJ/Highland_Forest/')
      .load('Tree.obj', function ( object ) {
        // object.position.y = 0;
        // scene.add( object );
				object.scale.set(20, 20, 20);
				for ( var i = 0; i < 500; i ++ ) {

					slimTree = object.clone();
					slimTree.position.x = ( Math.random() - 0.5 ) * 1000;
					slimTree.position.y = ( Math.random() - 0.5 ) * 1000;
					slimTree.position.z = ( Math.random() - 0.5 ) * 1000;
					slimTree.updateMatrix();
					slimTree.matrixAutoUpdate = false;
					scene.add( slimTree );
				}


      }, onProgress, onError );
  });
}

function render() {
	var timer = Date.now() * 0.0001; // general speed

	camera.position.x = Math.cos( timer ) * 100; // distance from center
	camera.position.y = Math.sin( timer ) * 100; //
	camera.updateMatrixWorld();

	// predator.position.needsUpdate = true;
	renderPositon()

	renderer.render( scene, camera );

	requestAnimationFrame(render);
}

function renderPositon(){
	var time = performance.now() * 0.0001;

	prev.copy(pos);
	var step = generateRandom3DVector();
	var r =  100 * Math.random()
	if (r < 1) {
		// large steps
		step.multiplyScalar(Math.random() * 80 + 25);
		console.log(' JUMP HERE :::: ', step, pos )
	} else {

		// small steps
		step.normalize().multiplyScalar(2);
	}

	pos.add(step);
	// windows half is the center point

	if(pos.x < -windowHalfX || pos.x > windowHalfX){
		console.log("--------X POSITION IS OUT OF FRAME --------")
	}else if(pos.y < -windowHalfY || pos.y > windowHalfY){
		console.log("--------Y POSITION IS OUT OF FRAME --------")
	}else if(pos.z < - 300 || pos.z > camera.position.z){
		console.log("--------Z POSITION IS IN FRONT OF CAMERA --------")

	}
	myTurtle.position.add(step);
	myTurtle.rotation.x += 0.003;
	myTurtle.rotation.z += 0.003;
	// predator.position.add(step);
	predator.rotation.x += 0.03;
	predator.rotation.y += 0.03;
	// predator.rotation.z += time * step.z;

}


var t = 0;
function generateRandom3DVector(){
	t += 0.01;
	var radius = 100, theta = 360;

	var x =  (Math.random() - 0.5) * 2;
	var y =  (Math.random() - 0.5) * 2;
	var z =  (Math.random() - 0.5) * 2;
	return new THREE.Vector3(x, y, z);

}
