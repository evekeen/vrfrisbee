import {scaleAndTranslate} from '../src/js/matrix';
import {expect} from 'chai';
import * as mathjs from "mathjs";

describe('Rotate', function () {
  it('scale', function () {
    const trajectory = mathjs.matrix([[0, 0, 0], [0, 0, 1], [0, 1, 2]]);
    const res = scaleAndTranslate(trajectory, 2, [0, 0, 0]);
    expect(res.toArray()).to.eql([[0, 0, 0], [0, 0, 2], [0, 2, 4]]);
  });

  it('translate', function () {
    const trajectory = [[0, 0, 0], [0, 0, 1], [0, 1, 2]];
    const res = scaleAndTranslate(trajectory, 1, [1, 2, 3]);
    expect(res.toArray()).to.eql([[1, 1, 1], [2, 2, 3], [3, 4, 5]]);
  });
});