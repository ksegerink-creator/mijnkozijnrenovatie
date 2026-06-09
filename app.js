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
const frameOuter = document.querySelector('#frameOuter');
const frameInner = document.querySelector('#frameInner');
const frameShadow = document.querySelector('#frameShadow');
const glassBase = document.querySelector('#glassBase');
const glassClipRect = document.querySelector('#glassClipRect');
const glassGroupRight = document.querySelector('#glassGroupRight');
const glassRight = document.querySelector('#glassRight');
const verticalDivider = document.querySelector('#verticalDivider');
const horizontalDivider = document.querySelector('#horizontalDivider');
const ventGroup = document.querySelector('#ventGroup');
const panelGroup = document.querySelector('#panelGroup');
const sashLine = document.querySelector('#sashLine');
const handle = document.querySelector('#handle');
const handleBackplate = document.querySelector('#handleBackplate');
const trackGroup = document.querySelector('#trackGroup');
const sashLeftOuter = document.querySelector('#sashLeftOuter');
const sashLeftInner = document.querySelector('#sashLeftInner');
const sashFrameRight = document.querySelector('#sashFrameRight');
const sashRightOuter = document.querySelector('#sashRightOuter');
const sashRightInner = document.querySelector('#sashRightInner');
const tripleReflection1 = document.querySelector('#tripleReflection1');
const tripleReflection2 = document.querySelector('#tripleReflection2');

let currentStep = 1;

const labels = {
  type: { kozijn: 'Kozijn', deur: 'Deur', schuifpui: 'Schuifpui', meerdere: 'Meerdere' },
  model: { vast: 'Vast glas', draaikiep: 'Draaikiep', 'twee-vaks': '2-vaks', paneel: 'Met paneel' },
  color: { white: 'Helder wit', cream: 'Creme', anthracite: 'Antraciet', black: 'Zwart', wood: 'Houtlook' }
};

const frameThemes = {
  white: { color: '#f8f8f3', highlight: '#ffffff', soft: '#ece7de', shadow: '#d8d0c6' },
  cream: { color: '#e6d5ba', highlight: '#f5ead8', soft: '#ddc8a6', shadow: '#bca17f' },
  anthracite: { color: '#314740', highlight: '#5f716d', soft: '#263a34', shadow: '#1a2924' },
  black: { color: '#22201f', highlight: '#4f4b49', soft: '#2a2827', shadow: '#141312' },
  wood: { color: '#9a6338', highlight: '#cb905f', soft: '#ad7348', shadow: '#714321' }
};

const stepTitles = ['Type', 'Indeling', 'Uitstraling', 'Comfort', 'Aanvraag'];

function getFormState() {
  const data = new FormData(form);
  return {
    type: data.get('type') || 'kozijn',
    model: data.get('model') || 'vast',
    color: data.get('color') || 'white',
    vent: data.get('vent') === 'on',
    panel: data.get('panel') === 'on',
    montage: data.get('montage') === 'on',
    glass: data.get('glass') || 'hrpp',
    name: data.get('name') || '',
    phone: data.get('phone') || '',
    email: data.get('email') || '',
    city: data.get('city') || '',
    notes: data.get('notes') || ''
  };
}

function setRect(el, {x, y, width, height, rx}) {
  el.setAttribute('x', x);
  el.setAttribute('y', y);
  el.setAttribute('width', width);
  el.setAttribute('height', height);
  if (rx !== undefined) el.setAttribute('rx', rx);
}

function setPath(el, d) { el.setAttribute('d', d); }
function setOpacity(el, value) { el.style.opacity = value; }

function applyTheme(state) {
  const theme = frameThemes[state.color];
  preview.style.setProperty('--frame-color', theme.color);
  preview.style.setProperty('--frame-highlight', theme.highlight);
  preview.style.setProperty('--frame-soft', theme.soft);
  preview.style.setProperty('--frame-shadow', theme.shadow);
  preview.style.setProperty('--glass-fill', state.glass === 'triple' ? 'url(#glassGradientTriple)' : 'url(#glassGradient)');
  preview.dataset.color = state.color;
  glassBase.setAttribute('fill', state.glass === 'triple' ? 'url(#glassGradientTriple)' : 'url(#glassGradient)');
  glassRight.setAttribute('fill', state.glass === 'triple' ? 'url(#glassGradientTriple)' : 'url(#glassGradient)');
  tripleReflection1.style.opacity = state.glass === 'triple' ? '0.14' : '0';
  tripleReflection2.style.opacity = state.glass === 'triple' ? '0.12' : '0';
}

function baseVariant(type) {
  if (type === 'deur') {
    return {
      outer: { x: 228, y: 60, width: 304, height: 430, rx: 28 },
      inner: { x: 252, y: 84, width: 256, height: 382, rx: 20 },
      glass: { x: 278, y: 112, width: 204, height: 154, rx: 16 },
      rightGlass: { x: 278, y: 112, width: 204, height: 154, rx: 16 },
      vertical: { x: 356, y: 96, width: 16, height: 340, rx: 8 },
      horizontal: { x: 268, y: 280, width: 224, height: 16, rx: 8 },
      panel: { x: 278, y: 286, width: 204, height: 154, rx: 16 },
      vent: { x: 278, y: 112, width: 204, height: 26, rx: 8 },
      sashLine: 'M292 126 L430 252',
      handle: 'M458 220c0-8 6-14 14-14s14 6 14 14v92c0 8-6 14-14 14s-14-6-14-14v-92z',
      backplate: 'M452 196h40a8 8 0 0 1 8 8v128a8 8 0 0 1-8 8h-40a8 8 0 0 1-8-8v-128a8 8 0 0 1 8-8z',
      leftSashOuter: { x: 268, y: 104, width: 224, height: 170, rx: 16 },
      leftSashInner: { x: 284, y: 120, width: 192, height: 138, rx: 12 },
      rightSashOuter: { x: 268, y: 104, width: 224, height: 170, rx: 16 },
      rightSashInner: { x: 284, y: 120, width: 192, height: 138, rx: 12 },
      shadowTransform: 'translate(0 12)'
    };
  }

  if (type === 'schuifpui') {
    return {
      outer: { x: 118, y: 96, width: 524, height: 344, rx: 24 },
      inner: { x: 142, y: 120, width: 476, height: 296, rx: 18 },
      glass: { x: 176, y: 140, width: 178, height: 256, rx: 14 },
      rightGlass: { x: 406, y: 140, width: 178, height: 256, rx: 14 },
      vertical: { x: 372, y: 124, width: 18, height: 288, rx: 9 },
      horizontal: { x: 166, y: 284, width: 428, height: 16, rx: 8 },
      panel: { x: 176, y: 286, width: 178, height: 110, rx: 14 },
      vent: { x: 176, y: 140, width: 408, height: 26, rx: 8 },
      sashLine: 'M200 156 L328 380',
      handle: 'M514 214c0-7 5-12 12-12s12 5 12 12v64c0 7-5 12-12 12s-12-5-12-12v-64z',
      backplate: 'M508 194h36a8 8 0 0 1 8 8v88a8 8 0 0 1-8 8h-36a8 8 0 0 1-8-8v-88a8 8 0 0 1 8-8z',
      leftSashOuter: { x: 166, y: 130, width: 198, height: 276, rx: 16 },
      leftSashInner: { x: 182, y: 146, width: 166, height: 244, rx: 12 },
      rightSashOuter: { x: 396, y: 130, width: 198, height: 276, rx: 16 },
      rightSashInner: { x: 412, y: 146, width: 166, height: 244, rx: 12 },
      shadowTransform: 'translate(0 10)'
    };
  }

  return {
    outer: { x: 168, y: 78, width: 424, height: 372, rx: 28 },
    inner: { x: 192, y: 102, width: 376, height: 324, rx: 20 },
    glass: { x: 220, y: 122, width: 320, height: 280, rx: 16 },
    rightGlass: { x: 382, y: 122, width: 158, height: 280, rx: 16 },
    vertical: { x: 370, y: 106, width: 18, height: 312, rx: 9 },
    horizontal: { x: 210, y: 274, width: 340, height: 18, rx: 9 },
    panel: { x: 220, y: 288, width: 320, height: 114, rx: 16 },
    vent: { x: 220, y: 122, width: 320, height: 34, rx: 8 },
    sashLine: 'M226 138 L372 386',
    handle: 'M498 220c0-8 6-14 14-14s14 6 14 14v58c0 8-6 14-14 14s-14-6-14-14v-58z',
    backplate: 'M492 198h40a8 8 0 0 1 8 8v86a8 8 0 0 1-8 8h-40a8 8 0 0 1-8-8v-86a8 8 0 0 1 8-8z',
    leftSashOuter: { x: 210, y: 112, width: 340, height: 300, rx: 18 },
    leftSashInner: { x: 228, y: 130, width: 304, height: 264, rx: 12 },
    rightSashOuter: { x: 376, y: 112, width: 174, height: 300, rx: 18 },
    rightSashInner: { x: 394, y: 130, width: 138, height: 264, rx: 12 },
    shadowTransform: 'translate(0 12)'
  };
}

function applyGeometry(variant) {
  setRect(frameOuter, variant.outer);
  setRect(frameInner, variant.inner);
  setRect(frameShadow, { ...variant.outer, y: variant.outer.y + 8 });
  frameShadow.setAttribute('transform', variant.shadowTransform);
  setRect(glassBase, variant.glass);
  setRect(glassClipRect, variant.glass);
  setRect(glassRight, variant.rightGlass);
  setRect(verticalDivider, variant.vertical);
  setRect(horizontalDivider, variant.horizontal);
  setRect(ventGroup.querySelector('rect'), variant.vent);
  setRect(panelGroup.querySelector('rect'), variant.panel);
  setPath(sashLine, variant.sashLine);
  setPath(handle, variant.handle);
  setPath(handleBackplate, variant.backplate);
  setRect(sashLeftOuter, variant.leftSashOuter);
  setRect(sashLeftInner, variant.leftSashInner);
  setRect(sashRightOuter, variant.rightSashOuter);
  setRect(sashRightInner, variant.rightSashInner);
}

function applyPreview() {
  const state = getFormState();
  const variant = baseVariant(state.type);
  applyTheme(state);
  applyGeometry(variant);

  preview.dataset.type = state.type;
  preview.dataset.model = state.model;
  preview.dataset.glass = state.glass;

  const showTwoPanes = state.model === 'twee-vaks' || state.type === 'schuifpui' || state.type === 'meerdere';
  const showPanel = state.panel || state.model === 'paneel' || state.type === 'deur';
  const showSash = state.model === 'draaikiep' || state.type === 'deur' || state.type === 'schuifpui';
  const showHorizontal = state.type === 'deur' || state.model === 'paneel';
  const showTrack = state.type === 'schuifpui';
  const showRightSash = state.type === 'schuifpui' || showTwoPanes;

  setOpacity(verticalDivider, showTwoPanes && state.type !== 'deur' ? '1' : '0');
  setOpacity(horizontalDivider, showHorizontal ? '1' : '0');
  setOpacity(ventGroup, state.vent ? '1' : '0');
  setOpacity(panelGroup, showPanel ? '1' : '0');
  setOpacity(sashLine, showSash ? '.82' : '0');
  setOpacity(handle, showSash ? '.96' : '0');
  setOpacity(handleBackplate, showSash ? '.86' : '0');
  setOpacity(trackGroup, showTrack ? '.95' : '0');
  setOpacity(sashLeftOuter, showSash || showTwoPanes ? '.92' : '0');
  setOpacity(sashLeftInner, showSash || showTwoPanes ? '.7' : '0');
  setOpacity(sashFrameRight, showRightSash && state.type !== 'deur' ? '1' : '0');
  setOpacity(glassGroupRight, showTwoPanes && state.type !== 'deur' ? '1' : '0');

  const priceText = state.montage ? 'Incl. montagecheck' : 'Na controle';
  summaryPill.textContent = `${labels.type[state.type]} - ${labels.model[state.model]}`;
  sumType.textContent = labels.type[state.type];
  sumModel.textContent = labels.model[state.model];
  sumColor.textContent = labels.color[state.color];
  sumPrice.textContent = priceText;
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

function saveDemoLead() {
  const state = getFormState();
  const payload = { created_at: new Date().toISOString(), source: 'mijnkozijnrenovatie-prototype', configuration: state };
  localStorage.setItem('mkr_demo_lead', JSON.stringify(payload, null, 2));
  feedback.textContent = 'Demo-aanvraag opgeslagen in je browser. Klaar voor koppeling met Supabase.';
  console.log('Demo lead payload:', payload);
}

nextBtn.addEventListener('click', () => {
  if (currentStep < steps.length) {
    currentStep += 1;
    renderStep();
    applyPreview();
    return;
  }
  saveDemoLead();
});

prevBtn.addEventListener('click', () => {
  if (currentStep > 1) {
    currentStep -= 1;
    renderStep();
    applyPreview();
  }
});

form.addEventListener('input', applyPreview);
form.addEventListener('change', applyPreview);
renderStep();
applyPreview();