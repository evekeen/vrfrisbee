import {findAverageVelocity} from "./matrix";
import * as cannon from 'cannon';
import {createParticles} from "./Particles";
import {animateFlight} from "./Flight";
import {getTrajectory} from "./trajectories";
import {
  AssetsManager,
  Ray,
  Scene,
  CannonJSPlugin,
  Color3,
  MeshBuilder,
  FreeCamera,
  Vector3,
  HemisphericLight, StandardMaterial, AbstractMesh
} from "babylonjs";

import 'babylonjs-loaders';
import { initForest } from './Forest';
import {initBalls} from "./Balls";


const frisbeeScale = 0.00002;
const frisbees: AbstractMesh[] = [];
let frisbeeCounter = 0;

let frisbee;

const ray = Ray.Zero();
let pressed = false;
let traceP: Vector3[] = [];
let frisbeeOrientation : Vector3 | undefined = undefined;

export const createScene = async function (engine, canvas) {
  const scene = new Scene(engine);
  scene.collisionsEnabled = true;
  const cannonPlugin = new CannonJSPlugin(true, 10, cannon);
  scene.enablePhysics(null, cannonPlugin);
  const env = scene.createDefaultEnvironment({
    enableGroundShadow: false,
    createSkybox: false
  })!!;
  env.setMainColor(Color3.FromHexString("#010002"));

  const ground = MeshBuilder.CreateGround("ground", {width: 50, height: 50}, scene);

  const xr = await scene.createDefaultXRExperienceAsync({
    floorMeshes: [ground],
    uiOptions: {
      sessionMode: 'immersive-vr'
    }
  });
  if (!xr.baseExperience) {
    alert("No XR support");
  } else {
    console.log("XR supported");
  }

  xr.teleportation.attach();
  xr.pointerSelection.attach();

  const camera = new FreeCamera("camera1", new Vector3(0, 0, -100), scene);
  camera.setTarget(new Vector3(0, 0, -1000));
  camera.attachControl(canvas, true);

  const light = new HemisphericLight("light", new Vector3(0, 1, 0), scene);
  light.intensity = 0.3;

  const fMaterial = new StandardMaterial("frisbee", scene);
  fMaterial.diffuseColor = new Color3(0, 0, 0);
  fMaterial.specularColor = new Color3(0.5, 0.6, 0.87);
  fMaterial.emissiveColor = new Color3(0.5, 0, 0.5);
  fMaterial.ambientColor = new Color3(0.23, 0.98, 0.53);
  fMaterial.alpha = 0.8;

  const groundMat = new StandardMaterial("ground", scene);
  groundMat.diffuseColor = Color3.FromHexString('#010002');
  groundMat.specularColor = new Color3(0.5, 0.6, 0.87);
  groundMat.emissiveColor = new Color3(0.1, 0, 0.1);
  groundMat.ambientColor = new Color3(0.1, 0, 0.1);
  groundMat.alpha = 1;
  ground.material = groundMat;

  const assetsManager = new AssetsManager(scene);
  const landscapeTask = assetsManager.addMeshTask("milkyway", "", "milkyway/", "scene.gltf");
  landscapeTask.onSuccess = task => task.loadedMeshes[0];

  const forest = initForest(assetsManager);
  const balls = initBalls(scene);

  const task = assetsManager.addMeshTask("task2", "", "disc/", "scene.gltf");
  task.onError = err => console.log("Cannot load scene", err);
  task.onSuccess = task => {
    frisbee = task.loadedMeshes[0];
    frisbee.position = new Vector3(0, 1, 0);
    frisbee.rotation = new Vector3(0, 0, 0);
    frisbee.scaling = new Vector3(frisbeeScale, frisbeeScale, frisbeeScale);
    frisbee.checkCollisions = true;
    setFrisbeeMaterial(frisbee, fMaterial);
    frisbee.setEnabled(false);

    createParticles(scene, frisbee);
  }
  assetsManager.load();

  scene.registerBeforeRender(() => {
    frisbees.forEach(frisbee => {
      if (frisbee.position.y < -1) {
        frisbee.dispose();
      }
      balls.then(b => b.checkCollisions(frisbee));
      forest.then(f => f.checkCollisions(frisbee));
    });
  });

  function listenToComponent(component, controller) {
    component && component.onButtonStateChangedObservable.add(() => {
      if (component.changes.pressed) {
        if (component.pressed) {
          pressed = true;
          traceP = [];
          if (frisbee) {
            frisbee.setEnabled(true);
            frisbee.position = ray.origin.clone();
            setRotationFrom(controller);
          }
        } else {
          pressed = false;
          // console.log(traceP);
          frisbee && throwFrisbee();
        }
      }
    });
  }

  xr.input.onControllerAddedObservable.add(controller => {
    if (controller.inputSource.handedness === 'right') {
      controller.onMotionControllerInitObservable.add(() => {
        listenToComponent(controller.motionController!!.getComponent('xr-standard-squeeze'), controller);
        listenToComponent(controller.motionController!!.getMainComponent(), controller);
      });

      const frameObserver = xr.baseExperience.sessionManager.onXRFrameObservable.add(() => {
        controller.getWorldPointerRayToRef(ray, true);
        if (frisbee && pressed) {
          const position = ray.origin.clone()!!;
          frisbeeOrientation = ray.direction.clone();
          traceP.push(position);
          frisbee.position = position.clone();
          setRotationFrom(controller);
        }
      });

      xr.input.onControllerRemovedObservable.add(() => {
        xr.baseExperience.sessionManager.onXRFrameObservable.remove(frameObserver);
      });
    }
  });

  function setRotationFrom(controller) {
    const rotationQuaternion = controller.pointer.rotationQuaternion;
    const frisbeeRotation = rotationQuaternion.toEulerAngles();
    frisbee.rotation = new Vector3(frisbeeRotation.x, frisbeeRotation.y, frisbeeRotation.z);
  }

  function throwFrisbee() {
    const clone = cloneFrisbee(frisbee);
    frisbee.setEnabled(false);
    const trajectory = getTrajectory(traceP, frisbeeOrientation, (points) => findAverageVelocity(points, 3));
    animateFlight(scene, clone, trajectory).onAnimationEnd = () => {
      clone.isVisible = false;
      setTimeout(() => clone.dispose(), 1000);
    };
  }

  return scene;
};

function getFrisbeeMesh(frisbee) {
  return frisbee.getChildMeshes(false, c => c.id.indexOf('TARELKA_Mat.1_0') !== -1)[0];
}

function setFrisbeeMaterial(frisbee, material) {
  getFrisbeeMesh(frisbee).material = material;
}

function cloneFrisbee(frisbee) {
  const clone = frisbee.clone();
  getFrisbeeMesh(clone).checkCollisions = true;
  const id = frisbeeCounter++;
  frisbees[id] = clone;
  clone.onDispose = () => delete frisbees[id];
  return clone;
}