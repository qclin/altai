import * as THREE from 'three';
import { OBJLoader } from '../public/Loaders/OBJLoader';
import { MTLLoader } from '../public/Loaders/MTLLoader';
import { DDSLoader } from '../public/Loaders/DDSLoader';
import { ColladaLoader } from '../public/Loaders/ColladaLoader';

import { SEA3D } from '../public/Loaders/sea3d/SEA3D';
import { SEA3DLZMA } from '../public/Loaders/sea3d/SEA3DLZMA';
import { SEA3DLoader } from '../public/Loaders/sea3d/SEA3DLoader';

import { EffectComposer } from '../public/postprocessing/EffectComposer';
import { RenderPass } from '../public/postprocessing/RenderPass';
import { ShaderPass } from '../public/postprocessing/ShaderPass';
import { MaskPass } from '../public/postprocessing/MaskPass';
import config from '../public/config/aws-s3-assets.json'
import './subtitle';

// if (process.env.NODE_ENV == 'production') {
	var assets = {
		agent: config.bucket + config.agent.turtle,
		terrain: config.bucket + config.terrain.forest
	}
// }else{
// 	var assets = {
// 		agent: '/OBJ/Agents/mascot.tjs.sea',
// 		terrain: '/OBJ/Highland_Forest/'
// 	}
// }


var camera, scene, renderer;

var pos;
var prev;
var LEVmaterial;
var LEVgeometry;
var windowHalfX = window.innerWidth / 2;
var windowHalfY = window.innerHeight / 2;

/// sea3d loader
var turtleLoader, myTurtle;
var slimTree;
var steak;
var clock = new THREE.Clock();

init();
loadTurtle();
animate(); // I guess can wait until the turtle is loader

function loadTurtle(){
	pos = new THREE.Vector3();
	prev = new THREE.Vector3();

	turtleLoader = new THREE.SEA3D({
		autoPlay : true, // Auto play animations
		container : scene // Container to add models
	} );

	turtleLoader.onComplete = function( e ) {
		// Get camera from SEA3D Studio
		// use turtleLoader.get... to get others objects
		var cam = turtleLoader.getCamera( "Camera007" );
		myTurtle = turtleLoader.getMesh( 'Mascot' );
		myTurtle.scale.set(.15, .15, .15); // TURTLE was too big :(
		myTurtle.position.z = 0;
	};

	turtleLoader.load(assets.agent);
}




function init() {

	camera = new THREE.PerspectiveCamera( 60, window.innerWidth / window.innerHeight, 1, 1000 );
	camera.position.z = 50;
	// camera.position.set(0,0,0);
	// world
	scene = new THREE.Scene();
	scene.background = new THREE.Color( 0xcccccc );
	scene.fog = new THREE.FogExp2( 0xcccccc, 0.002 );

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
	// renderer.setSize( 1920, 1080);

	document.body.appendChild( renderer.domElement );
	window.addEventListener( 'resize', onWindowResize, false );

	loadTree();
	loadSteak();

	initLevy();
}

/// TODO : MAKE STEAK RAIN
function loadSteak(){
	// loading manager
	var onProgress = function ( xhr ) {
    if ( xhr.lengthComputable ) {
      var percentComplete = xhr.loaded / xhr.total * 100;
      console.log( Math.round( percentComplete, 2 ) + '% downloaded' );
    }
  };
  var onError = function ( xhr ) { };
  THREE.Loader.Handlers.add( /\.dds$/i, new THREE.DDSLoader() );
  new THREE.MTLLoader()
  .setPath('/OBJ/props/raw_meat/')
  .load('sm_Raw_meat.mtl', function ( materials ) {
    materials.preload();
    new THREE.OBJLoader()
      .setMaterials( materials )
      .setPath('/OBJ/props/raw_meat/')
      .load('sm_Raw_meat.obj', function ( object ) {
				object.scale.set(20, 20, 20);
				scene.add( object );
				console.log(' STEAK OBJECT', object, object.position)
				// for ( var i = 0; i < 500; i ++ ) {
				// 	steak = object.clone();
				// 	steak.position.x = ( Math.random() - 0.5 ) * 1000;
				// 	steak.position.y = ( Math.random() - 0.5 ) * 1000;
				// 	steak.position.z = ( Math.random() - 0.5 ) * 1000;
				// 	steak.updateMatrix();
				// 	steak.matrixAutoUpdate = false;
				// 	scene.add( steak );
				// }


      }, onProgress, onError );
  });
}

function onWindowResize() {
	// perspective cam
	camera.aspect = window.innerWidth / window.innerHeight;

	camera.rotation.y = Math.PI;
	camera.updateProjectionMatrix();
	renderer.setSize( window.innerWidth, window.innerHeight );

	render();
}


function animate() {

	var delta = clock.getDelta();
	requestAnimationFrame( animate );
				// Update SEA3D Animations
	THREE.SEA3D.AnimationHandler.update( delta );
	render();
}

function initLevy(){
		// Material will be lines connecting each point of the LEVY system
		LEVmaterial = new THREE.LineBasicMaterial({
				linewidth: 50,
				color: 0x000000
		});
		LEVgeometry = new THREE.Geometry();
		LEVgeometry.dynamic = true;
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
  .setPath(assets.terrain).setCrossOrigin(true)
  .load('Tree.mtl', function ( materials ) {
    materials.preload();
    new THREE.OBJLoader()
      .setMaterials( materials )
      .setPath(assets.terrain)
      .load('Tree.obj', function ( object ) {
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


	renderPositon();
	renderer.render( scene, camera );
}

function renderPositon(){
	var timer = performance.now() * 0.0001;

	prev.copy(pos);

	if (!myTurtle) return;

	var step = generateRandom3DVector();
	var r =  100 * Math.random()
	if (r < 1) {
		// large steps
		step.multiplyScalar(Math.random() * 200 + 25);
		myTurtle.rotation.x += 0.003;
		myTurtle.rotation.z += 0.006;

		camera.position.z += Math.sin(timer) * myTurtle.position.z;
	} else {
		// small steps
		step.normalize().multiplyScalar(10);
	}
	pos.add(step);
	// windows half is the center point

	var geo = new THREE.Geometry();
	geo.vertices.push(new THREE.Vector3(prev.x, prev.y, prev.z));
	geo.vertices.push(new THREE.Vector3(pos.x, pos.y, pos.z));
	var col = new THREE.Color(255, 0, 0);
	LEVmaterial.color = col;
	var line = new THREE.Line(geo, LEVmaterial);

	if(pos.x < -windowHalfX || pos.x > windowHalfX){
		console.log("--------X POSITION IS OUT OF FRAME --------")
		pos.x = 0;
	}else if(pos.y < -windowHalfY || pos.y > windowHalfY){
		console.log("--------Y POSITION IS OUT OF FRAME --------")
		pos.y = 0;
	}else if(pos.z < -500 || pos.z > camera.position.z){
		console.log("--------Z POSITION IS IN FRONT OF CAMERA --------")
		pos.z = 0;
	}
	myTurtle.position.add(step);
	scene.add(line);


}



function drawLevy(){

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
