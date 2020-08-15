import {AbstractMesh, Color3, MeshBuilder, StandardMaterial, Vector3} from "babylonjs";
import {CollidingCollection} from "./CollidingCollection";
import {Scene} from "babylonjs/scene";

export function initBalls(scene: Scene, numberOfTrees: number = 40): Promise<CollidingCollection> {
  const normal = new StandardMaterial("ball", scene);
  normal.emissiveColor = Color3.FromHexString('#736f00');
  const collided = normal.clone("ball-collided");
  collided.emissiveColor = Color3.FromHexString('#fff64d');

  const original = MeshBuilder.CreateSphere("sphere", {diameter: 1}, scene);
  original.material = normal;

  return new Promise<CollidingCollection>(resolve => {
    const balls: AbstractMesh[] = [];
    for (let i = 0; i < numberOfTrees; i++) {
      balls.push(setupBall(original, i));
    }
    original.dispose();
    resolve(new CollidingCollection(balls, {normal, collided}));
  });
}

function setupBall(original: AbstractMesh, i: number): AbstractMesh {
  const ball = original.clone('ball' + i, null)!!;
  const scale = Math.random() * SCALE_RANGE + 1;
  ball.position = Vector3.FromArray(nextTreeCoordinates());
  ball.scaling = new Vector3(scale, scale, scale);
  ball.computeWorldMatrix();
  ball.checkCollisions = true;
  return ball;
}

const SCALE_RANGE = 2;
const RANGE_DISTANCE = 20;
const MIN_DISTANCE = 15;
const RANGE_Y = 10;
const MIN_Y = 2;

function nextTreeCoordinates(): number[] {
  const distance = Math.random() * RANGE_DISTANCE + MIN_DISTANCE;
  const angle = Math.random() * Math.PI * 2;
  const x = Math.cos(angle) * distance;
  const z = Math.sin(angle) * distance;
  const y = Math.random() * RANGE_Y + MIN_Y;
  return [x, y, z];
}