import {Color4, ParticleSystem, Scene, Texture, Vector3} from "babylonjs";

export function createParticles(scene: Scene, emitter: Vector3): ParticleSystem {
  const particleSystem = new ParticleSystem("particles", 2000, scene);
  particleSystem.emitter = emitter;
  particleSystem.particleTexture = new Texture("flare.png", scene);

  particleSystem.color1 = new Color4(0.7, 0.8, 1.0, 1.0);
  particleSystem.color2 = new Color4(0.2, 0.5, 1.0, 1.0);
  particleSystem.colorDead = new Color4(0, 0, 0.2, 0.0);

  particleSystem.minSize = 0.05;
  particleSystem.maxSize = 0.1;

  particleSystem.minLifeTime = 1;
  particleSystem.maxLifeTime = 5;

  particleSystem.emitRate = 200;
  particleSystem.blendMode = ParticleSystem.BLENDMODE_ONEONE;
  particleSystem.gravity = new Vector3(5, -9.81, 0);

  // @ts-ignore
  particleSystem.minEmitBox = new BABYLON.Vector3(-0.1, -0.02, -0.1);
  // @ts-ignore
  particleSystem.maxEmitBox = new BABYLON.Vector3(0.1, 0, 0.1);

  // Speed
  particleSystem.minEmitPower = 0.00000001;
  particleSystem.maxEmitPower = 0.00000002;
  particleSystem.updateSpeed = 0.005;

  // Start the particle system
  particleSystem.start();
  return particleSystem;
}