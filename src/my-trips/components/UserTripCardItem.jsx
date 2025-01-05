import { GetPlaceDetails, PHOTO_REF_URL } from "@/service/GlobalApi";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function UserTripCardItem({ trip }) {
  const [photoReference, setPhotoReference] = useState(null);
  const [photoUrl, setPhotoUrl] = useState(null);
  const [placeInfo, setPlaceInfo] = useState(null);

  const location = trip?.userSelection?.find(item => item.name === "location")?.value || "Unknown Location";
  const noOfDays = trip?.userSelection?.find(item => item.name === "noOfDays")?.value || "Unknown Days";
  const budget = trip?.userSelection?.find(item => item.name === "budget")?.value || "Unknown Budget";

  useEffect(() => {
    if (trip) {
      fetchPlaceDetails(location);
    }
  }, [trip]);

  const fetchPlaceDetails = async (query) => {
    try {
      const data = await GetPlaceDetails(query);
      setPlaceInfo(data);
      console.log("Place Details:", data);

      const result = data.results[0];
      if (result?.photos?.length > 0) {
        const photoRef = result.photos[0].photo_reference;
        setPhotoReference(photoRef);

        const photoUrl = PHOTO_REF_URL.replace("{{placeId}}", photoRef);
        setPhotoUrl(photoUrl);
        console.log("Photo Reference ID:", photoRef);
        console.log("Photo URL:", photoUrl);
      } else {
        console.warn("No photos available for this place.");
      }
    } catch (error) {
      console.error("Failed to fetch place details:", error);
    }
  };

  return (
    <Link to={"/view-trip/" + trip?.id}>
      <div className="hover:scale-105 transition-all ">
        <img
          src={photoUrl || ""}
          className="object-cover rounded-xl h-[250px]"
        />
        <div>
          <h2 className="font-bold text-lg">{location}</h2>
          <h2 className="text-sm text-gray-500">
            {noOfDays} Days trip with {budget} Budget
          </h2>
        </div>
      </div>
    </Link>
  );
}

export default UserTripCardItem;
