"use client";

import useUserSession from "@/cusomHooks/useUserSession";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { Button } from "./ui/button";
import { RotateCcw } from "lucide-react";

const AddedBySomeOtherManager = () => {
  const { user, loading, error } = useUserSession();
  const [addedByMeForOthers, setAddedByMeForOthers] = useState([]);

  const fetchCandidates = async () => {
    try {
      const res = await axios.get("http://localhost:5000/fetch-candidates", {
        withCredentials: true,
      });

      const fetchedResults = res.data.data;

      const filtered = fetchedResults.filter(
        (candidate) =>
          candidate.addedBy?.trim() === user?.email?.trim() &&
          !candidate.managers?.some(
            (manager) => manager?.email?.trim() === user?.email?.trim()
          )
      );

      setAddedByMeForOthers(filtered);
    } catch (err) {
      console.error(
        "Failed to fetch candidates:",
        err.response?.data || err.message
      );
    }
  };

  useEffect(() => {
    if (user?.email) {
      fetchCandidates();
    }
  }, [user?.email]);

  const handleDeleteCandidate = async (candidateId) => {
    try {
      await axios.delete(
        `http://localhost:5000/delete-candidate/${candidateId}`
      );
      alert("Candidate deleted successfully!");
      setAddedByMeForOthers((prev) =>
        prev.filter((c) => c._id !== candidateId)
      );
    } catch (err) {
      console.error(
        "Error deleting candidate:",
        err.response?.data || err.message
      );
      alert("Failed to delete candidate.");
    }
  };

  return (
    <div className="overflow-auto mt-6 mb-24 w-full sm:w-[90%] md:w-[85%] lg:w-[80%] mx-auto items-center justify-center p-4 sm:p-6 rounded-sm text-white relative">
      <div className="flex">
        <h1 className="text-2xl sm:text-3xl font-semibold mb-6 text-center">
        Candidates Added By You but Assigned to Other Managers
      </h1>
      <Button
        variant="outline"
        size="icon"
        onClick={fetchCandidates}
        className="border-slate-600 hover:bg-slate-700 bg-black ml-3 mt-1"
      >
        <RotateCcw
          className={`h-5 w-5 ${
            loading ? "animate-spin text-blue-400" : "text-white"
          }`}
        />
      </Button>
      </div>
      {addedByMeForOthers.length === 0 ? (
        <p className="text-center text-gray-400 text-sm sm:text-base">
          No such candidates found.
        </p>
      ) : (
        <div className="space-y-4">
          {addedByMeForOthers.map((candidate, index) => (
            <div
              key={index}
              className="bg-slate-900 flex flex-col sm:flex-row justify-between gap-4 p-4 rounded-md border border-slate-700 shadow"
            >
              <div className="flex-1 space-y-2">
                <h2 className="text-lg font-bold">{candidate.name}</h2>
                <p className="break-words">📧 {candidate?.email}</p>
                <p>🎯 Position: {candidate.position}</p>
                <p className="mt-2 text-sm text-gray-400">Assigned Managers:</p>
                <ul className="ml-4 list-disc text-sm text-blue-300">
                  {candidate.managers.map((manager, idx) => (
                    <li key={idx}>
                      {manager.name} - {manager?.email}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="flex items-start sm:items-center justify-end">
                <Button
                  onClick={() => handleDeleteCandidate(candidate._id)}
                  className="text-sm px-3 py-1 border border-red-500 text-red-500 hover:bg-red-600 hover:text-white transition"
                >
                  Remove Candidate
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AddedBySomeOtherManager;
