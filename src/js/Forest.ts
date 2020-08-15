import {AbstractMesh, AssetsManager, Material, Mesh, Vector3} from "@babylonjs/core";

export class Forest {
  private readonly collisions = new Map<number, Collision>();

  constructor(private readonly trees: AbstractMesh[], private readonly materials: TreeMaterials) {
  }

  checkCollisions(frisbee: AbstractMesh) {
    this.trees.forEach((tree, i) => {
      this.collisions.forEach((c, i) => {
        if (c.nextFrame()) this.collisions.delete(i);
      });
      if (frisbee.intersectsMesh(tree)) {
        if (!this.collisions.has(i)) {
          this.collisions.set(i, new Collision(tree, this.materials, 0));
        }
      }
    });
  }

  static init(numberOfTrees: number, assetsManager: AssetsManager): Promise<Forest> {
    const treeTask = assetsManager.addMeshTask('tree', '', 'pinetree/', 'tree.gltf');
    return new Promise<Forest>((resolve, reject) => {
      treeTask.onSuccess = task => {
        const original = task.loadedMeshes[0];
        const trees: AbstractMesh[] = [];
        for (let i = 0; i < numberOfTrees; i++) {
          const tree = Forest.setupTree(original, i);
          trees.push(tree);
        }

        const normal = original.material!!.clone('tree-normal')!!;
        const collided = normal.clone('tree-collided')!!;
        collided.alpha = 0.5;
        original.setEnabled(false);

        resolve(new Forest(trees, {normal, collided}));
      };
      treeTask.onError = err => {
        console.log("Cannot load scene", err);
        reject(err);
      }
    })
  }

  private static setupTree(original: AbstractMesh, i: number): AbstractMesh {
    const tree = original.clone('tree' + i, null)!!;
    tree.position = Vector3.FromArray(nextTreeCoordinates());
    const scale = TREE_SCALE_BASE * (Math.random() + 1);
    tree.scaling = new Vector3(scale, scale, scale);
    return tree;
  }
}

class Collision {
  constructor(private readonly mesh: AbstractMesh, private readonly materials: TreeMaterials, private elapsed: number) {
    this.start();
  }

  nextFrame(): boolean {
    if (this.elapsed++ > TREE_ANIMATION_LENGTH) {
      this.end();
      return true;
    }
    return false;
  }

  private start(): void {
    this.mesh.material = this.materials.collided;
  }

  private end(): void {
    this.mesh.material = this.materials.normal;
  }
}

interface TreeMaterials {
  normal: Material;
  collided: Material;
}

const TREE_ANIMATION_LENGTH = 10;
const TREE_SCALE_BASE = 0.3;
const TREE_POSITION_RANGE = 30;
const MIN_TREE_DISTANCE = 10;

function nextTreeCoordinates(): number[] {
  const distance = Math.random() * TREE_POSITION_RANGE + MIN_TREE_DISTANCE;
  const angle = Math.random() * Math.PI * 2;
  const x = Math.cos(angle) * distance;
  const z = Math.sin(angle) * distance;
  return [x, 0, z];
}