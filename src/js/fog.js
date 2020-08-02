const useGPUVersion = true;
let particleSystem;

export const createFogParticles = function(scene) {
  const fountain = BABYLON.Mesh.CreateBox("foutain", .01, scene);
  fountain.visibility = 0;

  const fogTexture = new BABYLON.Texture("https://raw.githubusercontent.com/aWeirdo/Babylon.js/master/smoke_15.png", scene);
  if (particleSystem) {
    particleSystem.dispose();
  }

  if (useGPUVersion && BABYLON.GPUParticleSystem.IsSupported) {
    particleSystem = new BABYLON.GPUParticleSystem("particles", { capacity: 50000 }, scene);
    particleSystem.activeParticleCount = 15000;
    particleSystem.manualEmitCount = particleSystem.activeParticleCount;
    particleSystem.minEmitBox = new BABYLON.Vector3(-50, 2, -50); // Starting all from
    particleSystem.maxEmitBox = new BABYLON.Vector3(50, 2, 50); // To..

  } else {
    particleSystem = new BABYLON.ParticleSystem("particles", 2500 , scene);
    particleSystem.manualEmitCount = particleSystem.getCapacity();
    particleSystem.minEmitBox = new BABYLON.Vector3(-25, 2, -25); // Starting all from
    particleSystem.maxEmitBox = new BABYLON.Vector3(25, 2, 25); // To...
  }


  particleSystem.particleTexture = fogTexture.clone();
  particleSystem.emitter = fountain;

  particleSystem.color1 = new BABYLON.Color4(0.8, 0.8, 0.8, 0.1);
  particleSystem.color2 = new BABYLON.Color4(.95, .95, .95, 0.15);
  particleSystem.colorDead = new BABYLON.Color4(0.9, 0.9, 0.9, 0.1);
  particleSystem.minSize = 3.5;
  particleSystem.maxSize = 5.0;
  particleSystem.minLifeTime = Number.MAX_SAFE_INTEGER;
  particleSystem.emitRate = 50000;
  particleSystem.blendMode = BABYLON.ParticleSystem.BLENDMODE_STANDARD;
  particleSystem.gravity = new BABYLON.Vector3(0, 0, 0);
  particleSystem.direction1 = new BABYLON.Vector3(0, 0, 0);
  particleSystem.direction2 = new BABYLON.Vector3(0, 0, 0);
  particleSystem.minAngularSpeed = -2;
  particleSystem.maxAngularSpeed = 2;
  particleSystem.minEmitPower = .5;
  particleSystem.maxEmitPower = 1;
  particleSystem.updateSpeed = 0.005;

  particleSystem.start();
  return particleSystem;
}