
'use client'

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";


export default function Home() {
  const router = useRouter();
  // const [user, setUser] = useState(false)
  // async function getUser() {
  //   // if(localStorage.getItem('user-session')) return true;
  //   // else return false;


  //   // return false
  // }

  // useEffect(() => {

  //   if (getUser()) router.replace("/dashboard") 
  //   else router.replace("/login");

  // }, [getUser, router]);

  
  useEffect(() => {
    axios
      .get("http://localhost:5000/logged-in", { withCredentials: true })
      .then((res) => {
        // console.log("Session exists:", res.data);
        router.replace('/dashboard')
      })
      .catch((err) => {
        router.replace("/login");
        console.log("No session", err);
      });
  }, []);

  
  return <div>Redirecting...</div>;
}
