import { FcGoogle } from "react-icons/fc";
import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { auth } from "@/utils/firebase";
import { useRouter } from "next/router";
import { useEffect } from "react";

//Checking Logins
import { useAuthState } from "react-firebase-hooks/auth";

export default function Login(props) {
  //setting the route
  const route = useRouter();

  //Anytime you want to get a user, call the useAuthState and pass in auth.
  const [user, loading] = useAuthState(auth);

  //Sign in with google
  const googleProvider = new GoogleAuthProvider();
  const GoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      //takes them to the homepage
      route.push("/");
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (user) {
      route.push("/");
    } else {
      console.log("Login");
    }
  }, [user]); //This will run every time the user changes

  return (
    <div className="shadow-xl mt-32 p-10 text-gray-700 rounded-lg">
      <h2 className="text-2xl font-medium">Join Today</h2>
      <div className="py-4 ">
        <h3 className="py-4">Sign in with one of the providers</h3>
        <button
          onClick={GoogleLogin}
          className="text-white bg-gray-700 w-full font-medium rounded-lg flex align-middle p-4 gap-2"
        >
          <FcGoogle className="text-2xl" />
          Sign in with Google
        </button>
      </div>
    </div>
  );
}

//npm i react-firebase-hooks
//This allows us to have a very simplistic way of checking the current user and adding some checks, basically, you check if the user is signed in, and if they are you can do some stuff.
