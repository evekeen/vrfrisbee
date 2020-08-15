import {AbstractMesh, Color4, ParticleSystem, Scene, Texture, Vector3} from "@babylonjs/core";

export function createParticles(scene: Scene, emitter: AbstractMesh) {
  const particleSystem = new ParticleSystem("particles", 2000, scene);
  particleSystem.emitter = emitter;
  particleSystem.particleTexture = new Texture("flare.png", scene);

  particleSystem.color1 = new Color4(0.7, 0.8, 1.0, 1.0);
  particleSystem.color2 = new Color4(0.2, 0.5, 1.0, 1.0);
  particleSystem.colorDead = new Color4(0, 0, 0.2, 0.0);

  particleSystem.minSize = 0.05;
  particleSystem.maxSize = 0.1;

  // Life time of each particle (random between...
  particleSystem.minLifeTime = 0.3;
  particleSystem.maxLifeTime = 2;

  // Emission rate
  particleSystem.emitRate = 5500;

  // Blend mode : BLENDMODE_ONEONE, or BLENDMODE_STANDARD
  particleSystem.blendMode = ParticleSystem.BLENDMODE_ONEONE;

  // Set the gravity of all particles
  particleSystem.gravity = new Vector3(5, -9.81, 0);

  // Direction of each particle after it has been emitted
  particleSystem.direction1 = new Vector3(-1000, -1000, -100);
  particleSystem.direction2 = new Vector3(1000, 1000, 100);

  // Angular speed, in radians
  particleSystem.minAngularSpeed = -Math.PI;
  particleSystem.maxAngularSpeed = Math.PI / 2;

  // Speed
  particleSystem.minEmitPower = 10;
  particleSystem.maxEmitPower = 20;
  particleSystem.updateSpeed = 0.005;

  // Start the particle system
  particleSystem.start();
}