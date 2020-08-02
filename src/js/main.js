import * as BABYLON from '@babylonjs/core/Legacy/legacy';
import {createScene} from './scene.js';

const canvas = document.getElementById("renderCanvas"); // Get the canvas element
const engine = new BABYLON.Engine(canvas, true); // Generate the BABYLON 3D engine

// let polyfill = new WebXRPolyfill();
if (!navigator.xr) {
  alert('no xr');
  throw Error('not supported');
}

const scenePromise = createScene(engine, canvas); //Call the createScene function

engine.runRenderLoop(async function () {
  const scene = await scenePromise;
  scene.render();
});

window.addEventListener("resize", function () {
  engine.resize();
});

// scenePromise.then(scene => {
//   scene.debugLayer.show({
//     overlay: false
//   });
// });