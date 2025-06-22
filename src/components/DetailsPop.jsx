import React from "react";
import { Button } from "./ui/button";
const DetailsPop = ({ managersAllowed, setShowDetails, position, addedBy }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 backdrop-blur-sm flex items-center justify-center z-50 transition-all duration-300">
      <div className="bg-slate-900 rounded-lg shadow-lg max-w-md w-full mx-4 p-6 border border-slate-700 relative animate-fade-in">
        <h2 className="text-xl text-white font-bold mb-4">Managers Allowed</h2>

        <ul className="space-y-2 text-white">
          {managersAllowed.map((manager) => (
            <div key={manager.id}>
              <li
                
                className="border border-slate-600 p-2 rounded"
              >
                <p>
                  <span className="font-semibold">Name:</span> {manager.name}
                </p>
                <p>
                  <span className="font-semibold">Email:</span> {manager.email}
                </p>
              </li>
            </div>
          ))}
          <ul>
            <li>
              <p className="">  
                <span>Added by <i className="font-semibold text-green-300 ">{addedBy}</i></span> 
              </p>
            </li>
          </ul>
        </ul>

        <Button
          onClick={() => setShowDetails(false)}
          className="mt-6 w-full bg-red-600 hover:bg-red-700 text-white"
        >
          Close
        </Button>
      </div>
    </div>
  );
};

export default DetailsPop;
