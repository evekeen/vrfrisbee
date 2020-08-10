import {rotateZTrajectory} from '../src/js/matrix';
import {expect} from 'chai';

describe('Rotate', function () {
  it('should keep z-trajectory', function () {
    const direction = [0, 0, 1];
    const trajectory = [[0, 0, 0], [0, 0, 1], [0, 1, 2]];
    const res = rotateZTrajectory(trajectory, direction);
    expect(res).to.eql([[0, 0, 0], [0, 0, 1], [0, 1, 2]]);
  });

  it('should rotateZTrajectory -90 degrees Y', function () {
    const direction = [1, 0, 0];
    const trajectory = [[0, 0, 0], [0, 0, 0], [0, 1, 2]];
    const res = rotateZTrajectory(trajectory, direction);
    expect(res).to.eql([[0, 1, 2], [0, 0, 0], [0, 0, 0]]);
  });

  it('should rotateZTrajectory 90 degrees X', function () {
    const direction = [0, 1, 0];
    const trajectory = [[0, 0, 0], [0, 0, 0], [0, 1, 2]];
    const res = rotateZTrajectory(trajectory, direction);
    expect(res).to.eql([[0, 0, 0], [0, 1, 2], [0, 0, 0]]);
  });

  it('should rotateZTrajectory -45 degrees Y', function () {
    const direction = [0.5, 0, 0.5];
    const trajectory = [[0, 0, 0], [0, 0, 0], [0, 1, 2]];
    const res = rotateZTrajectory(trajectory, direction);
    expect(roundCoordinates(res)).to.eql([[0, 0.71, 1.41], [0, 0, 0], [0, 0.71, 1.41]]);
  });

  it('should rotateZTrajectory 180 degrees Y', function () {
    const direction = [0, 0, -1];
    const trajectory = [[0, 0, 0], [0, 0, 0], [0, 1, 2]];
    const res = rotateZTrajectory(trajectory, direction);
    expect(roundCoordinates(res)).to.eql([[0, 0, 0], [0, 0, 0], [0, -1, -2]]);
  });

  it('should rotateZTrajectory -135 degrees Y', function () {
    const direction = [-0.5, 0, -0.5];
    const trajectory = [[0, 0, 0], [0, 0, 0], [0, 1, 2]];
    const res = rotateZTrajectory(trajectory, direction);
    expect(roundCoordinates(res)).to.eql([[0, -0.71, -1.41], [0, 0, 0], [0, -0.71, -1.41]]);
  });

  it('rotate a little', function () {
    const direction = [0.1, -0.1, 0.9];
    const trajectory = [[0, 0, 0], [0, 0, 0], [0, 1, 2]];
    const res = rotateZTrajectory(trajectory, direction);
    expect(roundCoordinates(res)).to.eql([[0, 0.11, 0.22], [0, -0.11, -0.22], [0, 0.99, 1.98]]);
  });

  it('should rotateZTrajectory -135 degrees Y & little X', function () {
    const direction = [-0.5, -0.1, -0.5];
    const trajectory = [[0, 0, 0], [0, 0, 0], [0, 1, 2]];
    const res = rotateZTrajectory(trajectory, direction);
    expect(roundCoordinates(res)).to.eql([[0, -0.69, -1.39], [0, -0.2, -0.39], [0, -0.69, -1.39]]);
  });
});

function roundCoordinates(coordinates) {
  return coordinates.map(c => c.map(e =>  Math.round(e * 100) / 100));
}