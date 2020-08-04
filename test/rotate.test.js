import {rotate} from '../src/js/trajectories';
import {expect} from 'chai';

describe('Rotate', function () {
  it('should rotate simple 2 points', function () {
    const direction = [0, 0, 1];
    const trajectory = [[0, 0, 0], [0, 0, 0], [0, 1, 2]];
    const res = rotate(trajectory, direction);
    expect(res.toArray()).to.eql([[0, 1, 2], [0, 0, 0], [0, 0, 0]]);
  });
});
