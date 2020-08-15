import {AbstractMesh, AssetsManager, Color3, Vector3} from "babylonjs";
import {CollidingCollection} from "./CollidingCollection";

export function initForest(assetsManager: AssetsManager, numberOfTrees: number = 40): Promise<CollidingCollection> {
  const treeTask = assetsManager.addMeshTask('tree', '', 'pinetree/', 'tree.gltf');
  return new Promise<CollidingCollection>((resolve, reject) => {
    treeTask.onSuccess = task => {
      const original = task.loadedMeshes[0];
      const trees: AbstractMesh[] = [];
      for (let i = 0; i < numberOfTrees; i++) {
        const tree = setupTree(original, i);
        trees.push(tree);
      }

      const normal = original.getChildMeshes()[0].material!!;
      const collided = normal.clone('tree-collided')!!;
      // @ts-ignore
      collided.emissiveColor = new Color3(0.8, 0, 0.5);
      original.dispose();
      resolve(new CollidingCollection(trees, {normal, collided}));
    };
    treeTask.onError = err => {
      console.log("Cannot load scene", err);
      reject(err);
    }
  })
}

function setupTree(original: AbstractMesh, i: number): AbstractMesh {
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