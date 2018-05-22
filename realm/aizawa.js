import * as THREE from 'three';

const numParticles = 15000;
let particles;

const world = new THREE.Object3D();
world.position.y = -100;


const createAizawa = () => {
  const a = 0.95;
  const b = 0.7;
  const c = 0.6;
  const d = 3.5;
  const e = 0.25;
  const f = 0.1;
  const time = 0.01;

  // scale x, y, z position by this factor
  const scale = 150;

  // begin position
  let x = 0.1;
  let y = 0;
  let z = 0;

  const points = [];

    // calculate points for attractor and push them in the geometry
  for (let i = 0; i < numParticles; i++) {
    let x1 = (z - b) * x - d * y;
    let y1 = d * x + (z - b) * y;
    let z1 = c + a * z - (Math.pow(z, 3) / 3) - (Math.pow(x, 2) + Math.pow(y, 2)) * (1 + e * z) + f * z * (Math.pow(x, 3));

    x1 *= time;
    y1 *= time;
    z1 *= time;

    x += x1;
    y += y1;
    z += z1;

    // add new vector to the geometry
    // and yes, it should be x, y, z but i like this better
    const vector = new THREE.Vector3(
      -y * scale,
      z * scale,
      x * scale
    );

    points.push(vector);
  }

  const spline = new THREE.CatmullRomCurve3(points);
  spline.type = 'catmullrom';
  spline.tension = 0;

  const extrudeSettings = {
    steps: numParticles / 2,
    bevelEnabled: false,
    extrudePath: spline
  };

  const shapePoints = [];
  const numPoints = 4;
  const width = 7;

  shapePoints.push(new THREE.Vector2(0, 0));
  shapePoints.push(new THREE.Vector2(width, 0));
  shapePoints.push(new THREE.Vector2(width, width));
  shapePoints.push(new THREE.Vector2(0, width));

  const shape = new THREE.Shape(shapePoints);
  const geometry = new THREE.ExtrudeGeometry(shape, extrudeSettings);
  const material = new THREE.MeshPhongMaterial({
    color: 0xaafaff,
    emissive: 0xffaa00,
    shininess: 100,
    fog: true
  });

  const mesh = new THREE.Mesh(geometry, material);
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  world.add(mesh);
}


const createCoullet = () => {
  const a = 0.8;
  const b = -1.1;
  const c = -0.45;
  const d = -1;
  const time = 0.01;

  // scale x, y, z position by this factor
  const scale = 150;

  // begin position
  let x = 0.1;
  let y = 0;
  let z = 0;

  const points = [];

    // calculate points for attractor and push them in the geometry
  for (let i = 0; i < numParticles; i++) {
    let x1 = y;
    let y1 = z;
    let z1 = (a*x) + (b*y) + (c*z) + (d*Math.pow(x, 3));

    x1 *= time;
    y1 *= time;
    z1 *= time;

    x += x1;
    y += y1;
    z += z1;

    // add new vector to the geometry
    const vector = new THREE.Vector3(
      x * scale,
      y * scale,
      z * scale
    );

    points.push(vector);
  }

  const spline = new THREE.CatmullRomCurve3(points);
  spline.type = 'catmullrom';
  spline.tension = 0;

  const extrudeSettings = {
    steps: numParticles / 2,
    bevelEnabled: false,
    extrudePath: spline
  };

  const shapePoints = [];
  const numPoints = 4;
  const width = 7;

  shapePoints.push(new THREE.Vector2(0, 0));
  shapePoints.push(new THREE.Vector2(width, 0));
  shapePoints.push(new THREE.Vector2(width, width));
  shapePoints.push(new THREE.Vector2(0, width));

  const shape = new THREE.Shape(shapePoints);
  const geometry = new THREE.ExtrudeGeometry(shape, extrudeSettings);
  const material = new THREE.MeshLambertMaterial({
    color: 0xb3b3b3,
    emissive: 0x575757,
    fog: true
  });

  const mesh = new THREE.Mesh(geometry, material);
  mesh.castShadow = true;
  mesh.receiveShadow = false;
  world.add(mesh);
}

// const loop = () => {
//   world.rotation.y += 0.01;
//   renderer.render(scene, camera);
//
//   rafId = requestAnimationFrame(loop);
// }


module.exports = {
  createAizawa, createCoullet, world 
}
