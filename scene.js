const canvas = document.getElementById("brn-3d-scene");

if (canvas) {
  const scene = new THREE.Scene();
  scene.fog = new THREE.Fog(0x21172e, 8, 24);

  const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 80);
  camera.position.set(7.8, 6.4, 9.5);
  camera.lookAt(0, 0.8, 0);

  const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true,
    alpha: true,
    preserveDrawingBuffer: true,
    powerPreference: "high-performance",
  });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.75));
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;

  const root = new THREE.Group();
  scene.add(root);

  const ambient = new THREE.HemisphereLight(0xfff3d1, 0x2b1740, 1.8);
  scene.add(ambient);

  const key = new THREE.DirectionalLight(0xffd86a, 2.4);
  key.position.set(4, 7, 4);
  key.castShadow = true;
  key.shadow.mapSize.set(1024, 1024);
  scene.add(key);

  const rim = new THREE.PointLight(0xff7a1a, 4.5, 18);
  rim.position.set(-4.5, 3, 4);
  scene.add(rim);

  const violet = new THREE.MeshStandardMaterial({ color: 0x3b1b72, roughness: 0.55, metalness: 0.12 });
  const violetDark = new THREE.MeshStandardMaterial({ color: 0x21172e, roughness: 0.62, metalness: 0.1 });
  const gold = new THREE.MeshStandardMaterial({ color: 0xd9b24c, roughness: 0.35, metalness: 0.25 });
  const orange = new THREE.MeshStandardMaterial({ color: 0xff7a1a, roughness: 0.42, metalness: 0.08 });
  const teal = new THREE.MeshStandardMaterial({ color: 0x0f766e, roughness: 0.5, metalness: 0.06 });
  const glass = new THREE.MeshPhysicalMaterial({
    color: 0xeadfff,
    roughness: 0.16,
    metalness: 0.05,
    transparent: true,
    opacity: 0.42,
    transmission: 0.2,
  });

  function mesh(geometry, material, position, scale = [1, 1, 1]) {
    const item = new THREE.Mesh(geometry, material);
    item.position.set(...position);
    item.scale.set(...scale);
    item.castShadow = true;
    item.receiveShadow = true;
    return item;
  }

  const base = mesh(new THREE.BoxGeometry(9.5, 0.22, 5.8), violetDark, [0, -0.18, 0]);
  base.receiveShadow = true;
  root.add(base);

  const road = mesh(new THREE.BoxGeometry(9.5, 0.05, 0.56), new THREE.MeshStandardMaterial({ color: 0x5e4b81 }), [0, 0.02, 0.15]);
  root.add(road);

  const river = mesh(new THREE.BoxGeometry(9.5, 0.04, 0.5), new THREE.MeshStandardMaterial({ color: 0x2da9d7, roughness: 0.18, metalness: 0.05 }), [0, 0.035, -1.9]);
  root.add(river);

  const pulseObjects = [];
  const calendarTiles = [];

  for (let i = 0; i < 11; i += 1) {
    const h = 0.32 + (i % 4) * 0.24;
    const b = mesh(
      new THREE.BoxGeometry(0.48, h, 0.48),
      i % 3 === 0 ? violet : i % 3 === 1 ? gold : teal,
      [-4.1 + i * 0.75, h / 2, -0.78 + (i % 2) * 0.42]
    );
    root.add(b);
    pulseObjects.push(b);
  }

  for (let i = 0; i < 5; i += 1) {
    const trunk = mesh(new THREE.CylinderGeometry(0.05, 0.06, 0.42, 10), violetDark, [-3.8 + i * 1.25, 0.24, -2.25]);
    const leaf = mesh(new THREE.SphereGeometry(0.22, 18, 12), teal, [-3.8 + i * 1.25, 0.58, -2.25]);
    root.add(trunk, leaf);
  }

  const board = new THREE.Group();
  board.position.set(1.75, 1.08, 1.92);
  board.rotation.x = -0.18;
  board.rotation.y = -0.28;
  root.add(board);
  board.add(mesh(new THREE.BoxGeometry(3.6, 2.05, 0.08), glass, [0, 0, 0]));
  board.add(mesh(new THREE.BoxGeometry(3.72, 0.12, 0.12), gold, [0, 1.08, 0.02]));

  for (let row = 0; row < 3; row += 1) {
    for (let col = 0; col < 6; col += 1) {
      const tile = mesh(
        new THREE.BoxGeometry(0.38, 0.28, 0.05),
        (row + col) % 4 === 0 ? orange : (row + col) % 3 === 0 ? gold : violet,
        [-1.38 + col * 0.55, 0.55 - row * 0.48, 0.08]
      );
      tile.userData.phase = row * 0.7 + col * 0.33;
      board.add(tile);
      calendarTiles.push(tile);
    }
  }

  const mascot = new THREE.Group();
  mascot.position.set(-2.2, 0.02, 1.35);
  root.add(mascot);

  const body = mesh(new THREE.CapsuleGeometry(0.26, 0.58, 8, 18), orange, [0, 0.72, 0]);
  const head = mesh(new THREE.SphereGeometry(0.26, 24, 16), gold, [0, 1.25, 0]);
  const visor = mesh(new THREE.BoxGeometry(0.32, 0.08, 0.04), violetDark, [0, 1.28, 0.24]);
  const cameraBox = mesh(new THREE.BoxGeometry(0.32, 0.2, 0.18), violet, [0.38, 0.78, 0.03]);
  const lens = mesh(new THREE.CylinderGeometry(0.08, 0.08, 0.08, 18), gold, [0.56, 0.78, 0.03]);
  lens.rotation.z = Math.PI / 2;
  const armL = mesh(new THREE.CapsuleGeometry(0.06, 0.36, 5, 10), gold, [-0.3, 0.82, 0]);
  const armR = mesh(new THREE.CapsuleGeometry(0.06, 0.34, 5, 10), gold, [0.3, 0.86, 0]);
  armL.rotation.z = 0.55;
  armR.rotation.z = -0.8;
  const legL = mesh(new THREE.CapsuleGeometry(0.065, 0.34, 5, 10), violetDark, [-0.12, 0.26, 0]);
  const legR = mesh(new THREE.CapsuleGeometry(0.065, 0.34, 5, 10), violetDark, [0.12, 0.26, 0]);
  mascot.add(body, head, visor, cameraBox, lens, armL, armR, legL, legR);

  const signal = new THREE.Group();
  signal.position.set(-3.9, 1.05, 1.55);
  root.add(signal);
  for (let i = 0; i < 3; i += 1) {
    const ring = mesh(new THREE.TorusGeometry(0.24 + i * 0.2, 0.012, 8, 40), gold, [0, i * 0.03, 0]);
    ring.rotation.x = Math.PI / 2;
    ring.userData.phase = i * 0.65;
    signal.add(ring);
    pulseObjects.push(ring);
  }

  const clock = new THREE.Clock();

  function resize() {
    const rect = canvas.getBoundingClientRect();
    const width = Math.max(1, Math.floor(rect.width));
    const height = Math.max(1, Math.floor(rect.height));
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height, false);
  }

  function animate() {
    const t = clock.getElapsedTime();
    root.rotation.y = Math.sin(t * 0.26) * 0.08 - 0.14;
    mascot.position.x = -2.25 + Math.sin(t * 0.78) * 0.32;
    mascot.position.z = 1.25 + Math.cos(t * 0.78) * 0.12;
    mascot.rotation.y = Math.sin(t * 0.78) * 0.24 + 0.28;
    legL.rotation.x = Math.sin(t * 4.2) * 0.28;
    legR.rotation.x = Math.sin(t * 4.2 + Math.PI) * 0.28;
    armR.rotation.z = -0.8 + Math.sin(t * 2.8) * 0.22;
    board.position.y = 1.08 + Math.sin(t * 1.2) * 0.05;

    calendarTiles.forEach((tile) => {
      const pulse = (Math.sin(t * 2.1 + tile.userData.phase) + 1) * 0.5;
      tile.position.z = 0.08 + pulse * 0.055;
      tile.scale.setScalar(1 + pulse * 0.035);
    });

    pulseObjects.forEach((item, index) => {
      item.position.y += Math.sin(t * 1.4 + index) * 0.0008;
    });

    rim.intensity = 3.6 + Math.sin(t * 1.8) * 0.9;
    renderer.render(scene, camera);
    requestAnimationFrame(animate);
  }

  resize();
  animate();
  window.addEventListener("resize", resize);

  document.addEventListener("brn:data", (event) => {
    const count = Math.min(8, (event.detail?.todayCount || 1) + 1);
    calendarTiles.forEach((tile, index) => {
      tile.material = index < count ? orange : index % 3 === 0 ? gold : violet;
    });
  });
}
