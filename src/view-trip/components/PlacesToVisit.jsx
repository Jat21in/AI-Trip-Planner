import React from 'react';
import PlaceCardItem from './PlaceCardItem';

function PlacesToVisit({ trip }) {
  return (
    <div>
      <h2 className="font-bold text-lg">Places to Visit</h2>
      <div>
        {/* Check if itinerary exists and is an object */}
        {trip.tripData?.itinerary &&
          Object.entries(trip.tripData.itinerary)
            .sort(([dayA], [dayB]) => {
              // Sorting the days numerically (if the days are in 'Day X' format)
              const dayNumberA = parseInt(dayA.replace(/\D/g, ''));
              const dayNumberB = parseInt(dayB.replace(/\D/g, ''));
              return dayNumberA - dayNumberB;
            })
            .map(([day, details], index) => (
              <div key={index} className="mt-5">
                <h2 className="font-medium text-lg">{day}</h2>
                <div className="grid md:grid-cols-2 gap-5">
                  {details.activities.map((place, idx) => (
                    <div key={idx} className="">
                      <h2 className="font-medium text-sm text-orange-600"></h2>
                      <PlaceCardItem place={place} />
                    </div>
                  ))}
                </div>
              </div>
            ))}
      </div>
    </div>
  );
}

export default PlacesToVisit;
