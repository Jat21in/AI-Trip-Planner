import axios from "axios";

const BASE_URL = 'https://maps.gomaps.pro/maps/api/place/textsearch/json';

const API_KEY = 'AlzaSyaDR0THIsyDP9-wr8cY_Leb3fRRQWxYiFe';

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

export const PHOTO_REF_URL = 'https://maps.gomaps.pro/maps/api/place/photo?photo_reference={{placeId}}&maxwidth=800&maxheight=800&key=AlzaSyaDR0THIsyDP9-wr8cY_Leb3fRRQWxYiFe'; // Increased resolution
