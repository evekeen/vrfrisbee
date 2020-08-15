import {AbstractMesh, AssetsManager, Material, Vector3, Color3} from "babylonjs";

export class Forest {
  private readonly collisions = new Map<number, Collision>();

  constructor(private readonly trees: AbstractMesh[], private readonly materials: TreeMaterials) {
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

  static init(assetsManager: AssetsManager, numberOfTrees: number = 40): Promise<Forest> {
    const treeTask = assetsManager.addMeshTask('tree', '', 'pinetree/', 'tree.gltf');
    return new Promise<Forest>((resolve, reject) => {
      treeTask.onSuccess = task => {
        const original = task.loadedMeshes[0];
        const trees: AbstractMesh[] = [];
        for (let i = 0; i < numberOfTrees; i++) {
          const tree = Forest.setupTree(original, i);
          trees.push(tree);
        }

        const normal = original.getChildMeshes()[0].material!!;
        const collided = normal.clone('tree-collided')!!;
        // @ts-ignore
        collided.emissiveColor = new Color3(0.8, 0, 0.5);
        original.dispose();
        resolve(new Forest(trees, {normal, collided}));
      };
      treeTask.onError = err => {
        console.log("Cannot load scene", err);
        reject(err);
      }
    })
  }

  private static setupTree(original: AbstractMesh, i: number): AbstractMesh {
    const root = original.clone('tree' + i, null)!!;
    const scaleIncrease = Math.random();
    const scale = TREE_SCALE_BASE * (scaleIncrease + 1);
    const coordinates = nextTreeCoordinates();
    coordinates[1] -= scaleIncrease * 3;
    root.position = Vector3.FromArray(coordinates);
    root.scaling = new Vector3(scale, scale, scale);
    root.computeWorldMatrix();

    const tree = root.getChildMeshes()[0];
    tree.checkCollisions = true;
    return tree;
  }
}

class Collision {
  private elapsed: number = 0;

  constructor(private readonly mesh: AbstractMesh, private readonly materials: TreeMaterials) {
    this.restart();
  }

  nextFrame(): boolean {
    if (this.elapsed++ > TREE_ANIMATION_LENGTH) {
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

export interface TreeMaterials {
  normal: Material;
  collided: Material;
}

const TREE_ANIMATION_LENGTH = 20;
const TREE_SCALE_BASE = 0.3;
const TREE_POSITION_RANGE = 30;
const MIN_TREE_DISTANCE = 5;

function nextTreeCoordinates(): number[] {
  const distance = Math.random() * TREE_POSITION_RANGE + MIN_TREE_DISTANCE;
  const angle = Math.random() * Math.PI * 2;
  const x = Math.cos(angle) * distance;
  const z = Math.sin(angle) * distance;
  return [x, 0, z];
}