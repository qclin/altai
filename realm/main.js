
import * as THREE from 'three';
import { createAizawa, createCoullet, world } from './aizawa'

var camera, scene, renderer;
var isUserInteracting = false,
onMouseDownMouseX = 0, onMouseDownMouseY = 0,
lon = 0, onMouseDownLon = 0,
lat = 0, onMouseDownLat = 0,
phi = 0, theta = 0;
init();
animate();
// make appearance aiwaza
createAizawa();
// loop();

const far = 2000;



function init() {
	var container, mesh;
	container = document.getElementById( 'container' );
	// camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 1, 1100 ); // heres cam for theta 360
  camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, far); // heres cam for model
  // camera.position.set(-60, 630, 970);
  camera.position.set(-200, 400, 0);

  camera.target = new THREE.Vector3( 0, 0, 0 );
	scene = new THREE.Scene();
	var geometry = new THREE.SphereBufferGeometry( 500, 60, 40 );
	// invert the geometry on the x-axis so that all of the faces point inward
	geometry.scale( - 1, 1, 1 );
	var material = new THREE.MeshBasicMaterial( {
		map: new THREE.TextureLoader().load( 'textures/R0010534.JPG' )
	} );
	mesh = new THREE.Mesh( geometry, material );
	scene.add( mesh );

  setupAiwaza();

	renderer = new THREE.WebGLRenderer();
	renderer.setPixelRatio( window.devicePixelRatio );
	renderer.setSize( window.innerWidth, window.innerHeight );
	container.appendChild( renderer.domElement );

  addListeners();

}

function addListeners(){
  document.addEventListener( 'mousedown', onDocumentMouseDown, false );
	document.addEventListener( 'mousemove', onDocumentMouseMove, false );
	document.addEventListener( 'mouseup', onDocumentMouseUp, false );
	document.addEventListener( 'wheel', onDocumentMouseWheel, false );
	//
	document.addEventListener( 'dragover', function ( event ) {
		event.preventDefault();
		event.dataTransfer.dropEffect = 'copy';
	}, false );
	document.addEventListener( 'dragenter', function ( event ) {
		document.body.style.opacity = 0.5;
	}, false );
	document.addEventListener( 'dragleave', function ( event ) {
		document.body.style.opacity = 1;
	}, false );
	document.addEventListener( 'drop', function ( event ) {
		event.preventDefault();
		var reader = new FileReader();
		reader.addEventListener( 'load', function ( event ) {
			material.map.image.src = event.target.result;
			material.map.needsUpdate = true;
		}, false );
		reader.readAsDataURL( event.dataTransfer.files[ 0 ] );
		document.body.style.opacity = 1;
	}, false );
	//
	window.addEventListener( 'resize', onWindowResize, false );

}

function setupAiwaza(){
  // create scene and container (world) for all geometries
  scene.fog = new THREE.Fog(0x000000, 500, far - 500);
  scene.add(world);

  const hemiLight = new THREE.HemisphereLight(0xffffff, 0x000000, 0.6);
  hemiLight.color.setHSL(0.6, 1, 0.6);
  hemiLight.groundColor.setHSL(0.1, 1, 0.75);
  hemiLight.position.set(0, 500, 0);
  scene.add(hemiLight);

  //
  const dirLight = new THREE.DirectionalLight(0xffffff, 0.9);
  dirLight.position.set(-1, 2, 1);
  dirLight.castShadow = false;
  dirLight.shadow.mapSize.width = 2048;
  dirLight.shadow.mapSize.height = 2048;

  var dir = 250;

  dirLight.shadow.camera.left = -dir;
  dirLight.shadow.camera.right = dir;
  dirLight.shadow.camera.top = dir;
  dirLight.shadow.camera.bottom = -dir;
  dirLight.shadow.camera.far = far;

  scene.add(dirLight);
}

function onWindowResize() {
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();
	renderer.setSize( window.innerWidth, window.innerHeight );
}
function onDocumentMouseDown( event ) {
	event.preventDefault();
	isUserInteracting = true;
	onMouseDownMouseX = event.clientX;
	onMouseDownMouseY = event.clientY;
	onMouseDownLon = lon;
	onMouseDownLat = lat;
}
function onDocumentMouseMove( event ) {
	if ( isUserInteracting === true ) {
		lon = ( onMouseDownMouseX - event.clientX ) * 0.1 + onMouseDownLon;
		lat = ( event.clientY - onMouseDownMouseY ) * 0.1 + onMouseDownLat;
	}
}
function onDocumentMouseUp( event ) {
	isUserInteracting = false;
}
function onDocumentMouseWheel( event ) {
	var fov = camera.fov + event.deltaY * 0.05;
	camera.fov = THREE.Math.clamp( fov, 10, 75 );
	camera.updateProjectionMatrix();
}

function animate() {
	requestAnimationFrame( animate );
	update();
}

function update() {
	if ( isUserInteracting === false ) {
		lon += 0.1;
	}
	lat = Math.max( - 85, Math.min( 85, lat ) );
	phi = THREE.Math.degToRad( 90 - lat );
	theta = THREE.Math.degToRad( lon );
	camera.target.x = 500 * Math.sin( phi ) * Math.cos( theta );
	camera.target.y = 500 * Math.cos( phi );
	camera.target.z = 500 * Math.sin( phi ) * Math.sin( theta );
	camera.lookAt( camera.target );
	/*
	// distortion
	camera.position.copy( camera.target ).negate();
	*/

  world.rotation.y += 0.01;

	renderer.render( scene, camera );
}


window.scene = scene;
window.THREE = THREE;

window.world = world; 
