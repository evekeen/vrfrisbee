import {arrayLength, normalize, rotateZTrajectory, scaleAndTranslate} from "./matrix";
import {distanceConversion, velocityFactor} from "./Flight";

const WEAK_THRESHOLD = 0.1;

export const trajectories = {
  ss: {
    translation: [
      [0.00,-0.00,-0.00,-0.00,-0.01,-0.01,-0.02,-0.03,-0.04,-0.05,-0.06,-0.07,-0.08,-0.08,-0.08,-0.08,-0.06,-0.05,-0.02,0.02,0.07,0.14,0.23,0.35,0.50,0.68,0.91,1.19,1.51,1.88,2.31,2.77,3.27,3.80,4.35,4.91,5.48,6.05,6.60,7.15,7.67,8.16,8.63,9.07,9.46,9.82,10.13,10.40],
      [0.00,-0.01,-0.04,-0.06,-0.07,-0.08,-0.07,-0.06,-0.03,-0.01,0.02,0.05,0.07,0.09,0.10,0.10,0.09,0.06,0.02,-0.03,-0.09,-0.17,-0.26,-0.37,-0.49,-0.63,-0.79,-0.98,-1.19,-1.43,-1.72,-2.03,-2.39,-2.77,-3.19,-3.64,-4.12,-4.61,-5.12,-5.64,-6.17,-6.69,-7.21,-7.71,-8.20,-8.67,-9.11,-9.53],
      [0.00,1.00,1.97,2.91,3.82,4.70,5.55,6.37,7.16,7.93,8.66,9.36,10.04,10.69,11.32,11.93,12.51,13.08,13.63,14.16,14.67,15.18,15.67,16.14,16.60,17.04,17.46,17.85,18.20,18.50,18.74,18.93,19.04,19.07,19.02,18.90,18.69,18.40,18.03,17.59,17.08,16.50,15.85,15.15,14.39,13.58,12.74,11.85],
    ], rotation: [
      [0.00,-0.05,-0.10,-0.14,-0.19,-0.23,-0.26,-0.30,-0.33,-0.36,-0.39,-0.41,-0.43,-0.46,-0.48,-0.49,-0.51,-0.53,-0.54,-0.56,-0.58,-0.59,-0.61,-0.62,-0.64,-0.66,-0.68,-0.69,-0.71,-0.73,-0.74,-0.75,-0.76,-0.76,-0.75,-0.74,-0.73,-0.71,-0.68,-0.65,-0.61,-0.58,-0.53,-0.49,-0.44,-0.39,-0.34,-0.29],
      [0.00,20.40,40.78,61.13,81.46,101.77,122.05,142.32,162.57,182.80,203.01,223.22,243.40,263.58,283.75,303.90,324.04,344.18,364.30,384.42,404.53,424.64,444.74,464.83,484.91,504.99,525.07,545.14,565.21,585.27,605.33,625.39,645.43,665.47,685.50,705.52,725.52,745.50,765.46,785.40,805.32,825.21,845.08,864.92,884.73,904.52,924.27,944.00],
      [0.00,0.01,0.02,0.02,0.02,0.02,0.01,0.01,0.00,-0.01,-0.01,-0.02,-0.03,-0.04,-0.05,-0.06,-0.07,-0.08,-0.09,-0.11,-0.12,-0.13,-0.14,-0.15,-0.15,-0.16,-0.16,-0.15,-0.14,-0.13,-0.11,-0.08,-0.05,-0.02,0.02,0.05,0.09,0.12,0.16,0.19,0.21,0.24,0.26,0.28,0.29,0.30,0.31,0.32],
    ]
  },
  sl: {
    translation: [
      [0.00,-0.01,-0.04,-0.08,-0.16,-0.25,-0.37,-0.51,-0.67,-0.86,-1.06,-1.28,-1.51,-1.77,-2.04,-2.33,-2.63,-2.95,-3.29,-3.64,-4.01,-4.41,-4.82,-5.26,-5.71,-6.19,-6.69,-7.20,-7.74,-8.29,-8.86,-9.44,-10.02,-10.61,-11.19,-11.77,-12.34,-12.89,-13.42,-13.93,-14.41,-14.86,-15.28,-15.66,-16.01,-16.31,-16.58],
      [0.00,-0.01,-0.04,-0.07,-0.10,-0.11,-0.13,-0.13,-0.13,-0.13,-0.13,-0.13,-0.14,-0.15,-0.17,-0.21,-0.25,-0.31,-0.38,-0.46,-0.55,-0.66,-0.78,-0.91,-1.06,-1.21,-1.38,-1.55,-1.74,-1.94,-2.14,-2.36,-2.58,-2.81,-3.05,-3.30,-3.54,-3.79,-4.05,-4.30,-4.55,-4.81,-5.05,-5.30,-5.54,-5.77,-6.00],
      [0.00,1.02,2.01,2.97,3.89,4.79,5.65,6.48,7.28,8.04,8.78,9.48,10.15,10.79,11.40,11.98,12.54,13.06,13.56,14.03,14.48,14.89,15.28,15.63,15.95,16.23,16.48,16.68,16.84,16.96,17.02,17.03,16.99,16.89,16.73,16.52,16.26,15.94,15.56,15.14,14.67,14.16,13.61,13.02,12.40,11.74,11.07],
    ], rotation: [
      [0.00,-0.05,-0.10,-0.15,-0.19,-0.23,-0.27,-0.30,-0.33,-0.36,-0.39,-0.41,-0.43,-0.45,-0.46,-0.48,-0.49,-0.50,-0.51,-0.51,-0.52,-0.52,-0.52,-0.51,-0.51,-0.50,-0.49,-0.48,-0.47,-0.45,-0.44,-0.42,-0.40,-0.38,-0.36,-0.34,-0.32,-0.29,-0.27,-0.24,-0.21,-0.18,-0.15,-0.13,-0.10,-0.07,-0.04],
      [0.00,20.84,41.65,62.43,83.19,103.92,124.64,145.33,166.00,186.66,207.30,227.92,248.53,269.12,289.70,310.27,330.83,351.37,371.91,392.43,412.95,433.45,453.95,474.44,494.92,515.39,535.85,556.31,576.75,597.19,617.62,638.04,658.45,678.85,699.24,719.62,739.99,760.34,780.69,801.02,821.33,841.64,861.93,882.21,902.47,922.72,942.95],
      [0.20,0.21,0.21,0.21,0.21,0.20,0.20,0.19,0.17,0.16,0.14,0.13,0.11,0.09,0.07,0.05,0.03,0.01,-0.01,-0.04,-0.06,-0.08,-0.11,-0.13,-0.15,-0.17,-0.20,-0.22,-0.24,-0.25,-0.27,-0.29,-0.30,-0.32,-0.33,-0.34,-0.35,-0.36,-0.37,-0.37,-0.38,-0.38,-0.38,-0.38,-0.38,-0.38,-0.38],
    ]
  },
  sr: {
    translation: [
      [0.00,0.01,0.03,0.08,0.15,0.23,0.34,0.46,0.61,0.78,0.97,1.18,1.41,1.67,1.95,2.25,2.59,2.95,3.34,3.77,4.24,4.74,5.27,5.83,6.43,7.04,7.68,8.33,8.98,9.63,10.27,10.90,11.51,12.08,12.63,13.14,13.60,14.02,14.39,14.71,14.97,15.18,15.33,15.42,15.45,15.43],
      [0.00,-0.01,-0.04,-0.07,-0.09,-0.11,-0.11,-0.11,-0.10,-0.09,-0.09,-0.09,-0.09,-0.11,-0.14,-0.19,-0.26,-0.34,-0.45,-0.58,-0.73,-0.92,-1.13,-1.37,-1.64,-1.94,-2.27,-2.62,-3.00,-3.40,-3.82,-4.26,-4.70,-5.16,-5.61,-6.06,-6.51,-6.94,-7.36,-7.77,-8.15,-8.51,-8.85,-9.16,-9.45,-9.71],
      [0.00,1.05,2.05,3.03,3.97,4.89,5.76,6.61,7.42,8.20,8.94,9.65,10.33,10.97,11.58,12.16,12.70,13.21,13.68,14.11,14.49,14.83,15.11,15.33,15.48,15.57,15.58,15.51,15.37,15.14,14.84,14.46,14.01,13.49,12.89,12.24,11.52,10.76,9.94,9.09,8.20,7.29,6.35,5.41,4.45,3.50],
    ], rotation: [
      [0.00,-0.05,-0.10,-0.15,-0.19,-0.23,-0.27,-0.31,-0.34,-0.37,-0.40,-0.43,-0.46,-0.48,-0.51,-0.53,-0.55,-0.57,-0.59,-0.61,-0.63,-0.64,-0.66,-0.67,-0.68,-0.68,-0.68,-0.68,-0.67,-0.66,-0.64,-0.61,-0.59,-0.55,-0.52,-0.48,-0.44,-0.39,-0.35,-0.30,-0.25,-0.20,-0.15,-0.10,-0.05,-0.01],
      [0.00,21.29,42.55,63.79,84.99,106.18,127.34,148.49,169.61,190.72,211.81,232.88,253.94,274.99,296.03,317.05,338.07,359.07,380.07,401.05,422.03,443.00,463.96,484.91,505.86,526.79,547.71,568.62,589.51,610.39,631.25,652.08,672.90,693.69,714.46,735.20,755.92,776.61,797.27,817.90,838.51,859.09,879.64,900.17,920.67,941.14],
      [-0.20,-0.19,-0.18,-0.18,-0.17,-0.17,-0.17,-0.17,-0.17,-0.17,-0.17,-0.17,-0.17,-0.16,-0.16,-0.16,-0.15,-0.15,-0.14,-0.13,-0.11,-0.09,-0.07,-0.05,-0.02,0.01,0.05,0.08,0.12,0.16,0.19,0.22,0.26,0.28,0.31,0.33,0.35,0.36,0.37,0.38,0.39,0.40,0.40,0.40,0.40,0.39],
    ]
  },
  ws: {
    translation: [
      [0.00,-0.00,-0.00,-0.00,-0.00,-0.01,-0.01,-0.01,-0.01,-0.01,0.00,0.01,0.04,0.07,0.11,0.16,0.23,0.31,0.42,0.54,0.70,0.88,1.10,1.35,1.65,2.00,2.39,2.83,3.32,3.85,4.43,5.03,5.65,6.29,6.94,7.59,8.22,8.84,9.44,10.00,10.53,11.02,11.46,11.86,12.19],
      [0.00,-0.03,-0.10,-0.19,-0.30,-0.41,-0.52,-0.63,-0.72,-0.82,-0.90,-0.98,-1.06,-1.13,-1.21,-1.28,-1.35,-1.43,-1.51,-1.60,-1.70,-1.81,-1.93,-2.07,-2.22,-2.40,-2.59,-2.82,-3.07,-3.36,-3.68,-4.03,-4.41,-4.82,-5.26,-5.72,-6.19,-6.68,-7.18,-7.67,-8.17,-8.65,-9.12,-9.58,-10.00],
      [0.00,0.86,1.70,2.52,3.32,4.12,4.90,5.67,6.43,7.18,7.91,8.63,9.34,10.02,10.70,11.35,12.00,12.62,13.23,13.82,14.39,14.94,15.48,15.98,16.46,16.90,17.31,17.66,17.95,18.18,18.34,18.41,18.41,18.31,18.13,17.87,17.52,17.09,16.57,15.99,15.33,14.61,13.83,13.00,12.14],
    ], rotation: [
      [0.00,-0.04,-0.07,-0.10,-0.13,-0.16,-0.19,-0.22,-0.25,-0.28,-0.30,-0.33,-0.35,-0.38,-0.40,-0.42,-0.44,-0.46,-0.48,-0.50,-0.52,-0.54,-0.57,-0.59,-0.61,-0.63,-0.65,-0.67,-0.68,-0.69,-0.70,-0.71,-0.71,-0.70,-0.69,-0.67,-0.65,-0.62,-0.59,-0.55,-0.51,-0.46,-0.42,-0.37,-0.32],
      [0.00,21.77,43.52,65.25,86.96,108.65,130.32,151.98,173.62,195.25,216.86,238.45,260.03,281.60,303.16,324.70,346.23,367.75,389.26,410.76,432.25,453.73,475.20,496.67,518.12,539.57,561.02,582.45,603.88,625.31,646.72,668.12,689.52,710.89,732.26,753.60,774.92,796.22,817.49,838.74,859.96,881.16,902.32,923.45,943.92],
      [0.00,0.01,0.01,0.01,0.00,-0.00,-0.01,-0.02,-0.02,-0.03,-0.04,-0.05,-0.06,-0.07,-0.08,-0.09,-0.10,-0.11,-0.12,-0.13,-0.14,-0.14,-0.15,-0.15,-0.14,-0.14,-0.13,-0.11,-0.09,-0.07,-0.04,-0.00,0.03,0.07,0.11,0.14,0.18,0.21,0.24,0.27,0.29,0.31,0.33,0.34,0.36],
    ]
  },
  wl: {
    translation: [
      [0.00,-0.01,-0.03,-0.07,-0.13,-0.22,-0.33,-0.46,-0.62,-0.80,-1.00,-1.22,-1.46,-1.73,-2.01,-2.30,-2.62,-2.94,-3.29,-3.64,-4.01,-4.39,-4.79,-5.19,-5.61,-6.05,-6.49,-6.95,-7.42,-7.91,-8.41,-8.92,-9.44,-9.97,-10.52,-11.07,-11.63,-12.20,-12.76,-13.32,-13.87,-14.40,-14.91,-15.40],
      [0.00,-0.03,-0.11,-0.21,-0.33,-0.46,-0.58,-0.71,-0.83,-0.95,-1.07,-1.17,-1.28,-1.38,-1.47,-1.57,-1.66,-1.76,-1.85,-1.95,-2.05,-2.16,-2.27,-2.38,-2.50,-2.62,-2.74,-2.88,-3.01,-3.15,-3.30,-3.45,-3.61,-3.77,-3.94,-4.12,-4.30,-4.49,-4.69,-4.90,-5.12,-5.35,-5.59,-5.84],
      [0.00,0.88,1.73,2.57,3.39,4.20,5.00,5.78,6.55,7.30,8.03,8.75,9.45,10.13,10.78,11.42,12.03,12.63,13.20,13.74,14.27,14.77,15.25,15.70,16.14,16.54,16.93,17.29,17.62,17.92,18.19,18.43,18.63,18.80,18.93,19.01,19.04,19.03,18.96,18.83,18.64,18.40,18.09,17.73],
    ], rotation: [
      [0.00,-0.04,-0.07,-0.10,-0.14,-0.17,-0.20,-0.22,-0.25,-0.27,-0.30,-0.32,-0.34,-0.36,-0.38,-0.39,-0.40,-0.42,-0.43,-0.43,-0.44,-0.45,-0.45,-0.45,-0.45,-0.45,-0.45,-0.44,-0.44,-0.43,-0.42,-0.41,-0.40,-0.38,-0.37,-0.35,-0.33,-0.31,-0.29,-0.27,-0.25,-0.22,-0.20,-0.17],
      [0.00,22.26,44.50,66.73,88.93,111.11,133.27,155.42,177.55,199.66,221.75,243.83,265.89,287.93,309.96,331.98,353.98,375.97,397.95,419.91,441.86,463.81,485.74,507.66,529.56,551.46,573.35,595.24,617.11,638.97,660.82,682.67,704.51,726.34,748.16,769.97,791.77,813.57,835.35,857.13,878.90,900.66,922.41,944.14],
      [0.20,0.21,0.21,0.20,0.20,0.19,0.18,0.16,0.15,0.13,0.11,0.09,0.07,0.05,0.03,0.01,-0.02,-0.04,-0.06,-0.09,-0.11,-0.14,-0.16,-0.19,-0.21,-0.23,-0.26,-0.28,-0.30,-0.33,-0.35,-0.37,-0.39,-0.40,-0.42,-0.44,-0.45,-0.46,-0.47,-0.48,-0.48,-0.49,-0.49,-0.49],
    ]
  },
  wr: {
    translation: [
      [0.00,0.01,0.03,0.07,0.13,0.21,0.32,0.46,0.63,0.82,1.05,1.31,1.60,1.93,2.30,2.70,3.14,3.62,4.13,4.69,5.28,5.91,6.56,7.25,7.96,8.68,9.42,10.16,10.89,11.61,12.32,12.99,13.63,14.23,14.79,15.30,15.74,16.13,16.46,16.72,16.92,17.04,17.09],
      [0.00,-0.03,-0.11,-0.22,-0.34,-0.47,-0.60,-0.72,-0.85,-0.97,-1.09,-1.21,-1.33,-1.45,-1.57,-1.70,-1.84,-1.99,-2.15,-2.33,-2.53,-2.74,-2.98,-3.23,-3.51,-3.81,-4.12,-4.46,-4.82,-5.19,-5.57,-5.96,-6.36,-6.76,-7.17,-7.57,-7.96,-8.35,-8.72,-9.08,-9.43,-9.75,-10.00],
      [0.00,0.90,1.77,2.63,3.47,4.30,5.11,5.91,6.69,7.45,8.19,8.91,9.61,10.28,10.91,11.51,12.08,12.60,13.08,13.51,13.88,14.19,14.44,14.62,14.72,14.74,14.69,14.55,14.33,14.03,13.64,13.18,12.64,12.03,11.36,10.62,9.83,8.99,8.11,7.19,6.25,5.29,4.52],
    ], rotation: [
      [0.00,-0.04,-0.07,-0.11,-0.14,-0.17,-0.20,-0.23,-0.27,-0.30,-0.33,-0.35,-0.38,-0.41,-0.43,-0.46,-0.48,-0.51,-0.53,-0.55,-0.56,-0.58,-0.59,-0.60,-0.61,-0.61,-0.61,-0.60,-0.59,-0.57,-0.55,-0.52,-0.49,-0.46,-0.42,-0.38,-0.34,-0.29,-0.25,-0.20,-0.15,-0.11,-0.07],
      [0.00,26.20,52.37,78.52,104.64,130.75,156.83,182.89,208.93,234.95,260.95,286.93,312.89,338.84,364.77,390.69,416.58,442.47,468.34,494.19,520.04,545.86,571.67,597.47,623.25,649.02,674.76,700.48,726.19,751.87,777.52,803.15,828.75,854.32,879.86,905.37,930.85,956.29,981.71,1007.09,1032.44,1057.76,1077.81],
      [-0.20,-0.19,-0.19,-0.19,-0.19,-0.19,-0.19,-0.19,-0.19,-0.19,-0.19,-0.18,-0.18,-0.18,-0.17,-0.16,-0.15,-0.13,-0.12,-0.10,-0.08,-0.05,-0.02,0.01,0.04,0.08,0.11,0.15,0.19,0.22,0.26,0.29,0.32,0.35,0.37,0.39,0.41,0.42,0.43,0.44,0.44,0.44,0.44],
    ]
  },
};

export function getOriginalTrajectoryAndTilt(velocityArray, frisbeeOrientation) : Trajectory {
  const absoluteOrientation = correctFrisbeeOrientation(frisbeeOrientation);
  const velocityLength = arrayLength(velocityArray);
  const velocityNormalized = normalize(velocityArray);
  const orientationVelocity = absoluteOrientation.map((v, i) => v - velocityNormalized[i]);
  const alphaTrj = Math.atan(orientationVelocity[1] / orientationVelocity[0]);
  const trajectoryClassName = velocityLength < WEAK_THRESHOLD ? 'w' : 's';
  const trajectoryTiltName = alphaTrj > 0.2 ? 'l' : alphaTrj < -0.2 ? 'r' : 's';
  // console.log(trajectoryClassName + ' - ' + trajectoryTiltName);
  return trajectories[trajectoryClassName + trajectoryTiltName];
}

export function getTrajectory(positions, frisbeeOrientation, velocityProvider): Trajectory {
  const lastPosition = positions[positions.length - 1];
  let velocityArray = velocityProvider(positions);
  if (arrayLength(velocityArray) < 0.1) {
    const randomFactor = 0.03
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
    translation: translation.toArray() as number[][],
    rotation: trajectory.rotation
  };
}

export function correctFrisbeeOrientation(orientationVector) {
  const orientation = orientationVector.asArray();
  orientation[1] += 0.2;
  return orientation;
}

export interface Trajectory {
  translation: number[][];
  rotation: number[][];
}