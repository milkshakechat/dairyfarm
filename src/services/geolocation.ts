import { getGeoPlacesSecret } from "@/utils/secrets";
import {
  FirestoreCollection,
  GeoInfo,
  GoogleMapsPlaceID,
} from "@milkshakechat/helpers";
import axios from "axios";
import { GeoFireX, firestore } from "./firebase";
import {
  createFirestoreDoc,
  updateFirestoreDoc,
  FirestoreDocument,
} from "./firestore";
import { get } from "geofirex";

export async function getPlaceDetails(
  placeID: GoogleMapsPlaceID
): Promise<GeoInfo> {
  const apiKey = await getGeoPlacesSecret();
  const response = await axios.get(
    "https://maps.googleapis.com/maps/api/place/details/json",
    {
      params: {
        place_id: placeID,
        key: apiKey,
      },
    }
  );

  if (response.data.status === "OK") {
    const result = response.data.result;
    const title: string = result.formatted_address;
    const lat: number = result.geometry.location.lat;
    const lng: number = result.geometry.location.lng;
    const geoInfo = {
      title,
      lat,
      lng,
      placeID,
    };
    return geoInfo;
  } else {
    throw new Error(`Failed to get place details: ${response.data.status}`);
  }
}

export const updateGeoField = async <
  SchemaID extends string,
  SchemaType extends FirestoreDocument
>({
  id,
  placeID,
  collection,
}: {
  id: SchemaID;
  placeID: GoogleMapsPlaceID;
  collection: FirestoreCollection;
}) => {
  const geoInfo = await getPlaceDetails(placeID);
  console.log(`geoInfo`, geoInfo);
  const payload = {
    geoInfo,
    geoFireX: GeoFireX.point(geoInfo.lat, geoInfo.lng),
  };

  const updatedUser = await updateFirestoreDoc<SchemaID, SchemaType>({
    id,
    // @ts-ignore
    payload,
    collection,
  });
  return updatedUser;
};

export const createGeoFields = async (placeID: GoogleMapsPlaceID) => {
  const geoInfo = await getPlaceDetails(placeID);
  console.log(`geoInfo`, geoInfo);
  const payload = {
    geoInfo,
    geoFireX: GeoFireX.point(geoInfo.lat, geoInfo.lng),
  };
  return payload;
};

export const testGeoFirestore = async () => {
  console.log("GeoFireX...");
  // const position = GeoFireX.point(40, -119);
  // console.log(position);
  // await createFirestoreDoc({
  //   id: "test",
  //   data: {
  //     id: "test",
  //     title: "yooo",
  //     position,
  //   },
  //   collection: "restaurants" as FirestoreCollection,
  // });
  const collection = firestore
    .collection(FirestoreCollection.STORIES)
    .where("allowSwipe", "==", true);
  const target = GeoFireX.point(34.0522342, -118.2436849);
  const radius = 20; // 20km

  const query = GeoFireX.query(collection).within(target, radius, "geoFireX");
  // query.subscribe(console.log);
  const stories = await get(query);
  console.log(stories);
};
