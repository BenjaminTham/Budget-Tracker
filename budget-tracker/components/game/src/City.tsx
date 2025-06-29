/* eslint-disable @typescript-eslint/no-explicit-any */
import buildingFactory from "./Buildings";

export function createCity(
  size: number,
  loadedData?: { size: number; data: any[] }
) {
  const data: any = [];

  initialize();

  function initialize() {
    for (let x = 0; x < size; x++) {
      const column = [];
      for (let y = 0; y < size; y++) {
        const tile = createTile(x, y);
        column.push(tile);
      }
      data.push(column);
    }

    if (loadedData && loadedData.data) {
      loadedData.data.forEach((tileData) => {
        const { x, y, building } = tileData;
        if (data[x] && data[x][y]) {
          if (building && building.id in buildingFactory) {
            data[x][y].building =
              buildingFactory[building.id as keyof typeof buildingFactory]();
          } else {
            data[x][y].building = null;
          }
        }
      });
    }
  }

  function update() {
    // console.log(`updating tile ${x}, ${y}`);
    for (let x = 0; x < size; x++) {
      for (let y = 0; y < size; y++) {
        data[x][y].building?.update();
      }
    }
  }

  return {
    size,
    data,
    update,
  };
}

function createTile(x: number, y: number) {
  return {
    x,
    y,
    terrainId: "building-grass",
    building: null,
  };
}
