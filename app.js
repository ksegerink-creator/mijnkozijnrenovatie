function injectBlueprintScroll() {
  if (!document.querySelector('link[href="scroll.css"]')) {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'scroll.css';
    document.head.appendChild(link);
  }
  if (!document.querySelector('link[href="frame-build.css"]')) {
    const frameLink = document.createElement('link');
    frameLink.rel = 'stylesheet';
    frameLink.href = 'frame-build.css';
    document.head.appendChild(frameLink);
  }

  const hero = document.querySelector('.hero');
  if (!hero || document.querySelector('.blueprint-scroll')) return;

  const section = document.createElement('section');
  section.className = 'blueprint-scroll frame-build-mode';
  section.innerHTML = `
    <div class="blueprint-sticky">
      <div class="blueprint-inner">
        <div class="blueprint-orbit"></div>
        <div class="blueprint-meta"><span>RENOVATION SYSTEM</span><span>SCROLL // FRAME BUILD SEQUENCE</span></div>
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
        <div class="blueprint-label label-profile">Renovatieprofiel</div>
        <div class="blueprint-label label-glass">HR++ / triple glas</div>
        <div class="blueprint-label label-vent">Ventilatie & comfort</div>
        <div class="blueprint-label label-mount">Inmeten & montage</div>
        <h2 class="blueprint-title">Frame voor frame opgebouwd tot renovatieplan.</h2>
      </div>
    </div>`;
  hero.insertAdjacentElement('afterend', section);
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

const labels = {
  type: { kozijn: 'Kozijn', deur: 'Deur', schuifpui: 'Schuifpui', meerdere: 'Meerdere' },
  model: { vast: 'Vast glas', draaikiep: 'Draaikiep', 'twee-vaks': '2-vaks', paneel: 'Met paneel' },
  color: { white: 'Helder wit', cream: 'Creme', anthracite: 'Antraciet', black: 'Zwart', wood: 'Houtlook' }
};
const themes = {
  white: ['#f8f8f3','#ffffff','#ece7de','#d8d0c6'],
  cream: ['#e6d5ba','#f5ead8','#ddc8a6','#bca17f'],
  anthracite: ['#314740','#5f716d','#263a34','#1a2924'],
  black: ['#22201f','#4f4b49','#2a2827','#141312'],
  wood: ['#9a6338','#cb905f','#ad7348','#714321']
};
const stepTitles = ['Type','Indeling','Uitstraling','Comfort','Aanvraag'];

function state() {
  const data = new FormData(form);
  return {
    type: data.get('type') || 'kozijn',
    model: data.get('model') || 'vast',
    color: data.get('color') || 'white',
    vent: data.get('vent') === 'on',
    panel: data.get('panel') === 'on',
    montage: data.get('montage') === 'on',
    glass: data.get('glass') || 'hrpp'
  };
}
function op(id, value) { const el = document.querySelector(id); if (el) el.style.opacity = value; }
function setTheme(s) {
  const t = themes[s.color] || themes.white;
  preview.style.setProperty('--frame-color', t[0]);
  preview.style.setProperty('--frame-highlight', t[1]);
  preview.style.setProperty('--frame-soft', t[2]);
  preview.style.setProperty('--frame-shadow', t[3]);
  preview.dataset.type = s.type;
  preview.dataset.model = s.model;
  preview.dataset.glass = s.glass;
}
function applyPreview() {
  if (!preview) return;
  const s = state();
  setTheme(s);
  const two = s.model === 'twee-vaks' || s.type === 'schuifpui' || s.type === 'meerdere';
  const panel = s.panel || s.model === 'paneel' || s.type === 'deur';
  const sash = s.model === 'draaikiep' || s.type === 'deur' || s.type === 'schuifpui';
  op('#verticalDivider', two && s.type !== 'deur' ? '1' : '0');
  op('#horizontalDivider', panel || s.type === 'deur' ? '1' : '0');
  op('#ventGroup', s.vent ? '1' : '0');
  op('#panelGroup', panel ? '1' : '0');
  op('#sashLine', sash ? '.82' : '0');
  op('#handle', sash ? '.96' : '0');
  op('#handleBackplate', sash ? '.86' : '0');
  op('#trackGroup', s.type === 'schuifpui' ? '.95' : '0');
  op('#sashFrameRight', two && s.type !== 'deur' ? '1' : '0');
  op('#glassGroupRight', two && s.type !== 'deur' ? '1' : '0');
  summaryPill.textContent = `${labels.type[s.type]} - ${labels.model[s.model]}`;
  sumType.textContent = labels.type[s.type];
  sumModel.textContent = labels.model[s.model];
  sumColor.textContent = labels.color[s.color];
  sumPrice.textContent = s.montage ? 'Incl. montagecheck' : 'Na controle';
}
function renderStep() {
  steps.forEach(step => step.classList.toggle('active', Number(step.dataset.step) === currentStep));
  progressBar.style.width = `${(currentStep / steps.length) * 100}%`;
  stepLabel.textContent = `Stap ${currentStep} van ${steps.length}`;
  stepTitle.textContent = stepTitles[currentStep - 1];
  prevBtn.disabled = currentStep === 1;
  prevBtn.style.opacity = currentStep === 1 ? '.45' : '1';
  nextBtn.textContent = currentStep === steps.length ? 'Aanvraag opslaan' : 'Volgende';
  feedback.textContent = '';
}
nextBtn.addEventListener('click', () => {
  if (currentStep < steps.length) {
    currentStep += 1;
    renderStep();
    applyPreview();
    return;
  }
  localStorage.setItem('mkr_demo_lead', JSON.stringify({ created_at: new Date().toISOString(), configuration: state() }, null, 2));
  feedback.textContent = 'Demo-aanvraag opgeslagen in je browser. Klaar voor koppeling met Supabase.';
});
prevBtn.addEventListener('click', () => { if (currentStep > 1) { currentStep -= 1; renderStep(); applyPreview(); } });
form.addEventListener('input', applyPreview);
form.addEventListener('change', applyPreview);
renderStep();
applyPreview();
