import $ from 'jquery';
import { OBJLoader } from '../public/Loaders/OBJLoader';
import { MTLLoader } from '../public/Loaders/MTLLoader';
import { DDSLoader } from '../public/Loaders/DDSLoader';
import { AsciiEffect } from '../public/Effects/AsciiEffect';

import { PointerLockControls } from '../public/Controls/PointerLockControls'
import { Bird } from './bird'
import { Boid } from './boid'
import {start, stop } from './subtitle';


import * as THREE from 'three';

import sample from './sample.json'
import json from '../public/json/20180520-220131_rec_story.json'

var container, stats;
var camera, scene, renderer, controls;
container = document.createElement( 'div' ); // have to be here to pass to control part
document.body.appendChild( container );

var raycaster;
var blocker = document.getElementById( 'blocker' );
var instructions = document.getElementById( 'instructions' );

var mouseX = 0, mouseY = 0;
var width = window.innerWidth || 2;
var height = window.innerHeight || 2;
var windowHalfX = window.innerWidth / 2;
var windowHalfY = window.innerHeight / 2;

var effect;
var asciiOn = false;
// control variable
var controlsEnabled = false;
var moveForward = false;
var moveBackward = false;
var moveLeft = false;
var moveRight = false;
var canJump = false;
var prevTime = performance.now();
var velocity = new THREE.Vector3();
var direction = new THREE.Vector3();
var vertex = new THREE.Vector3();
var color = new THREE.Color();

// video slice here
var video, image, imageContext,
	imageReflection, imageReflectionContext, imageReflectionGradient,
	texture, textureReflection;

var videoReflectionMesh;

// add agent here
var birds, bird, boid, boids;


// add pin lights
var light1, light2, light3, light4, light5, light6;
var clock = new THREE.Clock();

var havePointerLock = 'pointerLockElement' in document || 'mozPointerLockElement' in document || 'webkitPointerLockElement' in document;

if ( havePointerLock ) {
				var element = container;
				var pointerlockchange = function ( event ) {
					if ( document.pointerLockElement === element || document.mozPointerLockElement === element || document.webkitPointerLockElement === element ) {
						controlsEnabled = true;
						controls.enabled = true;
						blocker.style.display = 'none';
						start();
					} else {
						controls.enabled = false;
						blocker.style.display = 'block';
						instructions.style.display = '';
						stop();
					}
				};
				var pointerlockerror = function ( event ) {
					instructions.style.display = '';
				};
				// Hook pointer lock state change events
				document.addEventListener( 'pointerlockchange', pointerlockchange, false );
				document.addEventListener( 'mozpointerlockchange', pointerlockchange, false );
				document.addEventListener( 'webkitpointerlockchange', pointerlockchange, false );
				document.addEventListener( 'pointerlockerror', pointerlockerror, false );
				document.addEventListener( 'mozpointerlockerror', pointerlockerror, false );
				document.addEventListener( 'webkitpointerlockerror', pointerlockerror, false );
				instructions.addEventListener( 'click', function ( event ) {
					instructions.style.display = 'none';
					// Ask the browser to lock the pointer
					element.requestPointerLock = element.requestPointerLock || element.mozRequestPointerLock || element.webkitRequestPointerLock;
					element.requestPointerLock();
				}, false );
			} else {

				instructions.innerHTML = 'Your browser doesn\'t seem to support Pointer Lock API';
}




init();
animate();

function init(){


	// scene
	scene = new THREE.Scene();
	// scene.background = new THREE.Color( 0xffffff );
	// scene.fog = new THREE.Fog( 0xffffff, 0, 750 );

	camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, 2000 );
	camera.position.z = 250;

	// lights
	// var hemiSpherelight = new THREE.HemisphereLight( 0xeeeeff, 0x777788, 0.75 );
	// hemiSpherelight.position.set( 0.5, 1, 0.75 );
	// scene.add( hemiSpherelight );

	var ambientLight = new THREE.AmbientLight( 0xcccccc, 0.4 );
	scene.add( ambientLight );

	var pointLight = new THREE.PointLight( 0xffffff, 0.8 );
	camera.add( pointLight );
	scene.add(camera);
	// control added
	controls = new THREE.PointerLockControls( camera );
	scene.add( controls.getObject() );


	loadModel();
	setupVideo();
	createBirds();
	setupLights();
	// some ambient
	raycaster = new THREE.Raycaster( new THREE.Vector3(), new THREE.Vector3( 0, - 1, 0 ), 0, 10 );

	renderer = new THREE.WebGLRenderer();
	renderer.setPixelRatio( window.devicePixelRatio );
	renderer.setSize( window.innerWidth, window.innerHeight );
	container.appendChild( renderer.domElement );


	// add listener
	// document.addEventListener( 'mousemove', onDocumentMouseMove, false);
	document.addEventListener( 'keydown', onKeyDown, false );
	document.addEventListener( 'keyup', onKeyUp, false );

	window.addEventListener( 'resize', onWindowResize, false );

}

function setupVideo(){
	video = document.getElementById( 'video' );
	image = document.createElement( 'canvas' );
	image.width = 256;
	image.height = 128;

	imageContext = image.getContext( '2d' );
	imageContext.fillStyle = '#000000';
	imageContext.fillRect( 0, 0, 256, 128 );

	texture = new THREE.Texture( image );
	var material = new THREE.MeshBasicMaterial( { map: texture, overdraw: 0.5 } );
	imageReflection = document.createElement( 'canvas' );
	imageReflection.width = 256;
	imageReflection.height = 128;

	imageReflectionContext = imageReflection.getContext( '2d' );
	imageReflectionContext.fillStyle = '#000000';
	imageReflectionContext.fillRect( 0, 0, 256, 128 );

	imageReflectionGradient = imageReflectionContext.createLinearGradient( 0, 0, 0, 128 );
	imageReflectionGradient.addColorStop( 0.2, 'rgba(240, 240, 240, 1)' );
	imageReflectionGradient.addColorStop( 1, 'rgba(240, 240, 240, 0.8)' );

	textureReflection = new THREE.Texture( imageReflection );
	var materialReflection = new THREE.MeshBasicMaterial( { map: textureReflection, side: THREE.BackSide, overdraw: 0.5 } );
	// the video plane
	var plane = new THREE.PlaneGeometry( 256, 128, 4, 4 );
	videoReflectionMesh = new THREE.Mesh( plane, material );
	videoReflectionMesh.scale.x = videoReflectionMesh.scale.y = videoReflectionMesh.scale.z = 1.5;
	scene.add(videoReflectionMesh);
	// the reflection plane
	// videoReflectionMesh = new THREE.Mesh( plane, materialReflection );
	// videoReflectionMesh.position.y = -306;
	// videoReflectionMesh.rotation.x = - Math.PI;
	// videoReflectionMesh.scale.x = videoReflectionMesh.scale.y = videoReflectionMesh.scale.z = 1.5;
	// scene.add( videoReflectionMesh );

}

function setupLights(){
		// LIGHTS
		var intensity = 2.5;
		var distance = 100;
		var decay = 2.0;
		var c1 = 0xff0040, c2 = 0x0040ff, c3 = 0x80ff80, c4 = 0xffaa00, c5 = 0x00ffaa, c6 = 0xff1100;
		var sphere = new THREE.SphereBufferGeometry( 0.25, 16, 8 );
		light1 = new THREE.PointLight( c1, intensity, distance, decay );
		light1.add( new THREE.Mesh( sphere, new THREE.MeshBasicMaterial( { color: c1 } ) ) );
		scene.add( light1 );
		light2 = new THREE.PointLight( c2, intensity, distance, decay );
		light2.add( new THREE.Mesh( sphere, new THREE.MeshBasicMaterial( { color: c2 } ) ) );
		scene.add( light2 );
		light3 = new THREE.PointLight( c3, intensity, distance, decay );
		light3.add( new THREE.Mesh( sphere, new THREE.MeshBasicMaterial( { color: c3 } ) ) );
		scene.add( light3 );
		light4 = new THREE.PointLight( c4, intensity, distance, decay );
		light4.add( new THREE.Mesh( sphere, new THREE.MeshBasicMaterial( { color: c4 } ) ) );
		scene.add( light4 );
		light5 = new THREE.PointLight( c5, intensity, distance, decay );
		light5.add( new THREE.Mesh( sphere, new THREE.MeshBasicMaterial( { color: c5 } ) ) );
		scene.add( light5 );
		light6 = new THREE.PointLight( c6, intensity, distance, decay );
		light6.add( new THREE.Mesh( sphere, new THREE.MeshBasicMaterial( { color: c6 } ) ) );
		scene.add( light6 );
		var dlight = new THREE.DirectionalLight( 0xffffff, 0.05 );
		dlight.position.set( 0.5, 1, 0 ).normalize();
		scene.add( dlight );

}
function loadModel(){
	// handler
	var onProgress = function(xhr){
		if(xhr.lengthComputable){
			var percentComplete = xhr.loaded / xhr.total * 100;
			console.log(Math.round(percentComplete, 2) + '% downloaded');
		}
	};

	var onError = function(xhr) {};
	THREE.Loader.Handlers.add( /\.dds$/i, new THREE.DDSLoader() );

	new THREE.MTLLoader()
	.setPath( 'OBJ/Tundra/' ) // ** CHANGE Parameter HERE
	.load( 'Tundra_5.mtl', function ( materials ) {

		materials.preload();

		new THREE.OBJLoader()
			.setMaterials( materials )
			.setPath( 'OBJ/Tundra/' ) // ** CHANGE Parameter HERE
			.load( 'Tundra_5.obj', function ( object ) {
				object.position.y = - 95;
				object.rotation.z = 90; 
				scene.add( object );
			}, onProgress, onError );
	} );
	// // load grey model
	// var manager = new THREE.LoadingManager();
	// var loader = new THREE.OBJLoader(manager);

	// loader.load('OBJ/Altai_skp_model_1/Altai_skp_model_1.obj', function ( object ) {
	// 		object.position.y = - 95;
	// 		scene.add( object );
	// 	}, onProgress, onError );

}



function createBirds(){

	birds = [];
	boids = [];
	for ( var i = 0; i < 200; i ++ ) {
		boid = boids[ i ] = new Boid();
		boid.position.x = Math.random() * 400 - 200;
		boid.position.y = Math.random() * 400 - 200;
		boid.position.z = Math.random() * 400 - 200;
		boid.velocity.x = Math.random() * 2 - 1;
		boid.velocity.y = Math.random() * 2 - 1;
		boid.velocity.z = Math.random() * 2 - 1;
		boid.setAvoidWalls( true );
		boid.setWorldSize( 500, 500, 400 );
		bird = birds[ i ] = new THREE.Mesh( new Bird(), new THREE.MeshBasicMaterial( { color:Math.random() * 0xffffff, side: THREE.DoubleSide } ) );
		bird.phase = Math.floor( Math.random() * 62.83 );
		scene.add( bird );
	}
}



function onWindowResize() {
	windowHalfX = window.innerWidth / 2;
	windowHalfY = window.innerHeight / 2;
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();
	renderer.setSize( window.innerWidth, window.innerHeight );

	// ascii effect handleResize
	if(asciiOn === true){
		effect.setSize( window.innerWidth, window.innerHeight );
	}
}

function onDocumentMouseMove( event ) {
	mouseX = ( event.clientX - windowHalfX ) / 2;
	mouseY = ( event.clientY - windowHalfY ) / 2;


	// realign the birds & boids
	var vector = new THREE.Vector3( event.clientX - SCREEN_WIDTH_HALF, - event.clientY + SCREEN_HEIGHT_HALF, 0 );
	for ( var i = 0, il = boids.length; i < il; i++ ) {
		boid = boids[ i ];
		vector.z = boid.position.z;
		boid.repulse( vector );
	}
}


function onKeyDown ( event ) {
	switch ( event.keyCode ) {
		case 38: // up
		case 87: // w
			moveForward = true;
			break;
		case 37: // left
		case 65: // a
			moveLeft = true; break;
		case 40: // down
		case 83: // s
			moveBackward = true;
			break;
		case 39: // right
		case 68: // d
			moveRight = true;
			break;
		case 32: // space
			if ( canJump === true ) velocity.y += 350;
			canJump = false;
			break;
		case 86: // v
			if( asciiOn === false){
				asciiOn = true;
				kickAsciiEffect();
			}
			break;
		case 66: // b
			if( asciiOn === true){
				asciiOn = false;
				kickAsciiEffect();
			}
			break;
	}
};

function onKeyUp ( event ) {
	switch( event.keyCode ) {
		case 38: // up
		case 87: // w
			moveForward = false;
			break;
		case 37: // left
		case 65: // a
			moveLeft = false;
			break;
		case 40: // down
		case 83: // s
			moveBackward = false;
			break;
		case 39: // right
		case 68: // d
			moveRight = false;
			break;
	}
};

function animate() {
	requestAnimationFrame( animate );
	if ( controlsEnabled === true ) {
		enableMovement();
	}

	render();
}

function render(){
	camera.position.x += ( mouseX - camera.position.x ) * .05;
	camera.position.y += ( - mouseY - camera.position.y ) * .05;
	camera.lookAt( scene.position );


	renderVideo();
	renderBirds();
	renderLights();
	if(asciiOn === true){
		effect.render( scene, camera );
	}else{
		renderer.render( scene, camera );
	}

}

function kickAsciiEffect(){
	if(asciiOn === true){
		effect = new THREE.AsciiEffect( renderer );
		effect.setSize( width, height );
		container.removeChild( renderer.domElement );
		container.appendChild( effect.domElement );

	}else{
		container.removeChild( effect.domElement );

		container.appendChild( renderer.domElement );
	}
}
function enableMovement(){
	raycaster.ray.origin.copy( controls.getObject().position );
	raycaster.ray.origin.y -= 10;

	// var intersections = raycaster.intersectObjects( objects );
	// var onObject = intersections.length > 0;
	var time = performance.now();
	var delta = ( time - prevTime ) / 1000;

	velocity.x -= velocity.x * 10.0 * delta;
	velocity.z -= velocity.z * 10.0 * delta;
	velocity.y -= 9.8 * 100.0 * delta; // 100.0 = mass
	direction.z = Number( moveForward ) - Number( moveBackward );
	direction.x = Number( moveLeft ) - Number( moveRight );
	direction.normalize(); // this ensures consistent movements in all directions
	if ( moveForward || moveBackward ) velocity.z -= direction.z * 400.0 * delta;
	if ( moveLeft || moveRight ) velocity.x -= direction.x * 400.0 * delta;
	// if ( onObject === true ) {
	// 	velocity.y = Math.max( 0, velocity.y );
	// 	canJump = true;
	// }
	controls.getObject().translateX( velocity.x * delta );
	controls.getObject().translateY( velocity.y * delta );
	controls.getObject().translateZ( velocity.z * delta );
	if ( controls.getObject().position.y < 10 ) {
		velocity.y = 0;
		controls.getObject().position.y = 10;
		canJump = true;
	}
	prevTime = time;

}

function renderVideo(){

	if ( video.readyState === video.HAVE_ENOUGH_DATA ) {
		imageContext.drawImage( video, 0, 0 );
		if ( texture ) texture.needsUpdate = true;
		if ( textureReflection ) textureReflection.needsUpdate = true;
	}
	imageReflectionContext.drawImage( image, 0, 0 );
	imageReflectionContext.fillStyle = imageReflectionGradient;
	imageReflectionContext.fillRect( 0, 0, 256, 128 );
}

function renderBirds(){
	for ( var i = 0, il = birds.length; i < il; i++ ) {
		boid = boids[ i ];
		boid.run( boids );
		bird = birds[ i ];
		bird.position.copy( boids[ i ].position );
		var color = bird.material.color;
		color.r = color.g = color.b = ( 500 - bird.position.z ) / 1000;
		bird.rotation.y = Math.atan2( - boid.velocity.z, boid.velocity.x );
		bird.rotation.z = Math.asin( boid.velocity.y / boid.velocity.length() );
		bird.phase = ( bird.phase + ( Math.max( 0, bird.rotation.z ) + 0.1 )  ) % 62.83;
		bird.geometry.vertices[ 5 ].y = bird.geometry.vertices[ 4 ].y = Math.sin( bird.phase ) * 5;
	}
}


function renderLights(){
	var time = Date.now() * 0.00025;
	var z = 20, d = 150;
	light1.position.x = Math.sin( time * 0.7 ) * d;
	light1.position.z = Math.cos( time * 0.3 ) * d;
	light2.position.x = Math.cos( time * 0.3 ) * d;
	light2.position.z = Math.sin( time * 0.7 ) * d;
	light3.position.x = Math.sin( time * 0.7 ) * d;
	light3.position.z = Math.sin( time * 0.5 ) * d;
	light4.position.x = Math.sin( time * 0.3 ) * d;
	light4.position.z = Math.sin( time * 0.5 ) * d;
	light5.position.x = Math.cos( time * 0.3 ) * d;
	light5.position.z = Math.sin( time * 0.5 ) * d;
	light6.position.x = Math.cos( time * 0.7 ) * d;
	light6.position.z = Math.cos( time * 0.5 ) * d;
	// controls.update( clock.getDelta() );
	renderer.render( scene, camera );
}
