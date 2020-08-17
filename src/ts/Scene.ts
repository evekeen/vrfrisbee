import {average} from "./matrix";
import * as cannon from 'cannon';
import {createParticles} from "./Particles";
import {animateFlight} from "./Flight";
import {getTilt, getTrajectory} from "./trajectories";
import {
  AbstractMesh,
  AssetsManager,
  CannonJSPlugin,
  Color3,
  HemisphericLight,
  Matrix,
  MeshBuilder,
  Ray,
  Scene,
  StandardMaterial,
  Vector3,
  WebXRInputSource,
  Engine
} from "babylonjs";

import 'babylonjs-loaders';
import {initForest} from './Forest';
import {initBalls} from "./Balls";
import {WebXRCamera} from "babylonjs/XR/webXRCamera";
import {WebXRControllerComponent} from "babylonjs/XR/motionController/webXRControllerComponent";

export const createScene = async function (engine: Engine) {
  const frisbees: AbstractMesh[] = [];
  let frisbeeCounter = 0;
  let frisbee: AbstractMesh | undefined;

  const ray = Ray.Zero();
  let grabbed = false;
  let traceP: Vector3[] = [];
  let velocities: Vector3[] = [];
  let frisbeeOrientation: Vector3 | undefined = undefined;


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

  const light = new HemisphericLight("light", new Vector3(0, 1, 0), scene);
  light.intensity = 0.5;

  const fMaterial = new StandardMaterial("frisbee", scene);
  fMaterial.diffuseColor = new Color3(0.1, 0, 0.1);
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

  const task = assetsManager.addMeshTask("frisbee", "", "disc/", "disc.gltf");
  task.onError = err => console.log("Cannot load scene", err);
  task.onSuccess = task => {
    frisbee = task.loadedMeshes[0];
    frisbee.rotation = new Vector3(0, 0, 0);
    frisbee.checkCollisions = true;
    frisbee.getChildMeshes()[0].material = fMaterial;
    frisbee.setEnabled(false);
    frisbee.setPivotMatrix(Matrix.Translation(-PIVOT_SHIFT.x, -PIVOT_SHIFT.y, -PIVOT_SHIFT.z), false);
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

  function listenToComponent(component: WebXRControllerComponent, controller) {
    component && component.onButtonStateChangedObservable.add(() => {
      if (component.changes.value) {
        const camera = xr.baseExperience.camera;
        const pressure = component.value;
        if (pressure > GRAB_THRESHOLD) {
          grabbed = true;
          traceP = [];
          if (frisbee) {
            frisbee.position = getFrisbeePosition(ray, camera);
            setRotationFrom(controller);
            frisbee.setEnabled(true);
          }
        } else if (pressure < RELEASE_THRESHOLD) {
          grabbed = false;
          const cameraDirection = getCameraDirection(camera);
          frisbee && throwFrisbee(cameraDirection);
        }
      }
    });
  }

  let t = 0;

  xr.input.onControllerAddedObservable.add((controller: WebXRInputSource) => {
    if (controller.inputSource.handedness === 'right') {
      controller.onMotionControllerInitObservable.add(() => {
        listenToComponent(controller.motionController!!.getComponent('xr-standard-squeeze'), controller);
        listenToComponent(controller.motionController!!.getMainComponent(), controller);
      });

      const frameObserver = xr.baseExperience.sessionManager.onXRFrameObservable.add(() => {
        controller.getWorldPointerRayToRef(ray, true);
        if (frisbee && grabbed) {
          const position = getFrisbeePosition(ray, xr.baseExperience.camera);
          const prevPosition = traceP.length ? traceP[traceP.length - 1] : undefined;
          if (prevPosition) {
            const ratio = 1 / engine.getDeltaTime() * 1000;
            const vector = position.subtract(prevPosition);
            const velocity = vector.multiplyByFloats(ratio, ratio, ratio);
            velocities.push(velocity);
          }
          traceP.push(position);
          frisbee.position = position;
          setRotationFrom(controller);
        }
      });

      xr.input.onControllerRemovedObservable.add(() => {
        xr.baseExperience.sessionManager.onXRFrameObservable.remove(frameObserver);
      });
    }
  });

  function setRotationFrom(controller: WebXRInputSource) {
    const rotationQuaternion = controller.pointer.rotationQuaternion!!;
    const frisbeeRotation = rotationQuaternion.toEulerAngles();
    frisbee!!.rotation = new Vector3(frisbeeRotation.x, frisbeeRotation.y, frisbeeRotation.z);
    frisbeeOrientation = controller.pointer.forward;
  }

  function throwFrisbee(cameraDirection: Vector3): void {
    if (velocities.length === 0) return;
    const clone = cloneFrisbee(frisbee);
    frisbee!!.setEnabled(false);
    let velocity = average(velocities.slice(-3));
    if (velocity.length() === 0) {
      velocity = cameraDirection.scale(2);
    }
    const trajectory = getTrajectory(traceP, frisbeeOrientation!!, velocity);
    const particles = createParticles(scene, clone!!.position);
    animateFlight(scene, clone, trajectory).onAnimationEnd = () => {
      clone.isVisible = false;
      setTimeout(() => {
        clone.dispose();
        particles.stop();
      }, 1000);
    };
  }

  function cloneFrisbee(frisbee) {
    const clone = frisbee.clone();
    clone.checkCollisions = true;
    const id = frisbeeCounter++;
    frisbees[id] = clone;
    clone.onDispose = () => delete frisbees[id];
    // TODO translate clone on frisbee.pivot
    clone.setPivotMatrix(Matrix.Translation(0, 0, 0), false);
    return clone;
  }

  return scene;
};

function getFrisbeePosition(ray: Ray, camera: WebXRCamera) {
  return ray.origin.clone();
  // const headPosition = camera.position;
  // const headToController = controllerPosition.subtract(headPosition);
  // // const cameraDirection = getCameraDirection(camera);
  // // const norm = headToController.cross(cameraDirection);
  // // const toSide = cameraDirection.cross(norm).normalize().scale(scale);
  // const toSide = headToController.normalize().scale(FRISBEE_PIVOT_SHIFT);
  // toSide.y = 0;
  // return controllerPosition.add(toSide);
}

function getCameraDirection(camera: WebXRCamera): Vector3 {
  return camera.getTarget().subtract(camera.position).normalize();
}

const FRISBEE_PIVOT_SHIFT = 0.15;
const PIVOT_SHIFT = new Vector3(0, 0, FRISBEE_PIVOT_SHIFT);

const GRAB_THRESHOLD = 0.9;
const RELEASE_THRESHOLD = 0.8;