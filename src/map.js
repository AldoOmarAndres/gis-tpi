import Map from '../node_modules/ol/Map.js';
import OSM from '../node_modules/ol/source/OSM.js';
import TileLayer from '../node_modules/ol/layer/Tile.js';
import View from '../node_modules/ol/View.js';
import TileWMS from '../node_modules/ol/source/TileWMS.js';

// URL del servicio WMS en QGIS Server
const URL = "http://192.168.100.30/cgi-bin/qgis_mapserv.fcgi?map=/var/www/html/TPI-g4.qgs"

// Crear la capa WMS
const wmsLayer = new TileLayer({
  source: new TileWMS({
    url: URL,
    params: {
      'LAYERS': 'provincia',
      'TILED': true,
      'VERSION': '1.3.0',
      'FORMAT': 'image/png'
    },
    serverType: 'qgis'
  })
});


const map = new Map({
  target: 'map',
  layers: [
    wmsLayer,
    /* new TileLayer({
      source: new OSM() // Agrega una capa base de OpenStreetMap
    }), */
  ],
  view: new View({
    center: [0, 0],
    zoom: 10 
  })
});

document.getElementById('zoom-out').onclick = function () {
  const view = map.getView();
  const zoom = view.getZoom();
  view.setZoom(zoom - 1);
};

document.getElementById('zoom-in').onclick = function () {
  const view = map.getView();
  const zoom = view.getZoom();
  view.setZoom(zoom + 1);
};