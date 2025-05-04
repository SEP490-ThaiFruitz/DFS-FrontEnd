import React, { useEffect, useRef, useState } from "react";
import { Input } from "@/components/ui/input";
import {
  GoogleMap,
  LoadScript,
  Marker,
  StandaloneSearchBox,
} from "@react-google-maps/api";
import { MapPin } from "lucide-react";

type CustomMapProps = {
  onLocationChange?: (position: { lat: number; lng: number }) => void;
  defaultLocation?: { lat: number; lng: number };
};

function CustomMap({
  onLocationChange,
  defaultLocation,
}: Readonly<CustomMapProps>) {
  const mapRef = useRef<google.maps.Map | null>(null);
  const searchBoxRef = useRef<google.maps.places.SearchBox | null>(null);

  const [currentPosition, setCurrentPosition] = useState<{
    lat: number;
    lng: number;
  }>();
  useEffect(() => {
    if (defaultLocation) {
      setCurrentPosition(defaultLocation);
      if (mapRef.current) {
        mapRef.current.panTo(defaultLocation);
      }
    }
  }, [defaultLocation]);

  const [searchBoxInput, setSearchBoxInput] = useState<HTMLInputElement | null>(
    null
  );

  const handleGetLocation = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const pos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          onLocationChange?.(pos);
          setCurrentPosition(pos);
          if (mapRef.current) {
            mapRef.current.panTo(pos);
          }
        },
        (error) => {
          console.error("Error getting location: ", error);
        }
      );
    } else {
      alert("Trình duyệt của bạn không hỗ trợ định vị.");
    }
  };

  const handlePlaceChanged = () => {
    const places = searchBoxRef.current?.getPlaces();
    if (places && places.length > 0) {
      const location = places[0].geometry?.location;
      if (location) {
        const lat = location.lat();
        const lng = location.lng();
        setCurrentPosition({ lat, lng });
        mapRef.current?.panTo({ lat, lng });
        onLocationChange?.({ lat, lng });
      }
    }
  };

  const handleMapClick = (e: google.maps.MapMouseEvent) => {
    if (e.latLng) {
      const lat = e.latLng.lat();
      const lng = e.latLng.lng();
      setCurrentPosition({ lat, lng });
      onLocationChange?.({ lat, lng });
    }
  };

  return (
    <div className="relative h-[500px] w-full motion-preset-shake">
      <LoadScript
        libraries={["places"]}
        googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY as string}
      >
        <div className="absolute top-4 left-4 z-10 w-80">
          <StandaloneSearchBox
            onLoad={(ref) => (searchBoxRef.current = ref)}
            onPlacesChanged={handlePlaceChanged}
          >
            <Input
              placeholder="Tìm địa điểm..."
              ref={(ref) => setSearchBoxInput(ref)}
              className="w-full"
            />
          </StandaloneSearchBox>
        </div>
        <GoogleMap
          mapContainerStyle={{ width: "100%", height: "100%" }}
          center={
            currentPosition?.lat !== 0 && currentPosition?.lng !== 0
              ? currentPosition
              : { lat: 10.8231, lng: 106.6297 }
          }
          zoom={12}
          onLoad={(map) => {
            mapRef.current = map;
          }}
          onClick={handleMapClick}
        >
          {currentPosition && <Marker position={currentPosition} />}
        </GoogleMap>
        <button
          onClick={handleGetLocation}
          className="absolute flex items-center gap-2 bottom-4 left-4 bg-white text-gray-700 px-4 py-2 font-semibold rounded-md shadow-md z-10 hover:bg-gray-100 transition"
        >
          <MapPin size={18} />
          Vị trí của bạn
        </button>
      </LoadScript>
    </div>
  );
}

export default CustomMap;
