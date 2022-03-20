import {expect} from "chai";

describe('filter', () => {
  it('1', () => {
    const x = [1, 2, 1];
    const dt = 0.01; // 10 ms
    const tau = 0.005; // 5 ms
    expect(round(filter(x, dt, tau))).to.eql([2, 2, 0]);
  });

  it('2', () => {
    const x = [1, 2, 1];
    const dt = 0.01; // 10 ms
    const tau = 0.008; // 8 ms
    expect(round(filter(x, dt, tau))).to.eql([1.25, 2.19, 0.7]);
  });
});

function filter(x: number[], dt: number, tau: number) {
  const alpha = dt / tau;
  const y: number[] = [alpha * x[0]];
  for (let i = 1; i < x.length; i++) {
    y.push(y[i - 1] + alpha * (x[i] - y[i - 1]));
  }
  return y;
}

function round(array: number[]): number[] {
  return array.map(e => Math.round(e * 100) / 100);
}