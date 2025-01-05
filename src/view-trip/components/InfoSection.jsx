import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { GetPlaceDetails, PHOTO_REF_URL } from '@/service/GlobalApi';
import { IoIosSend } from "react-icons/io";

function InfoSection({ trip }) {
  const [photoUrl, setPhotoUrl] = useState(null);
  const [isImageLoading, setIsImageLoading] = useState(true);

  const location = trip?.userSelection?.[0]?.value || 'Unknown Location';

  useEffect(() => {
    if (trip) {
      fetchPlaceDetails(location);
    }
  }, [trip]);

  const fetchPlaceDetails = async (query) => {
    try {
      const data = await GetPlaceDetails(query);
      console.log("Place Details:", data); // Log place details to the console

      const result = data.results[0]; // Assuming the first result is the most relevant
      if (result?.photos?.length > 0) {
        const photoRef = result.photos[0].photo_reference;

        // Generate the photo URL using the updated parameters
        const generatedPhotoUrl = PHOTO_REF_URL.replace('{{placeId}}', photoRef);
        setPhotoUrl(generatedPhotoUrl);
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
      <div className="relative w-full h-[300px] object-cover overflow-hidden rounded-xl">
        {isImageLoading && (
          <div className="absolute inset-0 bg-slate-200 animate-pulse rounded-xl"></div>
        )}
        {photoUrl && (
          <img
            src={photoUrl}
            alt="Trip Preview"
            className={`w-full h-full object-cover rounded-xl ${
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
        <IoIosSend className="text-xl" />
      </div>
    </div>
  );
}

export default InfoSection;
