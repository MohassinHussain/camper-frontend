"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import ChatInterface from "./ChatInterface";
import useUserSession from "@/cusomHooks/useUserSession";

const CandidateCard = () => {
  const [currentCandidatesList, setCurrentCandidatesList] = useState([]);
  const [managerSpecificCandidates, setManagerSpecificCandidates] = useState(
    []
  );

  const { user, loading, error } = useUserSession();

  const fetchCandidates = async () => {
    try {
      const res = await axios.get("http://localhost:5000/fetch-candidates", {
        withCredentials: true, // If you use cookies for auth
      });
      setCurrentCandidatesList(res.data.data); // Assuming response shape: { message, data: [...] }

      // console.log("fetched candidates list: ", res.data.data);
    } catch (err) {
      console.error(
        "Failed to fetch candidates:",
        err.response?.data || err.message
      );
    }
  };

  // run for each on currentCandidatesList and check if any object include currently logged in man
  useEffect(() => {
    fetchCandidates();
  }, [currentCandidatesList]);
  const [allManaagers, setAllManaagers] = useState([]);
  useEffect(() => {
    // if (!user?.email || !currentCandidatesList?.length) return;
    // console.log(currentCandidatesList);

    // const filtered = currentCandidatesList.filter((candidateObj) =>
    //   candidateObj.managers.some(
    //     (manager) => {
    //       if(manager.email.trim() === user.email.trim()) setAllManaagers(manager)
    //     }
    //   )
    // );

    // console.log("Logged in user email:", user?.email.trim());
    // console.log("Candidate List:", currentCandidatesList);

    const matchingManager = currentCandidatesList
      .flatMap((candidateObj) => candidateObj.managers)
      .find((manager) => manager.email.trim() === user.email.trim());

    if (matchingManager) {
      setAllManaagers(matchingManager); // or whatever state setter you're using
    }

    // console.log(matchingManager);

    // setManagerSpecificCandidates(filtered);
  }, [user?.email, currentCandidatesList]);

  const [showModal, setShowModal] = useState(false);
  const [selectedCandidate, setSelectedCandidate] = useState(null);

  const handleCandidateClick = (cand) => {
    setSelectedCandidate(cand);
    setShowModal(true);
  };

  const handleClose = () => {
    setShowModal(false);
    setSelectedCandidate(null);
  };

  return (
    <div className="p-6 min-h-screen">
      <div className=" grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
        {currentCandidatesList
          .filter((cand) =>
            cand.managers.some((manager) => manager.email === user.email)
          )
          .map((cand, idx) => (
            <div
              key={idx}
              onClick={() => handleCandidateClick(cand)}
              className="overflow-auto bg-gray-950 p-6 h-96 w-full max-w-sm mx-auto rounded-lg hover:bg-gray-800 hover:border-2 border-blue-500 transition-all cursor-pointer shadow-lg hover:shadow-xl"
            >
              <div className="h-full flex flex-col justify-between text-white">
                <div className="space-y-4">
                  <div className="text-lg">
                    🙍🏻‍♂️ Name: <span className="font-semibold">{cand.name}</span>
                  </div>
                  <div className="text-lg">
                    ✉︎ Email:{" "}
                    <span className="font-semibold">{cand.email}</span>
                  </div>
                  <div className="text-lg">
                    🎯 Position:{" "}
                    <span className="font-semibold">{cand.position}</span>
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t border-gray-700">
                  <div className="text-sm text-gray-300">
                    🛡️ Added by: {cand.addedBy}
                  </div>
                </div>
              </div>
            </div>
          ))}
      </div>

      {/* Modal outside the map loop */}
      {showModal && selectedCandidate && (
        <div className="fixed inset-0 bg-black bg-opacity-20 flex items-center justify-center z-50 p-4">
          <div className="bg-black rounded-lg w-full max-w-4xl h-[80vh] max-h-[600px] relative flex flex-col">
            <div className="flex justify-between items-center p-6 border-b">
              <h2 className="text-2xl font-bold">
                Chat with {selectedCandidate.name}
              </h2>
              <button
                onClick={handleClose}
                className="text-3xl hover:text-red-500 transition-colors"
              >
                ×
              </button>
            </div>
            <div className="flex-1 overflow-hidden">
              <ChatInterface
                userName={selectedCandidate.name}
                managersAllowed={selectedCandidate.managers}
                position={selectedCandidate.position}
                addedBy={selectedCandidate.addedBy}
                selectedCandidate={selectedCandidate}
                setCurrentCandidatesList={setCurrentCandidatesList}
                setShowModal={setShowModal}
                fetchCandidates={fetchCandidates}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CandidateCard;
