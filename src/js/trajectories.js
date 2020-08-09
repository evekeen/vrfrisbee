import * as math from 'mathjs';
import {atan} from "mathjs";

const WEAK_THRESHOLD = 0.3;

export const trajectories = {
  straight: {
    translation: [
      [0.00, -0.00, -0.00, -0.00, -0.01, -0.01, -0.02, -0.03, -0.03, -0.03, -0.03, -0.03, -0.02, 0.00, 0.03, 0.06, 0.11, 0.17, 0.25, 0.36, 0.50, 0.69, 0.92, 1.20, 1.55, 1.95, 2.39, 2.87],
      [0.00, -0.01, -0.03, -0.04, -0.03, -0.00, 0.04, 0.10, 0.17, 0.24, 0.31, 0.37, 0.42, 0.46, 0.48, 0.48, 0.46, 0.42, 0.35, 0.27, 0.16, 0.02, -0.15, -0.36, -0.61, -0.91, -1.27, -1.68],
      [0.00, 1.05, 2.07, 3.05, 4.00, 4.91, 5.78, 6.62, 7.41, 8.16, 8.88, 9.56, 10.21, 10.83, 11.41, 11.97, 12.51, 13.03, 13.52, 14.00, 14.46, 14.89, 15.29, 15.66, 15.97, 16.21, 16.38, 16.46],
    ], rotation: [
      [0.00, -0.07, -0.14, -0.20, -0.25, -0.31, -0.35, -0.40, -0.44, -0.47, -0.51, -0.54, -0.56, -0.59, -0.61, -0.63, -0.65, -0.67, -0.69, -0.71, -0.73, -0.75, -0.77, -0.79, -0.80, -0.81, -0.82, -0.82],
      [0.00, 21.47, 42.90, 64.31, 85.70, 107.06, 128.40, 149.71, 171.01, 192.29, 213.56, 234.81, 256.05, 277.28, 298.50, 319.71, 340.91, 362.11, 383.29, 404.47, 425.65, 446.83, 468.00, 489.17, 510.33, 531.50, 552.67, 573.82],
      [0.00, 0.01, 0.01, 0.01, 0.01, 0.00, -0.00, -0.01, -0.02, -0.03, -0.04, -0.05, -0.06, -0.07, -0.08, -0.10, -0.11, -0.12, -0.13, -0.14, -0.14, -0.14, -0.14, -0.12, -0.10, -0.07, -0.04, 0.00],
    ]
  },
  straightWeak: {
    translation: [
      [0.00, -0.00, -0.00, -0.00, -0.01, -0.01, -0.01, -0.01, -0.02, -0.01, -0.01, 0.01, 0.03, 0.06, 0.09, 0.14, 0.21, 0.29, 0.40, 0.53, 0.70, 0.91, 1.16, 1.46, 1.82, 2.23, 2.68, 3.18],
      [0.00, -0.02, -0.06, -0.11, -0.16, -0.19, -0.22, -0.23, -0.24, -0.24, -0.23, -0.23, -0.23, -0.23, -0.25, -0.27, -0.31, -0.37, -0.44, -0.52, -0.63, -0.76, -0.92, -1.10, -1.33, -1.60, -1.91, -2.27],
      [0.00, 0.95, 1.87, 2.77, 3.64, 4.49, 5.31, 6.11, 6.88, 7.62, 8.34, 9.02, 9.68, 10.32, 10.92, 11.51, 12.08, 12.62, 13.14, 13.65, 14.13, 14.59, 15.01, 15.40, 15.74, 16.02, 16.23, 16.36],
    ], rotation: [
      [0.00, -0.06, -0.11, -0.16, -0.21, -0.26, -0.30, -0.34, -0.38, -0.41, -0.44, -0.47, -0.50, -0.53, -0.55, -0.57, -0.60, -0.62, -0.64, -0.66, -0.68, -0.70, -0.72, -0.74, -0.76, -0.78, -0.79, -0.79],
      [0.00, 21.47, 42.91, 64.34, 85.74, 107.12, 128.48, 149.82, 171.14, 192.45, 213.75, 235.03, 256.30, 277.55, 298.80, 320.03, 341.26, 362.48, 383.69, 404.90, 426.09, 447.29, 468.48, 489.66, 510.85, 532.03, 553.21, 574.38],
      [0.00, 0.01, 0.01, 0.01, 0.01, -0.00, -0.01, -0.02, -0.03, -0.04, -0.05, -0.06, -0.07, -0.08, -0.09, -0.10, -0.11, -0.12, -0.13, -0.14, -0.14, -0.14, -0.13, -0.12, -0.10, -0.08, -0.05, -0.01],
    ]
  },
  tiltLeft: {
    translation: [
      [0.00, -0.01, -0.04, -0.09, -0.17, -0.28, -0.41, -0.56, -0.74, -0.93, -1.14, -1.37, -1.62, -1.88, -2.15, -2.45, -2.76, -3.08, -3.43, -3.80, -4.20, -4.62, -5.07, -5.55, -6.05, -6.58, -7.12, -7.68],
      [0.00, -0.01, -0.04, -0.05, -0.06, -0.04, -0.02, 0.02, 0.06, 0.11, 0.15, 0.18, 0.21, 0.22, 0.22, 0.20, 0.16, 0.10, 0.02, -0.09, -0.21, -0.36, -0.52, -0.71, -0.93, -1.16, -1.41, -1.69],
      [0.00, 1.05, 2.07, 3.05, 4.00, 4.91, 5.78, 6.60, 7.39, 8.14, 8.85, 9.51, 10.14, 10.74, 11.30, 11.82, 12.32, 12.78, 13.20, 13.60, 13.95, 14.27, 14.54, 14.76, 14.93, 15.03, 15.07, 15.04],
    ], rotation: [
      [0.00, -0.07, -0.14, -0.20, -0.25, -0.31, -0.35, -0.40, -0.43, -0.47, -0.50, -0.53, -0.55, -0.57, -0.58, -0.60, -0.61, -0.61, -0.62, -0.62, -0.61, -0.61, -0.60, -0.59, -0.57, -0.55, -0.53, -0.51],
      [0.00, 21.47, 42.90, 64.31, 85.70, 107.05, 128.39, 149.70, 171.00, 192.27, 213.53, 234.77, 256.00, 277.22, 298.43, 319.62, 340.81, 361.98, 383.15, 404.30, 425.45, 446.60, 467.73, 488.86, 509.98, 531.09, 552.20, 573.29],
      [0.20, 0.21, 0.21, 0.21, 0.20, 0.19, 0.18, 0.16, 0.14, 0.12, 0.10, 0.08, 0.06, 0.03, 0.01, -0.02, -0.05, -0.07, -0.10, -0.13, -0.16, -0.18, -0.21, -0.23, -0.26, -0.28, -0.30, -0.31],
    ]
  },
  tiltRight: {
    translation: [
      [0.00, 0.01, 0.04, 0.09, 0.16, 0.25, 0.37, 0.51, 0.68, 0.87, 1.08, 1.31, 1.57, 1.85, 2.17, 2.51, 2.88, 3.29, 3.74, 4.22, 4.73, 5.28, 5.85, 6.44, 7.05, 7.66, 8.26, 8.86],
      [0.00, -0.01, -0.04, -0.05, -0.05, -0.04, -0.01, 0.03, 0.08, 0.13, 0.17, 0.20, 0.22, 0.22, 0.20, 0.15, 0.07, -0.04, -0.18, -0.36, -0.58, -0.84, -1.14, -1.48, -1.86, -2.27, -2.71, -3.18],
      [0.00, 1.05, 2.07, 3.05, 4.00, 4.91, 5.78, 6.61, 7.39, 8.14, 8.85, 9.51, 10.13, 10.72, 11.26, 11.77, 12.23, 12.64, 13.01, 13.32, 13.57, 13.75, 13.86, 13.89, 13.83, 13.69, 13.46, 13.14],
    ], rotation: [
      [0.00, -0.07, -0.14, -0.20, -0.25, -0.31, -0.36, -0.40, -0.44, -0.48, -0.52, -0.55, -0.58, -0.61, -0.63, -0.66, -0.68, -0.70, -0.72, -0.74, -0.75, -0.76, -0.76, -0.76, -0.75, -0.74, -0.71, -0.68],
      [0.00, 21.47, 42.90, 64.31, 85.70, 107.06, 128.40, 149.72, 171.02, 192.31, 213.58, 234.83, 256.08, 277.31, 298.54, 319.75, 340.96, 362.16, 383.35, 404.54, 425.72, 446.90, 468.06, 489.22, 510.37, 531.50, 552.61, 573.70],
      [-0.20, -0.19, -0.18, -0.18, -0.18, -0.18, -0.18, -0.18, -0.18, -0.17, -0.17, -0.17, -0.16, -0.16, -0.15, -0.14, -0.13, -0.11, -0.09, -0.07, -0.04, -0.00, 0.04, 0.08, 0.13, 0.17, 0.22, 0.26],
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

export function arrayLength(point) {
  const [x, y, z] = point;
  return Math.sqrt(x * x + y * y + z * z);
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

const referenceOrientationForehand = [0.9477840065956116, 0.17129312455654144, -0.2690058648586273];

export function getTrajectory(velocityArray, absoluteOrientation) {
  const velocityLength = arrayLength(velocityArray);
  const velocityNormalized = velocityArray.map(v => v / velocityLength);
  const orientation = absoluteOrientation.map((v, i) => v - referenceOrientationForehand[i]);
  const alphaAbsolute = Math.atan(absoluteOrientation[1] / absoluteOrientation[0]);
  const orientationVelocity = absoluteOrientation.map((v, i) => v - velocityNormalized[i]);
  const xAlpha = Math.atan(orientation[1] / orientation[0]);
  const alphaTrj = Math.atan(orientationVelocity[1] / orientationVelocity[0]);
  console.log('alpha_absolute: ' + alphaAbsolute);
  console.log('alpha_relative: ' + xAlpha);
  console.log('alpha_rel_trj:  ' + alphaTrj);
  if (arrayLength(velocityArray) < WEAK_THRESHOLD) {
    console.log('weak');
    return trajectories.straightWeak;
  } else if (alphaTrj < -0.2) {
    console.log('left');
    return trajectories.tiltLeft;
  } else if (alphaTrj > 0.2) {
    console.log('right');
    return trajectories.tiltRight;
  }
  console.log('straight');
  return trajectories.straight;
}