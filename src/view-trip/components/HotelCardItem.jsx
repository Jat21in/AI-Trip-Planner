import { GetPlaceDetails, PHOTO_REF_URL } from '@/service/GlobalApi';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

function HotelCardItem({ hotel }) {
  const [photoUrl, setPhotoUrl] = useState(null);
  const [isImageLoading, setIsImageLoading] = useState(true);

  useEffect(() => {
    if (hotel) {
      fetchPlaceDetails(hotel.hotelName);
    }
  }, [hotel]);

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
      to={`https://www.google.com/maps/search/?api=1&query=${hotel?.hotelName},${hotel.hotelAddress}`}
      target='_blank'
    >
      <div className='hover:scale-105 transition-all cursor-pointer'>
        <div className='relative h-[180px] w-full rounded-xl overflow-hidden'>
          {isImageLoading && (
            <div className='absolute inset-0 bg-slate-200 animate-pulse rounded-xl'></div>
          )}
          {photoUrl && (
            <img
              src={photoUrl}
              alt={hotel?.hotelName}
              className={`rounded-xl h-full w-full object-cover ${
                isImageLoading ? 'opacity-0' : 'opacity-100'
              } transition-opacity duration-500`}
              onLoad={() => setIsImageLoading(false)}
              onError={() => setIsImageLoading(false)} // Handle errors gracefully
            />
          )}
        </div>
        <div className='my-2 flex flex-col gap-2'>
          <h2 className='font-medium'>{hotel?.hotelName}</h2>
          <h2 className='text-xs text-gray-500'>📍 {hotel?.hotelAddress}</h2>
          <h2 className='text-sm'>💰 {hotel?.price}</h2>
          <h2 className='text-sm'>⭐ {hotel?.rating}</h2>
        </div>
      </div>
    </Link>
  );
}

export default HotelCardItem;
