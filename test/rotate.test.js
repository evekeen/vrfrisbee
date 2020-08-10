import {rotateZTrajectory} from '../src/js/matrix';
import {expect} from 'chai';

describe('Rotate', function () {
  it('should keep z-trajectory', function () {
    const direction = [0, 0, 1];
    const trajectory = [[0, 0, 0], [0, 0, 1], [0, 1, 2]];
    const res = rotateZTrajectory(trajectory, direction, 1);
    expect(res).to.eql([[0, 0, 0], [0, 0, 1], [0, 1, 2]]);
  });

  it('should rotateZTrajectory -90 degrees Y', function () {
    const direction = [1, 0, 0];
    const trajectory = [[0, 0, 0], [0, 0, 0], [0, 1, 2]];
    const res = rotateZTrajectory(trajectory, direction, 1);
    expect(res).to.eql([[0, 1, 2], [0, 0, 0], [0, 0, 0]]);
  });

  it('should rotateZTrajectory 90 degrees X', function () {
    const direction = [0, 1, 0];
    const trajectory = [[0, 0, 0], [0, 0, 0], [0, 1, 2]];
    const res = rotateZTrajectory(trajectory, direction, 1);
    expect(res).to.eql([[0, 0, 0], [0, 1, 2], [0, 0, 0]]);
  });

  it('should rotateZTrajectory -45 degrees Y', function () {
    const direction = [0.5, 0, 0.5];
    const trajectory = [[0, 0, 0], [0, 0, 0], [0, 1, 2]];
    const res = rotateZTrajectory(trajectory, direction, 1);
    expect(roundCoordinates(res)).to.eql([[0, 0.71, 1.41], [0, 0, 0], [0, 0.71, 1.41]]);
  });

  it('should rotateZTrajectory 180 degrees Y', function () {
    const direction = [0, 0, -1];
    const trajectory = [[0, 0, 0], [0, 0, 0], [0, 1, 2]];
    const res = rotateZTrajectory(trajectory, direction, 1);
    expect(roundCoordinates(res)).to.eql([[0, 0, 0], [0, 0, 0], [0, -1, -2]]);
  });

  it('should rotateZTrajectory -135 degrees Y', function () {
    const direction = [-0.5, 0, -0.5];
    const trajectory = [[0, 0, 0], [0, 0, 0], [0, 1, 2]];
    const res = rotateZTrajectory(trajectory, direction, 1);
    expect(roundCoordinates(res)).to.eql([[0, -0.71, -1.41], [0, 0, 0], [0, -0.71, -1.41]]);
  });
});

function roundCoordinates(coordinates) {
  return coordinates.map(c => c.map(e =>  Math.round(e * 100) / 100));
}