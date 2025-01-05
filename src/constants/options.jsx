export const SelectTravelsList = [
    {
        id: 1,
        title: 'Just Me',
        desc: 'A sole traveler in exploration',
        icon: '✈️',  // Use a plane emoji or an appropriate icon here
        people: '1',
    },
    {
        id: 2,
        title: 'A Couple',
        desc: 'Two travelers in tandem',
        icon: '🍻',  // Cheers emoji, or an appropriate icon
        people: '2 people',
    },
    {
        id: 3,
        title: 'Family',
        desc: 'A group of fun-loving adventurers',
        icon: '👨‍👩‍👧‍👦',  // Family emoji, or an appropriate icon
        people: '3 to 5 people',
    },
    {
        id: 4,
        title: 'Friends',
        desc: 'A bunch of thrill-seekers',  // Fixed typo here
        icon: '🛥️',  // Family emoji, or an appropriate icon
        people: '6-10 people',
    },
];

export const SelectBudgetOptions = [
    {
        id: 1,
        title: 'Cheap',
        desc: 'Stay conscious of costs',
        icon: '💰',  // Money icon or an appropriate emoji
    },
    {
        id: 2,
        title: 'Moderate',
        desc: 'Balance between cost and comfort',
        icon: '💵',  // Money icon or an appropriate emoji
    },
    {
        id: 3,
        title: 'Luxury',
        desc: 'Indulge in premium experiences',
        icon: '💎',  // Gem icon for luxury or an appropriate emoji
    },
];

export const AI_PROMPT = "Generate Travel Plan for Location: {location} for {totalDays} Days for {traveler} with a {budget} budget, give me Hotels options list with HotelName, Hotel address, Price, hotel image url, geo coordinates, rating, descriptions and suggest itinerary with placeName, Place Details, Place Image url, Geo Coordinates, ticket Pricing,rating, Time travel each of location for {totalDays} days with each day plan with best time to visit in JSON format.";
