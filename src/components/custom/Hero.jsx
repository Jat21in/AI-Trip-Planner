import React from 'react';
import { Button } from '../ui/button';
import { Link } from 'react-router-dom';

function Hero() {
  return (
    <div className="snow-bg flex flex-col items-center mx-auto gap-6 p-6">
      <h1 className="snow-bg font-extrabold text-[40px] text-center mt-16 leading-relaxed z-10">
        <span className="text-[#f56551]">
          Discover Your Next Adventure with AI:
        </span>
        <br />
        Personalized Itineraries at Your Fingertips
      </h1>
      <p className="snow-bg text-xl text-gray-500 text-center z-10">
        Your personalized travel assistant, designing custom itineraries that match preferences and budget.
      </p>

      <Link to={'/create-trip'}>
        <Button className="rounded-full z-10">Get Started, It's Free</Button>
      </Link>
    </div>
  );
}

export default Hero;
