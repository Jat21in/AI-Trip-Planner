import React, { useState } from "react";
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
import { toast } from "sonner";

function Header() {
  const user = JSON.parse(localStorage.getItem("user")); // Check user in local storage
  const [openDialog, setOpenDialog] = useState(false); // Dialog state for login

  // Google login
  const login = useGoogleLogin({
    onSuccess: (tokenInfo) => GetUserProfile(tokenInfo),
    onError: (error) => {
      console.error("Login failed:", error);
      toast.error("Google Login failed. Please try again.");
    },
  });

  // Fetch user profile after successful login
  const GetUserProfile = (tokenInfo) => {
    axios
      .get(
        `https://www.googleapis.com/oauth2/v1/userinfo?access_token=${tokenInfo?.access_token}`,
        {
          headers: {
            Authorization: `Bearer ${tokenInfo?.access_token}`,
            Accept: "application/json",
          },
        }
      )
      .then((response) => {
        localStorage.setItem("user", JSON.stringify(response.data));
        localStorage.setItem("userAuthenticated", "true");
        setOpenDialog(false);
        toast.success("Login successful!");
        window.location.reload(); // Reload to reflect changes
      })
      .catch((error) => {
        console.error("Failed to fetch user profile:", error);
        toast.error("Unable to fetch user profile. Please try again.");
      });
  };

  // Logout functionality
  const handleLogout = () => {
    googleLogout();
    localStorage.clear(); // Clear user and authentication state
    toast.success("Logged out successfully!");
    window.location.href = "/"; // Redirect to home
  };

  return (
    <div className="snow-bg p-3 shadow-sm flex justify-between items-center px-5">
      {/* Logo */}
      <img
        src="/Logo.PNG"
        alt="Logo"
        className="snow-bg max-w-[200px] max-h-[50px] w-auto h-auto object-contain"
      />

      <div className="flex items-center gap-5">
        {/* If user is logged in */}
        {user ? (
          <div className="snow-bg flex items-center gap-3">
            {/* Create Trip */}
            <a href="/create-trip">
              <Button variant="outline" className="snow-bg rounded-full">
                + Create Trip
              </Button>
            </a>

            {/* My Trips */}
            <a href="/my-trips">
              <Button variant="outline" className="snow-bg rounded-full">
                My Trips
              </Button>
            </a>

            {/* User Profile */}
            <Popover>
              <PopoverTrigger>
                <img
                  src={user?.picture || "/placeholder.jpg"}
                  className="snow-bg h-[35px] w-[35px] rounded-full object-cover"
                  alt="User Profile"
                />
              </PopoverTrigger>
              <PopoverContent>
                <div className="flex flex-col items-center">
                  <h3 className="font-bold">{user?.name || "Guest"}</h3>
                  <h4 className="text-sm text-gray-600">{user?.email}</h4>
                  <Button
                    variant="outline"
                    className="mt-2"
                    onClick={handleLogout}
                  >
                    Logout
                  </Button>
                </div>
              </PopoverContent>
            </Popover>
          </div>
        ) : (
          // If user is not logged in, show "Sign In" dialog
          <Button
            variant="outline"
            onClick={() => setOpenDialog(true)}
            className="bg-white border-transparent w-6 h-6 p-0 rounded-full"
          ></Button>
        )}

        {/* Dialog for Google Login */}
        <Dialog open={openDialog} onOpenChange={setOpenDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogDescription>
                <img
                  src="/Logo.PNG"
                  alt="Logo"
                  className="snow-bg max-w-[200px] max-h-[50px] w-auto h-auto object-contain"
                />
                <h2 className="snow-bg font-bold text-lg mt-7">
                  Sign In With Google
                </h2>
                <p>Sign in to the app securely using Google Authentication</p>
                <Button
                  onClick={login}
                  className="snow-bg w-full mt-5 flex gap-4 items-center"
                >
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
