import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { AI_PROMPT, SelectBudgetOptions, SelectTravelsList } from '@/constants/options';
import { toast } from 'sonner';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { chatSession } from '@/service/AIModel';
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
} from "@/components/ui/dialog";
import { FcGoogle } from "react-icons/fc";
import { useGoogleLogin } from '@react-oauth/google';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '@/service/firebaseConfig';
import { useNavigate } from 'react-router-dom';

function CreateTrip() {
  const [place, setPlace] = useState();
  const [formData, setFormData] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [userAuthenticated, setUserAuthenticated] = useState(false);
  const [loading,setLoading] = useState(false);
  const navigate = useNavigate();

  const handleInputChange = (name, value) => {
    const updatedFormData = [...formData.filter(item => item.name !== name), { name, value }];
    setFormData(updatedFormData);
  };

  useEffect(() => {
    console.log('Form Data:', formData);
  }, [formData]);

  const login = useGoogleLogin({
    onSuccess: (tokenInfo) => {
      GetUserProfile(tokenInfo);
    },
    onError: (error) => {
      console.error("Login failed:", error);
      toast.error("Google Login failed. Please try again.");
    }
  });

  const GetUserProfile = (tokenInfo) => {
    axios.get(`https://www.googleapis.com/oauth2/v1/userinfo?access_token=${tokenInfo?.access_token}`, {
      headers: {
        Authorization: `Bearer ${tokenInfo?.access_token}`,
        Accept: 'application/json',
      },
    })
      .then((resp) => {
        console.log(resp.data);
        localStorage.setItem('user', JSON.stringify(resp.data));
        setUserAuthenticated(true);
        setOpenDialog(false);
        toast.success("Login successful!");
      })
      .catch((error) => {
        console.error("Failed to fetch user profile:", error);
        toast.error("Unable to fetch user profile. Please try again.");
      });
  };

  const OnGenerateTrip = async () => {
    const user = localStorage.getItem('user');

    if (!user || !userAuthenticated) {
      setOpenDialog(true);
      toast.warning("Please sign in with Google to proceed.");
      return;
    }

    const noOfDays = formData?.find(item => item.name === 'noOfDays')?.value;
    const location = formData?.find(item => item.name === 'location');
    const budget = formData?.find(item => item.name === 'budget');
    const traveler = formData?.find(item => item.name === 'traveler');

    if (!noOfDays || !location || !budget || !traveler) {
      toast.error("Please fill all details!");
      return;
    }

    setLoading(true);
    const FINAL_PROMPT = AI_PROMPT
      .replace('{location}', location?.value)
      .replace('{totalDays}', noOfDays)
      .replace('{traveler}', traveler?.value)
      .replace('{budget}', budget?.value)
      .replace('{totalDays}', noOfDays);

    // console.log('FINAL PROMPT:', FINAL_PROMPT);

    try {
      const result = await chatSession.sendMessage(FINAL_PROMPT);
      console.log("--",result?.response?.text()); // Logging AI response
      setLoading(false);
      SaveAiTrip(result?.response?.text())
      toast.success("Trip generated successfully!");
    } catch (error) {
      console.error("Failed to generate trip:", error);
      toast.error("Error generating trip. Please try again.");
    }
  };
 
  const SaveAiTrip = async(TripData)=>{
    // Add a new document in collection "cities"
    setLoading(true);
    const user = JSON.parse(localStorage.getItem('user'));
    const docId=Date.now().toString()

    await setDoc(doc(db, "AITrips", docId), {
      userSelection : formData,
      tripData : JSON.parse(TripData),
      userEmail: user?.email,
      id:docId
    });
    setLoading(false);
    navigate('/view-trip/'+docId)
  }

  useEffect(() => {
    const script = document.createElement('script');
    script.src = "https://maps.gomaps.pro/maps/api/js?key=AlzaSyMZ0PnjjUCrj28W2xINuXl232Ph5AQn0Pu&libraries=places&callback=initAutocomplete";
    script.async = true;
    script.defer = true;
    document.body.appendChild(script);

    let autocomplete;

    window.initAutocomplete = () => {
      const input = document.getElementById('autocomplete');
      autocomplete = new window.google.maps.places.Autocomplete(input, {
        types: ['(cities)'],
        fields: ['name', 'formatted_address', 'place_id', 'geometry'],
      });

      autocomplete.addListener('place_changed', () => {
        const selectedPlace = autocomplete.getPlace();
        if (!selectedPlace.geometry) {
          toast.error("Please select a valid place!");
          return;
        }

        setPlace(selectedPlace);
        handleInputChange('location', selectedPlace.formatted_address);
      });
    };

    return () => {
      if (autocomplete) {
        autocomplete.unbindAll();
      }
      document.body.removeChild(script);
    };
  }, []);

  return (
    <div className='snow-bg sm:px-10 md:px-32 lg:px-56 xl:pd-10 px-5 mt-10'>
      <h2 className='snow-bg font-bold text-3xl'>Tell us your travel preferences 🏕️🌴</h2>
      <p className='snow-bg mt-3 text-gray-500 text-xl'>
        Just provide some basic information, and our trip planner will generate a customized itinerary based on your preferences.
      </p>

      <div className='snow-bg mt-20 flex flex-col gap-10'>
        <div>
          <h2 className='snow-bg text-xl my-3 font-medium'>What is the destination of choice?</h2>
          <input
            id="autocomplete"
            type="text"
            placeholder="Search for a destination"
            className="w-full p-2 text-lg border border-black rounded-md"
            style={{ height: '40px' }}
          />
        </div>

        <div>
          <h2 className='text-xl my-3 font-medium'>How many days are you planning your trip?</h2>
          <Input
            placeholder="Ex. 3"
            type="number"
            onChange={(e) => handleInputChange('noOfDays', e.target.value)}
          />
        </div>

        <div>
          <h2 className='text-xl my-3 font-medium'>What is Your Budget?</h2>
          <div className='grid grid-cols-3 gap-5 mt-5'>
            {SelectBudgetOptions.map((item, index) => (
              <div
                key={index}
                onClick={() => handleInputChange('budget', item.title)}
                className={`p-4 border cursor-pointer rounded-lg hover:shadow-lg ${
                  formData?.find(i => i.name === 'budget')?.value === item.title ? 'shadow-lg border-black' : ''
                }`}
              >
                <h2 className='text-4xl'>{item.icon}</h2>
                <h2 className='font-bold text-lg'>{item.title}</h2>
                <h2 className='text-sm text-gray-500'>{item.desc}</h2>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h2 className='text-xl my-3 font-medium'>Who do you plan on traveling with on your next adventure?</h2>
          <div className='grid grid-cols-3 gap-5 mt-5'>
            {SelectTravelsList.map((item, index) => (
              <div
                key={index}
                onClick={() => handleInputChange('traveler', item.people)}
                className={`p-4 border cursor-pointer rounded-lg hover:shadow-lg ${
                  formData?.find(i => i.name === 'traveler')?.value === item.people ? 'shadow-lg border-black' : ''
                }`}
              >
                <h2 className='text-4xl'>{item.icon}</h2>
                <h2 className='font-bold text-lg'>{item.title}</h2>
                <h2 className='text-sm text-gray-500'>{item.desc}</h2>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className='my-10 justify-end flex'>
        <Button disabled={loading} onClick={OnGenerateTrip}>
          {loading? <AiOutlineLoading3Quarters className='h-7 w-7 animate-spin' />: 'Generate Trip'}
        </Button>
      </div>

      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogDescription>
              <img src="/logo.svg" alt="Logo" />
              <h2 className='snow-bg font-bold text-lg mt-7'>Sign In With Google</h2>
              <p>Sign in to the App with Google authentication securely</p>
              <Button
                onClick={login}
                className="snow-bg w-full mt-5 flex gap-4 items-center"
              >
                <FcGoogle className='snow-bg h-7 w-7' />
                Sign In With Google
              </Button>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default CreateTrip;
