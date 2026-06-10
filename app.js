function injectBlueprintScroll() {
  const stylesheets = [
    'scroll.css',
    'frame-build.css',
    'transition-fix.css',
    'annotation-refine.css',
    'light-refine.css',
    'sunergy-style.css',
    'hero-showcase.css',
    'hero-realistic.css',
    'hero-benefits.css',
    'real-3d-window.css',
    'motion-benefits.css'
  ];

  stylesheets.forEach((href) => {
    if (!document.querySelector(`link[href="${href}"]`)) {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = href;
      document.head.appendChild(link);
    }
  });

  const hero = document.querySelector('.hero');
  if (!hero || document.querySelector('.blueprint-scroll')) return;

  const section = document.createElement('section');
  section.className = 'blueprint-scroll frame-build-mode real-3d-enabled';
  section.innerHTML = `
    <div class="blueprint-sticky">
      <div class="blueprint-inner">
        <div class="blueprint-orbit"></div>
        <div class="blueprint-meta"><span>RENOVATION SYSTEM</span><span>REAL 3D // WINDOW BUILD</span></div>
        <div class="real-3d-stage" id="real3dWindowStage" aria-hidden="true">
          <div class="real-3d-fallback-note">3D-preview wordt geladen...</div>
        </div>
        <div class="motion-benefits" aria-label="Voordelen per renovatiestap">
          <article class="motion-card motion-profile" data-step="01"><span class="motion-kicker">Kunststof profiel</span><strong>Onderhoudsarm.</strong><p>Geen terugkerend schuur- en schilderwerk zoals bij houten kozijnen.</p></article>
          <article class="motion-card motion-glass" data-step="02"><span class="motion-kicker">Isolatieglas</span><strong>Minder warmteverlies.</strong><p>Moderne profielen met HR++ of triple glas helpen je woning beter isoleren.</p></article>
          <article class="motion-card motion-comfort" data-step="03"><span class="motion-kicker">Comfortlaag</span><strong>Meer wooncomfort.</strong><p>Minder tocht, betere kierdichting en ventilatie die past bij jouw woning.</p></article>
          <article class="motion-card motion-finish" data-step="04"><span class="motion-kicker">Renovatie-afwerking</span><strong>Strakke upgrade.</strong><p>Een frisse uitstraling zonder grote verbouwing aan de volledige gevel.</p></article>
        </div>
        <svg class="blueprint-drawing" viewBox="0 0 1200 620" aria-label="Technische kozijnrenovatie animatie">
          <rect class="blueprint-frame-fill" x="326" y="140" width="548" height="330" rx="0" />
          <rect class="blueprint-glass-fill" x="374" y="188" width="204" height="104" rx="0" />
          <rect class="blueprint-glass-fill" x="622" y="188" width="204" height="104" rx="0" />
          <rect class="blueprint-glass-fill" x="374" y="328" width="204" height="104" rx="0" />
          <rect class="blueprint-glass-fill" x="622" y="328" width="204" height="104" rx="0" />
          <path class="blueprint-line line-1" pathLength="1" d="M326 140 H874 V470 H326 Z"/>
          <path class="blueprint-line line-1" pathLength="1" d="M356 170 H844 V440 H356 Z"/>
          <path class="blueprint-line line-2" pathLength="1" d="M600 140 V470 M326 305 H874"/>
          <path class="blueprint-line line-2 soft" pathLength="1" d="M356 170 L600 305 L356 440 M844 170 L600 305 L844 440"/>
          <path class="blueprint-line line-3 depth" pathLength="1" d="M326 140 L386 94 H934 L874 140 M874 470 L934 424 V94 M326 470 L386 424 H934"/>
          <path class="blueprint-line line-3 accent" pathLength="1" d="M326 108 H874 M326 104 V120 M874 104 V120"/>
          <path class="blueprint-line line-3 accent" pathLength="1" d="M284 140 V470 M280 140 H298 M280 470 H298"/>
          <path class="blueprint-line line-4 soft" pathLength="1" d="M210 96 H990 V520 H210 Z"/>
          <path class="blueprint-line line-4 soft" pathLength="1" d="M210 520 L326 470 M990 96 L874 140"/>
          <path class="blueprint-line line-4" pathLength="1" d="M170 545 H1030"/>
          <path class="blueprint-line line-4 accent" pathLength="1" d="M420 104 L420 72 H238 M780 104 L780 72 H962 M874 372 H1010 V430 M326 410 H214 V478"/>
        </svg>
        <div class="frame-stack" aria-hidden="true">
          <div class="frame-layer frame-opening"></div>
          <div class="frame-layer frame-outer"></div>
          <div class="frame-layer frame-inner"></div>
          <div class="frame-layer frame-glass"><span></span><span></span><span></span><span></span></div>
          <div class="frame-layer frame-comfort"></div>
          <div class="frame-sill"></div>
          <div class="frame-handle"></div>
        </div>
        <div class="blueprint-label label-profile">Kunststof profiel</div>
        <div class="blueprint-label label-glass">HR++ / triple glas</div>
        <div class="blueprint-label label-vent">Ventilatie & comfort</div>
        <div class="blueprint-label label-mount">Inmeten & montage</div>
        <h2 class="blueprint-title">Een renovatievoorstel dat je visueel begrijpt.</h2>
      </div>
    </div>`;
  hero.insertAdjacentElement('afterend', section);
  initReal3DWindowScene();
}

let real3DSceneController = null;

async function initReal3DWindowScene() {
  const stage = document.querySelector('#real3dWindowStage');
  if (!stage || real3DSceneController) return;

  try {
    const THREE = await import('https://unpkg.com/three@0.160.0/build/three.module.js');
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(34, 1, 0.1, 100);
    camera.position.set(0, 0.55, 8.8);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.7));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    stage.appendChild(renderer.domElement);

    const root = new THREE.Group();
    root.rotation.x = -0.03;
    scene.add(root);

    const wallGroup = new THREE.Group();
    const frameGroup = new THREE.Group();
    const trimGroup = new THREE.Group();
    const glassGroup = new THREE.Group();
    const detailGroup = new THREE.Group();
    root.add(wallGroup, frameGroup, trimGroup, glassGroup, detailGroup);

    const matWall = new THREE.MeshStandardMaterial({ color: 0xf0eadc, roughness: 0.72, metalness: 0.02 });
    const matReveal = new THREE.MeshStandardMaterial({ color: 0xd9cfbe, roughness: 0.78, metalness: 0.01 });
    const matGreen = new THREE.MeshStandardMaterial({ color: 0x183c2d, roughness: 0.44, metalness: 0.08 });
    const matGreenSide = new THREE.MeshStandardMaterial({ color: 0x0f2a20, roughness: 0.52, metalness: 0.05 });
    const matTrim = new THREE.MeshStandardMaterial({ color: 0xfffaf0, roughness: 0.38, metalness: 0.03 });
    const matGlass = new THREE.MeshPhysicalMaterial({
      color: 0xc9edf0,
      roughness: 0.08,
      metalness: 0,
      transmission: 0.55,
      transparent: true,
      opacity: 0.42,
      thickness: 0.06,
      clearcoat: 1,
      clearcoatRoughness: 0.05
    });
    const matLime = new THREE.MeshStandardMaterial({ color: 0xd7f36b, roughness: 0.34, metalness: 0.05 });
    const matShadow = new THREE.ShadowMaterial({ opacity: 0.18 });

    const addBox = (group, name, size, position, material) => {
      const mesh = new THREE.Mesh(new THREE.BoxGeometry(size[0], size[1], size[2]), material);
      mesh.name = name;
      mesh.position.set(position[0], position[1], position[2]);
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      group.add(mesh);
      return mesh;
    };

    addBox(wallGroup, 'gevelvlak', [6.25, 4.65, 0.28], [0, 0, -0.22], matWall);
    addBox(wallGroup, 'dagkant-links', [0.28, 4.2, 0.48], [-2.94, 0, 0.02], matReveal);
    addBox(wallGroup, 'dagkant-rechts', [0.28, 4.2, 0.48], [2.94, 0, 0.02], matReveal);
    addBox(wallGroup, 'dagkant-boven', [5.6, 0.28, 0.48], [0, 2.1, 0.02], matReveal);
    addBox(wallGroup, 'dagkant-onder', [5.6, 0.28, 0.48], [0, -2.1, 0.02], matReveal);

    addBox(frameGroup, 'buitenprofiel-links', [0.26, 3.78, 0.42], [-2.45, 0, 0.26], matGreen);
    addBox(frameGroup, 'buitenprofiel-rechts', [0.26, 3.78, 0.42], [2.45, 0, 0.26], matGreen);
    addBox(frameGroup, 'buitenprofiel-boven', [5.14, 0.26, 0.42], [0, 1.77, 0.26], matGreen);
    addBox(frameGroup, 'buitenprofiel-onder', [5.14, 0.26, 0.42], [0, -1.77, 0.26], matGreen);
    addBox(frameGroup, 'middenstijl', [0.22, 3.55, 0.48], [0, 0, 0.42], matGreenSide);
    addBox(frameGroup, 'tussenregel', [4.92, 0.19, 0.48], [0, 0, 0.43], matGreenSide);

    addBox(trimGroup, 'witte-kader-links', [0.12, 3.25, 0.16], [-2.18, 0, 0.61], matTrim);
    addBox(trimGroup, 'witte-kader-rechts', [0.12, 3.25, 0.16], [2.18, 0, 0.61], matTrim);
    addBox(trimGroup, 'witte-kader-boven', [4.36, 0.12, 0.16], [0, 1.51, 0.61], matTrim);
    addBox(trimGroup, 'witte-kader-onder', [4.36, 0.12, 0.16], [0, -1.51, 0.61], matTrim);

    const panePositions = [[-1.14, 0.79, 0.72], [1.14, 0.79, 0.72], [-1.14, -0.79, 0.72], [1.14, -0.79, 0.72]];
    panePositions.forEach((pos, index) => addBox(glassGroup, `glas-${index + 1}`, [1.74, 1.18, 0.035], pos, matGlass));

    addBox(detailGroup, 'ventilatie-rooster', [4.3, 0.18, 0.20], [0, 1.42, 0.86], matLime);
    for (let i = 0; i < 18; i += 1) addBox(detailGroup, `rooster-lamel-${i}`, [0.045, 0.19, 0.23], [-2.0 + i * 0.235, 1.42, 0.97], matGreenSide);
    addBox(detailGroup, 'greep-achterplaat', [0.12, 0.58, 0.08], [1.8, -0.05, 0.92], matTrim);
    addBox(detailGroup, 'greep', [0.065, 0.46, 0.16], [1.86, -0.05, 1.02], matGreenSide);
    addBox(detailGroup, 'vensterbank', [5.65, 0.18, 0.62], [0, -2.22, 0.42], matTrim);

    const floor = new THREE.Mesh(new THREE.PlaneGeometry(9, 6), matShadow);
    floor.rotation.x = -Math.PI / 2;
    floor.position.set(0, -2.52, 1.4);
    floor.receiveShadow = true;
    scene.add(floor);

    const hemi = new THREE.HemisphereLight(0xffffff, 0x6c7868, 1.65);
    scene.add(hemi);
    const key = new THREE.DirectionalLight(0xffffff, 2.1);
    key.position.set(-3.8, 5.2, 5.8);
    key.castShadow = true;
    key.shadow.mapSize.set(1024, 1024);
    scene.add(key);
    const rim = new THREE.DirectionalLight(0xd7f36b, 0.85);
    rim.position.set(4.4, 2.8, 3.2);
    scene.add(rim);

    const setOpacity = (group, opacity) => {
      group.traverse((object) => {
        if (!object.material) return;
        object.material.transparent = opacity < 0.999 || object.material.transparent;
        object.material.opacity = opacity;
        object.visible = opacity > 0.015;
      });
    };

    const resize = () => {
      const rect = stage.getBoundingClientRect();
      const width = Math.max(320, rect.width);
      const height = Math.max(320, rect.height);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height, false);
    };

    const applyProgress = (p) => {
      const ease = (x) => 1 - Math.pow(1 - Math.max(0, Math.min(1, x)), 3);
      const p1 = ease((p - 0.02) / 0.22);
      const p2 = ease((p - 0.20) / 0.24);
      const p3 = ease((p - 0.40) / 0.22);
      const p4 = ease((p - 0.58) / 0.24);
      setOpacity(wallGroup, 0.18 + 0.82 * p1);
      setOpacity(frameGroup, p2);
      setOpacity(trimGroup, p3);
      setOpacity(glassGroup, Math.max(0.18, p3));
      setOpacity(detailGroup, p4);
      wallGroup.position.z = -0.35 + 0.35 * p1;
      frameGroup.position.z = 1.25 - 1.0 * p2;
      trimGroup.position.z = 1.65 - 1.0 * p3;
      glassGroup.position.z = 2.0 - 1.05 * p3;
      detailGroup.position.z = 2.3 - 1.1 * p4;
      root.rotation.y = -0.28 + p * 0.42;
      root.rotation.x = -0.20 + p * 0.14;
      root.position.y = 0.18 - p * 0.06;
      root.scale.setScalar(0.86 + p * 0.08);
      camera.position.z = 9.0 - p * 1.1;
      camera.position.y = 0.86 - p * 0.24;
      camera.lookAt(0, 0, 0);
    };

    const render = () => renderer.render(scene, camera);
    real3DSceneController = { resize, applyProgress, render };
    resize();
    applyProgress(0);
    render();
    window.addEventListener('resize', () => { resize(); render(); });
    updateBlueprintScroll();
  } catch (error) {
    stage.classList.add('is-fallback');
    console.error('3D scene failed to load', error);
  }
}

function updateBlueprintScroll() {
  const section = document.querySelector('.blueprint-scroll');
  if (!section) return;
  const rect = section.getBoundingClientRect();
  const max = section.offsetHeight - window.innerHeight;
  const progress = Math.min(1, Math.max(0, -rect.top / Math.max(max, 1)));
  section.style.setProperty('--scroll-progress', progress.toFixed(3));
  section.classList.toggle('is-active', progress > 0.03);
  section.classList.toggle('step-1', progress > 0.10);
  section.classList.toggle('step-2', progress > 0.28);
  section.classList.toggle('step-3', progress > 0.48);
  section.classList.toggle('step-4', progress > 0.68);
  section.classList.toggle('motion-phase-1', progress >= 0.10 && progress < 0.30);
  section.classList.toggle('motion-phase-2', progress >= 0.30 && progress < 0.50);
  section.classList.toggle('motion-phase-3', progress >= 0.50 && progress < 0.70);
  section.classList.toggle('motion-phase-4', progress >= 0.70);
  if (real3DSceneController) {
    real3DSceneController.applyProgress(progress);
    real3DSceneController.render();
  }
}

injectBlueprintScroll();
window.addEventListener('scroll', updateBlueprintScroll, { passive: true });
window.addEventListener('resize', updateBlueprintScroll);
updateBlueprintScroll();

const form = document.querySelector('#renovationForm');
const steps = [...document.querySelectorAll('.step')];
const nextBtn = document.querySelector('#nextBtn');
const prevBtn = document.querySelector('#prevBtn');
const progressBar = document.querySelector('#progressBar');
const stepLabel = document.querySelector('#stepLabel');
const stepTitle = document.querySelector('#stepTitle');
const feedback = document.querySelector('#formFeedback');
const summaryPill = document.querySelector('#summaryPill');
const sumType = document.querySelector('#sumType');
const sumModel = document.querySelector('#sumModel');
const sumColor = document.querySelector('#sumColor');
const sumPrice = document.querySelector('#sumPrice');
const preview = document.querySelector('#windowPreview');
let currentStep = 1;
const labels = { type: { kozijn: 'Kozijn', deur: 'Deur', schuifpui: 'Schuifpui', meerdere: 'Meerdere' }, model: { vast: 'Vast glas', draaikiep: 'Draaikiep', 'twee-vaks': '2-vaks', paneel: 'Met paneel' }, color: { white: 'Helder wit', cream: 'Creme', anthracite: 'Antraciet', black: 'Zwart', wood: 'Houtlook' } };
const themes = { white: ['#f8f8f3','#ffffff','#ece7de','#d8d0c6'], cream: ['#e6d5ba','#f5ead8','#ddc8a6','#bca17f'], anthracite: ['#314740','#5f716d','#263a34','#1a2924'], black: ['#22201f','#4f4b49','#2a2827','#141312'], wood: ['#9a6338','#cb905f','#ad7348','#714321'] };
const stepTitles = ['Type','Indeling','Uitstraling','Comfort','Aanvraag'];
function state() { const data = new FormData(form); return { type: data.get('type') || 'kozijn', model: data.get('model') || 'vast', color: data.get('color') || 'white', vent: data.get('vent') === 'on', panel: data.get('panel') === 'on', montage: data.get('montage') === 'on', glass: data.get('glass') || 'hrpp' }; }
function op(id, value) { const el = document.querySelector(id); if (el) el.style.opacity = value; }
function setTheme(s) { if (!preview) return; const t = themes[s.color] || themes.white; preview.style.setProperty('--frame-color', t[0]); preview.style.setProperty('--frame-highlight', t[1]); preview.style.setProperty('--frame-soft', t[2]); preview.style.setProperty('--frame-shadow', t[3]); preview.dataset.type = s.type; preview.dataset.model = s.model; preview.dataset.glass = s.glass; }
function applyPreview() { if (!preview || !form) return; const s = state(); setTheme(s); const two = s.model === 'twee-vaks' || s.type === 'schuifpui' || s.type === 'meerdere'; const panel = s.panel || s.model === 'paneel' || s.type === 'deur'; const sash = s.model === 'draaikiep' || s.type === 'deur' || s.type === 'schuifpui'; op('#verticalDivider', two && s.type !== 'deur' ? '1' : '0'); op('#horizontalDivider', panel || s.type === 'deur' ? '1' : '0'); op('#ventGroup', s.vent ? '1' : '0'); op('#panelGroup', panel ? '1' : '0'); op('#sashLine', sash ? '.82' : '0'); op('#handle', sash ? '.96' : '0'); op('#handleBackplate', sash ? '.86' : '0'); op('#trackGroup', s.type === 'schuifpui' ? '.95' : '0'); op('#sashFrameRight', two && s.type !== 'deur' ? '1' : '0'); op('#glassGroupRight', two && s.type !== 'deur' ? '1' : '0'); if (summaryPill) summaryPill.textContent = `${labels.type[s.type]} - ${labels.model[s.model]}`; if (sumType) sumType.textContent = labels.type[s.type]; if (sumModel) sumModel.textContent = labels.model[s.model]; if (sumColor) sumColor.textContent = labels.color[s.color]; if (sumPrice) sumPrice.textContent = s.montage ? 'Incl. montagecheck' : 'Na controle'; }
function renderStep() { if (!progressBar || !stepLabel || !stepTitle || !prevBtn || !nextBtn || !feedback) return; steps.forEach(step => step.classList.toggle('active', Number(step.dataset.step) === currentStep)); progressBar.style.width = `${(currentStep / steps.length) * 100}%`; stepLabel.textContent = `Stap ${currentStep} van ${steps.length}`; stepTitle.textContent = stepTitles[currentStep - 1]; prevBtn.disabled = currentStep === 1; prevBtn.style.opacity = currentStep === 1 ? '.45' : '1'; nextBtn.textContent = currentStep === steps.length ? 'Aanvraag opslaan' : 'Volgende'; feedback.textContent = ''; }
if (nextBtn) nextBtn.addEventListener('click', () => { if (currentStep < steps.length) { currentStep += 1; renderStep(); applyPreview(); return; } localStorage.setItem('mkr_demo_lead', JSON.stringify({ created_at: new Date().toISOString(), configuration: state() }, null, 2)); feedback.textContent = 'Demo-aanvraag opgeslagen in je browser. Klaar voor koppeling met Supabase.'; });
if (prevBtn) prevBtn.addEventListener('click', () => { if (currentStep > 1) { currentStep -= 1; renderStep(); applyPreview(); } });
if (form) { form.addEventListener('input', applyPreview); form.addEventListener('change', applyPreview); }
renderStep();
applyPreview();