import {arrayLength, normalize, rotateZTrajectory, scaleAndTranslate} from "./matrix";
import {distanceConversion, velocityFactor} from "./flight";

const WEAK_THRESHOLD = 0.1;

export const trajectories = {
  ss: {
    translation: [
      [0.00,-0.00,-0.00,-0.00,-0.01,-0.01,-0.02,-0.02,-0.03,-0.03,-0.03,-0.03,-0.02,-0.01,0.01,0.03,0.07,0.12,0.18,0.26,0.36,0.50,0.67,0.88,1.14,1.46,1.83,2.24,2.68,3.16,3.65,4.15,4.66,5.15,5.64,6.10,6.53,6.93,7.30,7.62,7.89,8.11,8.28,8.39,8.45,8.45,8.39,8.32],
      [0.00,-0.01,-0.03,-0.04,-0.04,-0.01,0.03,0.08,0.14,0.21,0.27,0.34,0.39,0.43,0.47,0.48,0.48,0.45,0.41,0.35,0.27,0.16,0.03,-0.12,-0.31,-0.54,-0.82,-1.14,-1.51,-1.93,-2.38,-2.88,-3.40,-3.94,-4.50,-5.07,-5.64,-6.20,-6.74,-7.26,-7.75,-8.21,-8.63,-9.00,-9.33,-9.61,-9.85,-10.00],
      [0.00,1.00,1.97,2.91,3.82,4.69,5.53,6.33,7.10,7.83,8.53,9.20,9.83,10.43,11.01,11.56,12.09,12.59,13.08,13.55,14.00,14.44,14.85,15.24,15.59,15.90,16.15,16.33,16.44,16.47,16.41,16.26,16.02,15.70,15.29,14.80,14.23,13.59,12.88,12.11,11.29,10.42,9.51,8.58,7.62,6.67,5.71,5.02],
    ], rotation: [
      [0.00,-0.07,-0.13,-0.19,-0.24,-0.29,-0.34,-0.38,-0.42,-0.46,-0.49,-0.52,-0.55,-0.57,-0.59,-0.62,-0.63,-0.65,-0.67,-0.69,-0.71,-0.73,-0.74,-0.76,-0.78,-0.80,-0.81,-0.82,-0.82,-0.82,-0.81,-0.79,-0.76,-0.73,-0.69,-0.64,-0.59,-0.53,-0.47,-0.41,-0.34,-0.28,-0.21,-0.14,-0.07,-0.01,0.06,0.11],
      [0.00,20.40,40.78,61.13,81.46,101.77,122.05,142.32,162.57,182.80,203.02,223.23,243.42,263.60,283.78,303.94,324.10,344.25,364.39,384.53,404.66,424.78,444.91,465.03,485.15,505.27,525.39,545.51,565.62,585.72,605.81,625.89,645.96,666.00,686.02,706.02,725.99,745.94,765.86,785.75,805.62,825.45,845.26,865.04,884.79,904.52,924.22,938.57],
      [0.00,0.01,0.01,0.01,0.01,0.01,-0.00,-0.01,-0.02,-0.02,-0.03,-0.04,-0.05,-0.07,-0.08,-0.09,-0.10,-0.11,-0.12,-0.13,-0.14,-0.14,-0.14,-0.14,-0.13,-0.11,-0.08,-0.05,-0.01,0.03,0.07,0.12,0.16,0.20,0.23,0.26,0.29,0.31,0.33,0.34,0.35,0.36,0.36,0.37,0.37,0.36,0.36,0.36],
    ]
  },
  sl: {
    translation: [
      [0.00,-0.01,-0.04,-0.09,-0.16,-0.26,-0.39,-0.53,-0.70,-0.88,-1.08,-1.30,-1.53,-1.78,-2.04,-2.32,-2.61,-2.92,-3.25,-3.59,-3.96,-4.36,-4.78,-5.22,-5.70,-6.19,-6.71,-7.24,-7.78,-8.32,-8.87,-9.40,-9.92,-10.41,-10.88,-11.32,-11.72,-12.08,-12.40,-12.67,-12.90,-13.08,-13.20,-13.28,-13.32,-13.30,-13.24],
      [0.00,-0.01,-0.04,-0.05,-0.06,-0.05,-0.02,0.01,0.05,0.09,0.14,0.17,0.20,0.22,0.22,0.21,0.18,0.13,0.06,-0.03,-0.14,-0.26,-0.41,-0.58,-0.77,-0.99,-1.22,-1.47,-1.74,-2.03,-2.33,-2.65,-2.98,-3.31,-3.64,-3.97,-4.30,-4.61,-4.92,-5.22,-5.50,-5.76,-6.01,-6.24,-6.45,-6.64,-6.81],
      [0.00,1.02,2.01,2.97,3.89,4.78,5.63,6.44,7.21,7.95,8.64,9.30,9.93,10.52,11.07,11.60,12.09,12.55,12.98,13.38,13.75,14.08,14.37,14.62,14.82,14.96,15.05,15.07,15.02,14.91,14.72,14.46,14.13,13.74,13.28,12.77,12.20,11.58,10.92,10.22,9.49,8.73,7.96,7.17,6.38,5.59,4.81],
    ], rotation: [
      [0.00,-0.07,-0.13,-0.19,-0.25,-0.30,-0.35,-0.39,-0.43,-0.46,-0.49,-0.52,-0.54,-0.56,-0.58,-0.59,-0.60,-0.61,-0.61,-0.62,-0.62,-0.61,-0.61,-0.60,-0.58,-0.57,-0.55,-0.53,-0.50,-0.48,-0.45,-0.42,-0.39,-0.36,-0.32,-0.28,-0.24,-0.20,-0.16,-0.11,-0.07,-0.03,0.02,0.06,0.10,0.15,0.19],
      [0.00,20.84,41.65,62.43,83.19,103.92,124.63,145.33,166.00,186.65,207.29,227.92,248.53,269.13,289.72,310.29,330.86,351.42,371.97,392.51,413.04,433.57,454.09,474.60,495.11,515.60,536.10,556.58,577.05,597.52,617.98,638.42,658.86,679.28,699.69,720.08,740.46,760.83,781.17,801.51,821.82,842.12,862.39,882.65,902.89,923.12,943.32],
      [0.20,0.21,0.21,0.21,0.20,0.19,0.18,0.16,0.15,0.13,0.11,0.09,0.06,0.04,0.02,-0.01,-0.03,-0.06,-0.09,-0.11,-0.14,-0.17,-0.19,-0.22,-0.24,-0.26,-0.28,-0.30,-0.32,-0.33,-0.34,-0.36,-0.37,-0.37,-0.38,-0.39,-0.39,-0.39,-0.39,-0.39,-0.39,-0.38,-0.37,-0.36,-0.35,-0.34,-0.32],
    ]
  },
  sr: {
    translation: [
      [0.00,0.01,0.04,0.08,0.16,0.25,0.37,0.50,0.67,0.85,1.06,1.29,1.54,1.82,2.13,2.47,2.83,3.23,3.67,4.14,4.64,5.18,5.74,6.33,6.93,7.53,8.13,8.73,9.30,9.85,10.37,10.84,11.28,11.65,11.98,12.24,12.43,12.56,12.62,12.62,12.54,12.40,12.20,11.93,11.61,11.23],
      [0.00,-0.01,-0.04,-0.05,-0.05,-0.04,-0.01,0.03,0.08,0.12,0.16,0.20,0.22,0.22,0.20,0.15,0.08,-0.02,-0.16,-0.33,-0.54,-0.79,-1.08,-1.41,-1.78,-2.18,-2.62,-3.08,-3.56,-4.05,-4.55,-5.05,-5.55,-6.03,-6.50,-6.94,-7.36,-7.74,-8.09,-8.41,-8.68,-8.93,-9.14,-9.32,-9.47,-9.60],
      [0.00,1.05,2.05,3.03,3.97,4.87,5.73,6.56,7.34,8.09,8.79,9.45,10.07,10.66,11.20,11.71,12.17,12.59,12.96,13.28,13.53,13.73,13.85,13.89,13.85,13.72,13.51,13.22,12.84,12.37,11.82,11.20,10.51,9.76,8.95,8.09,7.19,6.26,5.31,4.35,3.39,2.44,1.51,0.60,-0.27,-1.11],
    ], rotation: [
      [0.00,-0.07,-0.13,-0.20,-0.25,-0.30,-0.35,-0.40,-0.44,-0.48,-0.51,-0.55,-0.58,-0.60,-0.63,-0.66,-0.68,-0.70,-0.72,-0.74,-0.75,-0.76,-0.76,-0.76,-0.75,-0.74,-0.72,-0.69,-0.66,-0.62,-0.57,-0.52,-0.46,-0.40,-0.34,-0.28,-0.21,-0.15,-0.08,-0.02,0.05,0.11,0.17,0.23,0.28,0.33],
      [0.00,21.29,42.55,63.79,84.99,106.18,127.35,148.49,169.62,190.73,211.82,232.91,253.98,275.04,296.09,317.13,338.16,359.19,380.21,401.22,422.23,443.23,464.22,485.21,506.18,527.14,548.09,569.01,589.91,610.79,631.65,652.48,673.28,694.05,714.80,735.52,756.21,776.87,797.51,818.12,838.70,859.25,879.79,900.29,920.78,941.24],
      [-0.20,-0.19,-0.18,-0.18,-0.18,-0.18,-0.18,-0.18,-0.18,-0.17,-0.17,-0.17,-0.16,-0.16,-0.15,-0.14,-0.13,-0.12,-0.10,-0.07,-0.04,-0.01,0.03,0.07,0.12,0.16,0.21,0.25,0.29,0.32,0.35,0.37,0.39,0.41,0.42,0.43,0.44,0.44,0.44,0.43,0.43,0.42,0.41,0.39,0.37,0.36],
    ]
  },
  ws: {
    translation: [
      [0.00,-0.00,-0.00,-0.00,-0.01,-0.01,-0.01,-0.01,-0.02,-0.01,-0.00,0.01,0.03,0.06,0.10,0.16,0.23,0.32,0.43,0.57,0.75,0.97,1.24,1.57,1.95,2.38,2.86,3.38,3.92,4.48,5.06,5.62,6.18,6.71,7.22,7.68,8.11,8.48,8.80,9.06,9.26,9.39,9.46,9.47,9.47],
      [0.00,-0.02,-0.07,-0.12,-0.16,-0.20,-0.22,-0.23,-0.24,-0.24,-0.23,-0.23,-0.23,-0.24,-0.25,-0.28,-0.32,-0.38,-0.46,-0.55,-0.66,-0.80,-0.97,-1.17,-1.41,-1.70,-2.03,-2.41,-2.84,-3.30,-3.80,-4.33,-4.88,-5.45,-6.02,-6.58,-7.14,-7.67,-8.18,-8.65,-9.09,-9.48,-9.82,-10.00,-10.00],
      [0.00,0.96,1.90,2.81,3.69,4.55,5.38,6.19,6.96,7.71,8.43,9.12,9.79,10.43,11.04,11.63,12.20,12.74,13.27,13.77,14.26,14.71,15.13,15.52,15.84,16.10,16.29,16.39,16.40,16.31,16.13,15.85,15.47,15.00,14.44,13.80,13.08,12.29,11.44,10.53,9.58,8.61,7.61,7.04,7.04],
    ], rotation: [
      [0.00,-0.06,-0.11,-0.16,-0.21,-0.26,-0.30,-0.34,-0.38,-0.42,-0.45,-0.48,-0.51,-0.53,-0.56,-0.58,-0.60,-0.62,-0.64,-0.67,-0.69,-0.71,-0.73,-0.75,-0.77,-0.78,-0.79,-0.79,-0.79,-0.77,-0.75,-0.73,-0.69,-0.64,-0.59,-0.54,-0.48,-0.42,-0.35,-0.28,-0.21,-0.14,-0.07,-0.03,-0.03],
      [0.00,21.77,43.51,65.22,86.92,108.59,130.25,151.88,173.50,195.10,216.68,238.26,259.82,281.36,302.90,324.43,345.94,367.45,388.96,410.45,431.94,453.43,474.91,496.39,517.86,539.33,560.80,582.26,603.72,625.15,646.58,667.98,689.36,710.72,732.05,753.35,774.62,795.86,817.07,838.24,859.39,880.51,901.60,913.54,913.54],
      [0.00,0.01,0.01,0.01,0.01,-0.00,-0.01,-0.02,-0.03,-0.04,-0.05,-0.06,-0.07,-0.08,-0.09,-0.10,-0.11,-0.12,-0.13,-0.14,-0.14,-0.14,-0.13,-0.12,-0.10,-0.07,-0.03,0.01,0.05,0.10,0.15,0.19,0.23,0.27,0.30,0.32,0.34,0.36,0.37,0.38,0.39,0.39,0.39,0.39,0.39],
    ]
  },
  wl: {
    translation: [
      [0.00,-0.01,-0.03,-0.08,-0.16,-0.26,-0.39,-0.54,-0.71,-0.90,-1.12,-1.35,-1.60,-1.87,-2.15,-2.45,-2.77,-3.11,-3.47,-3.84,-4.24,-4.67,-5.12,-5.59,-6.09,-6.61,-7.15,-7.72,-8.29,-8.86,-9.44,-10.00,-10.54,-11.06,-11.55,-11.99,-12.39,-12.75,-13.05,-13.29,-13.48,-13.61,-13.68,-13.69],
      [0.00,-0.02,-0.07,-0.13,-0.19,-0.24,-0.28,-0.31,-0.34,-0.36,-0.38,-0.41,-0.43,-0.46,-0.51,-0.56,-0.62,-0.70,-0.79,-0.89,-1.01,-1.15,-1.30,-1.46,-1.64,-1.84,-2.06,-2.29,-2.54,-2.81,-3.09,-3.39,-3.70,-4.02,-4.34,-4.67,-5.00,-5.32,-5.63,-5.94,-6.23,-6.52,-6.78,-7.03],
      [0.00,0.99,1.94,2.87,3.77,4.64,5.48,6.30,7.08,7.83,8.55,9.24,9.89,10.51,11.10,11.66,12.19,12.69,13.15,13.59,13.99,14.36,14.68,14.96,15.20,15.38,15.49,15.55,15.53,15.44,15.27,15.03,14.71,14.31,13.85,13.32,12.73,12.09,11.40,10.67,9.91,9.13,8.32,7.51],
    ], rotation: [
      [0.00,-0.06,-0.12,-0.17,-0.22,-0.26,-0.31,-0.35,-0.38,-0.41,-0.44,-0.47,-0.49,-0.51,-0.53,-0.54,-0.55,-0.56,-0.57,-0.57,-0.57,-0.57,-0.56,-0.55,-0.54,-0.52,-0.50,-0.48,-0.46,-0.43,-0.41,-0.38,-0.35,-0.31,-0.28,-0.24,-0.20,-0.16,-0.12,-0.07,-0.03,0.01,0.06,0.10],
      [0.00,22.26,44.49,66.70,88.89,111.05,133.19,155.31,177.41,199.50,221.56,243.61,265.65,287.67,309.68,331.67,353.66,375.64,397.60,419.56,441.50,463.44,485.37,507.29,529.21,551.11,573.01,594.90,616.78,638.65,660.51,682.36,704.20,726.02,747.84,769.63,791.42,813.18,834.93,856.66,878.37,900.07,921.74,943.39],
      [0.20,0.21,0.21,0.20,0.19,0.18,0.17,0.15,0.13,0.11,0.09,0.07,0.04,0.02,-0.01,-0.04,-0.07,-0.09,-0.12,-0.15,-0.18,-0.21,-0.24,-0.26,-0.29,-0.31,-0.33,-0.35,-0.37,-0.39,-0.40,-0.41,-0.42,-0.42,-0.43,-0.43,-0.43,-0.43,-0.43,-0.42,-0.41,-0.40,-0.39,-0.37],
    ]
  },
  wr: {
    translation: [
      [0.00,0.01,0.03,0.08,0.16,0.25,0.38,0.53,0.71,0.92,1.16,1.43,1.73,2.06,2.43,2.84,3.29,3.77,4.30,4.86,5.46,6.09,6.75,7.41,8.09,8.76,9.41,10.04,10.64,11.20,11.71,12.16,12.55,12.87,13.11,13.28,13.37,13.38,13.31,13.17,12.95,12.65,12.29],
      [0.00,-0.02,-0.07,-0.13,-0.19,-0.24,-0.28,-0.31,-0.33,-0.36,-0.39,-0.42,-0.46,-0.52,-0.60,-0.70,-0.82,-0.97,-1.15,-1.37,-1.62,-1.91,-2.24,-2.60,-2.99,-3.41,-3.86,-4.32,-4.80,-5.28,-5.76,-6.24,-6.71,-7.15,-7.58,-7.97,-8.34,-8.67,-8.97,-9.24,-9.48,-9.69,-9.87],
      [0.00,1.01,1.98,2.93,3.85,4.74,5.60,6.43,7.22,7.98,8.70,9.39,10.04,10.64,11.21,11.72,12.19,12.61,12.96,13.25,13.47,13.61,13.66,13.61,13.48,13.25,12.92,12.50,11.99,11.39,10.72,9.97,9.15,8.27,7.35,6.40,5.42,4.42,3.43,2.44,1.47,0.52,-0.38],
    ], rotation: [
      [0.00,-0.06,-0.12,-0.17,-0.22,-0.27,-0.32,-0.36,-0.40,-0.44,-0.47,-0.51,-0.54,-0.57,-0.59,-0.62,-0.64,-0.66,-0.68,-0.70,-0.71,-0.71,-0.71,-0.70,-0.69,-0.67,-0.64,-0.60,-0.56,-0.51,-0.46,-0.40,-0.34,-0.28,-0.22,-0.15,-0.08,-0.02,0.05,0.11,0.17,0.23,0.28],
      [0.00,26.19,52.36,78.49,104.60,130.68,156.73,182.77,208.78,234.77,260.75,286.71,312.65,338.58,364.49,390.40,416.29,442.17,468.05,493.91,519.76,545.60,571.43,597.23,623.03,648.79,674.54,700.26,725.95,751.61,777.24,802.83,828.39,853.92,879.41,904.87,930.29,955.68,981.04,1006.36,1031.66,1056.92,1082.16],
      [-0.20,-0.19,-0.19,-0.19,-0.18,-0.18,-0.18,-0.18,-0.18,-0.18,-0.17,-0.17,-0.16,-0.15,-0.14,-0.12,-0.11,-0.08,-0.06,-0.02,0.01,0.05,0.10,0.14,0.19,0.23,0.28,0.32,0.35,0.38,0.41,0.43,0.44,0.45,0.46,0.46,0.46,0.46,0.45,0.44,0.43,0.41,0.39],
    ]
  },
};

export function getOriginalTrajectoryAndTilt(velocityArray, frisbeeOrientation) {
  const absoluteOrientation = correctFrisbeeOrientation(frisbeeOrientation);
  const velocityLength = arrayLength(velocityArray);
  const velocityNormalized = normalize(velocityArray);
  const orientationVelocity = absoluteOrientation.map((v, i) => v - velocityNormalized[i]);
  const alphaTrj = Math.atan(orientationVelocity[1] / orientationVelocity[0]);
  const trajectoryClassName = velocityLength < WEAK_THRESHOLD ? 'w' : 's';
  const trajectoryTiltName = alphaTrj > 0.2 ? 'l' : alphaTrj < -0.2 ? 'r' : 's';
  console.log(trajectoryClassName + ' - ' + trajectoryTiltName);
  return trajectories[trajectoryClassName + trajectoryTiltName];
}

export function getTrajectory(positions, frisbeeOrientation, velocityProvider) {
  const lastPosition = positions[positions.length - 1];
  let velocityArray = velocityProvider(positions);
  if (arrayLength(velocityArray) < 0.1) {
    const randomFactor = 0.1
    velocityArray = [
      Math.random() * randomFactor - randomFactor / 2,
      Math.random() * randomFactor - randomFactor / 2,
      positions.length / 100
    ];
  }
  const controllerPositionShift = lastPosition.asArray().map(p => p / distanceConversion);
  const trajectory = getOriginalTrajectoryAndTilt(velocityArray, frisbeeOrientation);
  const rotated = rotateZTrajectory(trajectory.translation, velocityArray);
  const translation = scaleAndTranslate(rotated, arrayLength(velocityArray) * velocityFactor, controllerPositionShift);
  return {
    translation: translation.toArray(),
    rotation: trajectory.rotation
  };
}

export function correctFrisbeeOrientation(orientationVector) {
  const orientation = orientationVector.asArray();
  orientation[1] += 0.2;
  return orientation;
}