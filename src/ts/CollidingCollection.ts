import {AbstractMesh, AssetsManager, Material, Vector3, Color3} from "babylonjs";

export class CollidingCollection {
  private readonly collisions = new Map<number, Collision>();

  constructor(private readonly trees: AbstractMesh[], private readonly materials: CollisionMaterials) {
  }

  checkCollisions(frisbee: AbstractMesh) {
    this.collisions.forEach((c, i) => {
      if (c.nextFrame()) this.collisions.delete(i);
    });

    this.trees.forEach((tree, i) => {
      if (frisbee.intersectsMesh(tree)) {
        const collision = this.collisions.get(i);
        if (collision) {
          collision.restart();
        } else {
          this.collisions.set(i, new Collision(tree, this.materials));
        }
      }
    });
  }
}

class Collision {
  private elapsed: number = 0;

  constructor(private readonly mesh: AbstractMesh, private readonly materials: CollisionMaterials) {
    this.restart();
  }

  nextFrame(): boolean {
    if (this.elapsed++ > ANIMATION_LENGTH) {
      this.end();
      return true;
    }
    return false;
  }

  restart(): void {
    this.elapsed = 0;
    this.mesh.material = this.materials.collided;
  }

  private end(): void {
    this.mesh.material = this.materials.normal;
  }
}

export interface CollisionMaterials {
  normal: Material;
  collided: Material;
}

const ANIMATION_LENGTH = 10;
