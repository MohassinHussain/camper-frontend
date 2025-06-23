"use client";

import React, { useEffect, useState } from "react";
import GlobalNotifications from "@/components/GlobalNotifications";
import Candidates from "@/app/candidates/page";

import { useRouter } from "next/navigation";
import axios from "axios";


import Footer from "@/components/Footer";
import useUserSession from "@/cusomHooks/useUserSession";
import AddedBySomeOtherManager from "@/components/AddedBySomeOtherManager";
const page = () => {
  const router = useRouter();

  const { user, loading, error } = useUserSession();
  useEffect(() => {
    if (user) router.replace("/dashboard");
    else router.replace("/login");
  }, [router, user]);

  
  const handleLogout = async () => {
    await axios
      .post(
        "http://localhost:5000/logout",
        {},
        {
          withCredentials: true,
        }
      )
      .then(() => {
        router.replace("/login");
      });
  };

  return (
    // <>
    //   {sess ? (
    <div className="items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 ">
      <div className="mb-6 flex flex-col items-center justify-center text-white">
        <h1 className="text-4xl  mb-8">
          Welcome back! <i className="text-green-300">{user?.name}</i> to
          Camper!
        </h1>


        <h2 className="text-gray-500 text-2xl mb-5">
          <i>A Collaborative Candidate Notes MVP</i>
        </h2>
        <h3 className="text-gray-500 text-2xl mb-5">
          Allows recruiters and hiring managers to interact in real time, share
          candidate feedback, and receive tag-based notifications
        </h3>
      </div>
      <GlobalNotifications />
      {/* <CandidatesSection /> */}
      <Candidates />




      <AddedBySomeOtherManager  />


      <button onClick={handleLogout} className="m-10 bg-red-400 rounded-sm p-1">
        Log Out
      </button>
    
      <Footer />
    </div>
   
  );
};

export default page;
