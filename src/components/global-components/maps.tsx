"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useFormStatus } from "react-dom";
import { Eye, EyeOff, LucideIcon } from "lucide-react";
import { ControllerRenderProps } from "react-hook-form";

import { useRef, useState, ElementType, forwardRef } from "react";
import {
  useJsApiLoader,
  GoogleMap,
  Marker,
  Autocomplete,
  DirectionsRenderer,
} from "@react-google-maps/api";

// import { useEventListener } from "usehooks-ts";
import { useEvent } from "react-use";

import {
  ArrowLeftToLine,
  ArrowRightToLine,
  Navigation,
  Search,
  X,
} from "lucide-react";

import { cn } from "@/lib/utils";
import ImprovedLoadingPage from "@/app/loading";

const center = { lat: 10.845453, lng: 106.836512 };

interface FormInputProps {
  type?: string;
  disabled?: boolean;
  placeholder?: string;
  id: string;
  required?: boolean;
  className?: string;
  icon?: ElementType;
  error?: Record<string, string[]> | undefined;
  searchIcon?: React.ReactNode;
  defaultValue?: string;
  label?: string;
  labelClassName?: string;
  iconClassName?: string;
  typeInputPassword?: string;
  onToggle?: (e: React.MouseEvent<SVGElement>) => void;
  field?: ControllerRenderProps<any, any>;
}

const Maps = ({ className }: { className?: string }) => {
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY as string,
    libraries: ["places"],
  });

  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [directionResponse, setDirectionResponse] =
    useState<google.maps.DirectionsResult | null>(null);
  const [distance, setDistance] = useState("");
  const [duration, setDuration] = useState("");
  const [isSearchPlace, setIsSearchPlace] = useState<boolean>(true);

  const originRef = useRef<HTMLInputElement | null>(null);
  const destinationRef = useRef<HTMLInputElement | null>(null);
  const searchRef = useRef<HTMLDivElement | null>(null);

  const calculate = async () => {
    if (
      originRef.current?.value === "" ||
      destinationRef.current?.value === ""

      // !originRef.current ||
      // !destinationRef.current ||
      // !originRef.current.value ||
      // !destinationRef.current.value
    ) {
      return;
    }

    const originValue = originRef.current?.value as string;
    const destinationValue = destinationRef.current?.value as string;

    if (!originRef || !destinationRef) {
      return;
    }

    const directionService = new google.maps.DirectionsService();
    const result = await directionService.route({
      origin: originValue,
      destination: destinationValue,
      travelMode: google.maps.TravelMode.DRIVING,
      // polylineOption: {}
      // polylineOptions: {
      //   strokeColor: "red", // Change the color to your desired color
      // },
    });

    setDirectionResponse(result);
    // Check if routes and legs are defined before accessing them
    if (result.routes && result.routes.length > 0) {
      const route = result.routes[0];
      if (route.legs && route.legs.length > 0) {
        const leg = route.legs[0];
        if (leg.distance) {
          setDistance(leg.distance.text || "N/A");
        }
        if (leg.duration) {
          setDuration(leg.duration.text || "N/A");
        }
      }
    }
  };

  const clearValue = () => {
    setDirectionResponse(null);
    setDistance("");
    setDuration("");
    if (originRef.current) {
      originRef.current.value = "";
      originRef.current.focus();
    }

    if (destinationRef.current) {
      destinationRef.current.value = "";
    }
  };

  const conditionStyleSearch = distance && duration && "text-primary scale:110";

  const onLoad = (autocomplete: any) => {
    autocomplete.setOptions({
      types: ["geocode"],
      componentRestrictions: { country: "VN" }, // the region country
    });

    // Add event listeners to the Autocomplete instance
    autocomplete.addListener("place_changed", () => {
      const place = autocomplete.getPlace();
      if (!place.geometry) {
        console.log("Place details not found.");
        return;
      }

      const name = place.name;
      const address = place.formatted_address;
      const lat = place.geometry.location.lat();
      const lng = place.geometry.location.lng();

      // console.log("Name: " + name);
      // console.log("Address: " + address);
      // console.log("Latitude: " + lat);
      // console.log("Longitude: " + lng);

      // Do something with the selected place data, e.g., update state
      // For example, if you want to update a state variable with the selected place:
      // setSelectedPlace({ name, address, lat, lng });
    });
  };

  const onKeydown = (e: KeyboardEvent) => {
    // console.log(e.key);
    if (e.key === "Enter") {
      calculate();
    }
  };

  // useEventListener("keydown", onKeydown);
  useEvent("keydown", onKeydown);

  if (!isLoaded) {
    return <ImprovedLoadingPage />;
  }

  return (
    <div className="">
      <div className="flex flex-row items-center justify-center w-full relative">
        {!isSearchPlace && (
          <ArrowRightToLine
            className="size-8 text-primary cursor-pointer duration-300 z-10 absolute top-4 left-3
              hover:scale-110 rounded-full p-1 hover:p-0 bg-secondary"
            onClick={() => setIsSearchPlace(true)}
          />
        )}
        {isSearchPlace && (
          <div
            className={`w-full flex items-center justify-center relative transition-all duration-300
            ease-in-out `}
          >
            <ArrowRightToLine
              className="size-8 text-primary cursor-pointer duration-300 absolute top-0 left-1
                hover:scale-110 rounded-full p-1 hover:p-0 bg-red-500"
              // onClick={() => setIsSearchPlace(!isSearchPlace)}
            />
            <div
              className="flex flex-col gap-2 p-2 bg-card rounded-xl absolute left-4 top-4 z-10
                min-w-[780px]"
            >
              {isSearchPlace && (
                <ArrowLeftToLine
                  onClick={() => setIsSearchPlace(!isSearchPlace)}
                  className="size-8 text-primary cursor-pointer duration-300 absolute top-0 left-1
                    hover:scale-110 rounded-full p-1 hover:p-0 bg-secondary"
                />
              )}
              <div className="p-3 flex flex-row gap-2 items-center justify-center w-full">
                <Autocomplete>
                  <FormInput
                    ref={originRef}
                    type="text"
                    placeholder="Departure point"
                    id="destination"
                    className="h-10 pl-2 py-1 w-80 rounded-xl outline-none duration-200"
                  />
                </Autocomplete>

                <Autocomplete onLoad={onLoad}>
                  <FormInput
                    ref={destinationRef}
                    type="text"
                    placeholder="Destination"
                    id="destination"
                    className="h-10 pl-2 py-1 rounded-xl w-80 outline-none duration-200"
                  />
                </Autocomplete>
                <div
                  onClick={calculate}
                  ref={searchRef}
                  className="p-2 rounded-full cursor-pointer bg-secondary hover:bg-secondaryForeground
                    hover:scale-105 transition duration-200"
                >
                  <Search
                    size={24}
                    className={`${conditionStyleSearch} text-primary font-semibold`}
                  />
                </div>

                {duration && distance && (
                  <div
                    onClick={clearValue}
                    className="cursor-pointer bg-secondary hover:bg-secondaryForeground p-2 hover:scale-105
                      rounded-full duration-200"
                  >
                    <X
                      size={24}
                      className={`${conditionStyleSearch} text-primary font-semibold`}
                    />
                  </div>
                )}
              </div>

              <div className="flex flex-row items-center justify-between flex-1 p-3">
                <div className="text-primary font-semibold">
                  {distance && (
                    <>
                      <span>Distance:</span>{" "}
                      <span className="text-primary">{distance}</span>
                    </>
                  )}
                </div>

                <div className="text-primary font-semibold">
                  {duration && (
                    <>
                      <span>Estimate: </span>
                      <span className="text-primary">{duration}</span>
                    </>
                  )}
                </div>

                <div
                  onClick={() => map?.panTo(center)}
                  className="rounded-full p-2 bg-secondary hover:bg-secondaryForeground hover:scale-105
                    cursor-pointer transition duration-200 group/navigation"
                >
                  <Navigation
                    size={20}
                    className="group-hover/navigation:-translate-y-1 group-hover/navigation:translate-x-1
                      transform duration-300 text-primary"
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className={cn("absolute h-full inset-0 w-full ", className)}>
        {/* <div className="h-full w-full absolute"> */}
        <GoogleMap
          center={center}
          zoom={15}
          mapContainerStyle={{
            width: "100%",
            height: "100%",
            borderRadius: "20px",
          }}
          options={{
            fullscreenControl: false,
            streetViewControl: false,
            zoomControl: false,
            mapTypeControl: false,
          }}
          onLoad={(map) => setMap(map)}
        >
          <Marker position={center} />
          {directionResponse && (
            <DirectionsRenderer directions={directionResponse} />
          )}
          {/* display maker or direction */}
        </GoogleMap>
        {/* </div> */}
      </div>
    </div>
  );
};

export default Maps;

export const FormInput = forwardRef<HTMLInputElement, FormInputProps>(
  (
    {
      type,
      disabled,
      placeholder,
      id,
      required,
      className,
      searchIcon,
      error,
      icon: Icon,
      defaultValue = "",
      label,
      labelClassName,
      iconClassName,
      typeInputPassword,
      onToggle,
      field,
    },
    ref
  ) => {
    const { pending } = useFormStatus();

    return (
      <div className="space-y-2">
        <div className="space-y-1">
          {label ? (
            <Label
              className={cn(
                "text-lg font-semibold text-neutral-200",
                labelClassName
              )}
              htmlFor={id}
            >
              {label}
            </Label>
          ) : null}
          {Icon ? (
            <div className="relative">
              <div
                className={cn(
                  "absolute inset-y-0 left-0 flex items-center pl-2",
                  iconClassName
                )}
              >
                <Icon />
              </div>
              <Input
                ref={ref}
                type={type}
                required={required}
                disabled={disabled || pending}
                placeholder={placeholder}
                id={id}
                name={id}
                defaultValue={defaultValue}
                className={cn("h-7 w-full py-1 pl-8 text-sm", className)}
                aria-describedby={`${id}-error`}
                // style={{ paddingLeft: <Icon /> ? "2.5rem" : "1rem" }}
              />
            </div>
          ) : searchIcon ? (
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-2">
                {searchIcon}
              </div>
              <Input
                ref={ref}
                type={type}
                required={required}
                disabled={disabled || pending}
                placeholder={placeholder}
                id={id}
                name={id}
                defaultValue={defaultValue}
                className={cn("h-7 w-full py-1 pl-8 text-sm", className)}
                aria-describedby={`${id}-error`}
                style={{ paddingLeft: searchIcon ? "3rem" : "1rem" }}
              />
            </div>
          ) : typeInputPassword ? (
            <div className="relative">
              <div
                className={cn(
                  "absolute inset-y-0 right-0 flex cursor-pointer items-center pr-4",
                  iconClassName
                )}
                onClick={(e) => {
                  e.stopPropagation();
                }}
              >
                {typeInputPassword === "password" ? (
                  <EyeOff
                    className="size-6 cursor-pointer"
                    // onClick={(e) => {
                    //   e.stopPropagation();
                    //   onToggle?.();
                    // }}
                    onClick={(e) => onToggle?.(e)}
                  />
                ) : (
                  <Eye
                    className="size-6 cursor-pointer"
                    onClick={(e) => onToggle?.(e)}
                  />
                )}
              </div>
              <Input
                ref={ref}
                type={typeInputPassword}
                required={required}
                disabled={disabled || pending}
                placeholder={placeholder}
                {...field}
                id={id}
                name={id}
                defaultValue={defaultValue}
                className={cn("h-7 w-full py-1 text-sm", className)}
                aria-describedby={`${id}-error`}
                // style={{ paddingLeft: "2.5rem" }}
                // style={{ paddingLeft: <Icon /> ? "2.5rem" : "1rem" }}
              />
            </div>
          ) : (
            <Input
              ref={ref}
              type={type}
              required={required}
              disabled={disabled || pending}
              placeholder={placeholder}
              id={id}
              name={id}
              defaultValue={defaultValue}
              className={cn("h-7 w-full py-1 pl-4 text-sm", className)}
              aria-describedby={`${id}-error`}
            />
          )}
        </div>
      </div>
    );
  }
);

FormInput.displayName = "FormInput";
