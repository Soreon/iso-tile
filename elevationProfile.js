/* eslint-disable no-underscore-dangle */
import * as watchUtils from 'https://js.arcgis.com/4.23/@arcgis/core/core/watchUtils.js';
import Expand from 'https://js.arcgis.com/4.23/@arcgis/core/widgets/Expand.js';
import ElevationProfile from 'https://js.arcgis.com/4.23/@arcgis/core/widgets/ElevationProfile.js';

export default function addElevationProfile() {
  const elevationProfile = new ElevationProfile({
    view: window.sanefSIG.sceneview,
    profiles: [
      { type: 'ground' },
      // { type: 'view' },
    ],
    visibleElements: {
      selectButton: false,
    },
  });

  window.sanefSIG.widgets.elevationProfile = elevationProfile;
  const expand = new Expand({
    content: elevationProfile,
    expandIconClass: 'esri-icon-polyline',
    expandTooltip: 'Profil d\'élévation',
  });

  watchUtils.watch(elevationProfile, 'visible', (v) => {
    elevationProfile._settingsButton._buttonElement.style.display = 'none';
  });

  window.sanefSIG.defaultUI.add(expand, 'top-left');

  watchUtils.watch(expand, 'expanded', (val) => {
    if (!val) {
      elevationProfile.viewModel.clear();
      document.body.classList.remove('elevation-mode');
    } else {
      document.body.classList.add('elevation-mode');
    }
  });

  watchUtils.whenTrue(expand, 'expanded', (val) => {
    document.body.dispatchEvent(new CustomEvent('expand-opened', { detail: expand.id }));
  });

  document.body.addEventListener('expand-opened', ({ detail }) => {
    if (detail !== expand.id || !document.body.classList.contains('elevation-mode')) expand.expanded = false;
  });
  return expand;
}
