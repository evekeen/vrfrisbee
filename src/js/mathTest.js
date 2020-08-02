import * as math from 'mathjs';

function ndsolve(f, x0, dt, tmax) {
  const n = f.length  // Number of variables
  const x = [...x0]   // Current values of variables
  const dxdt = []        // Temporary variable to hold time-derivatives
  const result = []      // Contains entire solution

  const nsteps = math.divide(tmax, dt)   // Number of time steps
  for(let i=0; i<nsteps; i++) {
    // Compute derivatives
    for(let j=0; j<n; j++) {
      dxdt[j] = f[j].apply(null, x)
    }
    // Euler method to compute next time step
    for(let j=0; j<n; j++) {
      x[j] = math.add(x[j], math.multiply(dxdt[j], dt))
    }
    result.push([...x])
  }

  return math.matrix(result)
}

// Import the numerical ODE solver
// math.import({ndsolve:ndsolve})

// Create a math.js context for our simulation. Everything else occurs in the context of the expression parser!

const sim = math.parser()

const G = 6.67408 * Math.pow(10, 11)
sim.evaluate("G = " + G + " m^3 kg^-1 s^-2")  // Gravitational constant
const mbody = sim.evaluate("mbody = 5.972e24 kg")             // Mass of Earth
const mu = sim.evaluate("mu = G * mbody")
const dt = sim.evaluate("dt = 1.0 s")                      // Simulation timestep
const tfinal = sim.evaluate("tfinal = 162 s")                  // Simulation duration
const T = sim.evaluate("T = 1710000 lbf * 0.9")           // Engine thrust
const g0 = sim.evaluate("g0 = 9.80665 m/s^2")              // Standard gravity: used for calculating prop consumption (dmdt)
const isp = sim.evaluate("isp = 290 s")                     // Specific impulse
const gamma0 = sim.evaluate("gamma0 = 89.99883 deg")           // Initial pitch angle (90 deg is vertical)
const r0 = sim.evaluate("r0 = 6378.1370 km")               // Equatorial radius of Earth
const v0 = sim.evaluate("v0 = 10 m/s")                     // Initial velocity (must be non-zero because ODE is ill-conditioned)
const phi0 = sim.evaluate("phi0 = 0 deg")                    // Initial orbital reference angle
const m0 = sim.evaluate("m0 = 1207920 lbm + 30000 lbm")    // Initial mass of rocket and fuel

// Define the equations of motion. It is important to maintain the same argument order for each of these functions.
const drdt = sim.evaluate("drdt(r, v, m, phi, gamma) = v sin(gamma)")
const dvdt = sim.evaluate("dvdt(r, v, m, phi, gamma) = -mu / r^2 * sin(gamma) + T / m")
const dmdt = sim.evaluate("dmdt(r, v, m, phi, gamma) = -T/g0/isp")
const dphidt = sim.evaluate("dphidt(r, v, m, phi, gamma) = v/r * cos(gamma) * rad")
const dgammadt = sim.evaluate("dgammadt(r, v, m, phi, gamma) = (1/r * (v - mu / (r v)) * cos(gamma)) * rad")

// Again, remember to maintain the same variable order in the call to ndsolve.
const result_stage1 = ndsolve([drdt, dvdt, dmdt, dphidt, dgammadt], [r0, v0, m0, phi0, gamma0], dt, tfinal);
console.log(result_stage1)
                                         ;''
// Reset initial conditions for interstage flight
// sim.evaluate("T = 0 lbf")
// sim.evaluate("tfinal = 12 s")
// sim.evaluate("x = flatten(result_stage1[result_stage1.size()[1],:])")
// sim.evaluate("result_interstage = ndsolve([drdt, dvdt, dmdt, dphidt, dgammadt], x, dt, tfinal)")
//
// console.log(sim.evaluate("result_interstage[result_interstage.size()[1],3]").toString())
//
// // Reset initial conditions for stage 2 flight
// sim.evaluate("T = 210000 lbf")
// sim.evaluate("isp = 348 s")
// sim.evaluate("tfinal = 397 s")
// sim.evaluate("x = flatten(result_interstage[result_interstage.size()[1],:])")
// sim.evaluate("x[3] = 273600 lbm")  // Lighten the rocket a bit since we discarded the first stage
// sim.evaluate("result_stage2 = ndsolve([drdt, dvdt, dmdt, dphidt, dgammadt], x, dt, tfinal)")
//
// // Reset initial conditions for unpowered flight
// sim.evaluate("T = 0 lbf")
// sim.evaluate("tfinal = 60 s")
// sim.evaluate("x = flatten(result_stage2[result_stage2.size()[1],:])")
// sim.evaluate("result_unpowered = ndsolve([drdt, dvdt, dmdt, dphidt, dgammadt], x, dt, tfinal)")



// Extract the useful information from the results so it can be plotted
// const data_stage1 =     sim.evaluate("transpose(concat( transpose(    result_stage1[:,4] - phi0) * r0 / rad / km, (    transpose(result_stage1[:,1]) - r0) / km, 1 ))").toArray().map(function(e) { return {x: e[0], y: e[1]} })
// const data_interstage = sim.evaluate("transpose(concat( transpose(result_interstage[:,4] - phi0) * r0 / rad / km, (transpose(result_interstage[:,1]) - r0) / km, 1 ))").toArray().map(function(e) { return {x: e[0], y: e[1]} })
// const data_stage2 =     sim.evaluate("transpose(concat( transpose(    result_stage2[:,4] - phi0) * r0 / rad / km, (    transpose(result_stage2[:,1]) - r0) / km, 1 ))").toArray().map(function(e) { return {x: e[0], y: e[1]} })
// const data_unpowered =  sim.evaluate("transpose(concat( transpose( result_unpowered[:,4] - phi0) * r0 / rad / km, ( transpose(result_unpowered[:,1]) - r0) / km, 1 ))").toArray().map(function(e) { return {x: e[0], y: e[1]} })
//
// window['chart'] = new Chart(document.getElementById('canvas1'), {
//   type: 'line',
//   data: {
//     datasets: [{
//       label: "Stage 1",
//       data: data_stage1,
//       fill: false,
//       borderColor: "red",
//       pointRadius: 0
//     }, {
//       label: "Interstage",
//       data: data_interstage,
//       fill: false,
//       borderColor: "green",
//       pointRadius: 0
//     }, {
//       label: "Stage 2",
//       data: data_stage2,
//       fill: false,
//       borderColor: "orange",
//       pointRadius: 0
//     }, {
//       label: "Unpowered",
//       data: data_unpowered,
//       fill: false,
//       borderColor: "blue",
//       pointRadius: 0
//     }]
//   },
//   options: {
//     scales: {
//       xAxes: [{
//         type: 'linear',
//         position: 'bottom'
//       }]
//     }
//   }
//
// })