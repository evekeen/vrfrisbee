import {createScene} from './Scene';
import {Engine} from 'babylonjs'
import WebXRPolyfill from 'webxr-polyfill';

const canvas = document.getElementById("renderCanvas"); // Get the canvas element
// @ts-ignore
const engine = new Engine(canvas, true); // Generate the BABYLON 3D engine

// @ts-ignore
if (!navigator.xr) {
  console.log('Enabling WebXR polyfill');
  new WebXRPolyfill();
}
// @ts-ignore
if (!navigator.xr) {
  alert('no xr');
  throw Error('not supported');
}

// @ts-ignore
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