import $ from 'jquery';
import { OBJLoader } from '../public/Loaders/OBJLoader';
import { MTLLoader } from '../public/Loaders/MTLLoader';
import { DDSLoader } from '../public/Loaders/DDSLoader';
import * as THREE from 'three';
import '../public/CurveExtras';
import './overlay';
import './subtitle';


var container, stats;
var camera, scene, renderer;
var mouseX = 0, mouseY = 0;
var windowHalfX = window.innerWidth / 2;
var windowHalfY = window.innerHeight / 2;

// for flamingo
var mixers = [];
var clock = new THREE.Clock();
var mesh;

// tetra agent
var tetraAgent;
var testAgent;

// for log camera zoom
var NEAR = 1e-6, FAR = 1e27;
var zoompos = -100, minzoomspeed = .015;
var zoomspeed = minzoomspeed;


// fly thru camera
var splineCamera, tubeGeometry;
var binormal = new THREE.Vector3();
var normal = new THREE.Vector3();

var params = {
	spline: 'GrannyKnot',
	scale: 4,
	extrusionSegments: 150,
	radiusSegments: 3,
	closed: true,
	animationView: false,
	lookAhead: true,
	cameraHelper: false,
};

var hemiLight;


init();
animate();

function init() {
	container = document.createElement( 'div' );
	document.body.appendChild( container );
	camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, 2000 );
	camera.position.z = 250;


  // scene
	scene = new THREE.Scene();
  scene.background = new THREE.Color().setHSL( 0.6, 0, 1 );
	scene.fog = new THREE.Fog( scene.background, 1, 5000 );

  var ambientLight = new THREE.AmbientLight( 0xcccccc, 0.4 );
	scene.add( ambientLight );


  // fly thru camera
  splineCamera = new THREE.PerspectiveCamera( 84, window.innerWidth / window.innerHeight, 0.01, 1000 );
  scene.add(splineCamera);

  // addLight();

	var pointLight = new THREE.PointLight( 0xffffff, 0.8 );
	camera.add( pointLight );
	scene.add( camera );

  loadTerrain();
	// addTetrahedron();
	loadAgent();

  addTube();
	//
	renderer = new THREE.WebGLRenderer();
	renderer.setPixelRatio( window.devicePixelRatio );
	renderer.setSize( window.innerWidth, window.innerHeight );
	container.appendChild( renderer.domElement );
	document.addEventListener( 'mousemove', onDocumentMouseMove, false );
	//
	window.addEventListener( 'resize', onWindowResize, false );
}
function addLight(){
  hemiLight = new THREE.HemisphereLight( 0xffffff, 0xffffff, 0.3 );
	hemiLight.color.setHSL( 0.6, 1, 0.6 );
	hemiLight.groundColor.setHSL( 0.095, 1, 0.75 );
	hemiLight.position.set( 0, 50, 0 );
	scene.add( hemiLight );
	// hemiLightHelper = new THREE.HemisphereLightHelper( hemiLight, 10 );
	// scene.add( hemiLightHelper );
}

function addTube(){

  var path = new THREE.Curves.GrannyKnot();
  tubeGeometry = new THREE.TubeBufferGeometry( path, params.extrusionSegments, 2, params.radiusSegments, params.closed );


}
function addTetrahedron(){
	var texture = new THREE.TextureLoader().load( '/textures/hp_text.png' );

	tetraAgent = new THREE.Mesh( new THREE.TetrahedronBufferGeometry( 75, 0 ), texture );

	var s = 0.35;
	tetraAgent.scale.set( s, s, s );
	// tetraAgent.position.y = 15;
	tetraAgent.rotation.y = -1;
	tetraAgent.castShadow = true;
	tetraAgent.receiveShadow = true;

	splineCamera.add( tetraAgent );
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
  .setPath('/OBJ/Skp_Highland_Prairie/')
  .load('Skp_Highland_Prairie.mtl', function ( materials ) {
    materials.preload();
    new THREE.OBJLoader()
      .setMaterials( materials )
      .setPath('/OBJ/Skp_Highland_Prairie/')
      .load('Skp_Highland_Prairie.obj', function ( object ) {
        object.position.y = - 95;
        scene.add( object );
      }, onProgress, onError );
  });
}

function loadAgent(){

  var onProgress = function ( xhr ) {
    if ( xhr.lengthComputable ) {
      var percentComplete = xhr.loaded / xhr.total * 100;
      console.log( Math.round( percentComplete, 2 ) + '% downloaded' );
    }
  };
  var onError = function ( xhr ) { };
  THREE.Loader.Handlers.add( /\.dds$/i, new THREE.DDSLoader() );

  new THREE.MTLLoader()
  .setPath('/OBJ/Agents/flamingo/')
  .load('3_material.mtl', function ( materials ) {
    materials.preload();
    new THREE.OBJLoader()
      .setMaterials( materials )
      .setPath('/OBJ/Agents/flamingo/')
      .load('3_material.obj', function ( object ) {

				testAgent = object
				// var s = 0.35;
				// testAgent.scale.set( s, s, s );
				// testAgent.position.y = 15;
				// testAgent.rotation.y = -1;
				testAgent.castShadow = true;
				testAgent.receiveShadow = true;

        scene.add( testAgent );

      }, onProgress, onError );
  });
}

function onWindowResize() {
	windowHalfX = window.innerWidth / 2;
	windowHalfY = window.innerHeight / 2;
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();
	renderer.setSize( window.innerWidth, window.innerHeight );
}
function onDocumentMouseMove( event ) {
	mouseX = ( event.clientX - windowHalfX ) / 2;
	mouseY = ( event.clientY - windowHalfY ) / 2;
}
//
function animate() {
	requestAnimationFrame( animate );
	render();
}
function render() {
  // animate flamingo wings
  var delta = clock.getDelta();
  for ( var i = 0; i < mixers.length; i ++ ) {
    mixers[ i ].update( delta );
  }
  // mesh.position.y += ( mouseX - camera.position.x ) * .05;
  // 1. mesh appears
	// camera.position.x += ( mouseX - camera.position.x ) * .05;
	// camera.position.y += ( - mouseY - camera.position.y ) * .05;

	camera.lookAt( scene.position );
	// renderer.render( scene, camera );
  animateAlong();
  renderer.render(scene, splineCamera);
}

// function animate camera along spline

function animateAlong(){
  var time = Date.now();
	var looptime = 200 * 1000;
	var t = ( time % looptime ) / looptime;

  var pos = tubeGeometry.parameters.path.getPointAt( t );
  pos.multiplyScalar( params.scale );


  // interpolation
	var segments = tubeGeometry.tangents.length;
	var pickt = t * segments;
	var pick = Math.floor( pickt );
	var pickNext = ( pick + 1 ) % segments;
	binormal.subVectors( tubeGeometry.binormals[ pickNext ], tubeGeometry.binormals[ pick ] );
	binormal.multiplyScalar( pickt - pick ).add( tubeGeometry.binormals[ pick ] );
	var dir = tubeGeometry.parameters.path.getTangentAt( t );
	var offset = 15;
	normal.copy( binormal ).cross( dir );
	// we move on a offset on its binormal
	pos.add( normal.clone().multiplyScalar( offset ) );
	splineCamera.position.copy( pos );

  // mesh.position.copy(pos);
  // mesh.position.x += 100;
  // mesh.position.z += -100;
	console.log("999999999999:::::: ",testAgent)
	testAgent.position.copy(pos);
  testAgent.position.x += 100;
  testAgent.position.z += -100;

  // cameraEye.position.copy( pos );

  // using arclength for stablization in look ahead
	var lookAt = tubeGeometry.parameters.path.getPointAt( ( t + 30 / tubeGeometry.parameters.path.getLength() ) % 1 ).multiplyScalar( params.scale );
	// camera orientation 2 - up orientation via normal
	if ( ! params.lookAhead ) lookAt.copy( pos ).add( dir );
	splineCamera.matrix.lookAt( splineCamera.position, lookAt, normal );
	splineCamera.rotation.setFromRotationMatrix( splineCamera.matrix, splineCamera.rotation.order );


	// renderer.render( scene, params.animationView === true ? splineCamera : camera );




}
