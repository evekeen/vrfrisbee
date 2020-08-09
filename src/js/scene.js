import * as BABYLON from 'babylonjs';
import {CannonJSPlugin} from 'babylonjs';
import 'babylonjs-loaders';
import {findVelocity, rotate, trajectories} from "./trajectories";
import * as cannon from 'cannon';

const frameRate = 30;
const originalMaxTime = 3;
const playbackSpeed = 0.7;
const distanceConversion = 5;
const discretization = 10;
const velocityScale = 10;

const frisbeeScale = 0.00005;

export const createScene = async function (engine, canvas) {
  // Create scene
  const scene = new BABYLON.Scene(engine);
  scene.collisionsEnabled = true;
  const cannonPlugin = new CannonJSPlugin(true, 10, cannon);
  scene.enablePhysics(null, cannonPlugin);
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

  const camera = new BABYLON.FreeCamera("camera1", new BABYLON.Vector3(0, 0, -100), scene);
  camera.setTarget(new BABYLON.Vector3(0, 0, -1000));
  camera.attachControl(canvas, true);

  const light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(0, 1, 0), scene);
  light.intensity = 0.7;

  const fMaterial = new BABYLON.StandardMaterial("frisbee", scene);
  fMaterial.diffuseColor = new BABYLON.Color3(0, 0, 0);
  fMaterial.specularColor = new BABYLON.Color3(0.5, 0.6, 0.87);
  fMaterial.emissiveColor = new BABYLON.Color3(0.5, 0, 0.5);
  fMaterial.ambientColor = new BABYLON.Color3(0.23, 0.98, 0.53);
  fMaterial.alpha = 0.8;

  const pMaterial = new BABYLON.StandardMaterial("pineapple", scene);
  pMaterial.diffuseColor = new BABYLON.Color3(0, 0, 1);
  pMaterial.specularColor = new BABYLON.Color3(0.5, 0.6, 0.87);
  pMaterial.emissiveColor = new BABYLON.Color3(0, 0, 0);
  pMaterial.ambientColor = new BABYLON.Color3(0.23, 0.98, 0.53);
  pMaterial.alpha = 0.9;

  const pMaterialExplosion = new BABYLON.StandardMaterial("pineapple-explosion", scene);
  pMaterialExplosion.diffuseColor = new BABYLON.Color3(1, 0, 0);
  pMaterialExplosion.specularColor = new BABYLON.Color3(0.5, 0.6, 0.87);
  pMaterialExplosion.emissiveColor = new BABYLON.Color3(0, 0, 0);
  pMaterialExplosion.ambientColor = new BABYLON.Color3(0.23, 0.98, 0.53);
  pMaterialExplosion.alpha = 1;

  const assetsManager = new BABYLON.AssetsManager(scene);
  const landscapeTask = assetsManager.addMeshTask("landscape", "", "barcelona/", "scene.gltf");
  landscapeTask.onSuccess = task => {
    const landscape = task.loadedMeshes[0];
    landscape.rotation = new BABYLON.Vector3(0, Math.PI / 2, 0);
  };
  landscapeTask.onError = err => console.log("Cannot load scene", err);

  let pineapple;
  let frisbee;

  // const pTask = assetsManager.addMeshTask("pineapple", "", "pineapple/", "scene.gltf");
  // pTask.onError = err => console.log("Cannot load scene", err);
  // pTask.onSuccess = task => {
  //   task.loadedMeshes.forEach(e => e.checkCollisions = true);
  //   pineapple = task.loadedMeshes[0];
  //   pineapple.position = new BABYLON.Vector3(0, 0, 25);
  //   pineapple.scaling = new BABYLON.Vector3(3, 3, 3);
  //   pineapple.checkCollisions = true;
  //   pineapple.showBoundingBox = true;
  // };

  pineapple = BABYLON.MeshBuilder.CreateSphere("sphere", {diameter: 2}, scene);
  pineapple.position = new BABYLON.Vector3(0, 0, 25);
  pineapple.material = pMaterial;

  const task = assetsManager.addMeshTask("task2", "", "disc/", "scene.gltf");
  task.onError = err => console.log("Cannot load scene", err);
  task.onSuccess = task => {
    task.loadedMeshes.forEach(e => e.checkCollisions = true);
    frisbee = task.loadedMeshes[0];
    frisbee.position = new BABYLON.Vector3(0, 1, 0);
    frisbee.rotation = new BABYLON.Vector3(0, 0, 0);
    frisbee.scaling = new BABYLON.Vector3(frisbeeScale, frisbeeScale, frisbeeScale);
    frisbee.checkCollisions = true;
    frisbee.getChildMeshes(false, c => c.id === 'TARELKA_Mat.1_0')[0].material = fMaterial;
    frisbee.setEnabled(false);

    createParticles(scene, frisbee);
  }
  assetsManager.load();
  // createFogParticles(scene);

  let collision = false;
  const collisionFrames = frameRate * 5;
  let collisionFrame = 0;

  scene.registerBeforeRender(() => {
    if (!frisbee || !pineapple) return;
    if (frisbee.intersectsMesh(pineapple, false)) {
      if (!collision) {
        collision = true;
        collisionFrame = 0;
        pineapple.material = pMaterialExplosion;
        const scaling = 1.5;
        pineapple.scaling = new BABYLON.Vector3(scaling, scaling, scaling);
        pineapple.physicsImpostor = new BABYLON.PhysicsImpostor(pineapple, BABYLON.PhysicsImpostor.MeshImpostor, {
          mass: 10,
          restitution: 0.5
        }, scene);
        pineapple.physicsImpostor.applyImpulse(new BABYLON.Vector3(100, 10, 400), pineapple.getAbsolutePosition());
      }
    }
    if (collision && collisionFrame++ > collisionFrames) {
      collision = false;
      pineapple.material = pMaterial;
      pineapple.scaling = new BABYLON.Vector3(1, 1, 1);
      pineapple.position = new BABYLON.Vector3(0, 0, 25);
      pineapple.physicsImpostor = new BABYLON.PhysicsImpostor(pineapple, BABYLON.PhysicsImpostor.MeshImpostor, {
        mass: 0,
        restitution: 0.5
      }, scene);
    }
  });

  const ray = BABYLON.Ray.Zero();
  let pressed = false;
  let traceP = [];
  let traceR = [];

  xr.input.onControllerAddedObservable.add(controller => {
    if (controller.inputSource.handedness === 'right') {
      controller.onMotionControllerInitObservable.add(() => {
        const component = controller.motionController.getComponent('xr-standard-squeeze') || controller.motionController.getMainComponent();
        component.onButtonStateChangedObservable.add(() => {
          if (component.changes.pressed) {
            if (component.pressed) {
              pressed = true;
              traceP = [];
              traceR = [];
              if (frisbee) {
                frisbee.setEnabled(true);
                frisbee.position = ray.origin.clone();
                frisbee.rotation = BABYLON.Vector3.Zero();
              }
            } else {
              pressed = false;
              console.log(traceP);
              console.log(traceR);
              const velocity = findVelocity(traceP, 8);
              frisbee && throwFrisbee(scene, frisbee, ray, velocity);
            }
          }
        });
      });

      const frameObserver = xr.baseExperience.sessionManager.onXRFrameObservable.add(() => {
        controller.getWorldPointerRayToRef(ray, true);
        if (frisbee && pressed) {
          const position = ray.origin.clone();
          const direction = ray.direction.clone();
          traceP.push(position);
          traceR.push(direction);
          frisbee.position = position.clone();
          frisbee.rotation = BABYLON.Vector3.Zero();
        }
      });

      xr.input.onControllerRemovedObservable.add(() => {
        xr.baseExperience.sessionManager.onXRFrameObservable.remove(frameObserver);
      });
    }
  });

  return scene;
};

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

function throwFrisbee(scene, frisbee, ray, velocityArray) {
  const xSlide = new BABYLON.Animation("translateX", "position.x", frameRate, BABYLON.Animation.ANIMATIONTYPE_FLOAT, BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT);
  const ySlide = new BABYLON.Animation("translateY", "position.y", frameRate, BABYLON.Animation.ANIMATIONTYPE_FLOAT, BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT);
  const zSlide = new BABYLON.Animation("translateZ", "position.z", frameRate, BABYLON.Animation.ANIMATIONTYPE_FLOAT, BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT);
  const xRot = new BABYLON.Animation("xRot", "rotation.x", frameRate, BABYLON.Animation.ANIMATIONTYPE_FLOAT, BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT);
  const yRot = new BABYLON.Animation("yRot", "rotation.y", frameRate, BABYLON.Animation.ANIMATIONTYPE_FLOAT, BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT);
  const zRot = new BABYLON.Animation("zRot", "rotation.z", frameRate, BABYLON.Animation.ANIMATIONTYPE_FLOAT, BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT);

  const trajectory = trajectories.straightForehand;
  const [alpha_x, alpha_y, alpha_z] = trajectory.rotation;
  const translation = rotate(trajectory.translation, velocityArray, velocityScale);
  const [x, y, z] = translation;
  const xTranslated = x.map(p => p + ray.origin.x / distanceConversion);
  const yTranslated = y.map(p => p + ray.origin.y / distanceConversion);
  const zTranslated = z.map(p => p + ray.origin.z / distanceConversion);
  xSlide.setKeys(toPositionFrames(xTranslated));
  ySlide.setKeys(toPositionFrames(yTranslated));
  zSlide.setKeys(toPositionFrames(zTranslated));
  xRot.setKeys(toRotationFrames(alpha_x));
  yRot.setKeys(toRotationFrames(alpha_y));
  zRot.setKeys(toRotationFrames(alpha_z));
  scene.beginDirectAnimation(frisbee, [xSlide, zSlide, ySlide, xRot, zRot], 0, originalMaxTime / playbackSpeed * frameRate - 0.5 * frameRate / playbackSpeed, true);
}

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
}