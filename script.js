// 1. ایجاد صحنه، دوربین و رندرر
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x1a1a1a);
scene.fog = new THREE.FogExp2(0x0d0d0d, 0.05);

const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
document.body.appendChild(renderer.domElement);

// 2. تنظیمات زمین
const blockSize = 1;
const worldSize = 50; // اندازه جدید برای تولید زمین
const blocks = new Set(); // برای نگهداری بلوک‌ها
let offsetX = 0;
let offsetZ = 0;

// تابع ایجاد زمین
function createGround(xOffset, zOffset) {
  const blockGeometry = new THREE.BoxGeometry(blockSize, blockSize, blockSize);
  const groundMaterial = new THREE.MeshStandardMaterial({ color: 0x2b2b2b });

  for (let x = -worldSize / 2; x < worldSize / 2; x++) {
    for (let z = -worldSize / 2; z < worldSize / 2; z++) {
      const groundBlock = new THREE.Mesh(blockGeometry, groundMaterial);
      groundBlock.position.set(x + xOffset, -1, z + zOffset);
      groundBlock.receiveShadow = true;
      blocks.add(groundBlock);
      scene.add(groundBlock);
    }
  }
}

// ایجاد زمین اولیه
createGround(offsetX, offsetZ);

// 3. ایجاد درخت‌های ترسناک
const treeTrunkMaterial = new THREE.MeshStandardMaterial({ color: 0x3b2b1f });
const treeLeavesMaterial = new THREE.MeshStandardMaterial({
  color: 0x1a3a3a,
  roughness: 0.9,
  metalness: 0.1,
});

function createScaryTree(x, z) {
  const trunkHeight = Math.random() * 5 + 5;
  const trunk = new THREE.Mesh(
    new THREE.CylinderGeometry(0.4, 0.6, trunkHeight),
    treeTrunkMaterial
  );
  trunk.position.set(x, trunkHeight / 2 - 1, z);
  trunk.castShadow = true;
  scene.add(trunk);

  const leaves = new THREE.Mesh(
    new THREE.ConeGeometry(1.5, 3, 8),
    treeLeavesMaterial
  );
  leaves.position.set(x, trunkHeight - 1, z);
  leaves.castShadow = true;
  scene.add(leaves);
}

function addTrees(xOffset, zOffset) {
  for (let i = 0; i < 20; i++) {
    const x = Math.floor(Math.random() * worldSize) - worldSize / 2 + xOffset;
    const z = Math.floor(Math.random() * worldSize) - worldSize / 2 + zOffset;
    createScaryTree(x, z);
  }
}

// 4. ایجاد سنگ‌ها و گرگ‌ها
const createRocksAndWolves = (offsetX, offsetZ) => {
  // ایجاد سنگ‌ها
  const rockGeometry = new THREE.SphereGeometry(0.5, 16, 16);
  const rockMaterial = new THREE.MeshStandardMaterial({ color: 0x7d7d7d });
  for (let i = 0; i < 10; i++) {
    const rock = new THREE.Mesh(rockGeometry, rockMaterial);
    rock.position.set(
      Math.random() * worldSize - worldSize / 2 + offsetX,
      -0.5,
      Math.random() * worldSize - worldSize / 2 + offsetZ
    );
    rock.castShadow = true;
    scene.add(rock);
  }

  // ایجاد گرگ‌ها
  const wolfMaterial = new THREE.MeshStandardMaterial({ color: 0x555555 });
  for (let i = 0; i < 5; i++) {
    const wolf = new THREE.Mesh(
      new THREE.BoxGeometry(0.5, 0.5, 1),
      wolfMaterial
    );
    wolf.position.set(
      Math.random() * worldSize - worldSize / 2 + offsetX,
      0,
      Math.random() * worldSize - worldSize / 2 + offsetZ
    );
    wolf.castShadow = true;
    scene.add(wolf);
  }
};

// 5. ایجاد ماه
const moonGeometry = new THREE.SphereGeometry(2, 32, 32);
const moonMaterial = new THREE.MeshStandardMaterial({
  color: 0xffffff,
  emissive: 0xffffff,
  emissiveIntensity: 0.5,
});
const moon = new THREE.Mesh(moonGeometry, moonMaterial);
moon.position.set(5, 5, -10);
scene.add(moon);

// 6. نورپردازی
const dimLight = new THREE.DirectionalLight(0x444444, 0.4);
dimLight.position.set(10, 20, 10);
dimLight.castShadow = true;
scene.add(dimLight);

const ambientLight = new THREE.AmbientLight(0x111111);
scene.add(ambientLight);

// 7. موقعیت دوربین
camera.position.set(0, 2, 5);

// 8. کنترل ماوس
let isMouseDown = false;
let previousMousePosition = { x: 0, y: 0 };

window.addEventListener("mousedown", (event) => {
  isMouseDown = true;
  previousMousePosition = { x: event.clientX, y: event.clientY };
});

window.addEventListener("mouseup", () => {
  isMouseDown = false;
});

window.addEventListener("mousemove", (event) => {
  if (isMouseDown) {
    const deltaX = event.clientX - previousMousePosition.x;
    const deltaY = event.clientY - previousMousePosition.y;

    camera.rotation.y -= deltaX * 0.005;
    camera.rotation.x -= deltaY * 0.005;

    previousMousePosition = { x: event.clientX, y: event.clientY };
  }
});

// 9. ایجاد دکمه‌ها
const controls = document.createElement("div");
controls.id = "controls";
document.body.appendChild(controls);

const createButton = (text, onClick) => {
  const button = document.createElement("button");
  button.innerText = text;
  button.onclick = onClick;
  controls.appendChild(button);
};

createButton("⬆️", () => {
  camera.position.z -= 0.5;
});

createButton("⬇️", () => {
  camera.position.z += 0.5;
});

createButton("⬅️", () => {
  camera.position.x -= 0.5;
});

createButton("➡️", () => {
  camera.position.x += 0.5;
});

// 11. کنترل کیبورد
window.addEventListener("keydown", (event) => {
  switch (event.key) {
    case "ArrowUp":
      camera.position.z -= 0.5;
      break;
    case "ArrowDown":
      camera.position.z += 0.5;
      break;
    case "ArrowLeft":
      camera.position.x -= 0.5;
      break;
    case "ArrowRight":
      camera.position.x += 0.5;
      break;
  }
});

// 9. تابع انیمیشن
function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);

  // 10. نظارت بر موقعیت دوربین و ایجاد زمین جدید
  const cameraPosX = Math.floor(camera.position.x / blockSize);
  const cameraPosZ = Math.floor(camera.position.z / blockSize);

  // بررسی موقعیت دوربین برای ایجاد زمین جدید
  if (Math.abs(camera.position.x - offsetX) >= worldSize / 2) {
    const oldOffsetX = offsetX;
    offsetX = camera.position.x;
    createGround(offsetX, offsetZ);
    addTrees(offsetX, offsetZ);
    createRocksAndWolves(offsetX, offsetZ);

    // حذف زمین‌های قدیمی
    blocks.forEach((block) => scene.remove(block));
    blocks.clear();

    createGround(oldOffsetX, offsetZ);
  }

  if (Math.abs(camera.position.z - offsetZ) >= worldSize / 2) {
    const oldOffsetZ = offsetZ;
    offsetZ = camera.position.z;
    createGround(offsetX, offsetZ);
    addTrees(offsetX, offsetZ);
    createRocksAndWolves(offsetX, offsetZ);

    // حذف زمین‌های قدیمی
    // blocks.forEach(block => scene.remove(block));
    // blocks.clear();

    // ایجاد زمین قبلی دوباره
    createGround(offsetX, oldOffsetZ);
  }
}

animate();

// 11. تغییر اندازه صفحه
window.addEventListener("resize", function () {
  renderer.setSize(window.innerWidth, window.innerHeight);
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
});
