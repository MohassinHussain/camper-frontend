'use client';

import useUserSession from '@/cusomHooks/useUserSession';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button } from './ui/button';

const AddedBySomeOtherManager = () => {
  const { user, loading, error } = useUserSession();
  const [addedByMeForOthers, setAddedByMeForOthers] = useState([]);

  const fetchCandidates = async () => {
    try {
      const res = await axios.get('http://localhost:5000/fetch-candidates', {
        withCredentials: true,
      });

      const fetchedResults = res.data.data;

      const filtered = fetchedResults.filter(
        (candidate) =>
          candidate.addedBy?.trim() === user?.email?.trim() && // I added them
          !candidate.managers?.some(
            (manager) => manager.email?.trim() === user?.email?.trim() // But I didn't assign to myself
          )
      );

      setAddedByMeForOthers(filtered);
    } catch (err) {
      console.error('Failed to fetch candidates:', err.response?.data || err.message);
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
      // setShowModal(false);
    } catch (err) {
      console.error(
        "Error deleting candidate:",
        err.response?.data || err.message
      );
      alert("Failed to delete candidate.");
    }
  };

  return (
    <div className="overflow-auto mt-6 mb-24 w-[80%] mx-auto items-center justify-center p-6 rounded-sm text-white relative">
      <h1 className="text-3xl font-semibold mb-6 text-center">
        Candidates Added By You but Assigned to Other Managers
      </h1>
      {addedByMeForOthers.length === 0 ? (
        <p className="text-center text-gray-400">No such candidates found.</p>
      ) : (
        <div className="space-y-4">
          {addedByMeForOthers.map((candidate, index) => (
            <div
              key={index}
              className="bg-slate-900 flex justify-between p-4 rounded-md border border-slate-700 shadow"
            >
              <div>
                <h2 className="text-lg font-bold">{candidate.name}</h2>
              <p>📧 {candidate.email}</p>
              <p>🎯 Position: {candidate.position}</p>
              <p className="mt-2 text-sm text-gray-400">
                Assigned Managers:
              </p>
              <ul className="ml-4 list-disc text-sm text-blue-300">
                {candidate.managers.map((manager, idx) => (
                  <li key={idx}>{manager.name} - {manager.email}</li>
                ))}
              </ul>
              </div>
              <div>
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
