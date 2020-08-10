import * as BABYLON from 'babylonjs';


export function animateFlight(scene, frisbee, trajectory) {
  const {translation, rotation} = trajectory;
  const xSlide = new BABYLON.Animation("translateX", "position.x", frameRate, BABYLON.Animation.ANIMATIONTYPE_FLOAT, BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT);
  const ySlide = new BABYLON.Animation("translateY", "position.y", frameRate, BABYLON.Animation.ANIMATIONTYPE_FLOAT, BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT);
  const zSlide = new BABYLON.Animation("translateZ", "position.z", frameRate, BABYLON.Animation.ANIMATIONTYPE_FLOAT, BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT);
  const xRot = new BABYLON.Animation("xRot", "rotation.x", frameRate, BABYLON.Animation.ANIMATIONTYPE_FLOAT, BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT);
  const yRot = new BABYLON.Animation("yRot", "rotation.y", frameRate, BABYLON.Animation.ANIMATIONTYPE_FLOAT, BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT);
  const zRot = new BABYLON.Animation("zRot", "rotation.z", frameRate, BABYLON.Animation.ANIMATIONTYPE_FLOAT, BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT);
  xSlide.setKeys(toPositionFrames(translation[0]));
  ySlide.setKeys(toPositionFrames(translation[1]));
  zSlide.setKeys(toPositionFrames(translation[2]));
  xRot.setKeys(toRotationFrames(rotation[0]));
  yRot.setKeys(toRotationFrames(rotation[1]));
  zRot.setKeys(toRotationFrames(rotation[2]));
  const anim = scene.beginDirectAnimation(frisbee, [xSlide, zSlide, ySlide, xRot, zRot], 0, originalMaxTime / playbackSpeed * frameRate - 0.5 * frameRate / playbackSpeed, false);
  anim.onAnimationEnd = () => setTimeout(() => frisbee.dispose(), 1000);
  return anim;
}

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

const frameRate = 30;
const originalMaxTime = 3;
const playbackSpeed = 0.7;
export const distanceConversion = 10;
export const velocityFactor = 1.3;
export const discretization = 10;