/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import React, { useRef, useEffect, useState } from "react";
import * as THREE from "three";
import { createCamera } from "./Camera";
import { createCity } from "./City";
import { createScene } from "./Scene";
import buildingFactory from "./Buildings";
import { GetBalanceStatesResponseType } from "@/app/api/stats/balance/route";
import { DateToUtcDate } from "@/lib/helpers";
import { useQuery } from "@tanstack/react-query";
import { UserSettings } from "@prisma/client";

interface Props {
  from: Date;
  to: Date;
  userSettings: UserSettings;
}

const ThreeScene: React.FC = () => {
  // const statsQuery = useQuery<GetBalanceStatesResponseType>({
  //   queryKey: ["overview", "stats", from, to],
  //   queryFn: () =>
  //     fetch(
  //       `/api/stats/balance?from=${DateToUtcDate(from)}&to=${DateToUtcDate(to)}`
  //     ).then((res) => res.json()),
  // });

  const containerRef = useRef<HTMLDivElement>(null);

  const [activeToolId, setActiveToolId] = useState<string>("");
  const activeToolRef = useRef(activeToolId);

  const [buttonPage, setButtonPageId] = useState<number>(1);
  const buttonPageRef = useRef(buttonPage);

  useEffect(() => {
    activeToolRef.current = activeToolId;
    buttonPageRef.current = buttonPage;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setActiveToolId(""); // or set to some default tool ID
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [activeToolId, buttonPage]);

  useEffect(() => {
    activeToolRef.current = activeToolId;
    if (!containerRef.current) return;

    // Clear previous canvas if any
    while (containerRef.current.firstChild) {
      containerRef.current.removeChild(containerRef.current.firstChild);
    }

    const scene = new THREE.Scene();

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(
      containerRef.current.clientWidth,
      containerRef.current.clientHeight
    );
    renderer.setClearColor(0x000000, 0);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    const city = createCity(17);
    let cityUpdateInterval: number;

    const camera = createCamera(containerRef, renderer, city.size);

    const {
      initialize,
      update: updateScene,
      onMouseDown,
      onMouseMove,
      onMouseUp,
      onScroll,
      // onObjectSelected,
    } = createScene(scene, camera, renderer, (selectedObject) => {
      const { x, y } = selectedObject.userData;
      const tile = city.data[x][y];

      if (activeToolRef.current === "building-bulldoze") {
        console.log("@@tile.building", tile.building);
        tile.building = null;
        updateScene(city);
      } else if (activeToolRef.current in buildingFactory && !tile.building) {
        tile.building =
          buildingFactory[
            activeToolRef.current as keyof typeof buildingFactory
          ]();
        // console.log(tile.building);
        updateScene(city);
      }
    });

    containerRef.current.appendChild(renderer.domElement);
    const handleContextmenu = (e: { preventDefault: () => void }) => {
      e.preventDefault();
    };
    renderer.domElement.addEventListener("contextmenu", handleContextmenu);
    renderer.domElement.addEventListener("mousedown", onMouseDown.bind(scene));
    renderer.domElement.addEventListener("mouseup", onMouseUp.bind(scene));
    renderer.domElement.addEventListener("mousemove", onMouseMove.bind(scene));
    renderer.domElement.addEventListener("wheel", onScroll.bind(scene));
    renderer.domElement.addEventListener("wheel", onScroll.bind(scene));

    const start = () => {
      scene.clear();
      initialize(city);

      renderer.setAnimationLoop(update);

      cityUpdateInterval = window.setInterval(() => {
        city.update();
        updateScene(city);
      }, 1000);
    };

    const update = () => {
      // city.update();
      renderer.render(scene, camera.camera);
    };

    const stop = () => {
      renderer.setAnimationLoop(null);

      renderer.domElement.removeEventListener("mousedown", onMouseDown);
      renderer.domElement.removeEventListener("mouseup", onMouseUp);
      renderer.domElement.removeEventListener("mousemove", onMouseMove);
      renderer.domElement.removeEventListener("wheel", onScroll);
      renderer.domElement.removeEventListener("contextmenu", handleContextmenu);

      clearInterval(cityUpdateInterval);

      window.removeEventListener("resize", handleResize);
      containerRef.current?.removeChild(renderer.domElement);
    };

    const handleResize = () => {
      if (!containerRef.current) return;
      const width = containerRef.current.clientWidth;
      const height = containerRef.current.clientHeight;

      camera.camera.aspect = width / height;
      camera.camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };

    start();

    window.addEventListener("resize", handleResize);

    return () => {
      stop();
    };
  }, []);

  return (
    <div className="h-full w-full flex flex-col align-middle justify-center ">
      {/* Top bar */}
      {/* <div className="bg-gray-800 text-white p-4">
        <h1 className="text-lg font-bold">City Builder HUD</h1>
      </div> */}

      {/* Main content: sidebar + game */}
      <div className="flex flex-col h-full w-full align-middle justify-center">
        {/* Three.js container */}
        <div
          className="flex-grow "
          ref={containerRef}
          style={{ height: "100%" }}
        />

        {/* Sidebar */}
        <div className="w-full flex flex-row justify-center align-middle">
          {/* <div className="bg-violet-600 h-30 w-30 flex flex-row gap-4 align-middle justify-center p-1 rounded-full mr-3"> */}
          <button
            className={` h-30 w-30 text-black text-sm  rounded-full mr-3 flex justify-center align-middle`}
            onClick={() => setActiveToolId("building-bulldoze")}
            style={{
              backgroundColor:
                activeToolId === "building-bulldoze" ? "#a855f7" : "#8824fc",
            }}
          >
            <img width={75} height={75} src="/bulldozer.svg" alt="bulldoze" />
          </button>
          {/* </div> */}

          <div className="bg-violet-600 h-30 w-2xl flex flex-row gap-4 align-middle justify-between p-1 rounded-lg">
            <div className="bg-stone-200 p-1 gap-2 h-full w-xl flex flex-row align-middle justify-evenly rounded-sm ml-2">
              <button
                id="building-residential"
                className={`text-black h-full w-20 text-sm rounded flex flex-col align-top
                    c
              ${buttonPage === 1 ? "" : "hidden"}`}
                style={{
                  backgroundColor:
                    activeToolId === "building-residential"
                      ? "#a855f7"
                      : "#b4b4b4e4",
                }}
                onClick={() => setActiveToolId("building-residential")}
              >
                <div
                  className="h-6 w-full rounded-t flex align-middle justify-center"
                  style={{ backgroundColor: "#523667" }}
                >
                  <p className=" font-bold text-white text-center">$100</p>
                </div>
                <img src="/resident1.png" alt="resident 1" />
              </button>

              <button
                id="building-commercial"
                className={`text-black h-full w-20 text-sm rounded flex flex-col align-top
                    transition-colors duration-200
              ${buttonPage === 1 ? "" : "hidden"}`}
                style={{
                  backgroundColor:
                    activeToolId === "building-commercial"
                      ? "#a855f7"
                      : "#b4b4b4e4",
                }}
                onClick={() => setActiveToolId("building-commercial")}
              >
                <div
                  className="h-6 w-full rounded-t flex align-middle justify-center"
                  style={{ backgroundColor: "#523667" }}
                >
                  <p className=" font-bold text-white text-center">$90</p>
                </div>
                <img src="/commercial.png" alt="commercial" />
              </button>

              <button
                id="building-industrial"
                className={`text-black h-full w-20 text-sm rounded flex flex-col align-top
                    transition-colors duration-200
              ${buttonPage === 1 ? "" : "hidden"}`}
                style={{
                  backgroundColor:
                    activeToolId === "building-industrial"
                      ? "#a855f7"
                      : "#b4b4b4e4",
                }}
                onClick={() => setActiveToolId("building-industrial")}
              >
                <div
                  className="h-6 w-full rounded-t flex align-middle justify-center"
                  style={{ backgroundColor: "#523667" }}
                >
                  <p className=" font-bold text-white text-center">$120</p>
                </div>
                <img src="/industrial.png" alt="industrial" />
              </button>

              <button
                id="building-road"
                className={`text-black h-full w-20 text-sm rounded flex flex-col align-top
                    transition-colors duration-200
              ${buttonPage === 1 ? "" : "hidden"}`}
                style={{
                  backgroundColor:
                    activeToolId === "building-road" ? "#a855f7" : "#b4b4b4e4",
                }}
                onClick={() => setActiveToolId("building-road")}
              >
                <div
                  className="h-6 w-full rounded-t flex align-middle justify-center"
                  style={{ backgroundColor: "#523667" }}
                >
                  <p className=" font-bold text-white text-center">$20</p>
                </div>
                <img src="/road.png" alt="road" />
              </button>

              <button
                id="building-tree1"
                className={`text-black h-full w-20 text-sm rounded flex flex-col align-top
                    transition-colors duration-200
              ${buttonPage === 2 ? "" : "hidden"}`}
                style={{
                  backgroundColor:
                    activeToolId === "building-tree1" ? "#a855f7" : "#b4b4b4e4",
                }}
                onClick={() => setActiveToolId("building-tree1")}
              >
                <div
                  className="h-6 w-full rounded-t flex align-middle justify-center"
                  style={{ backgroundColor: "#523667" }}
                >
                  <p className=" font-bold text-white text-center">$50</p>
                </div>
                <img src="/tree1.png" alt="tree1" />
              </button>

              <button
                id="building-tree2"
                className={`text-black h-full w-20 text-sm rounded flex flex-col align-top
                    transition-colors duration-200
              ${buttonPage === 2 ? "" : "hidden"}`}
                style={{
                  backgroundColor:
                    activeToolId === "building-tree2" ? "#a855f7" : "#b4b4b4e4",
                }}
                onClick={() => setActiveToolId("building-tree2")}
              >
                <div
                  className="h-6 w-full rounded-t flex align-middle justify-center"
                  style={{ backgroundColor: "#523667" }}
                >
                  <p className=" font-bold text-white text-center">$50</p>
                </div>
                <img src="/tree2.png" alt="tree2" />
              </button>

              <button
                id="building-tree3"
                className={`text-black h-full w-20 text-sm rounded flex flex-col align-top
                    transition-colors duration-200
              ${buttonPage === 2 ? "" : "hidden"}`}
                style={{
                  backgroundColor:
                    activeToolId === "building-tree3" ? "#a855f7" : "#b4b4b4e4",
                }}
                onClick={() => setActiveToolId("building-tree3")}
              >
                <div
                  className="h-6 w-full rounded-t flex align-middle justify-center"
                  style={{ backgroundColor: "#523667" }}
                >
                  <p className=" font-bold text-white text-center">$70</p>
                </div>
                <img src="/tree3.png" alt="tree3" />
              </button>

              <button
                id="building-well"
                className={`text-black h-full w-20 text-sm rounded flex flex-col align-top
                    transition-colors duration-200
              ${buttonPage === 2 ? "" : "hidden"}`}
                style={{
                  backgroundColor:
                    activeToolId === "building-well" ? "#a855f7" : "#b4b4b4e4",
                }}
                onClick={() => setActiveToolId("building-well")}
              >
                <div
                  className="h-6 w-full rounded-t flex align-middle justify-center"
                  style={{ backgroundColor: "#523667" }}
                >
                  <p className=" font-bold text-white text-center">$80</p>
                </div>
                <img src="/well.png" alt="well" />
              </button>

              <button
                id="building-gazebo"
                className={`text-black h-full w-20 text-sm rounded flex flex-col align-top
                    transition-colors duration-200
              ${buttonPage === 2 ? "" : "hidden"}`}
                style={{
                  backgroundColor:
                    activeToolId === "building-gazebo"
                      ? "#a855f7"
                      : "#b4b4b4e4",
                }}
                onClick={() => setActiveToolId("building-gazebo")}
              >
                <div
                  className="h-6 w-full rounded-t flex align-middle justify-center"
                  style={{ backgroundColor: "#523667" }}
                >
                  <p className=" font-bold text-white text-center">$90</p>
                </div>
                <img src="/gazebo.png" alt="gazebo" />
              </button>

              <button
                id="building-residential2"
                className={`text-black h-full w-20 text-sm rounded flex flex-col align-top
                    transition-colors duration-200
              ${buttonPage === 3 ? "" : "hidden"}`}
                style={{
                  backgroundColor:
                    activeToolId === "building-residential2"
                      ? "#a855f7"
                      : "#b4b4b4e4",
                }}
                onClick={() => setActiveToolId("building-residential2")}
              >
                <div
                  className="h-6 w-full rounded-t flex align-middle justify-center"
                  style={{ backgroundColor: "#523667" }}
                >
                  <p className=" font-bold text-white text-center">$120</p>
                </div>
                <img src="/residential2.png" alt="residential2" />
              </button>

              <button
                id="building-belltower"
                className={`text-black h-full w-20 text-sm rounded flex flex-col align-top
                    transition-colors duration-200
              ${buttonPage === 3 ? "" : "hidden"}`}
                style={{
                  backgroundColor:
                    activeToolId === "building-belltower"
                      ? "#a855f7"
                      : "#b4b4b4e4",
                }}
                onClick={() => setActiveToolId("building-belltower")}
              >
                <div
                  className="h-6 w-full rounded-t flex align-middle justify-center"
                  style={{ backgroundColor: "#523667" }}
                >
                  <p className=" font-bold text-white text-center">$150</p>
                </div>
                <img src="/belltower.png" alt="belltower" />
              </button>

              <button
                id="building-inn"
                className={`text-black h-full w-20 text-sm rounded flex flex-col align-top
                    transition-colors duration-200
              ${buttonPage === 3 ? "" : "hidden"}`}
                style={{
                  backgroundColor:
                    activeToolId === "building-inn" ? "#a855f7" : "#b4b4b4e4",
                }}
                onClick={() => setActiveToolId("building-inn")}
              >
                <div
                  className="h-6 w-full rounded-t flex align-middle justify-center"
                  style={{ backgroundColor: "#523667" }}
                >
                  <p className=" font-bold text-white text-center">$170</p>
                </div>
                <img src="/inn.png" alt="inn" />
              </button>

              <button
                id="building-storage"
                className={`text-black h-full w-20 text-sm rounded flex flex-col align-top
                    transition-colors duration-200
              ${buttonPage === 3 ? "" : "hidden"}`}
                style={{
                  backgroundColor:
                    activeToolId === "building-storage"
                      ? "#a855f7"
                      : "#b4b4b4e4",
                }}
                onClick={() => setActiveToolId("building-storage")}
              >
                <div
                  className="h-6 w-full rounded-t flex align-middle justify-center"
                  style={{ backgroundColor: "#523667" }}
                >
                  <p className=" font-bold text-white text-center">$170</p>
                </div>
                <img src="/storage.png" alt="storage" />
              </button>

              <button
                id="building-temple"
                className={`text-black h-full w-20 text-sm rounded flex flex-col align-top
                    transition-colors duration-200
              ${buttonPage === 3 ? "" : "hidden"}`}
                style={{
                  backgroundColor:
                    activeToolId === "building-temple"
                      ? "#a855f7"
                      : "#b4b4b4e4",
                }}
                onClick={() => setActiveToolId("building-temple")}
              >
                <div
                  className="h-6 w-full rounded-t flex align-middle justify-center"
                  style={{ backgroundColor: "#523667" }}
                >
                  <p className=" font-bold text-white text-center">$190</p>
                </div>
                <img src="/temple.png" alt="temple" />
              </button>

              <button
                id="building-military"
                className={`text-black h-full w-20 text-sm rounded flex flex-col align-top
                    transition-colors duration-200
              ${buttonPage === 4 ? "" : "hidden"}`}
                style={{
                  backgroundColor:
                    activeToolId === "building-military"
                      ? "#a855f7"
                      : "#b4b4b4e4",
                }}
                onClick={() => setActiveToolId("building-military")}
              >
                <div
                  className="h-6 w-full rounded-t flex align-middle justify-center"
                  style={{ backgroundColor: "#523667" }}
                >
                  <p className=" font-bold text-white text-center">$210</p>
                </div>
                <img src="/military.png" alt="military" />
              </button>

              <button
                id="building-towerhouse"
                className={`text-black h-full w-20 text-sm rounded flex flex-col align-top
                    transition-colors duration-200
              ${buttonPage === 4 ? "" : "hidden"}`}
                style={{
                  backgroundColor:
                    activeToolId === "building-towerhouse"
                      ? "#a855f7"
                      : "#b4b4b4e4",
                }}
                onClick={() => setActiveToolId("building-towerhouse")}
              >
                <div
                  className="h-6 w-full rounded-t flex align-middle justify-center"
                  style={{ backgroundColor: "#523667" }}
                >
                  <p className=" font-bold text-white text-center">$180</p>
                </div>
                <img src="/towerhouse.png" alt="towerhouse" />
              </button>

              <button
                id="building-towncenter"
                className={`text-black h-full w-20 text-sm rounded flex flex-col align-top
                    transition-colors duration-200
              ${buttonPage === 4 ? "" : "hidden"}`}
                style={{
                  backgroundColor:
                    activeToolId === "building-towncenter"
                      ? "#a855f7"
                      : "#b4b4b4e4",
                }}
                onClick={() => setActiveToolId("building-towncenter")}
              >
                <div
                  className="h-6 w-full rounded-t flex align-middle justify-center"
                  style={{ backgroundColor: "#523667" }}
                >
                  <p className=" font-bold text-white text-center">$170</p>
                </div>
                <img src="/towncenter.png" alt="towncenter" />
              </button>

              <button
                id="building-windmill"
                className={`text-black h-full w-20 text-sm rounded flex flex-col align-top
                    transition-colors duration-200
              ${buttonPage === 4 ? "" : "hidden"}`}
                style={{
                  backgroundColor:
                    activeToolId === "building-windmill"
                      ? "#a855f7"
                      : "#b4b4b4e4",
                }}
                onClick={() => setActiveToolId("building-windmill")}
              >
                <div
                  className="h-6 w-full rounded-t flex align-middle justify-center"
                  style={{ backgroundColor: "#523667" }}
                >
                  <p className=" font-bold text-white text-center">$120</p>
                </div>
                <img src="/windmill.png" alt="windmill" />
              </button>

              <button
                id="building-watchtower"
                className={`text-black h-full w-20 text-sm rounded flex flex-col align-top
                    transition-colors duration-200
              ${buttonPage === 4 ? "" : "hidden"}`}
                style={{
                  backgroundColor:
                    activeToolId === "building-watchtower"
                      ? "#a855f7"
                      : "#b4b4b4e4",
                }}
                onClick={() => setActiveToolId("building-watchtower")}
              >
                <div
                  className="h-6 w-full rounded-t flex align-middle justify-center"
                  style={{ backgroundColor: "#523667" }}
                >
                  <p className=" font-bold text-white text-center">$110</p>
                </div>
                <img src="/watchtower.png" alt="watchtower" />
              </button>
            </div>

            {/* div for button page buttons */}
            <div className="bg-violet-600 h-full flex flex-col align-middle justify-between p-2">
              <button
                className="bg-neutral-400 w-10 h-10 rounded-sm flex align-middle justify-center"
                onClick={() =>
                  setButtonPageId((prev) => (prev < 4 ? prev + 1 : prev))
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
                className="bg-neutral-400  w-10 h-10 rounded-sm flex align-middle justify-center"
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
    </div>
  );
};

export default ThreeScene;
