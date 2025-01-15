import axios from "axios";

const BASE_URL = 'https://maps.gomaps.pro/maps/api/place/textsearch/json';

const API_KEY = 'AlzaSyeMDhtFN4PG-Muy9BeXQfbpXzht82vxamp';

const config = {
    headers: {
        'Content-type': 'application/json',
    }
};

export const GetPlaceDetails = async (query) => {
    try {
        const response = await axios.get(`${BASE_URL}?query=${query}&key=${API_KEY}`, config);
        return response.data;
    } catch (error) {
        console.error("Error fetching place details:", error);
        throw error;
    }
};

export const PHOTO_REF_URL = 'https://maps.gomaps.pro/maps/api/place/photo?photo_reference={{placeId}}&maxwidth=800&maxheight=800&key=AlzaSyeMDhtFN4PG-Muy9BeXQfbpXzht82vxamp'; // Increased resolution
