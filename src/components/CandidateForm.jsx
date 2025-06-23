"use client";

import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import useUserSession from "@/cusomHooks/useUserSession";
import axios from "axios";

const CandidateForm = ({
  onAddCandidate,
  setShowModal,
  hadleAddedCandidate,
}) => {
  const { user, loading, error } = useUserSession();

  const [formData, setFormData] = useState({
    name: "",
    gender: "",
    email: "",
    position: "",
  });

  const [selectedManagers, setSelectedManagers] = useState([]);

  const managers = [

    // { id: user?.name, name: user?.name, email: user?.email },
    { id: "manager1", name: "manager1", email: "manager1@gmail.com" },
    { id: "manager2", name: "manager2", email: "manager2@gmail.com" },
    { id: "manager3", name: "manager3", email: "manager3@gmail.com" },
    { id: "techrecruiter", name: "techrecruiter", email: "techrecruiter@gmail.com" },
  ];



  // const [managers, setManagers] = useState([])


//   const fetchCandidates = async () => {
//   try {
//     const res = await axios.get("http://localhost:5000/fetch-candidates", {
//       withCredentials: true,
//     });

//     const candidates = res.data.data;

//     // Extract all managers
//     const allManagers = candidates.flatMap(candidate => candidate.managers || []);

//     // Remove duplicates based on email (or id)
//     const uniqueManagersMap = new Map();

//     allManagers.forEach(manager => {
//       if (!uniqueManagersMap.has(manager.email)) {
//         uniqueManagersMap.set(manager.email, manager); // or manager.id
//       }
//     });

//     const uniqueManagers = Array.from(uniqueManagersMap.values());

//     setManagers(uniqueManagers);

//     console.log("Unique managers:", uniqueManagers);

//   } catch (err) {
//     console.error("Failed to fetch candidates:", err.response?.data || err.message);
//   }
// };



//   // run for each on currentCandidatesList and check if any object include currently logged in manager, if yes then only show to him


//   useEffect(() => {
//     fetchCandidates();
//   }, []);


  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleManagerToggle = (managerId) => {
    setSelectedManagers((prev) =>
      prev.includes(managerId)
        ? prev.filter((id) => id !== managerId)
        : [...prev, managerId]
    );
  };

  const handleSelectAllManagers = () => {
    if (selectedManagers.length === managers.length) {
      // If all are selected, deselect all
      setSelectedManagers([]);
    } else {
      // Otherwise, select all
      setSelectedManagers(managers.map((manager) => manager.id));
    }
  };

  const isAllSelected = selectedManagers.length === managers.length;
  const isIndeterminate =
    selectedManagers.length > 0 && selectedManagers.length < managers.length;

  const handleSubmit = async () => {
    const selectedManagersData = managers.filter((manager) =>
      selectedManagers.includes(manager.id)
    );

    const candidateDetails = {
      ...formData,
      managers: selectedManagersData,
    };

    // added by whom
    candidateDetails.addedBy = user?.email;
    onAddCandidate(candidateDetails);

    try {
      const res = await axios.post(
        "http://localhost:5000/addCandidate",
        candidateDetails
      );
      console.log("Candidate added to DB:", res.data);
    } catch (err) {
      console.error(
        "Error adding candidate:",
        err.response?.data || err.message
      );
    }

    setShowModal(false);
    console.log("Candidate Details:", candidateDetails);
    // setCandidateDetails(candidateDetails)
  };

  return (
    <div className=" p-6 flex items-center justify-center">
      <Card className="w-full max-w-md bg-slate-900 border-slate-700">
        <CardHeader className="pb-4">
          <CardTitle className="text-white text-lg font-medium">
            Candidate Details
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="space-y-6">
            {/* Name and Gender Row */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-white text-sm">
                  Name
                </Label>
                <Input
                  id="name"
                  type="text"
                  value={formData.name}
                  
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  className="bg-transparent border-slate-600 text-white placeholder:text-slate-400 focus:border-slate-500"
                  placeholder=""
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="gender" className="text-white text-sm">
                  Gender
                </Label>
                <Select
                  onValueChange={(value) => handleInputChange("gender", value)}
                >
                  <SelectTrigger className="bg-transparent border-slate-600 text-white">
                    <SelectValue placeholder="" />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-800 border-slate-700">
                    <SelectItem
                      value="male"
                      className="text-white hover:bg-slate-700"
                    >
                      Male
                    </SelectItem>
                    <SelectItem
                      value="female"
                      className="text-white hover:bg-slate-700"
                    >
                      Female
                    </SelectItem>
                    <SelectItem
                      value="other"
                      className="text-white hover:bg-slate-700"
                    >
                      Other
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email" className="text-white text-sm">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                className="bg-transparent border-slate-600 text-white placeholder:text-slate-400 focus:border-slate-500"
                placeholder=""
              />
            </div>

            {/* Position */}
            <div className="space-y-2">
              <Label htmlFor="position" className="text-white text-sm">
                Position For:
              </Label>
              <Input
                id="position"
                type="text"
                value={formData.position}
                onChange={(e) => handleInputChange("position", e.target.value)}
                className="bg-transparent border-slate-600 text-white placeholder:text-slate-400 focus:border-slate-500"
                placeholder=""
              />
            </div>

            {/* Managers Section */}
            <div className="space-y-4">
              <Label className="text-white text-lg font-medium">
                Managers Allowed
              </Label>

              {/* Select All Checkbox */}
              <div className="flex items-center space-x-3 border-b border-slate-700 pb-3">
                <Checkbox
                  id="select-all"
                  checked={isAllSelected}
                  ref={(ref) => {
                    if (ref) ref.indeterminate = isIndeterminate;
                  }}
                  onCheckedChange={handleSelectAllManagers}
                  className="border-slate-600 data-[state=checked]:bg-white data-[state=checked]:border-white"
                />
                <Label
                  htmlFor="select-all"
                  className="text-white text-sm cursor-pointer flex-1 font-medium"
                >
                  Select All Managers
                </Label>
              </div>

              <div className="space-y-3">
                {managers.map((manager, id) => (
                  <div key={id} className="flex items-center space-x-3">
                    <Checkbox
                      id={manager.id}
                      checked={selectedManagers.includes(manager.id)}
                      onCheckedChange={() => handleManagerToggle(manager.id)}
                      className="border-slate-600 data-[state=checked]:bg-white data-[state=checked]:border-white"
                    />
                    <Label
                      htmlFor={manager.id}
                      className="text-white text-sm cursor-pointer flex-1"
                    >
                      {manager.name} - {manager.email}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-center pt-4">
              <Button
                onClick={handleSubmit}
                className="bg-transparent border border-slate-600 text-white hover:bg-slate-800 hover:border-slate-500 px-8 py-2 rounded"
              >
                Add
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CandidateForm;
