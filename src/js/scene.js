import * as BABYLON from 'babylonjs';
import 'babylonjs-loaders';
import {createFogParticles} from "./fog";

export const createScene = async function (engine, canvas) {
  // Create scene
  const scene = new BABYLON.Scene(engine);
  // var env = scene.createDefaultEnvironment({enableGroundShadow: true, groundYBias: 1});
  // env.setMainColor(BABYLON.Color3.FromHexString("#010002"))

  // here we add XR support
  const xr = await scene.createDefaultXRExperienceAsync({
    // floorMeshes: [ground],
    uiOptions: {
      sessionMode: 'immersive-vr'
    }
  });
  if (!xr.baseExperience) {
    alert("No XR support");
  } else {
    console.log("XR supported");
  }

  const webXRInput = xr.input; // if using the experience helper, otherwise, an instance of WebXRInput
  webXRInput.onControllerAddedObservable.add((xrController /* WebXRInputSource instance */) => {
    // more fun with the new controller, since we are in XR!
    console.log(xrController);
    xrController.onMotionControllerInitObservable.add((motionController) => {
      // get the motionController, which is similar to but NOT a gamepad:
      console.log(motionController);
    });
    // xr supports all types of inputs, so some won't have a motion controller
    if (!xrController.gamepad) {
      // using touch, hands, gaze, something else?
    }
  });

  const camera = new BABYLON.FreeCamera("camera1", new BABYLON.Vector3(0, 0, -100), scene);
  camera.setTarget(new BABYLON.Vector3(0, 0, -1000));
  camera.attachControl(canvas, true);

  const light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(0, 1, 0), scene);
  light.intensity = 0.7;

  const frameRate = 30;
  const originalMaxTime = 3;
  const playbackSpeed = 0.7;
  const distanceConversion = 10;
  const discretization = 10;
  const heightBias = -1 * discretization;

  const x = [0.00,0.00,0.00,0.00,0.01,0.01,0.02,0.03,0.03,0.03,0.03,0.03,0.02,-0.00,-0.03,-0.06,-0.11,-0.17,-0.25,-0.36,-0.50,-0.69,-0.92,-1.20,-1.55,-1.95,-2.06,-2.06];
  const y = [1.00,0.99,0.97,0.96,0.97,1.00,1.04,1.10,1.17,1.24,1.31,1.37,1.42,1.46,1.48,1.48,1.46,1.42,1.35,1.27,1.16,1.02,0.85,0.64,0.39,0.09,-0.00,-0.00];
  const z = [0.00,1.05,2.07,3.05,4.00,4.91,5.78,6.62,7.41,8.16,8.88,9.56,10.21,10.83,11.41,11.97,12.51,13.03,13.52,14.00,14.46,14.89,15.29,15.66,15.97,16.21,16.26,16.26];
  const alpha_x = [0.00,-0.07,-0.14,-0.20,-0.25,-0.31,-0.35,-0.40,-0.44,-0.47,-0.51,-0.54,-0.56,-0.59,-0.61,-0.63,-0.65,-0.67,-0.69,-0.71,-0.73,-0.75,-0.77,-0.79,-0.80,-0.81,-0.82,-0.82];
  const alpha_y = [0.00,-21.47,-42.90,-64.31,-85.70,-107.06,-128.40,-149.71,-171.01,-192.29,-213.56,-234.81,-256.05,-277.28,-298.50,-319.71,-340.91,-362.11,-383.29,-404.47,-425.65,-446.83,-468.00,-489.17,-510.33,-531.50,-537.00,-537.00];
  const alpha_z = [0.00,-0.01,-0.01,-0.01,-0.01,-0.00,0.00,0.01,0.02,0.03,0.04,0.05,0.06,0.07,0.08,0.10,0.11,0.12,0.13,0.14,0.14,0.14,0.14,0.12,0.10,0.07,0.06,0.06];

  function toPositionFrames(points, bias) {
    bias = bias || 0;
    return points.map((p, i) => ({
      frame: i * frameRate / discretization / playbackSpeed,
      value: p * distanceConversion + bias
    }));
  }

  function toRotationFrames(points) {
    return points.map((p, i) => ({
      frame: i * frameRate / discretization / playbackSpeed,
      value: p
    }));
  }

  // createParticles(scene);

  const assetsManager = new BABYLON.AssetsManager(scene);
  const landscapeTask = assetsManager.addMeshTask("landscape", "", "/barcelona/", "scene.gltf");
  landscapeTask.onSuccess = task => {
    const landscape = task.loadedMeshes[0];
    landscape.rotation = new BABYLON.Vector3(0, Math.PI / 2, 0);
  };
  landscapeTask.onError = err => console.log("Cannot load scene", err);

  const task = assetsManager.addMeshTask("task2", "", "disc/", "scene.gltf");
  task.onError = err => console.log("Cannot load scene", err);
  task.onSuccess = task => {
    const frisbee = task.loadedMeshes[0];
    frisbee.position = new BABYLON.Vector3(0, 1, 0);
    frisbee.rotation = new BABYLON.Vector3(0, 0, 0);
    frisbee.scaling = new BABYLON.Vector3(0.0001, 0.0001, 0.0001);

    const material = new BABYLON.StandardMaterial("frisbee", scene);
    material.diffuseColor = new BABYLON.Color3(0, 0, 0);
    material.specularColor = new BABYLON.Color3(0.5, 0.6, 0.87);
    material.emissiveColor = new BABYLON.Color3(0.5, 0, 0.5);
    material.ambientColor = new BABYLON.Color3(0.23, 0.98, 0.53);
    frisbee.getChildMeshes(false, c => c.id === 'TARELKA_Mat.1_0')[0].material = material;

    try {
      const velocityCorrection = 1
      const xSlide = new BABYLON.Animation("translateX", "position.x", frameRate * velocityCorrection, BABYLON.Animation.ANIMATIONTYPE_FLOAT, BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE);
      const ySlide = new BABYLON.Animation("translateY", "position.y", frameRate * velocityCorrection, BABYLON.Animation.ANIMATIONTYPE_FLOAT, BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE);
      const zSlide = new BABYLON.Animation("translateZ", "position.z", frameRate * velocityCorrection, BABYLON.Animation.ANIMATIONTYPE_FLOAT, BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE);
      xSlide.setKeys(toPositionFrames(x));
      ySlide.setKeys(toPositionFrames(y, heightBias));
      zSlide.setKeys(toPositionFrames(z));
      const xRot = new BABYLON.Animation("xRot", "rotation.x", frameRate * velocityCorrection, BABYLON.Animation.ANIMATIONTYPE_FLOAT, BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE);
      const yRot = new BABYLON.Animation("yRot", "rotation.y", frameRate * velocityCorrection, BABYLON.Animation.ANIMATIONTYPE_FLOAT, BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE);
      const zRot = new BABYLON.Animation("zRot", "rotation.z", frameRate * velocityCorrection, BABYLON.Animation.ANIMATIONTYPE_FLOAT, BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE);
      xRot.setKeys(toRotationFrames(alpha_x));
      yRot.setKeys(toRotationFrames(alpha_y));
      zRot.setKeys(toRotationFrames(alpha_z));
      scene.beginDirectAnimation(frisbee, [xSlide, zSlide, ySlide, xRot, zRot], 0, originalMaxTime / playbackSpeed * frameRate - 0.5 * frameRate / playbackSpeed , true);

      createParticles(scene, frisbee);
    } catch (e) {
      console.log(e);
    }
  }
  assetsManager.load();
  // createFogParticles(scene);

  return scene;
};

function createParticles(scene, emitter) {
  const particleSystem = new BABYLON.ParticleSystem("particles", 2000, scene);
  particleSystem.emitter = emitter;
  particleSystem.particleTexture = new BABYLON.Texture("flare.png", scene);

  particleSystem.color1 = new BABYLON.Color4(0.7, 0.8, 1.0, 1.0);
  particleSystem.color2 = new BABYLON.Color4(0.2, 0.5, 1.0, 1.0);
  particleSystem.colorDead = new BABYLON.Color4(0, 0, 0.2, 0.0);

  particleSystem.minSize = 0.2;
  particleSystem.maxSize = 0.5;

  // Life time of each particle (random between...
  particleSystem.minLifeTime = 0.3;
  particleSystem.maxLifeTime = 2;

  // Emission rate
  particleSystem.emitRate = 5500;

  // Blend mode : BLENDMODE_ONEONE, or BLENDMODE_STANDARD
  particleSystem.blendMode = BABYLON.ParticleSystem.BLENDMODE_ONEONE;

  // Set the gravity of all particles
  particleSystem.gravity = new BABYLON.Vector3(5, -9.81, 0);

  // Direction of each particle after it has been emitted
  particleSystem.direction1 = new BABYLON.Vector3(-1000, -1000, -100);
  particleSystem.direction2 = new BABYLON.Vector3(1000, 1000, 100);

  // Angular speed, in radians
  particleSystem.minAngularSpeed = -Math.PI;
  particleSystem.maxAngularSpeed = Math.PI / 2;

  // Speed
  particleSystem.minEmitPower = 10;
  particleSystem.maxEmitPower = 20;
  particleSystem.updateSpeed = 0.005;

  // Start the particle system
  particleSystem.start();
};