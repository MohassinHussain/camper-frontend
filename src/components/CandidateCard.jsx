"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import ChatInterface from "./ChatInterface";
import useUserSession from "@/cusomHooks/useUserSession";

const CandidateCard = () => {
  const [currentCandidatesList, setCurrentCandidatesList] = useState([]);
  const [managerSpecificCandidates, setManagerSpecificCandidates] = useState([]);
  const { user, loading, error } = useUserSession();

  const fetchCandidates = async () => {
    try {
      const res = await axios.get("http://localhost:5000/fetch-candidates", {
        withCredentials: true,
      });
      setCurrentCandidatesList(res.data.data);
    } catch (err) {
      console.error("Failed to fetch candidates:", err.response?.data || err.message);
    }
  };

  useEffect(() => {
    fetchCandidates();
  }, [currentCandidatesList]);

  const [allManaagers, setAllManaagers] = useState([]);
  useEffect(() => {
    const matchingManager = currentCandidatesList
      .flatMap((candidateObj) => candidateObj.managers)
      .find((manager) => manager?.email.trim() === user?.email.trim());

    if (matchingManager) {
      setAllManaagers(matchingManager);
    }
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
    <div className="p-4 sm:p-6 md:p-8 min-h-screen">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-4 sm:gap-6">
        {currentCandidatesList
          .filter((cand) =>
            cand.managers.some((manager) => manager.email === user?.email)
          )
          .map((cand, idx) => (
            <div
              key={idx}
              onClick={() => handleCandidateClick(cand)}
              className="overflow-auto bg-gray-950 p-4 sm:p-6 h-80 sm:h-96 w-full max-w-sm mx-auto rounded-lg hover:bg-gray-800 hover:border-2 border-blue-500 transition-all cursor-pointer shadow-lg hover:shadow-xl"
            >
              <div className="h-full flex flex-col justify-between text-white">
                <div className="space-y-3 sm:space-y-4">
                  <div className="text-base sm:text-lg">
                    🙍🏻‍♂️ Name: <span className="font-semibold">{cand.name}</span>
                  </div>
                  <div className="text-base sm:text-lg break-words">
                    ✉︎ Email: <span className="font-semibold">{cand.email}</span>
                  </div>
                  <div className="text-base sm:text-lg">
                    🎯 Position:{" "}
                    <span className="font-semibold">{cand.position}</span>
                  </div>
                </div>
                <div className="mt-3 pt-3 border-t border-gray-700">
                  <div className="text-xs sm:text-sm text-gray-300">
                    🛡️ Added by: {cand.addedBy}
                  </div>
                </div>
              </div>
            </div>
          ))}
      </div>

      {/* Modal */}
      {showModal && selectedCandidate && (
        <div className="fixed inset-0 bg-black bg-opacity-20 flex items-center justify-center z-50 p-4 sm:p-6">
          <div className="bg-black rounded-lg w-full max-w-lg sm:max-w-2xl md:max-w-3xl lg:max-w-4xl h-[85vh] max-h-[90vh] relative flex flex-col">
            <div className="flex justify-between items-center p-4 sm:p-6 border-b border-slate-700 text-white">
              <h2 className="text-xl sm:text-2xl font-bold">
                Chat with {selectedCandidate.name}
              </h2>
              <button
                onClick={handleClose}
                className="text-2xl sm:text-3xl hover:text-red-500 transition-colors"
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
