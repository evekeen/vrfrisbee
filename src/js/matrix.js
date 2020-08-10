import * as math from "mathjs";

export function rotateZTrajectory(trajectory, velocityArray) {
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
  return math.multiply(yRotation, first).toArray();
}

function getProjectionsNormalized(sin, cos) {
  const bothZero = sin === cos && cos === 0;
  const s = bothZero ? 0 : sin;
  const c = bothZero ? 1 : cos;
  const norm = Math.sqrt(s * s + c * c)
  return [s / norm, c / norm];
}

export function arrayLength(point) {
  const [x, y, z] = point;
  return Math.sqrt(x * x + y * y + z * z);
}

export function pointToArray(point) {
  return [point.x, point.y, point.z];
}

export function findLastVelocity(traceP, pointNumber) {
  if (traceP.length < 2) return [0, 0, 1];

  const velocities = differentiate(traceP, pointNumber);
  // const lengths = velocities.map(vectorSquareLength);
  // const indexOfMaxVelocity = lengths.reduce((iMax, x, i, arr) => x > arr[iMax] ? i : iMax, 0);
  const indexOfMaxVelocity = velocities.length - 1;
  let average;
  if (indexOfMaxVelocity === 0) {
    average = averagePoint(velocities.slice(indexOfMaxVelocity, indexOfMaxVelocity + 1));
  } else if (indexOfMaxVelocity === velocities.length - 1) {
    average = averagePoint(velocities.slice(indexOfMaxVelocity - 1, indexOfMaxVelocity));
  } else {
    average = averagePoint(velocities.slice(indexOfMaxVelocity - 1, indexOfMaxVelocity + 1));
  }
  return pointToArray(average);
}

export function findAverageVelocity(traceP, pointNumber) {
  if (traceP.length < 2) return [0, 0, 1];
  const velocities = differentiate(traceP, pointNumber);
  const average = averagePoint(velocities);
  return pointToArray(average);
}

function differentiate(traceP, pointNumber) {
  const lastPoints = traceP.slice(-pointNumber);
  return lastPoints.slice(1).map((p, i) => {
    return {
      x: p.x - lastPoints[i].x,
      y: p.y - lastPoints[i].y,
      z: p.z - lastPoints[i].z
    };
  });
}

function averagePoint(points) {
  return points.reduce((average, point) => average ? {
    x: average.x + point.x / 2,
    y: average.y + point.y / 2,
    z: average.z + point.z / 2
  } : point, undefined);
}

export function normalize(array) {
  const length = arrayLength(array);
  if (length === 0) return array;
  return array.map(v => v / length);
}