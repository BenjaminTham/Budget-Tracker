/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import React, { useRef, useEffect, useState } from "react";
import * as THREE from "three";
import { createCamera } from "./Camera";
import { createCity } from "./City";
import { createScene } from "./Scene";
import buildingFactory from "./Buildings";
import { UserSettings } from "@prisma/client";
import Image from "next/image";
import { useQuery } from "@tanstack/react-query";
import { GetBalanceStatesResponseType } from "@/app/api/stats/balance/route";
import { DateToUtcDate } from "@/lib/helpers";

interface Props {
  from: Date;
  to: Date;
  userSettings: UserSettings;
}

const ThreeScene: React.FC = () => {
  interface Building {
    id: string;
    height: number;
    updated: boolean;
    update: () => void;
  }

  interface Tile {
    x: number;
    y: number;
    terrainId: string;
    building: Building | null;
  }

  const from = new Date("2025-04-01T00:00:00.000Z");
  const to = new Date("2025-05-31T23:59:59.999Z");
  const statsQuery = useQuery<GetBalanceStatesResponseType>({
    queryKey: ["overview", "stats", from, to],
    queryFn: () =>
      fetch(
        `/api/stats/gamebalance?from=${DateToUtcDate(from)}&to=${DateToUtcDate(
          to
        )}`
      ).then((res) => res.json()),
  });

  const income = statsQuery.data?.income || 0;
  const expense = statsQuery.data?.expense || 0;
  const balance = income - expense;
  const balanceRef = useRef(balance);

  const containerRef = useRef<HTMLDivElement>(null);
  const isBuildingRef = useRef(false);

  const [activeToolId, setActiveToolId] = useState<string>("");
  const activeToolRef = useRef(activeToolId);

  const [buttonPage, setButtonPageId] = useState<number>(1);
  const buttonPageRef = useRef(buttonPage);

  const isPausedRef = useRef(false);

  /**
   * @description check if city is full
   */
  const isCityFull = (cityToCheck: any): boolean => {
    for (let x = 0; x < cityToCheck.size; x++) {
      for (let y = 0; y < cityToCheck.size; y++) {
        if (!cityToCheck.data[x][y].building) {
          return false;
        }
      }
    }

    return true;
  };

  /**
   * @description const for mapping city data to be saved to city.json
   */
  const cityData: {
    size: number;
    totalSpent: number;
    population: number;
    cityLevel: number;
    data: Tile[];
  } = {
    size: 5,
    totalSpent: 0,
    population: 0,
    cityLevel: 0,
    data: [],
  };

  /**
   * @description used for saving city data
   */
  const saveGame = async (city: any) => {
    cityData.data = [];
    const size = city.size;

    for (let x = 0; x < city.size; x++) {
      for (let y = 0; y < city.size; y++) {
        const tile = city.data[x][y];
        cityData.data.push(tile);
      }
    }

    cityData.size = size;
    cityData.totalSpent = totalSpentRef.current;
    cityData.population = populationRef.current;
    cityData.cityLevel = cityLevelRef.current;

    await fetch("/api/save-city", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(cityData),
    });
  };

  const loadGame = async (): Promise<any> => {
    try {
      const response = await fetch("/api/save-city");
      const cityData = await response.json();
      totalSpentRef.current = cityData.totalSpent;
      populationRef.current = cityData.population;
      cityLevelRef.current = cityData.cityLevel;

      return cityData;
    } catch (error) {
      console.error(error);

      return null;
    }
  };

  const totalSpentRef = useRef(cityData.totalSpent);
  const populationRef = useRef(cityData.population);
  const cityLevelRef = useRef(cityData.cityLevel);

  /**
   * @description useEffect to handle the active tool and button page state
   */
  useEffect(() => {
    activeToolRef.current = activeToolId;
    buttonPageRef.current = buttonPage;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setActiveToolId("");
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [activeToolId, buttonPage]);

  useEffect(() => {
    balanceRef.current = balance;
  }, [balance]);

  useEffect(() => {
    totalSpentRef.current = cityData.totalSpent;
  }, [cityData.totalSpent]);

  useEffect(() => {
    populationRef.current = cityData.population;
  }, [cityData.population]);

  useEffect(() => {
    cityLevelRef.current = cityData.cityLevel;
  }, [cityData.cityLevel]);

  /**
   * @description useEffect for main game logic
   * This effect initializes the Three.js scene, camera, renderer, and city.
   */
  useEffect(() => {
    let isMounted = true;
    let renderer: THREE.WebGLRenderer;
    let cityUpdateInterval: number;
    let handleResize: () => void;

    (async () => {
      activeToolRef.current = activeToolId; // activeToolRef sets the current selected button like building or bulldozer button

      if (!containerRef.current) return;

      renderer = new THREE.WebGLRenderer({ antialias: true });
      const scene = new THREE.Scene();
      // Clear previous canvas if anyf
      while (containerRef.current.firstChild) {
        containerRef.current.removeChild(containerRef.current.firstChild);
      }

      renderer.setSize(
        containerRef.current.clientWidth,
        containerRef.current.clientHeight
      );

      renderer.setClearColor(0x000000, 0);
      renderer.shadowMap.enabled = true;
      renderer.shadowMap.type = THREE.PCFSoftShadowMap;

      const loadCityData = async () => {
        const savedCityData = await loadGame();
        if (!isMounted) return null;

        return savedCityData ? savedCityData : null;
      };

      const cityData = await loadCityData();

      if (!isMounted) return;

      const city = createCity(cityData.size, cityData);
      const camera = createCamera(containerRef, renderer, city.size);

      const {
        initialize,
        update: updateScene,
        onMouseDown,
        onMouseMove,
        onMouseUp,
        onScroll,
      } = createScene(scene, camera, renderer, async (selectedObject) => {
        const { x, y } = selectedObject.userData;
        const tile = city.data[x][y];

        if (activeToolRef.current === "building-bulldoze") {
          if (!(null == tile.building)) {
            totalSpentRef.current = totalSpentRef.current - tile.building.price;
          }

          if (
            !(null == tile.building) &&
            (tile.building.id == "building-residential" ||
              tile.building.id == "building-residential2")
          ) {
            populationRef.current -= 1;
          }

          tile.building = null;

          await updateScene(city);
          saveGame(city);
        } else if (activeToolRef.current in buildingFactory && !tile.building) {
          if (isBuildingRef.current) return;

          isBuildingRef.current = true;

          try {
            tile.building =
              buildingFactory[
                activeToolRef.current as keyof typeof buildingFactory
              ]();

            totalSpentRef.current = totalSpentRef.current + tile.building.price;

            if (
              tile.building.id == "building-residential" ||
              tile.building.id == "building-residential2"
            ) {
              populationRef.current += 1;
            }

            await updateScene(city);
            saveGame(city);

            if (isCityFull(city)) {
              cityLevelRef.current += 1;

              const newCitySize = city.size + 2;
              const oldCitySize = city.size;
              const newCityData: any = [];

              for (let x = 0; x < newCitySize; x++) {
                const column = [];
                for (let y = 0; y < newCitySize; y++) {
                  if (x < oldCitySize && y < oldCitySize) {
                    column.push(city.data[x][y]);
                  } else {
                    const tile = {
                      x,
                      y,
                      terrainId: "building-grass",
                      building: null,
                    };

                    column.push(tile);
                  }
                }

                newCityData.push(column);
              }

              for (let x = 0; x < oldCitySize; x++) {
                for (let y = 0; y < oldCitySize; y++) {
                  if (newCityData[x][y].building) {
                    newCityData[x][y].building.updated = true;
                  }
                }
              }

              city.data = newCityData;
              city.size = newCitySize;

              isPausedRef.current = true;

              await saveGame(city);
              scene.clear();
              await initialize(city);
              isPausedRef.current = false;
            }
          } finally {
            isBuildingRef.current = false;
          }
        }
      });

      if (!isMounted) {
        // Dispose of the renderer that was created but never used.
        renderer.dispose();
        return;
      }

      containerRef.current.appendChild(renderer.domElement);
      const handleContextmenu = (e: { preventDefault: () => void }) => {
        e.preventDefault();
      };

      renderer.domElement.addEventListener("contextmenu", handleContextmenu);
      renderer.domElement.addEventListener(
        "mousedown",
        onMouseDown.bind(scene)
      );
      renderer.domElement.addEventListener("mouseup", onMouseUp.bind(scene));
      renderer.domElement.addEventListener(
        "mousemove",
        onMouseMove.bind(scene)
      );
      renderer.domElement.addEventListener("wheel", onScroll.bind(scene));
      renderer.domElement.addEventListener("wheel", onScroll.bind(scene));

      const start = () => {
        scene.clear();
        initialize(city);

        renderer.setAnimationLoop(() => {
          renderer.render(scene, camera.camera);
        });

        cityUpdateInterval = window.setInterval(() => {
          if (isPausedRef.current) return;
          city.update();
          updateScene(city);
        }, 1000);
      };

      handleResize = () => {
        if (!containerRef.current) return;

        const width = containerRef.current.clientWidth;
        const height = containerRef.current.clientHeight;
        camera.camera.aspect = width / height;
        camera.camera.updateProjectionMatrix();
        renderer.setSize(width, height);
      };

      start();
      window.addEventListener("resize", handleResize);
    })();

    return () => {
      // On unmount, set the flag to false.
      isMounted = false;
      // Clean up resources. Check if they exist first,
      // as unmounting could happen before they are created.

      if (cityUpdateInterval) {
        clearInterval(cityUpdateInterval);
      }

      if (handleResize) {
        window.removeEventListener("resize", handleResize);
      }

      if (renderer) {
        renderer.setAnimationLoop(null);

        // Safely remove the canvas from the DOM
        if (renderer.domElement.parentElement) {
          renderer.domElement.parentElement.removeChild(renderer.domElement);
        }

        // Free up GPU resources
        renderer.dispose();
      }
    };
  }, []);

  return (
    <div className="h-full w-full flex flex-col align-middle justify-center">
      {/* Top bar */}
      <div className="relative bg-[#3A7CA5] text-white p-4 rounded-t-2xl flex justify-between items-center">
        <div className="flex flex-row items-center space-x-2">
          <div className="w-6 h-6 flex items-center justify-center">💰</div>
          <span className="font-bold">
            {balance - totalSpentRef.current}/{balance}
          </span>
        </div>
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 translate-y-1/2 rounded-full w-16 h-16 bg-[#3A7CA5] flex justify-center items-center">
          <span className="font-bold text-white text-4xl">
            {cityLevelRef.current}
          </span>
        </div>
        <div className="flex flex-row items-center space-x-2">
          <div className="w-6 h-6 flex items-center justify-center">😊</div>
          <span className="font-bold">{populationRef.current}</span>
        </div>
      </div>

      {/* Main content: sidebar + game */}
      <div className="flex flex-col h-full w-full align-middle justify-center">
        {/* Three.js container */}
        <div
          className="flex-grow "
          ref={containerRef}
          style={{ height: "100%" }}
        />

        {/* Sidebar */}
        <div className=" h-15 w-full flex flex-row justify-center items-center">
          <button //BULLDOZE BTN
            className={` h-13 w-1/6 text-black text-sm  rounded-full mr-3 flex justify-center align-middle`}
            onClick={() => setActiveToolId("building-bulldoze")}
            style={{
              backgroundColor:
                activeToolId === "building-bulldoze" ? "#81C3D7" : "#3A7CA5",
            }}
          >
            <Image width={35} height={35} src="/bulldozer.svg" alt="bulldoze" />
          </button>

          <div //BUILDING BUTTON GRP
            className="bg-[#3A7CA5] h-full w-4/6 flex flex-row gap-4 items-center justify-between p-1 rounded-lg"
          >
            <div className="bg-stone-200 p-1 gap-2 h-full w-xl flex flex-row align-middle justify-evenly rounded-sm">
              <button //RESIDENTIAL 1
                id="building-residential"
                className={`    text-black h-full w-10 text-sm rounded 
    flex flex-col items-center justify-center gap-1 
    transition-colors duration-200
              ${buttonPage === 1 ? "" : "hidden"}`}
                style={{
                  backgroundColor:
                    activeToolId === "building-residential"
                      ? "#3A7CA5"
                      : "#b4b4b4e4",
                }}
                onClick={() => setActiveToolId("building-residential")}
              >
                <div className="h-6 w-full rounded-t flex align-middle justify-center bg-[#3A7CA5]">
                  <p className=" font-bold text-white text-center">$100</p>
                </div>
                <Image
                  width={20}
                  height={20}
                  src="/resident1.png"
                  alt="resident 1"
                />
              </button>

              <button //COMMERCIAL
                id="building-commercial"
                className={`text-black h-full w-10 text-sm rounded 
    flex flex-col items-center justify-center gap-1 
    transition-colors duration-200
              ${buttonPage === 1 ? "" : "hidden"}`}
                style={{
                  backgroundColor:
                    activeToolId === "building-commercial"
                      ? "#3A7CA5"
                      : "#b4b4b4e4",
                }}
                onClick={() => setActiveToolId("building-commercial")}
              >
                <div className="h-6 w-full rounded-t flex align-middle justify-center bg-[#3A7CA5]">
                  <p className=" font-bold text-white text-center">$90</p>
                </div>
                <Image
                  width={20}
                  height={20}
                  src="/commercial.png"
                  alt="commercial"
                />
              </button>

              <button //INDUSTRIAL
                id="building-industrial"
                className={`text-black h-full w-10 text-sm rounded 
    flex flex-col items-center justify-center gap-1 
    transition-colors duration-200
              ${buttonPage === 1 ? "" : "hidden"}`}
                style={{
                  backgroundColor:
                    activeToolId === "building-industrial"
                      ? "#3A7CA5"
                      : "#b4b4b4e4",
                }}
                onClick={() => setActiveToolId("building-industrial")}
              >
                <div className="h-6 w-full rounded-t flex align-middle justify-center bg-[#3A7CA5]">
                  <p className=" font-bold text-white text-center">$120</p>
                </div>
                <Image
                  width={20}
                  height={20}
                  src="/industrial.png"
                  alt="industrial"
                />
              </button>

              <button //ROAD
                id="building-road"
                className={`text-black h-full w-10 text-sm rounded 
    flex flex-col items-center justify-center gap-1 
    transition-colors duration-200
              ${buttonPage === 1 ? "" : "hidden"}`}
                style={{
                  backgroundColor:
                    activeToolId === "building-road" ? "#3A7CA5" : "#b4b4b4e4",
                }}
                onClick={() => setActiveToolId("building-road")}
              >
                <div className="h-6 w-full rounded-t flex align-middle justify-center bg-[#3A7CA5]">
                  <p className=" font-bold text-white text-center">$20</p>
                </div>
                <Image width={20} height={20} src="/road.png" alt="road" />
              </button>

              <button //TREE 1
                id="building-tree1"
                className={`text-black h-full w-10 text-sm rounded 
    flex flex-col items-center justify-center gap-1 
    transition-colors duration-200
              ${buttonPage === 2 ? "" : "hidden"}`}
                style={{
                  backgroundColor:
                    activeToolId === "building-tree1" ? "#3A7CA5" : "#b4b4b4e4",
                }}
                onClick={() => setActiveToolId("building-tree1")}
              >
                <div className="h-6 w-full rounded-t flex align-middle justify-center bg-[#3A7CA5]">
                  <p className=" font-bold text-white text-center">$50</p>
                </div>
                <Image width={20} height={20} src="/tree1.png" alt="tree1" />
              </button>

              <button //TREE 2
                id="building-tree2"
                className={`text-black h-full w-10 text-sm rounded 
    flex flex-col items-center justify-center gap-1 
    transition-colors duration-200
              ${buttonPage === 2 ? "" : "hidden"}`}
                style={{
                  backgroundColor:
                    activeToolId === "building-tree2" ? "#3A7CA5" : "#b4b4b4e4",
                }}
                onClick={() => setActiveToolId("building-tree2")}
              >
                <div className="h-6 w-full rounded-t flex align-middle justify-center bg-[#3A7CA5]">
                  <p className=" font-bold text-white text-center">$50</p>
                </div>
                <Image width={20} height={20} src="/tree2.png" alt="tree2" />
              </button>

              <button //THREE 3
                id="building-tree3"
                className={`text-black h-full w-10 text-sm rounded 
    flex flex-col items-center justify-center gap-1 
    transition-colors duration-200
              ${buttonPage === 2 ? "" : "hidden"}`}
                style={{
                  backgroundColor:
                    activeToolId === "building-tree3" ? "#3A7CA5" : "#b4b4b4e4",
                }}
                onClick={() => setActiveToolId("building-tree3")}
              >
                <div className="h-6 w-full rounded-t flex align-middle justify-center bg-[#3A7CA5]">
                  <p className=" font-bold text-white text-center">$70</p>
                </div>
                <Image width={20} height={20} src="/tree3.png" alt="tree3" />
              </button>

              <button //WELL
                id="building-well"
                className={`text-black h-full w-10 text-sm rounded 
    flex flex-col items-center justify-center gap-1 
    transition-colors duration-200
              ${buttonPage === 2 ? "" : "hidden"}`}
                style={{
                  backgroundColor:
                    activeToolId === "building-well" ? "#3A7CA5" : "#b4b4b4e4",
                }}
                onClick={() => setActiveToolId("building-well")}
              >
                <div className="h-6 w-full rounded-t flex align-middle justify-center bg-[#3A7CA5]">
                  <p className=" font-bold text-white text-center">$80</p>
                </div>
                <Image width={20} height={20} src="/well.png" alt="well" />
              </button>

              <button //GAZEBO
                id="building-gazebo"
                className={`text-black h-full w-10 text-sm rounded 
    flex flex-col items-center justify-center gap-1 
    transition-colors duration-200
              ${buttonPage === 3 ? "" : "hidden"}`}
                style={{
                  backgroundColor:
                    activeToolId === "building-gazebo"
                      ? "#3A7CA5"
                      : "#b4b4b4e4",
                }}
                onClick={() => setActiveToolId("building-gazebo")}
              >
                <div className="h-6 w-full rounded-t flex align-middle justify-center bg-[#3A7CA5]">
                  <p className=" font-bold text-white text-center">$90</p>
                </div>
                <Image width={20} height={20} src="/gazebo.png" alt="gazebo" />
              </button>

              <button //RESIDENTIAL 2
                id="building-residential2"
                className={`text-black h-full w-10 text-sm rounded 
    flex flex-col items-center justify-center gap-1 
    transition-colors duration-200
              ${buttonPage === 3 ? "" : "hidden"}`}
                style={{
                  backgroundColor:
                    activeToolId === "building-residential2"
                      ? "#3A7CA5"
                      : "#b4b4b4e4",
                }}
                onClick={() => setActiveToolId("building-residential2")}
              >
                <div className="h-6 w-full rounded-t flex align-middle justify-center bg-[#3A7CA5]">
                  <p className=" font-bold text-white text-center">$120</p>
                </div>
                <Image
                  width={20}
                  height={20}
                  src="/residential2.png"
                  alt="residential2"
                />
              </button>

              <button //BELLTOWER
                id="building-belltower"
                className={`text-black h-full w-10 text-sm rounded 
    flex flex-col items-center justify-center gap-1 
    transition-colors duration-200
              ${buttonPage === 3 ? "" : "hidden"}`}
                style={{
                  backgroundColor:
                    activeToolId === "building-belltower"
                      ? "#3A7CA5"
                      : "#b4b4b4e4",
                }}
                onClick={() => setActiveToolId("building-belltower")}
              >
                <div className="h-6 w-full rounded-t flex align-middle justify-center bg-[#3A7CA5]">
                  <p className=" font-bold text-white text-center">$150</p>
                </div>
                <Image
                  width={20}
                  height={20}
                  src="/belltower.png"
                  alt="belltower"
                />
              </button>

              <button //INN
                id="building-inn"
                className={`text-black h-full w-10 text-sm rounded 
    flex flex-col items-center justify-center gap-1 
    transition-colors duration-200
              ${buttonPage === 3 ? "" : "hidden"}`}
                style={{
                  backgroundColor:
                    activeToolId === "building-inn" ? "#3A7CA5" : "#b4b4b4e4",
                }}
                onClick={() => setActiveToolId("building-inn")}
              >
                <div className="h-6 w-full rounded-t flex align-middle justify-center bg-[#3A7CA5]">
                  <p className=" font-bold text-white text-center">$170</p>
                </div>
                <Image width={20} height={20} src="/inn.png" alt="inn" />
              </button>

              <button //STORAGE
                id="building-storage"
                className={`text-black h-full w-10 text-sm rounded 
    flex flex-col items-center justify-center gap-1 
    transition-colors duration-200
              ${buttonPage === 4 ? "" : "hidden"}`}
                style={{
                  backgroundColor:
                    activeToolId === "building-storage"
                      ? "#3A7CA5"
                      : "#b4b4b4e4",
                }}
                onClick={() => setActiveToolId("building-storage")}
              >
                <div className="h-6 w-full rounded-t flex align-middle justify-center bg-[#3A7CA5]">
                  <p className=" font-bold text-white text-center">$170</p>
                </div>
                <Image
                  width={20}
                  height={20}
                  src="/storage.png"
                  alt="storage"
                />
              </button>

              <button //TEMPLE
                id="building-temple"
                className={`text-black h-full w-10 text-sm rounded 
    flex flex-col items-center justify-center gap-1 
    transition-colors duration-200
              ${buttonPage === 4 ? "" : "hidden"}`}
                style={{
                  backgroundColor:
                    activeToolId === "building-temple"
                      ? "#3A7CA5"
                      : "#b4b4b4e4",
                }}
                onClick={() => setActiveToolId("building-temple")}
              >
                <div className="h-6 w-full rounded-t flex align-middle justify-center bg-[#3A7CA5]">
                  <p className=" font-bold text-white text-center">$190</p>
                </div>
                <Image width={20} height={20} src="/temple.png" alt="temple" />
              </button>

              <button //MILITARY
                id="building-military"
                className={`text-black h-full w-10 text-sm rounded 
    flex flex-col items-center justify-center gap-1 
    transition-colors duration-200
              ${buttonPage === 4 ? "" : "hidden"}`}
                style={{
                  backgroundColor:
                    activeToolId === "building-military"
                      ? "#3A7CA5"
                      : "#b4b4b4e4",
                }}
                onClick={() => setActiveToolId("building-military")}
              >
                <div className="h-6 w-full rounded-t flex align-middle justify-center bg-[#3A7CA5]">
                  <p className=" font-bold text-white text-center">$210</p>
                </div>
                <Image
                  width={20}
                  height={20}
                  src="/military.png"
                  alt="military"
                />
              </button>

              <button //TOWER HOUSE
                id="building-towerhouse"
                className={`text-black h-full w-10 text-sm rounded 
    flex flex-col items-center justify-center gap-1 
    transition-colors duration-200
              ${buttonPage === 4 ? "" : "hidden"}`}
                style={{
                  backgroundColor:
                    activeToolId === "building-towerhouse"
                      ? "#3A7CA5"
                      : "#b4b4b4e4",
                }}
                onClick={() => setActiveToolId("building-towerhouse")}
              >
                <div className="h-6 w-full rounded-t flex align-middle justify-center bg-[#3A7CA5]">
                  <p className=" font-bold text-white text-center">$180</p>
                </div>
                <Image
                  width={20}
                  height={20}
                  src="/towerhouse.png"
                  alt="towerhouse"
                />
              </button>

              <button //TOWNCENTER
                id="building-towncenter"
                className={`text-black h-full w-10 text-sm rounded 
    flex flex-col items-center justify-center gap-1 
    transition-colors duration-200
              ${buttonPage === 5 ? "" : "hidden"}`}
                style={{
                  backgroundColor:
                    activeToolId === "building-towncenter"
                      ? "#3A7CA5"
                      : "#b4b4b4e4",
                }}
                onClick={() => setActiveToolId("building-towncenter")}
              >
                <div className="h-6 w-full rounded-t flex align-middle justify-center bg-[#3A7CA5]">
                  <p className=" font-bold text-white text-center">$170</p>
                </div>
                <Image
                  width={20}
                  height={20}
                  src="/towncenter.png"
                  alt="towncenter"
                />
              </button>

              <button //WINDMILL
                id="building-windmill"
                className={`text-black h-full w-10 text-sm rounded 
    flex flex-col items-center justify-center gap-1 
    transition-colors duration-200
              ${buttonPage === 5 ? "" : "hidden"}`}
                style={{
                  backgroundColor:
                    activeToolId === "building-windmill"
                      ? "#3A7CA5"
                      : "#b4b4b4e4",
                }}
                onClick={() => setActiveToolId("building-windmill")}
              >
                <div className="h-6 w-full rounded-t flex align-middle justify-center bg-[#3A7CA5]">
                  <p className=" font-bold text-white text-center">$120</p>
                </div>
                <Image
                  width={20}
                  height={20}
                  src="/windmill.png"
                  alt="windmill"
                />
              </button>

              <button //WATCHTOWER
                id="building-watchtower"
                className={`text-black h-full w-10 text-sm rounded 
    flex flex-col items-center justify-center gap-1 
    transition-colors duration-200
              ${buttonPage === 5 ? "" : "hidden"}`}
                style={{
                  backgroundColor:
                    activeToolId === "building-watchtower"
                      ? "#3A7CA5"
                      : "#b4b4b4e4",
                }}
                onClick={() => setActiveToolId("building-watchtower")}
              >
                <div className="h-6 w-full rounded-t flex align-middle justify-center bg-[#3A7CA5]">
                  <p className=" font-bold text-white text-center">$110</p>
                </div>
                <Image
                  width={20}
                  height={20}
                  src="/watchtower.png"
                  alt="watchtower"
                />
              </button>
            </div>
          </div>

          <div //PAGE UP DOWN BTN
            className="bg-transparent h-full w-1/6 flex flex-col items-center justify-between"
          >
            <button
              className="bg-[#3A7CA5] w-8 h-8 rounded-sm flex align-middle justify-center"
              onClick={() =>
                setButtonPageId((prev) => (prev < 5 ? prev + 1 : prev))
              }
            >
              <svg
                className="w-6 h-6 text-gray-800 dark:text-white"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 14 8"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M13 7 7.674 1.3a.91.91 0 0 0-1.348 0L1 7"
                />
              </svg>
            </button>

            <button
              className="bg-[#3A7CA5]  w-8 h-8 rounded-sm flex align-middle justify-center"
              onClick={() =>
                setButtonPageId((prev) => (prev > 1 ? prev - 1 : prev))
              }
            >
              <svg
                className="w-6 h-6 text-gray-800 dark:text-white"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 14 8"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="m1 1 5.326 5.7a.909.909 0 0 0 1.348 0L13 1"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ThreeScene;
