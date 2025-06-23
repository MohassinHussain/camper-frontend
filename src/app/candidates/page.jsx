"use client";
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
// import {
//   Table,
//   TableHeader,
//   TableRow,
//   TableHead,
//   TableBody,
//   TableCell,
//   TableCaption,
// } from "@/components/ui/table";
import CandidateForm from "@/components/CandidateForm";
import { Input } from "@/components/ui/input";
import useUserSession from "@/cusomHooks/useUserSession";
import axios from "axios";
import CandidateCard from "@/components/CandidateCard";

const Page = () => {
  const [showModal, setShowModal] = useState(false);
  const [candidateDetails, setCandidateDetails] = useState();
  const [currentCandidatesList, setCurrentCandidatesList] = useState([]);
  const { user, loading, error } = useUserSession();

  const handleAddCandidate = () => {
    setShowModal(true);
  };

  const handleClose = () => {
    setShowModal(false);
  };

  const handleNewCandidate = async (newCandidate) => {
    const updatedList = [...currentCandidatesList, newCandidate];
    setCurrentCandidatesList(updatedList);
    // await hadleAddedCandidate(updatedList);
    // await hadleAddedCandidate(newCandidate);
  };

  
  return (
    <div className="overflow-auto min-h-screen  mt-6 mb-24  w-[80%]  items-center justify-center p-6 rounded-sm text-white relative">
      <h1 className="text-4xl font-semibold mb-4 text-center">Candidates Section</h1>
      <p className="text-gray-300 text-center text-2xl mb-10">Follow the Process!</p>
      {/* MODAL */} 
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-black/40">
          <div className="rounded-xl shadow-lg  relative text-black">
            {/* Close Button */}
            <button
              className="absolute top-5 right-7 text-white hover:text-red-500 text-3xl font-bold"
              onClick={handleClose}
            >
              &times;
            </button>
            {/* <CandidateForm setCandidateDetails={setCandidateDetails} /> */}

            <CandidateForm
              onAddCandidate={handleNewCandidate}
              setShowModal={setShowModal}
            />

        
          </div>
        </div>
      )}


      <CandidateCard />

      <Button
        onClick={handleAddCandidate}
        className="fixed right-4 bottom-4 w-30 h-30 rounded-xl hover:bg-gray-800 hover:border-2 border-blue-500 transition-all"
      >
        Add Candidate
      </Button>
    </div>
  );
};

export default Page;
