import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { GetPlaceDetails, PHOTO_REF_URL } from '@/service/GlobalApi';
import { IoIosSend } from "react-icons/io";

function InfoSection({ trip }) {
  const [photoUrl, setPhotoUrl] = useState(null);
  const [isImageLoading, setIsImageLoading] = useState(true);

  // Access location correctly from userSelection
  const location = trip?.userSelection?.location || 'Unknown Location';

  useEffect(() => {
    if (trip && location !== 'Unknown Location') {
      console.log("Fetching details for location:", location);
      fetchPlaceDetails(location);
    }
  }, [trip, location]);

  const fetchPlaceDetails = async (query) => {
    try {
      const data = await GetPlaceDetails(query);
      console.log("Place Details:", data); // Log place details to the console

      const result = data.results?.[0]; // Assuming the first result is the most relevant
      if (result?.photos?.length > 0) {
        const photoRef = result.photos[0].photo_reference;

        // Generate the photo URL using the updated parameters
        const generatedPhotoUrl = PHOTO_REF_URL.replace('{{placeId}}', photoRef);
        setPhotoUrl(generatedPhotoUrl);

        console.log("Generated Photo URL:", generatedPhotoUrl); // Log the generated photo URL
      } else {
        console.warn("No photos available for this place.");
      }
    } catch (error) {
      console.error("Failed to fetch place details:", error);
    }
  };

  return (
    <div>
      {/* Image Section with Skeleton Effect */}
      <div className="snow-bg relative w-full h-[300px] object-cover overflow-hidden rounded-xl">
        {isImageLoading && (
          <div className="snow-bg absolute inset-0 bg-slate-200 animate-pulse rounded-xl"></div>
        )}
        {photoUrl && (
          <img
            src={photoUrl}
            alt="Trip Preview"
            className={`snow-bg w-full h-full object-cover rounded-xl ${
              isImageLoading ? 'opacity-0' : 'opacity-100'
            } transition-opacity duration-500`}
            onLoad={() => setIsImageLoading(false)}
            onError={() => setIsImageLoading(false)} // Handle errors gracefully
          />
        )}
      </div>

      <div className="flex justify-between items-center">
        {/* Location Details */}
        <div className="my-5 flex flex-col gap-2">
          <h2 className="font-bold text-2xl">{location}</h2>
        </div>

        {/* Send Button */}
        {/* <Button className="rounded-lg w-auto p-3 text-white flex items-center justify-center transition-all">
          <IoIosSend className="text-xl" />
        </Button> */}
        <IoIosSend className="snow-bg text-xl" />
      </div>
    </div>
  );
}

export default InfoSection;
