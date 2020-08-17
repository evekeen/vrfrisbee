import * as math from "mathjs";
import {Vector3} from "babylonjs";

export function rotateZTrajectory(trajectory: number[][], velocityArray: number[]) {
  const [vx, vy, vz] = normalize(velocityArray);
  const [xSin, xCos] = getProjectionsNormalized(-vy, vy === 0 ? 1 : Math.abs(vz));
  const xRotation = math.matrix([
    [1, 0, 0],
    [0, xCos, -xSin],
    [0, xSin, xCos]
  ]);

  const [ySin, yCos] = getProjectionsNormalized(vx, vz);
  const yRotation = math.matrix([
    [yCos, 0, ySin],
    [0, 1, 0],
    [-ySin, 0, yCos]
  ]);

  const first = math.multiply(xRotation, trajectory);
  return math.multiply(yRotation, first);
}

export function scaleAndTranslate(trajectoryMatrix, scaleFactor, shiftArray) {
  const transform = math.matrix([
    [scaleFactor, 0, 0, shiftArray[0]],
    [0, scaleFactor, 0, shiftArray[1]],
    [0, 0, scaleFactor, shiftArray[2]],
    [0, 0, 0, 1]
  ]);
  const size = trajectoryMatrix.size
    ? trajectoryMatrix.size()[1]
    : math.subset(math.size(trajectoryMatrix), math.index(1));
  const ones = math.ones(size);
  const extended = math.subset(trajectoryMatrix, math.index(3, math.range(0, size)), ones);
  const product = math.multiply(transform, extended);
  return math.subset(product, math.index(math.range(0, 3), math.range(0, size)));
}

function getProjectionsNormalized(sin, cos) {
  const bothZero = sin === cos && cos === 0;
  const s = bothZero ? 0 : sin;
  const c = bothZero ? 1 : cos;
  const norm = Math.sqrt(s * s + c * c)
  return [s / norm, c / norm];
}

export function arrayLength(point: number[]): number {
  const [x, y, z] = point;
  return Math.sqrt(x * x + y * y + z * z);
}

export function pointToArray(point: Point): number[] {
  return [point.x, point.y, point.z];
}

export function average(velocities: Vector3[]): Vector3 {
  if (velocities.length === 0) return Vector3.Forward();
  const average = averagePoint(velocities);
  return new Vector3(average!!.x, average!!.y, average!!.z);
}

function averagePoint(points: Point[]): Point {
  const sum = points.reduce((average: Point, point: Point) => average ? {
    x: average.x + point.x,
    y: average.y + point.y,
    z: average.z + point.z
  } : point, undefined) as Point;
  return {x: sum.x / points.length, y: sum.y / points.length, z: sum.z / points.length};
}

export function normalize(array) {
  const length = arrayLength(array);
  if (length === 0) return array;
  return array.map(v => v / length);
}

export function getAngle(va: Vector3, vb: Vector3): number {
  const angle = Math.acos(Vector3.Dot(va.normalize(), vb.normalize()));
  const cross = Vector3.Cross(va, vb);
  return Vector3.Dot(Vector3.Up(), cross) < 0 ? -angle : angle;
}

interface Point {
  x: number;
  y: number;
  z: number;
}