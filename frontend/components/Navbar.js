import React, { useEffect, useState } from "react";
import { useGoogleLogin , googleLogout } from "@react-oauth/google";
import axios from "axios";
import { useCookies } from "react-cookie";


export default function Navbar() {
  const [cookies, setCookie, removeCookie] = useCookies(["session_id"]);
  const [user, setUser] = useState("1");
  const [loading, setLoading] = useState(false);

  const login = useGoogleLogin({
    onSuccess: async credentialResponse => {
      const userInfo = await axios
        .get(
          `https://bits-and-pses.duckdns.org/dj-rest-auth/google/?access_token=${credentialResponse.access_token}`,
          { headers: { Authorization: "" } }
        )
        .then(res => res.data);
        setUser(null);
        setLoading(true);
      setCookie("session_id", userInfo.session_id, {
        path: "/",
        maxAge: 2 * 60 * 60,
      });
    },
  });

  const logOut = () => {
    googleLogout();
    removeCookie(['session_id'])
    setUser("1");
};

  useEffect(() => {
    if(cookies.session_id){
      setUser(null)
    }
  })

  return (
    <div>
    <div className="sticky top-0 z-10 bg-[#E0E0E0] gap-5 px-6 py-2 justify-between flex">
      <div className="text-2xl font-semibold text-[#606060]">
        Pick Your Course
      </div>
      {user ? <div className="loginButton">
        <button
          onClick={() => login()}
          className="text-xl font-semibold text-[#606060]"
        >
          Sign in with Google
        </button>
      </div> :
      <div className="logOutButton">
        <button onClick={() => logOut()}
        className="text-xl font-semibold text-[#606060]">Logout</button>
      </div>}
    </div>
    </div>
  );
}
