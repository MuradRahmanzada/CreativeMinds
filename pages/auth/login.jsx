import React, {useEffect} from "react";
import { useRouter } from "next/router";
import { FcGoogle } from "react-icons/fc";
import { useAuthState } from 'react-firebase-hooks/auth';
import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { auth } from "../../utils/Firebase";

const Login = () => {
  // Sign in function
  const route = useRouter();  
  const provider = new GoogleAuthProvider();
  const [user, loading] = useAuthState(auth)
 
 
  const GoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      route.push("/")
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if(user) {
        route.push('/')
    } else {
        console.log("Login")
    }
  }, [user])

  return (
    <div className="shadow-xl mt-32 p-10 text-gray-700 rounded-lg">
      <h2 className="text-2xl font-medium">Join Today</h2>
      <div className="py-4">
        <h3 className="py-4">Sign in with one of the providers</h3>
        <button
          className="flex items-center justify-center align-middle p-2 bg-gray-700 text-white w-full font-medium gap-3 rounded-lg"
          onClick={GoogleLogin}
        >
          <FcGoogle />
          <span>Sign in with Google</span>
        </button>
      </div>
    </div>
  );
};

export default Login;
