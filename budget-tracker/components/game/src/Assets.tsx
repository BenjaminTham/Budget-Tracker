/* eslint-disable @typescript-eslint/no-explicit-any */
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";

const BUILDING_Y_ADJUSTMENT = 0.06;

const geometry = new THREE.BoxGeometry(1, 1, 1);

//importing models
const models = {
  "building-road": new URL(
    "../../../public/village/village/Props/Blends/Path_Square.glb",
    import.meta.url
  ),
  "building-belltower": new URL(
    "../../../public/village/village/Buildings/Blends/Bell_Tower.glb",
    import.meta.url
  ),
  "building-inn": new URL(
    "../../../public/village/village/Buildings/Blends/Inn.glb",
    import.meta.url
  ),
  "building-well": new URL(
    "../../../public/village/village/Buildings/Blends/Well.glb",
    import.meta.url
  ),
  "building-gazebo": new URL(
    "../../../public/village/village/Buildings/Blends/Gazebo.glb",
    import.meta.url
  ),
  "building-tree1": new URL(
    "../../../public/village/village/Buildings/glTF/Resource_Tree1.gltf",
    import.meta.url
  ),
  "building-tree2": new URL(
    "../../../public/village/village/Buildings/glTF/Resource_Tree2.gltf",
    import.meta.url
  ),
  "building-tree3": new URL(
    "../../../public/village/village/Buildings/glTF/Resource_PineTree.gltf",
    import.meta.url
  ),
  "building-towerhouse": new URL(
    "../../../public/village/village/Buildings/glTF/TowerHouse_SecondAge.gltf",
    import.meta.url
  ),
  "building-windmill": new URL(
    "../../../public/village/village/Buildings/glTF/Windmill_SecondAge.gltf",
    import.meta.url
  ),
};

const residentialModels = {
  "residential-5": new URL(
    "../../../public/village/village/Buildings/glTF/Houses_SecondAge_1_Level1.gltf",
    import.meta.url
  ),
  "residential-6": new URL(
    "../../../public/village/village/Buildings/glTF/Houses_SecondAge_1_Level2.gltf",
    import.meta.url
  ),
  "residential-7": new URL(
    "../../../public/village/village/Buildings/glTF/Houses_SecondAge_1_Level3.gltf",
    import.meta.url
  ),
  "residential-8": new URL(
    "../../../public/village/village/Buildings/glTF/Houses_SecondAge_2_Level1.gltf",
    import.meta.url
  ),
  "residential-9": new URL(
    "../../../public/village/village/Buildings/glTF/Houses_SecondAge_2_Level2.gltf",
    import.meta.url
  ),
  "residential-11": new URL(
    "../../../public/village/village/Buildings/glTF/Houses_SecondAge_3_Level1.gltf",
    import.meta.url
  ),
  "residential-12": new URL(
    "../../../public/village/village/Buildings/glTF/Houses_SecondAge_3_Level2.gltf",
    import.meta.url
  ),
  "residential-13": new URL(
    "../../../public/village/village/Buildings/glTF/Houses_SecondAge_3_Level3.gltf",
    import.meta.url
  ),
};
const residentialModelUrls = Object.values(residentialModels);

const residential2Models = {
  "residential-1": new URL(
    "../../../public/village/village/Buildings/Blends/House_1.glb",
    import.meta.url
  ),
  "residential-2": new URL(
    "../../../public/village/village/Buildings/Blends/House_2.glb",
    import.meta.url
  ),
  "residential-3": new URL(
    "../../../public/village/village/Buildings/Blends/House_3.glb",
    import.meta.url
  ),
  "residential-4": new URL(
    "../../../public/village/village/Buildings/Blends/House_4.glb",
    import.meta.url
  ),
};
const residential2ModelUrls = Object.values(residential2Models);

const commercialModels = {
  "commercial-1": new URL(
    "../../../public/village/village/Buildings/Blends/MarketStand_1.glb",
    import.meta.url
  ),
  "commercial-2": new URL(
    "../../../public/village/village/Buildings/Blends/MarketStand_2.glb",
    import.meta.url
  ),
};
const commercialModelUrls = Object.values(commercialModels);

const industrialModels = {
  "industrial-1": new URL(
    "../../../public/village/village/Buildings/Blends/Blacksmith.glb",
    import.meta.url
  ),
  "industrial-2": new URL(
    "../../../public/village/village/Buildings/Blends/Mill.glb",
    import.meta.url
  ),
  "industrial-3": new URL(
    "../../../public/village/village/Buildings/Blends/Sawmill.glb",
    import.meta.url
  ),
  "industrial-4": new URL(
    "../../../public/village/village/Buildings/Blends/Stable.glb",
    import.meta.url
  ),
  "industrial-5": new URL(
    "../../../public/village/village/Buildings/glTF/Farm_SecondAge_Level1.gltf",
    import.meta.url
  ),
  "industrial-6": new URL(
    "../../../public/village/village/Buildings/glTF/Farm_SecondAge_Level2.gltf",
    import.meta.url
  ),
  "industrial-7": new URL(
    "../../../public/village/village/Buildings/glTF/Farm_SecondAge_Level3.gltf",
    import.meta.url
  ),
};
const industrialModelUrls = Object.values(industrialModels);

const militaryModels = {
  "military-1": new URL(
    "../../../public/village/village/Buildings/glTF/Archery_SecondAge_Level1.gltf",
    import.meta.url
  ),
  "military-2": new URL(
    "../../../public/village/village/Buildings/glTF/Archery_SecondAge_Level2.gltf",
    import.meta.url
  ),
  "military-3": new URL(
    "../../../public/village/village/Buildings/glTF/Archery_SecondAge_Level3.gltf",
    import.meta.url
  ),
  "military-4": new URL(
    "../../../public/village/village/Buildings/glTF/Barracks_SecondAge_Level2.gltf",
    import.meta.url
  ),
  "military-5": new URL(
    "../../../public/village/village/Buildings/glTF/Barracks_SecondAge_Level3.gltf",
    import.meta.url
  ),
};
const militaryModelUrls = Object.values(militaryModels);

const roadPropModels = {
  "roadprop-1": new URL(
    "../../../public/village/village/Props/Blends/Bench_1.glb",
    import.meta.url
  ),
  "roadprop-2": new URL(
    "../../../public/village/village/Props/Blends/Bench_2.glb",
    import.meta.url
  ),
  "roadprop-3": new URL(
    "../../../public/village/village/Props/Blends/Cart.glb",
    import.meta.url
  ),
  "roadprop-4": new URL(
    "../../../public/village/village/Props/Blends/Sawmill_saw.glb",
    import.meta.url
  ),
};
const roadPropModelUrls = Object.values(roadPropModels);

const storageModels = {
  "storage-1": new URL(
    "../../../public/village/village/Buildings/glTF/Storage_SecondAge_Level1.gltf",
    import.meta.url
  ),
  "storage-2": new URL(
    "../../../public/village/village/Buildings/glTF/Storage_SecondAge_Level2.gltf",
    import.meta.url
  ),
  "storage-3": new URL(
    "../../../public/village/village/Buildings/glTF/Storage_SecondAge_Level3.gltf",
    import.meta.url
  ),
};
const storageModelUrls = Object.values(storageModels);

const templeModels = {
  "temple-1": new URL(
    "../../../public/village/village/Buildings/glTF/Temple_SecondAge_Level1.gltf",
    import.meta.url
  ),
  "temple-2": new URL(
    "../../../public/village/village/Buildings/glTF/Temple_SecondAge_Level2.gltf",
    import.meta.url
  ),
  "temple-3": new URL(
    "../../../public/village/village/Buildings/glTF/Temple_SecondAge_Level3.gltf",
    import.meta.url
  ),
};
const templeModelUrls = Object.values(templeModels);

const towncenterModels = {
  "towncenter-1": new URL(
    "../../../public/village/village/Buildings/glTF/TownCenter_SecondAge_Level1.gltf",
    import.meta.url
  ),
  "towncenter-2": new URL(
    "../../../public/village/village/Buildings/glTF/TownCenter_SecondAge_Level2.gltf",
    import.meta.url
  ),
  "towncenter-3": new URL(
    "../../../public/village/village/Buildings/glTF/TownCenter_SecondAge_Level3.gltf",
    import.meta.url
  ),
};
const towncenterModelUrls = Object.values(towncenterModels);

const watchtowerModels = {
  "towncenter-1": new URL(
    "../../../public/village/village/Buildings/glTF/WatchTower_SecondAge_Level1.gltf",
    import.meta.url
  ),
  "towncenter-2": new URL(
    "../../../public/village/village/Buildings/glTF/WatchTower_SecondAge_Level2.gltf",
    import.meta.url
  ),
  "towncenter-3": new URL(
    "../../../public/village/village/Buildings/glTF/WatchTower_SecondAge_Level3.gltf",
    import.meta.url
  ),
};
const watchtowerModelUrls = Object.values(watchtowerModels);

const assetLoader = new GLTFLoader();

//load gltf models by name
const assets: {
  [key: string]: (x: number, y: number, data?: any) => Promise<THREE.Object3D>;
} = {
  "building-residential": async (x, y, data) => {
    const roadModelGroup = new THREE.Group();
    const randomHouse = Math.floor(Math.random() * residentialModelUrls.length);
    const modelUrl = residentialModelUrls[randomHouse];
    roadModelGroup.add(
      await loadGLTFModel(modelUrl, x, y, data, "residential")
    );
    roadModelGroup.add(
      await loadGLTFModel(models["building-road"], x, y, data, "road")
    );
    roadModelGroup.children[0].position.y = BUILDING_Y_ADJUSTMENT;

    return await roadModelGroup;
  },

  "building-residential2": async (x, y, data) => {
    const roadModelGroup = new THREE.Group();
    const randomHouse = Math.floor(
      Math.random() * residential2ModelUrls.length
    );
    const modelUrl = residential2ModelUrls[randomHouse];
    roadModelGroup.add(
      await loadGLTFModel(modelUrl, x, y, data, "residential2")
    );
    roadModelGroup.add(
      await loadGLTFModel(models["building-road"], x, y, data, "road")
    );
    roadModelGroup.children[0].position.y = BUILDING_Y_ADJUSTMENT;

    return await roadModelGroup;
  },

  "building-military": async (x, y, data) => {
    const roadModelGroup = new THREE.Group();
    const randomHouse = Math.floor(Math.random() * militaryModelUrls.length);
    const modelUrl = militaryModelUrls[randomHouse];
    roadModelGroup.add(await loadGLTFModel(modelUrl, x, y, data, "military"));
    roadModelGroup.add(
      await loadGLTFModel(models["building-road"], x, y, data, "road")
    );
    roadModelGroup.children[0].position.y = BUILDING_Y_ADJUSTMENT;

    return await roadModelGroup;
  },

  "building-commercial": async (x, y, data) => {
    const roadModelGroup = new THREE.Group();
    const randomHouse = Math.floor(Math.random() * commercialModelUrls.length);
    const modelUrl = commercialModelUrls[randomHouse];
    roadModelGroup.add(await loadGLTFModel(modelUrl, x, y, data, "commercial"));
    roadModelGroup.add(
      await loadGLTFModel(models["building-road"], x, y, data, "road")
    );
    roadModelGroup.children[0].position.y = BUILDING_Y_ADJUSTMENT;

    return await roadModelGroup;
  },

  "building-industrial": async (x, y, data) => {
    const roadModelGroup = new THREE.Group();
    const randomHouse = Math.floor(Math.random() * industrialModelUrls.length);
    const modelUrl = industrialModelUrls[randomHouse];
    roadModelGroup.add(await loadGLTFModel(modelUrl, x, y, data, "industrial"));
    roadModelGroup.add(
      await loadGLTFModel(models["building-road"], x, y, data, "road")
    );
    roadModelGroup.children[0].position.y = BUILDING_Y_ADJUSTMENT;
    return await roadModelGroup;
  },

  "building-road": async (x, y, data) => {
    const roadModelGroup = new THREE.Group();
    const randomProp = Math.floor(Math.random() * roadPropModelUrls.length);
    const modelUrl = roadPropModelUrls[randomProp];
    if (Math.random() < 0.4) {
      roadModelGroup.add(
        await loadGLTFModel(modelUrl, x, y, data, "roadprops")
      );
      roadModelGroup.children[0].rotation.y = (Math.PI / 2) * Math.random();
      roadModelGroup.children[0].position.set(
        x + (Math.random() - 0.5) * 1,
        0.065,
        y + (Math.random() - 0.5) * 1
      );
    }
    roadModelGroup.add(
      await loadGLTFModel(models["building-road"], x, y, data, "road")
    );
    return await roadModelGroup;
  },

  "building-belltower": async (x, y, data) => {
    const roadModelGroup = new THREE.Group();
    roadModelGroup.add(
      await loadGLTFModel(models["building-belltower"], x, y, data, "belltower")
    );
    roadModelGroup.add(
      await loadGLTFModel(models["building-road"], x, y, data, "road")
    );
    roadModelGroup.children[0].position.y = BUILDING_Y_ADJUSTMENT;

    return await roadModelGroup;
  },

  "building-inn": async (x, y, data) => {
    const roadModelGroup = new THREE.Group();
    roadModelGroup.add(
      await loadGLTFModel(models["building-inn"], x, y, data, "inn")
    );
    roadModelGroup.add(
      await loadGLTFModel(models["building-road"], x, y, data, "road")
    );
    roadModelGroup.children[0].position.y = BUILDING_Y_ADJUSTMENT;

    return await roadModelGroup;
  },

  "building-well": async (x, y, data) => {
    const roadModelGroup = new THREE.Group();
    roadModelGroup.add(
      await loadGLTFModel(models["building-well"], x, y, data, "well")
    );
    roadModelGroup.add(
      await loadGLTFModel(models["building-road"], x, y, data, "road")
    );
    roadModelGroup.children[0].position.y = BUILDING_Y_ADJUSTMENT + 0.1;

    return await roadModelGroup;
  },

  "building-gazebo": async (x, y, data) => {
    const roadModelGroup = new THREE.Group();
    roadModelGroup.add(
      await loadGLTFModel(models["building-gazebo"], x, y, data, "gazebo")
    );
    roadModelGroup.add(
      await loadGLTFModel(models["building-road"], x, y, data, "road")
    );
    roadModelGroup.children[0].position.y = BUILDING_Y_ADJUSTMENT;

    return await roadModelGroup;
  },

  "building-grass": async (x, y) => {
    const mat = [
      new THREE.MeshToonMaterial({ color: 0x59360d }),
      new THREE.MeshToonMaterial({ color: 0x59360d }),
      new THREE.MeshToonMaterial({ color: 0x0d591f }),
      new THREE.MeshToonMaterial({ color: 0x59360d }),
      new THREE.MeshToonMaterial({ color: 0x59360d }),
      new THREE.MeshToonMaterial({ color: 0x59360d }),
    ];
    const mesh = new THREE.Mesh(geometry, mat);
    mesh.userData = { id: "grass", x, y };
    mesh.position.set(x, -0.5, y);
    mesh.receiveShadow = true;
    const edges = new THREE.EdgesGeometry(geometry);
    const lineMaterial = new THREE.LineBasicMaterial({ color: 0x0d591f }); // border color
    const line = new THREE.LineSegments(edges, lineMaterial);
    mesh.add(line); // add outline to mesh
    return mesh;
  },

  "building-tree1": async (x, y, data) => {
    const roadModelGroup = new THREE.Group();
    roadModelGroup.add(
      await loadGLTFModel(models["building-tree1"], x, y, data, "tree1")
    );
    roadModelGroup.add(
      await loadGLTFModel(models["building-road"], x, y, data, "road")
    );
    roadModelGroup.children[0].scale.set(1, 1, 1);

    roadModelGroup.children[0].position.y = BUILDING_Y_ADJUSTMENT;

    return await roadModelGroup;
  },

  "building-tree2": async (x, y, data) => {
    const roadModelGroup = new THREE.Group();
    roadModelGroup.add(
      await loadGLTFModel(models["building-tree2"], x, y, data, "tree2")
    );
    roadModelGroup.add(
      await loadGLTFModel(models["building-road"], x, y, data, "road")
    );
    roadModelGroup.children[0].scale.set(1, 1, 1);
    roadModelGroup.children[0].position.y = BUILDING_Y_ADJUSTMENT;
    return await roadModelGroup;
  },

  "building-tree3": async (x, y, data) => {
    const roadModelGroup = new THREE.Group();
    roadModelGroup.add(
      await loadGLTFModel(models["building-tree3"], x, y, data, "tree3")
    );
    roadModelGroup.add(
      await loadGLTFModel(models["building-road"], x, y, data, "road")
    );
    roadModelGroup.children[0].scale.set(1.4, 1.4, 1.4);
    roadModelGroup.children[0].position.y = BUILDING_Y_ADJUSTMENT;

    return await roadModelGroup;
  },

  "building-storage": async (x, y, data) => {
    const roadModelGroup = new THREE.Group();
    const randomHouse = Math.floor(Math.random() * storageModelUrls.length);
    const modelUrl = storageModelUrls[randomHouse];
    roadModelGroup.add(await loadGLTFModel(modelUrl, x, y, data, "storage"));
    roadModelGroup.add(
      await loadGLTFModel(models["building-road"], x, y, data, "road")
    );
    roadModelGroup.children[0].scale.set(0.7, 0.7, 0.7);
    roadModelGroup.children[0].position.y = BUILDING_Y_ADJUSTMENT;

    return await roadModelGroup;
  },

  "building-temple": async (x, y, data) => {
    const roadModelGroup = new THREE.Group();
    const randomHouse = Math.floor(Math.random() * templeModelUrls.length);
    const modelUrl = templeModelUrls[randomHouse];
    roadModelGroup.add(await loadGLTFModel(modelUrl, x, y, data, "temple"));
    roadModelGroup.add(
      await loadGLTFModel(models["building-road"], x, y, data, "road")
    );
    roadModelGroup.children[0].scale.set(0.5, 0.5, 0.5);
    roadModelGroup.children[0].position.y = BUILDING_Y_ADJUSTMENT;

    return await roadModelGroup;
  },

  "building-towerhouse": async (x, y, data) => {
    const roadModelGroup = new THREE.Group();
    roadModelGroup.add(
      await loadGLTFModel(
        models["building-towerhouse"],
        x,
        y,
        data,
        "towerhouse"
      )
    );
    roadModelGroup.add(
      await loadGLTFModel(models["building-road"], x, y, data, "road")
    );
    roadModelGroup.children[0].scale.set(0.6, 0.6, 0.6);
    roadModelGroup.children[0].position.y = BUILDING_Y_ADJUSTMENT;

    return await roadModelGroup;
  },

  "building-towncenter": async (x, y, data) => {
    const roadModelGroup = new THREE.Group();
    const randomHouse = Math.floor(Math.random() * towncenterModelUrls.length);
    const modelUrl = towncenterModelUrls[randomHouse];
    roadModelGroup.add(await loadGLTFModel(modelUrl, x, y, data, "towncenter"));
    roadModelGroup.add(
      await loadGLTFModel(models["building-road"], x, y, data, "road")
    );
    // roadModelGroup.children[0].scale.set(0.4, 0.4, 0.4);
    roadModelGroup.children[0].position.y = BUILDING_Y_ADJUSTMENT;

    return await roadModelGroup;
  },

  "building-windmill": async (x, y, data) => {
    const roadModelGroup = new THREE.Group();
    roadModelGroup.add(
      await loadGLTFModel(models["building-windmill"], x, y, data, "windmill")
    );
    roadModelGroup.add(
      await loadGLTFModel(models["building-road"], x, y, data, "road")
    );
    roadModelGroup.children[0].scale.set(1, 1, 1);
    roadModelGroup.children[0].position.y = BUILDING_Y_ADJUSTMENT;

    return await roadModelGroup;
  },

  "building-watchtower": async (x, y, data) => {
    const roadModelGroup = new THREE.Group();
    const randomHouse = Math.floor(Math.random() * watchtowerModelUrls.length);
    const modelUrl = watchtowerModelUrls[randomHouse];
    roadModelGroup.add(await loadGLTFModel(modelUrl, x, y, data, "watchtower"));
    roadModelGroup.add(
      await loadGLTFModel(models["building-road"], x, y, data, "road")
    );
    roadModelGroup.children[0].scale.set(1, 1, 1);
    roadModelGroup.children[0].position.y = BUILDING_Y_ADJUSTMENT;

    return await roadModelGroup;
  },
};

export async function createAssetInstance(
  type: string,
  x: number,
  y: number,
  data: any
): Promise<THREE.Object3D | undefined> {
  if (type in assets) {
    return await assets[type](x, y, data);
  } else {
    console.warn(`Asset type ${type} not found`);
    return undefined;
  }
}

function loadGLTFModel(
  modelUrl: URL,
  x: number,
  y: number,
  data?: any,
  id?: string
): Promise<THREE.Object3D> {
  return new Promise((resolve, reject) => {
    assetLoader.load(
      modelUrl.href,
      (gltf) => {
        const model = gltf.scene.clone(true);
        // console.log("@@modeurl.pathname: ", String(modelUrl.pathname));
        model.userData = { id, x, y };
        if (String(modelUrl.pathname).includes("MarketStand")) {
          model.scale.set(0.4, 0.4, 0.4);
        } else if (model.userData.id === "road") {
          model.scale.set(2.05, 1, 2.1);
        } else if (String(modelUrl.pathname).includes("House_2")) {
          model.scale.set(0.3, 0.4, 0.3);
        } else if (String(modelUrl.pathname).includes("Houses_SecondAge")) {
          model.scale.set(0.7, 0.7, 0.7);
        } else if (String(modelUrl.pathname).includes("Mill")) {
          model.scale.set(0.3, 0.4, 0.3);
        } else if (String(modelUrl.pathname).includes("Blacksmith")) {
          model.scale.set(0.25, 0.4, 0.3);
        } else if (String(modelUrl.pathname).includes("Sawmill")) {
          model.scale.set(0.25, 0.4, 0.3);
        } else if (String(modelUrl.pathname).includes("Inn")) {
          model.scale.set(0.25, 0.4, 0.25);
        } else if (String(modelUrl.pathname).includes("Stable")) {
          model.scale.set(0.25, 0.4, 0.3);
        } else if (String(modelUrl.pathname).includes("Well")) {
          model.scale.set(0.3, 0.3, 0.3);
        } else if (String(modelUrl.pathname).includes("Gazebo")) {
          model.scale.set(0.7, 0.7, 0.7);
        } else if (
          String(modelUrl.pathname).includes("Farm_SecondAge_Level1")
        ) {
          model.scale.set(0.55, 1.2, 0.55);
        } else if (
          String(modelUrl.pathname).includes("Farm_SecondAge_Level3")
        ) {
          model.scale.set(0.5, 1, 0.5);
        } else if (String(modelUrl.pathname).includes("Archery")) {
          model.scale.set(0.55, 1, 0.55);
        } else if (String(modelUrl.pathname).includes("Barracks")) {
          model.scale.set(0.55, 1, 0.55);
        } else {
          model.scale.set(0.4, 0.4, 0.4);
        }

        const box = new THREE.Box3().setFromObject(model);
        const center = box.getCenter(new THREE.Vector3());
        model.position.sub(center);
        model.position.y = 0;

        model.position.x += x;
        model.position.z += y;
        model.traverse((child) => {
          if (
            child instanceof THREE.Mesh &&
            !String(modelUrl.pathname).includes("Path_Square")
          ) {
            child.castShadow = true;
            child.receiveShadow = true;
          } else {
            child.receiveShadow = true;
          }
        });

        resolve(model);
      },
      undefined,
      (error) => {
        console.error(`Failed to load model ${modelUrl.href}`, error);
        reject(error);
      }
    );
  });
}
