/* eslint-disable @typescript-eslint/no-explicit-any */
export function createCity(size: number) {
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
