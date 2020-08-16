import {Color4, ParticleSystem, Scene, Texture, Vector3} from "babylonjs";

export function createParticles(scene: Scene, emitter: Vector3): ParticleSystem {
  const particleSystem = new ParticleSystem("particles", 20000, scene);
  particleSystem.emitter = emitter;
  particleSystem.particleTexture = new Texture("flare.png", scene);

  particleSystem.color1 = new Color4(0.7, 0.8, 1.0, 1.0);
  particleSystem.color2 = new Color4(0.2, 0.5, 1.0, 1.0);
  particleSystem.colorDead = new Color4(0, 0, 0.2, 0.0);

  particleSystem.minSize = 0.05;
  particleSystem.maxSize = 0.1;

  particleSystem.minLifeTime = 1;
  particleSystem.maxLifeTime = 10;

  particleSystem.emitRate = 3000;

  // Blend mode : BLENDMODE_ONEONE, or BLENDMODE_STANDARD
  particleSystem.blendMode = ParticleSystem.BLENDMODE_ONEONE;

  // Set the gravity of all particles
  particleSystem.gravity = new Vector3(5, -9.81, 0);

  // Direction of each particle after it has been emitted
  particleSystem.direction1 = new Vector3(-1, 0, -1);
  particleSystem.direction2 = new Vector3(1, 0, 1);

  // Angular speed, in radians
  particleSystem.minAngularSpeed = 0;
  particleSystem.maxAngularSpeed = Math.PI / 2;

  // Speed
  particleSystem.minEmitPower = 0.00000001;
  particleSystem.maxEmitPower = 0.00000002;
  particleSystem.updateSpeed = 0.005;

  // Start the particle system
  particleSystem.start();
  return particleSystem;
}