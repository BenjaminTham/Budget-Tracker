/* eslint-disable prefer-const */
/* eslint-disable @typescript-eslint/no-explicit-any */
import * as THREE from "three";
import { createAssetInstance } from "./Assets";

export function createScene(
  scene: THREE.Scene,
  camera: any,
  renderer: THREE.WebGLRenderer,
  onObjectSelected?: (object: THREE.Object3D) => void
) {
  const raycaster = new THREE.Raycaster();
  const mouse = new THREE.Vector2();
  let selectedObject: THREE.Mesh<any, any, any> | undefined = undefined;

  let terrain = [];
  let buildings: any[][] = [];

  // let onObjectSelected = undefined;

  async function initialize(city: { size: number; data: any[][] }) {
    // scene.clear();
    terrain = [];
    buildings = [];
    for (let x = 0; x < city.size; x++) {
      const column = [];
      for (let y = 0; y < city.size; y++) {
        /** 1. load mesh/object corresponding to the tile at {x,y}
         *  2. add mesh to scene
         *  3. add mesh to meshes array
         */

        // grass geometry
        const terrainId = city.data[x][y].terrainId;
        const mesh = await createAssetInstance(
          terrainId,
          x,
          y,
          city.data[x][y].building
        );
        if (mesh) scene.add(mesh);

        column.push(mesh);
      }
      terrain.push(column);
      buildings.push([...Array(city.size)]);
    }

    setupLight();
  }

  async function update(city: { size: number; data: any[][] }) {
    // console.log("@@update scene");
    for (let x = 0; x < city.size; x++) {
      for (let y = 0; y < city.size; y++) {
        const tile = city.data[x][y];
        const existingBuildingMesh = buildings[x][y];

        //if player removes building, remove from scene
        if (!tile.building && existingBuildingMesh) {
          scene.remove(existingBuildingMesh);
          buildings[x][y] = undefined;
        }

        //if data model has changed, update mesh
        if (tile.building && tile.building.updated) {
          scene.remove(existingBuildingMesh);
          buildings[x][y] = await createAssetInstance(
            tile.building.id,
            x,
            y,
            tile.building
          );
          if (buildings[x][y]) scene.add(buildings[x][y]);

          tile.building.updated = false;
        }
      }
    }
  }

  function setupLight() {
    const sun = new THREE.DirectionalLight(0xffffff, 5);
    sun.position.set(20, 20, 20);
    sun.castShadow = true;
    sun.shadow.camera.left = -10;
    sun.shadow.camera.right = 10;
    sun.shadow.camera.top = 0;
    sun.shadow.camera.bottom = -10;
    sun.shadow.mapSize.width = 1024;
    sun.shadow.mapSize.height = 1024;
    sun.shadow.camera.near = 0.5;
    sun.shadow.camera.far = 50;

    scene.add(sun);
    scene.add(new THREE.AmbientLight(0xffffff, 0.3));
  }

  function onMouseDown(event: MouseEvent) {
    camera.onMouseDown(event);
  }

  function onMouseUp(event: MouseEvent) {
    camera.onMouseUp(event);

    const bounds = renderer.domElement.getBoundingClientRect();
    mouse.x = ((event.clientX - bounds.left) / bounds.width) * 2 - 1;
    mouse.y = -((event.clientY - bounds.top) / bounds.height) * 2 + 1;

    raycaster.setFromCamera(mouse, camera.camera);

    let intersections = raycaster.intersectObjects(scene.children, false);

    if (intersections.length > 0) {
      // console.log(intersections[0]);
      if (intersections[0].object instanceof THREE.Mesh) {
        if (selectedObject) {
          // selectedObject.material.emissive.setHex(0);
          selectedObject.material.forEach(
            (material: { emissive: THREE.Color }) => {
              material.emissive.setHex(0); // Green emissive color
            }
          );
        }
        selectedObject = intersections[0].object;

        // selectedObject.material.emissive.setHex(0x555555);

        selectedObject.material.forEach(
          (material: { emissive: THREE.Color }) => {
            material.emissive.setHex(0x555555); // Green emissive color
          }
        );

        if (onObjectSelected) {
          onObjectSelected(selectedObject);
        }
      }
    }
  }

  function onMouseMove(event: MouseEvent) {
    camera.onMouseMove(event);
  }

  function onScroll(event: MouseEvent) {
    camera.onScroll(event);
  }

  return {
    initialize,
    update,
    onMouseDown,
    onMouseMove,
    onMouseUp,
    onScroll,
    onObjectSelected,
  };
}
