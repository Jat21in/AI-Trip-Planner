import React, { useEffect, useState } from "react";
import { Button } from "../ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { googleLogout, useGoogleLogin } from "@react-oauth/google";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
} from "@/components/ui/dialog";
import { FcGoogle } from "react-icons/fc";
import axios from "axios";
import { toast } from 'sonner';

function Header() {
  const user = JSON.parse(localStorage.getItem("user"));
  const [openDialog, setOpenDialog] = useState(false);
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
        window.location.reload();
        toast.success("Login successful!");
      })
      .catch((error) => {
        console.error("Failed to fetch user profile:", error);
        toast.error("Unable to fetch user profile. Please try again.");
      });
  };

  useEffect(() => {
    console.log(user); // Logs the user data to the console for debugging
  }, []);

  const handleLogout = () => {
    googleLogout();
    localStorage.clear();
    window.location.href = '/'; // Redirect to the start page
  };

  return (
    <div className="snow-bg p-3 shadow-sm flex justify-between items-center px-5">
      <img src="/Logo.PNG" alt="Logo" className="snow-bg max-w-[200px] max-h-[50px] w-auto h-auto object-contain" />
      <div>
        <div className="flex items-center gap-5">
          {user ? (
            <div className="snow-bg flex items-center gap-3"> {/* Adjusted gap here */}
              <a href='/create-trip'>
                <Button variant="outline" className="snow-bg rounded-full">
                  + Create Trip
                </Button>
              </a>
              <a href='/my-trips'>
                <Button variant="outline" className="snow-bg rounded-full">
                  My Trips
                </Button>
              </a>
              {/* Profile Image */}
              <Popover>
                <PopoverTrigger>
                  <img
                    src={user?.picture || "/placeholder.jpg"} // Fallback image
                    className="snow-bg h-[35px] w-[35px] rounded-full border-0 p-0 object-cover" // Removed padding, border, and ensured object-fit cover
                    alt="User Profile"
                  />
                </PopoverTrigger>
                <PopoverContent>
                  <h2
                    className="cursor-pointer"
                    onClick={handleLogout} // Call handleLogout on click
                  >
                    Logout
                  </h2>
                </PopoverContent>
              </Popover>
            </div>
          ) : (
            <Button onClick={() => setOpenDialog(true)} className='rounded-full snow-bg'>Sign In</Button>
          )}
        </div>

        <Dialog open={openDialog} onOpenChange={setOpenDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogDescription>
                <img src="/Logo.PNG" alt="Logo" className="snow-bg max-w-[200px] max-h-[50px] w-auto h-auto object-contain" />
                <h2 className="snow-bg font-bold text-lg mt-7">Sign In With Google</h2>
                <p>Sign in to the App with Google authentication securely</p>
                <Button onClick={login} className="snow-bg w-full mt-5 flex gap-4 items-center">
                  <FcGoogle className="h-7 w-7" />
                  Sign In With Google
                </Button>
              </DialogDescription>
            </DialogHeader>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}

export default Header;
