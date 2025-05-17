"use client";

import * as THREE from "three";

export function createCamera(
  containerRef: React.RefObject<HTMLDivElement | null>,
  renderer: THREE.WebGLRenderer,
  size: number
) {
  const DEG2RAD = Math.PI / 180;
  const MIN_CAMERA_RADIUS = Math.max(5 - size / 2, 3);
  const MAX_CAMERA_RADIUS = 12 + size;

  const LEFT_MOUSE_BUTTON = 0;
  const MIDDLE_MOUSE_BUTTON = 1;
  const RIGHT_MOUSE_BUTTON = 2;

  const ROTATION_SENSITIVITY = 100;
  const ZOOM_SENSITIVITY = 1;

  const MIN_CAMERA_ELEVATION = 0;
  const MAX_CAMERA_ELEVATION = 90;

  const Y_AXIS = new THREE.Vector3(0, 1, 0);

  // eslint-disable-next-line prefer-const
  let cameraOrigin = new THREE.Vector3(size / 2, 0, size / 2);

  let isLeftMouseDown = false;
  let isRightMouseDown = false;
  // let isMiddleMouseDown = false;
  let cameraRadius = (MIN_CAMERA_RADIUS + MAX_CAMERA_RADIUS) / 2;
  let cameraAzimuth = -30;
  let cameraElevation = 35;

  let prevMouseX = 0;
  let prevMouseY = 0;

  if (!containerRef.current) {
    throw new Error("ContainerRef is not ready when creating the camera.");
  }

  const camera = new THREE.PerspectiveCamera(
    75,
    containerRef.current.clientWidth / containerRef.current.clientHeight,
    0.1,
    1000
  );
  updateCameraPostion();

  function onMouseDown(event: MouseEvent) {
    if (event.button === LEFT_MOUSE_BUTTON) isLeftMouseDown = true;
    if (event.button === MIDDLE_MOUSE_BUTTON) {
      // isMiddleMouseDown = true;
      event.preventDefault();
    }
    if (event.button === RIGHT_MOUSE_BUTTON) isRightMouseDown = true;
  }

  function onMouseUp(event: MouseEvent) {
    if (event.button === LEFT_MOUSE_BUTTON) isLeftMouseDown = false;
    // if (event.button === MIDDLE_MOUSE_BUTTON) isMiddleMouseDown = false;
    if (event.button === RIGHT_MOUSE_BUTTON) isRightMouseDown = false;
  }

  function onMouseMove(event: MouseEvent) {
    const rect = renderer.domElement.getBoundingClientRect();
    const mouseX = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    const mouseY = -((event.clientY - rect.top) / rect.height) * 2 + 1;
    const deltaX = mouseX - prevMouseX;
    const deltaY = mouseY - prevMouseY;

    //rotation of cam
    if (isLeftMouseDown) {
      cameraAzimuth += -(deltaX * ROTATION_SENSITIVITY);
      cameraElevation += -(deltaY * ROTATION_SENSITIVITY);
      cameraElevation = Math.min(
        MAX_CAMERA_ELEVATION,
        Math.max(MIN_CAMERA_ELEVATION, cameraElevation)
      );
    }

    //pan cam
    if (isRightMouseDown) {
      const forward = new THREE.Vector3(0, 0, 1).applyAxisAngle(
        Y_AXIS,
        cameraAzimuth * DEG2RAD
      );
      const left = new THREE.Vector3(1, 0, 0).applyAxisAngle(
        Y_AXIS,
        cameraAzimuth * DEG2RAD
      );

      cameraOrigin.add(forward.multiplyScalar(5 * deltaY));
      cameraOrigin.add(left.multiplyScalar(-10 * deltaX));

      updateCameraPostion();
    }

    updateCameraPostion();
    prevMouseX = mouseX;
    prevMouseY = mouseY;
  }

  function onScroll(event: WheelEvent) {
    event.preventDefault(); // prevent browser scrolling

    // Scrolling up (deltaY < 0) should zoom in (reduce radius)
    // Scrolling down (deltaY > 0) should zoom out (increase radius)
    console.log(event.clientY);
    cameraRadius += event.deltaY * 0.01 * ZOOM_SENSITIVITY;

    // Clamp the camera distance between min and max
    cameraRadius = Math.max(
      MIN_CAMERA_RADIUS,
      Math.min(MAX_CAMERA_RADIUS, cameraRadius)
    );

    updateCameraPostion();
  }

  function updateCameraPostion() {
    camera.position.x =
      cameraRadius *
      Math.sin(cameraAzimuth * DEG2RAD) *
      Math.cos(cameraElevation * DEG2RAD);

    camera.position.y = cameraRadius * Math.sin(cameraElevation * DEG2RAD);

    camera.position.z =
      cameraRadius *
      Math.cos(cameraAzimuth * DEG2RAD) *
      Math.cos(cameraElevation * DEG2RAD);

    camera.position.add(cameraOrigin);
    camera.lookAt(cameraOrigin);
    camera.updateMatrix();
  }

  return {
    camera,
    onMouseDown,
    onMouseUp,
    onMouseMove,
    onScroll,
  };
}
