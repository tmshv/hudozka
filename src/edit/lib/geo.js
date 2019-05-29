import Leaflet from 'leaflet'

export function getBoundsOf(feature) {
    return Leaflet
        .geoJSON(feature)
        .getBounds()
}