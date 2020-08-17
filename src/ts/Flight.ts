import {AbstractMesh, Animation, Scene} from "babylonjs";
import {Trajectory} from "./trajectories";

export function animateFlight(scene: Scene, frisbee: AbstractMesh, trajectory: Trajectory) {
  const {translation, rotation} = trajectory;
  const xSlide = new Animation("translateX", "position.x", frameRate, Animation.ANIMATIONTYPE_FLOAT, Animation.ANIMATIONLOOPMODE_CONSTANT);
  const ySlide = new Animation("translateY", "position.y", frameRate, Animation.ANIMATIONTYPE_FLOAT, Animation.ANIMATIONLOOPMODE_CONSTANT);
  const zSlide = new Animation("translateZ", "position.z", frameRate, Animation.ANIMATIONTYPE_FLOAT, Animation.ANIMATIONLOOPMODE_CONSTANT);
  const xRot = new Animation("xRot", "rotation.x", frameRate, Animation.ANIMATIONTYPE_FLOAT, Animation.ANIMATIONLOOPMODE_CONSTANT);
  const yRot = new Animation("yRot", "rotation.y", frameRate, Animation.ANIMATIONTYPE_FLOAT, Animation.ANIMATIONLOOPMODE_CONSTANT);
  const zRot = new Animation("zRot", "rotation.z", frameRate, Animation.ANIMATIONTYPE_FLOAT, Animation.ANIMATIONLOOPMODE_CONSTANT);
  xSlide.setKeys(toPositionFrames(translation[0]));
  ySlide.setKeys(toPositionFrames(translation[1]));
  zSlide.setKeys(toPositionFrames(translation[2]));
  xRot.setKeys(toRotationFrames(rotation[0]));
  yRot.setKeys(toRotationFrames(rotation[1]));
  zRot.setKeys(toRotationFrames(rotation[2]));
  return scene.beginDirectAnimation(frisbee, [xSlide, zSlide, ySlide, xRot, zRot], 0, originalMaxTime / playbackSpeed * frameRate - 2 * frameRate / DISCRETIZATION / playbackSpeed, false);
}

function toPositionFrames(points: number[], bias?: number): any[] {
  const b = bias || 0;
  return points.map((p, i) => ({
    frame: i * frameRate / DISCRETIZATION / playbackSpeed,
    value: p * DISTANCE_CONVERSION + b
  }));
}

function toRotationFrames(points: number[]): any[] {
  return points.map((p, i) => ({
    frame: i * frameRate / DISCRETIZATION / playbackSpeed,
    value: p
  }));
}

const frameRate = 30;
const originalMaxTime = 5;
const playbackSpeed = 1;
export const DISTANCE_CONVERSION = 4;
export const DISCRETIZATION = 10;
export const RECORDED_VELOCITY = 10; // m/s