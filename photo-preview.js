(() => {
  function ensurePhotoPreview() {
    const scene = document.querySelector('.preview-stage .window-scene');
    if (!scene || document.querySelector('.photo-preview')) return;

    const preview = document.createElement('div');
    preview.className = 'photo-preview';
    preview.innerHTML = `
      <div class="photo-opening">
        <div class="photo-reveal"></div>
        <div class="photo-sill"></div>
        <div class="photo-product">
          <div class="photo-frame"></div>
          <div class="photo-glass pg1"></div>
          <div class="photo-glass pg2"></div>
          <div class="photo-glass pg3"></div>
          <div class="photo-glass pg4"></div>
          <div class="photo-panel"></div>
          <div class="photo-mullion-v"></div>
          <div class="photo-mullion-h"></div>
          <div class="photo-rubber"></div>
          <div class="photo-vent"></div>
          <div class="photo-rail"></div>
          <div class="photo-handle"></div>
        </div>
        <div class="photo-label">Kozijn</div>
      </div>`;
    scene.appendChild(preview);
    syncPhotoPreview();
  }

  function syncPhotoPreview() {
    const form = document.querySelector('#renovationForm');
    const photo = document.querySelector('.photo-preview');
    if (!form || !photo) return;
    const data = new FormData(form);
    const type = data.get('type') || 'kozijn';
    const model = data.get('model') || 'vast';
    const color = data.get('color') || 'white';
    const vent = data.get('vent') === 'on';
    photo.dataset.type = type;
    photo.dataset.model = model;
    photo.dataset.color = color;
    photo.dataset.vent = String(vent);
    const label = photo.querySelector('.photo-label');
    if (label) label.textContent = ({ kozijn: 'Kozijn', deur: 'Deur', schuifpui: 'Schuifpui', meerdere: 'Meerdere delen' })[type] || 'Kozijn';
  }

  function boot() {
    ensurePhotoPreview();
    const form = document.querySelector('#renovationForm');
    if (form) {
      form.addEventListener('input', syncPhotoPreview);
      form.addEventListener('change', syncPhotoPreview);
    }
    const observer = new MutationObserver(() => {
      ensurePhotoPreview();
      syncPhotoPreview();
    });
    observer.observe(document.body, { childList: true, subtree: true });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})();
