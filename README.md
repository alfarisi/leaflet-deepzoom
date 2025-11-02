# Leaflet-DeepZoom

[![npm version](https://img.shields.io/npm/v/leaflet-deepzoom.svg)](https://www.npmjs.com/package/leaflet-deepzoom)
[![license: MIT](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

Display DeepZoom (DZI) image tiles with [Leaflet](https://leafletjs.com/).  
Originally based on **Leaflet.Zoomify**.

---

## 🚀 Features
- Simple integration of DeepZoom (DZI) image tiles into Leaflet maps.
- Works with any DeepZoom-compatible tile source.
- Supports panning, zooming, and full Leaflet controls.
- Zero dependencies beyond Leaflet itself.

---

## 📦 Installation

Using npm:
```bash
npm install leaflet-deepzoom
```

Using CDN (for quick demo or CodePen):
```html
<script src="https://unpkg.com/leaflet-deepzoom@latest/leaflet-deepzoom.js"></script>
```

---

## 🗺️ Example

Live demo:
👉 [https://alfarisi.github.io/leaflet-deepzoom/example/](https://alfarisi.github.io/leaflet-deepzoom/example/)

Basic example:
```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <title>Leaflet DeepZoom Example</title>
  <link
    rel="stylesheet"
    href="https://unpkg.com/leaflet@1.7.1/dist/leaflet.css"
  />
  <style>
    #map { height: 100vh; }
  </style>
</head>
<body>
  <div id="map"></div>

  <script src="https://unpkg.com/leaflet@1.7.1/dist/leaflet.js"></script>
  <script src="https://unpkg.com/leaflet-deepzoom@latest/leaflet-deepzoom.js"></script>
  <script>
    const map = L.map('map').setView([0, 0], 0);

    var dzLayer = L.tileLayer.deepzoom('DeepZoomImage/hubble_files/', {
      width: 2400,
      height: 3000,
      overlap: 1
    }).addTo(map);

    map.fitBounds(dzLayer.options.bounds);
  </script>
</body>
</html>
```

---

## ⚙️ Compatibility

| Leaflet Version | Plugin Version |
|------------------|----------------|
| 1.2.0 and later | 2.x |
| 0.7.x | 1.x (legacy) |

---

## 📄 License
Released under the [MIT License](LICENSE.txt).

---

## 🧩 Links
- **NPM:** [https://www.npmjs.com/package/leaflet-deepzoom](https://www.npmjs.com/package/leaflet-deepzoom)
- **GitHub Repo:** [https://github.com/alfarisi/leaflet-deepzoom](https://github.com/alfarisi/leaflet-deepzoom)