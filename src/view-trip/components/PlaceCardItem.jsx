import { GetPlaceDetails, PHOTO_REF_URL } from '@/service/GlobalApi';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

function PlaceCardItem({ place }) {
  const [photoUrl, setPhotoUrl] = useState(null);
  const [isImageLoading, setIsImageLoading] = useState(true);

  useEffect(() => {
    if (place) {
      fetchPlaceDetails(place.placeName);
    }
  }, [place]);

  const fetchPlaceDetails = async (query) => {
    try {
      const data = await GetPlaceDetails(query);
      const result = data.results[0]; // Assuming the first result is the most relevant
      if (result?.photos?.length > 0) {
        const photoRef = result.photos[0].photo_reference;
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
    <Link 
      to={`https://www.google.com/maps/search/?api=1&query=${place.placeName}`} 
      target='_blank'
    >
      <div className="snow-bg border rounded-xl p-4 mt-4 flex items-stretch gap-6 bg-white shadow-lg hover:scale-105 transition-all hover:shadow-md cursor-pointer">
        {/* Image Section with Skeleton Effect */}
        <div className="snow-bg relative w-full h-[130px] overflow-hidden rounded-xl">
          {isImageLoading && (
            <div className="snow-bg absolute inset-0 bg-slate-200 animate-pulse rounded-xl"></div>
          )}
          {photoUrl && (
            <img
              src={photoUrl}
              alt={place.placeName}
              className={`snow-bg w-full h-full object-cover rounded-xl ${
                isImageLoading ? 'opacity-0' : 'opacity-100'
              } transition-opacity duration-500`}
              onLoad={() => setIsImageLoading(false)}
              onError={() => setIsImageLoading(false)} // Gracefully handle errors
            />
          )}
        </div>
        
        {/* Content Section */}
        <div className="flex flex-col justify-between flex-grow min-h-[250px]">
          {/* Place Name */}
          <h2 className="font-bold text-xl text-gray-800 mb-1">{place.placeName}</h2>

          {/* Place Details */}
          <p className="text-sm text-gray-600 mb-3">{place.placeDetails}</p>

          {/* Additional Details */}
          <div className="space-y-1">
            <p className="text-sm text-gray-600 flex items-center">
              Ratings: <span className="ml-1 font-medium text-black">{place.rating} ⭐</span>
            </p>
            <p className="text-sm text-gray-600 flex items-center">
              🕙: <span className="ml-1 font-medium">{place.travelTime}</span>
            </p>
            <p className="text-sm text-gray-600 flex items-center">
              💰: <span className="ml-1 font-medium">{place.ticketPricing}</span>
            </p>
          </div>
        </div>
      </div>
    </Link>
  );
}

export default PlaceCardItem;
