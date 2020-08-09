import * as math from 'mathjs';

export const trajectories = {
  straightForehand: {
    translation: [
      [0.00, 0.00, 0.00, 0.00, 0.01, 0.01, 0.02, 0.03, 0.03, 0.03, 0.03, 0.03, 0.02, -0.00, -0.03, -0.06, -0.11, -0.17, -0.25, -0.36, -0.50, -0.69, -0.92, -1.20, -1.55, -1.95, -2.06, -2.06],
      [0.00, -0.01, -0.03, -0.04, -0.03, -0.00, 0.04, 0.10, 0.17, 0.24, 0.31, 0.37, 0.42, 0.46, 0.48, 0.48, 0.46, 0.42, 0.35, 0.27, 0.16, 0.02, -0.15, -0.36, -0.61, -0.91, -1.00, -1.00],
      [0.00, 1.05, 2.07, 3.05, 4.00, 4.91, 5.78, 6.62, 7.41, 8.16, 8.88, 9.56, 10.21, 10.83, 11.41, 11.97, 12.51, 13.03, 13.52, 14.00, 14.46, 14.89, 15.29, 15.66, 15.97, 16.21, 16.26, 16.26]
    ],
    rotation: [
      [0.00, -0.07, -0.14, -0.20, -0.25, -0.31, -0.35, -0.40, -0.44, -0.47, -0.51, -0.54, -0.56, -0.59, -0.61, -0.63, -0.65, -0.67, -0.69, -0.71, -0.73, -0.75, -0.77, -0.79, -0.80, -0.81, -0.82, -0.82],
      [0.00, -21.47, -42.90, -64.31, -85.70, -107.06, -128.40, -149.71, -171.01, -192.29, -213.56, -234.81, -256.05, -277.28, -298.50, -319.71, -340.91, -362.11, -383.29, -404.47, -425.65, -446.83, -468.00, -489.17, -510.33, -531.50, -537.00, -537.00],
      [0.00, -0.01, -0.01, -0.01, -0.01, -0.00, 0.00, 0.01, 0.02, 0.03, 0.04, 0.05, 0.06, 0.07, 0.08, 0.10, 0.11, 0.12, 0.13, 0.14, 0.14, 0.14, 0.14, 0.12, 0.10, 0.07, 0.06, 0.06]
    ]
  }
};

const correction90 = math.matrix([
  [0, 0, -1],
  [0, 1, 0],
  [1, 0, 0]
]);

export function rotate(trajectory, velocityArray, scale) {
  const [vx, vy, vz] = velocityArray.map(v => v * scale);
  const ySin = vx;
  const yCos = vz;
  const yRotation = math.matrix([
    [yCos, 0, ySin],
    [0, 1, 0],
    [-ySin, 0, yCos]
  ]);

  const xSin = -vy;
  const xCos = vz;
  const xRotation = math.matrix([
    [1, 0, 0],
    [0, xCos, -xSin],
    [0, xSin, xCos]
  ]);
  //
  // const zSin = y;
  // const zCos = x;
  // const zRotation = math.matrix([
  //   [zCos, -zSin, 0],
  //   [zSin, zCos, 0],
  //   [0, 0, 1]
  // ]);


  // let rotation = math.multiply(yRotation, xRotation);
  // rotation = math.multiply(zRotation, rotation);
  let first = math.multiply(xRotation, trajectory);
  return math.multiply(yRotation, first).toArray();
}

export function vectorSquareLength(point) {
  const {x, y, z} = point;
  return x * x + y * y + z * z;
}

export function pointToArray(point) {
  return [point.x, point.y, point.z];
}

export function findVelocity(traceP, pointNumber) {
  const lastPoints = traceP.slice(-pointNumber);
  const velocities = lastPoints.slice(1).map((p, i) => {
    return {
      x: p.x - lastPoints[i].x,
      y: p.y - lastPoints[i].y,
      z: p.z - lastPoints[i].z
    };
  });
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

function averagePoint(points) {
  return points.reduce((average, point) => average ? {
    x: average.x + point.x / 2,
    y: average.y + point.y / 2,
    z: average.z + point.z / 2
  } : point, undefined);
}