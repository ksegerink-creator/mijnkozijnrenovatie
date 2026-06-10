(() => {
  let controller = null;

  const clamp = (v, min, max) => Math.max(min, Math.min(max, v));
  const ease = (x) => 1 - Math.pow(1 - clamp(x, 0, 1), 3);

  async function boot() {
    const stage = document.querySelector('#real3dWindowStage');
    const section = document.querySelector('.blueprint-scroll.real-3d-enabled');
    if (!stage || !section || controller) return;

    stage.classList.add('professional-3d');
    const THREE = await import('https://unpkg.com/three@0.160.0/build/three.module.js');

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(32, 1, 0.1, 100);
    camera.position.set(0, 0.3, 10.6);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.domElement.className = 'realistic-window-canvas';
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    stage.appendChild(renderer.domElement);

    const root = new THREE.Group();
    scene.add(root);

    const wall = new THREE.Group();
    const frame = new THREE.Group();
    const glass = new THREE.Group();
    const details = new THREE.Group();
    root.add(wall, frame, glass, details);

    const mWall = new THREE.MeshStandardMaterial({ color: 0xf2ebdc, roughness: 0.78 });
    const mReveal = new THREE.MeshStandardMaterial({ color: 0xd2c7b4, roughness: 0.82 });
    const mGreen = new THREE.MeshStandardMaterial({ color: 0x163d2c, roughness: 0.42, metalness: 0.04 });
    const mDark = new THREE.MeshStandardMaterial({ color: 0x0d271d, roughness: 0.48, metalness: 0.04 });
    const mCream = new THREE.MeshStandardMaterial({ color: 0xfffbf0, roughness: 0.36 });
    const mLime = new THREE.MeshStandardMaterial({ color: 0xd7f36b, roughness: 0.34 });
    const mGlass = new THREE.MeshPhysicalMaterial({ color: 0xc5e5e8, roughness: 0.06, transparent: true, opacity: 0.48, transmission: 0.45, thickness: 0.08, clearcoat: 1, clearcoatRoughness: 0.04 });
    const mShadow = new THREE.ShadowMaterial({ opacity: 0.18 });

    function box(group, size, pos, mat) {
      const mesh = new THREE.Mesh(new THREE.BoxGeometry(size[0], size[1], size[2]), mat);
      mesh.position.set(pos[0], pos[1], pos[2]);
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      group.add(mesh);
      return mesh;
    }

    box(wall, [7.4, 4.95, 0.22], [0, 0, -0.38], mWall);
    box(wall, [6.15, 3.92, 0.35], [0, 0, -0.13], mReveal);
    box(wall, [5.56, 3.36, 0.36], [0, 0, 0.02], mWall);

    const profileDepth = 0.48;
    box(frame, [0.28, 3.42, profileDepth], [-2.62, 0, 0.42], mGreen);
    box(frame, [0.28, 3.42, profileDepth], [2.62, 0, 0.42], mGreen);
    box(frame, [5.52, 0.28, profileDepth], [0, 1.71, 0.42], mGreen);
    box(frame, [5.52, 0.28, profileDepth], [0, -1.71, 0.42], mGreen);
    box(frame, [0.22, 3.3, 0.56], [0, 0, 0.62], mDark);
    box(frame, [5.28, 0.2, 0.56], [0, 0, 0.63], mDark);

    box(frame, [0.13, 3.02, 0.16], [-2.28, 0, 0.82], mCream);
    box(frame, [0.13, 3.02, 0.16], [2.28, 0, 0.82], mCream);
    box(frame, [4.58, 0.13, 0.16], [0, 1.44, 0.82], mCream);
    box(frame, [4.58, 0.13, 0.16], [0, -1.44, 0.82], mCream);

    [[-1.16, .74, .92], [1.16, .74, .92], [-1.16, -.74, .92], [1.16, -.74, .92]].forEach((p) => box(glass, [1.82, 1.1, .04], p, mGlass));

    box(details, [4.8, .18, .2], [0, 1.34, 1.06], mLime);
    for (let i = 0; i < 20; i++) box(details, [.04, .23, .26], [-2.25 + i * .237, 1.34, 1.18], mDark);
    box(details, [5.9, .16, .58], [0, -2.02, .46], mCream);
    box(details, [.13, .55, .08], [1.95, -.04, 1.13], mCream);
    box(details, [.065, .42, .18], [2.02, -.04, 1.25], mDark);

    const floor = new THREE.Mesh(new THREE.PlaneGeometry(9, 5), mShadow);
    floor.rotation.x = -Math.PI / 2;
    floor.position.set(0, -2.22, 1.3);
    scene.add(floor);

    scene.add(new THREE.HemisphereLight(0xffffff, 0x82917e, 1.85));
    const key = new THREE.DirectionalLight(0xffffff, 2.4);
    key.position.set(-4, 5, 6);
    key.castShadow = true;
    key.shadow.mapSize.set(1024, 1024);
    scene.add(key);
    const rim = new THREE.DirectionalLight(0xd7f36b, 0.85);
    rim.position.set(4, 3, 5);
    scene.add(rim);

    function setGroup(group, opacity, z) {
      group.position.z = z;
      group.traverse((o) => {
        if (!o.material) return;
        o.material.transparent = opacity < 0.99 || o.material.transparent;
        o.material.opacity = opacity;
        o.visible = opacity > 0.02;
      });
    }

    function resize() {
      const rect = stage.getBoundingClientRect();
      const w = Math.max(320, rect.width);
      const h = Math.max(320, rect.height);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h, false);
    }

    function progress() {
      const rect = section.getBoundingClientRect();
      const max = section.offsetHeight - window.innerHeight;
      return clamp(-rect.top / Math.max(max, 1), 0, 1);
    }

    function draw() {
      const p = progress();
      const p1 = ease((p - .02) / .20);
      const p2 = ease((p - .20) / .22);
      const p3 = ease((p - .38) / .22);
      const p4 = ease((p - .58) / .22);
      setGroup(wall, .22 + .78 * p1, -.15 + .15 * p1);
      setGroup(frame, p2, .72 - .38 * p2);
      setGroup(glass, Math.max(.15, p3), 1.08 - .34 * p3);
      setGroup(details, p4, 1.32 - .36 * p4);
      root.rotation.y = -0.18 + p * .28;
      root.rotation.x = -0.08 + p * .04;
      root.scale.setScalar(.86 + p * .02);
      camera.position.z = 10.7 - p * .9;
      camera.position.y = .38 - p * .12;
      camera.lookAt(0, -.05, .35);
      renderer.render(scene, camera);
    }

    controller = { resize, draw };
    resize();
    draw();
    window.addEventListener('resize', () => { resize(); draw(); });
    window.addEventListener('scroll', draw, { passive: true });
    new ResizeObserver(() => { resize(); draw(); }).observe(stage);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', () => setTimeout(boot, 350));
  else setTimeout(boot, 350);
})();
