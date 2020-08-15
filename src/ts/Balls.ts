import {AbstractMesh, Color3, MeshBuilder, StandardMaterial, Vector3} from "babylonjs";
import {CollidingCollection} from "./CollidingCollection";
import {Scene} from "babylonjs/scene";

export function initBalls(scene: Scene, numberOfTrees: number = 40): Promise<CollidingCollection> {
  const normal = new StandardMaterial("ball", scene);
  normal.diffuseColor = new Color3(0, 0.7, 0.1);
  normal.specularColor = new Color3(0.5, 0.6, 0.87);
  normal.emissiveColor = new Color3(0, 0.3, 0.3);
  normal.ambientColor = new Color3(0.23, 0.98, 0.53);

  const collided = normal.clone("ball-collided");
  collided.emissiveColor = new Color3(0, 1, 0);

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
  const scale = Math.random() + 1;
  ball.position = Vector3.FromArray(nextTreeCoordinates());
  ball.scaling = new Vector3(scale, scale, scale);
  ball.computeWorldMatrix();
  ball.checkCollisions = true;
  return ball;
}

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