import React, { useEffect, useRef } from "react";
import MapView, { Callout, Marker } from "react-native-maps";
import { StyleSheet, Text, View, Dimensions } from "react-native";

import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import { useSelector } from "react-redux";
import { selectOrigin } from "../slices/navSlice";
import { useDispatch } from "react-redux";
import { selectDestination } from "../slices/navSlice";
import MapViewDirections from "react-native-maps-directions";
import { GOOGLE_MAPS_APIKEY } from "@env";

export default function Map() {
  const origin = useSelector(selectOrigin);
  const destination = useSelector(selectDestination);

  //have a reference to the map like a pointer
  const mapRef = useRef(null);
  const dispatch = useDispatch();
  useEffect(() => {
    if (!origin || !destination) return;
    //Zomm and fit to markers
    mapRef.current.fitToSuppliedMarkers(["origin", "destination"], {
      edgPadding: { top: 50, right: 50, bottom: 50, left: 50 },
    });
  });

  useEffect(() => {
    if (!origin || !destination) return;
    const getTravelTime = async () => {
      fetch(
        `https://maps.googleapis.com/maps/api/distancematrix/json
  ?destinations=${destination.description}
  &origins=${origin.description}
  &units=imperial  
  &key=${GOOGLE_MAPS_APIKEY}`
      )
        .then((res) => res.json())
        .then((data) => {
          console.log(data);
          dispatch(setTravelTimeInformation(data.tow[0].elements[0]));
        });
    };
    getTravelTime();
  }, [origin, destination, GOOGLE_MAPS_APIKEY]);

  return (
    <View style={{ flex: 1 }}>
      <MapView
        style={styles.map}
        initialRegion={{
          // latitude: origin.location.lat,
          // longitude: origin.location.lng,
          latitudeDelta: 0.005,
          longitudeDelta: 0.005,
        }}
      >
        {origin && destination && (
          <MapViewDirections
            origin={origin.description}
            destination={destination.description}
            apikey={GOOGLE_MAPS_APIKEY}
            strockWidth={3}
            strokeColor="black"
          />
        )}
        {/* {{origin?.location && ( */}
        {/* <Marker
          pinColor="black"
          draggable={true}
          coordinate={{ latitude: origin.location.lat,
          longitude: origin.location.lng,}}
        >
        title="Origin"
        description={origin.description}
        identifier="origin"
          <Callout>
            <Text>I'm here</Text>
          </Callout>
          )}
        </Marker>  */}

        {/* {{destination?.location && ( */}
        {/* <Marker
          pinColor="black"
          draggable={true}
          coordinate={{ latitude: destination.location.lat,
          longitude: destination.location.lng,}}
        >
        title="destination"
        description={destination.description}
        identifier="destination"
          <Callout>
            <Text>I'm here</Text>
          </Callout>
          )}
        </Marker>  */}
      </MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  map: {
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height / 2,
  },
});
