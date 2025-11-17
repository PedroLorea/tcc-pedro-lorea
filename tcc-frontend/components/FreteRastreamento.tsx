"use client";
import { MapContainer, TileLayer, Polyline, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// 🔹 Configurando o ícone padrão do Leaflet
const DefaultIcon = L.icon({
  iconUrl: new URL("leaflet/dist/images/marker-icon.png", import.meta.url).toString(),
  iconRetinaUrl: new URL("leaflet/dist/images/marker-icon-2x.png", import.meta.url).toString(),
  shadowUrl: new URL("leaflet/dist/images/marker-shadow.png", import.meta.url).toString(),
  iconSize: [20, 32],
  iconAnchor: [10, 32],
  popupAnchor: [0, -28],
  shadowSize: [32, 32], 
});

// Sobrescrevendo o ícone padrão
L.Marker.prototype.options.icon = DefaultIcon;

interface Posicao {
  label: string;
  coords: [number, number];
  timestamp: string;
}

interface Props {
  posicoes: Posicao[];
}

export default function FreteRastreamento({ posicoes }: Props) {
  if (!posicoes || posicoes.length === 0) return null;

  return (
    <div className="mt-6 flex flex-col lg:flex-row gap-6">
      {/* Lista de posições */}
      <div className="bg-white shadow-lg rounded-2xl border border-gray-200 p-6 w-full lg:w-1/3">
        <h3 className="text-xl font-semibold text-roglio-blue mb-2">Últimas Posições</h3>
        <ul className="list-disc list-inside text-gray-700 space-y-1">
          {posicoes.map((p, i) => (
            <li key={i}>{`${p.label} — ${p.timestamp}`}</li>
          ))}
        </ul>
      </div>

      {/* Mapa */}
      <div className="w-full lg:w-2/3 h-96 rounded-2xl overflow-hidden shadow-lg border border-gray-200">
        <MapContainer
          center={posicoes[0].coords}
          zoom={6}
          scrollWheelZoom={false}
          className="w-full h-full"
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution="&copy; OpenStreetMap contributors"
          />
          <Polyline positions={posicoes.map(p => p.coords)} color="blue" />
          {posicoes.map((p, i) => (
            <Marker key={i} position={p.coords}>
              <Popup>{`${p.label} — ${p.timestamp}`}</Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
    </div>
  );
}
