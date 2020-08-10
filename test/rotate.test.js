import {rotate} from '../src/js/trajectories';
import {expect} from 'chai';

describe('Rotate', function () {
  it('should keep z-trajectory', function () {
    const direction = [0, 0, 1];
    const trajectory = [[0, 0, 0], [0, 0, 1], [0, 1, 2]];
    const res = rotate(trajectory, direction, 1);
    expect(res).to.eql([[0, 0, 0], [0, 0, 1], [0, 1, 2]]);
  });

  it('should rotate 90 degrees towards X', function () {
    const direction = [1, 0, 0];
    const trajectory = [[0, 0, 0], [0, 0, 0], [0, 1, 2]];
    const res = rotate(trajectory, direction, 1);
    expect(res).to.eql([[0, 1, 2], [0, 0, 0], [0, 0, 0]]);
  });

  it('should rotate 90 degrees towards Y', function () {
    const direction = [0, 1, 0];
    const trajectory = [[0, 0, 0], [0, 0, 0], [0, 1, 2]];
    const res = rotate(trajectory, direction, 1);
    expect(res).to.eql([[0, 0, 0], [0, 1, 2], [0, 0, 0]]);
  });

  it('should rotate 45 degrees towards X', function () {
    const direction = [0.5, 0, 0.5];
    const trajectory = [[0, 0, 0], [0, 0, 0], [0, 1, 2]];
    const res = rotate(trajectory, direction, 1);
    expect(roundCoordinates(res)).to.eql([[0, 0.5, 1], [0, 0, 0], [0, 0.5, 1]]);
  });

  it('should rotate 180 degrees Y', function () {
    const direction = [0, 0, -1];
    const trajectory = [[0, 0, 0], [0, 0, 0], [0, 1, 2]];
    const res = rotate(trajectory, direction, 1);
    expect(roundCoordinates(res)).to.eql([[0, 0, 0], [0, 0, 0], [0, -1, -2]]);
  });

  it('should rotate -135 degrees Y', function () {
    const direction = [-0.5, 0, -0.5];
    const trajectory = [[0, 0, 0], [0, 0, 0], [0, 1, 2]];
    const res = rotate(trajectory, direction, 1);
    expect(roundCoordinates(res)).to.eql([[0, -0.5, -1], [0, 0, 0], [0, -0.5, -1]]);
  });
});

function roundCoordinates(coordinates) {
  return coordinates.map(c => c.map(e =>  Math.round(e * 100) / 100));
}