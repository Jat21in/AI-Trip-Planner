import { db } from '@/service/firebaseConfig';
import { collection, query, where, getDocs } from 'firebase/firestore'; // Added missing imports
import React, { useEffect, useState } from 'react';
import { useNavigate, useNavigation } from 'react-router-dom';
import UserTripCardItem from './components/UserTripCardItem';

function MyTrips() {
    const navigation = useNavigation();
    const [userTrips, setUserTrips] = useState([]);

    useEffect(() => {
        GetUserTrips();
    }, []);

    const GetUserTrips = async () => {
        const user = JSON.parse(localStorage.getItem('user'));
        console.log("jatin", user);
        if (!user) {
            navigation('/');
            return;
        }
        
        const q = query(collection(db, 'AITrips'), where('userEmail', '==', user?.email));
        const querySnapshot = await getDocs(q);
        const trips = [];

        querySnapshot.forEach((doc) => {
            console.log(doc.id, " => ", doc.data());
            trips.push(prevVal=>[...prevVal,doc.data()]); // Collecting data into the trips array
        });

        setUserTrips(trips); // Set the retrieved trips
    }

    return (
        <div className='snow-bg sm:px-10 md:px-32 lg:px-56 xl:pd-10 px-5 mt-10'>
            <h2 className='snow-bg font-bold text-3xl'>My Trips</h2>
            <div className='snow-bg grid grid-cols-2 mt-10 md:grid-cols-3 gap-5 object-cover rounded-xl'>
                {userTrips.length > 0 ? userTrips.map((trip, index) => (
                    <UserTripCardItem trip={trip} key={index} />
                )) : [1, 2, 3, 4, 5, 6].map((item, index) => (
                    <div key={index} className='snow-bg h-[250px] w-full bg-slate-200 animate-pulse rounded-xl'></div>
                ))}
            </div>
        </div>
    );
}

export default MyTrips;
