"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import useUserSession from "@/cusomHooks/useUserSession";
import { RotateCcw } from "lucide-react"; 
import { Button } from "@/components/ui/button";

const GlobalNotifications = () => {
  const { user } = useUserSession();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchNotifications = async () => {
    if (!user?.email) return;
    try {
      setLoading(true);
      const res = await axios.get(
        `http://localhost:5000/notifications/${user.email}`
      );
      // setNotifications(res.data.data || []);
      const filtered = (res.data.data || []).filter((note) =>
        note.receivers?.some((r) => r.email?.trim() === user.email?.trim())
      );
      setNotifications(filtered);
    } catch (err) {
      console.error("Failed to fetch notifications", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, [user?.email]);

  return (
    <>
      <div className="flex justify-center items-center gap-4 mb-6">
       <div className="flex flex-col">
         <h1 className="text-4xl text-white text-center">
          Notifications / Mentions
        </h1>
        <h2 className="text-center text-gray-400 mt-3 text-xl"> From where ever you are in</h2>
       </div>
        <Button
          variant="outline"
          size="icon"
          onClick={fetchNotifications}
          className="border-slate-600 hover:bg-slate-700 bg-black mb-6"
        >
          <RotateCcw
            className={`h-5 w-5 ${
              loading ? "animate-spin text-blue-400" : "text-white"
            }`}
          />
        </Button>
      </div>

      <div className="overflow-auto h-125 mt-6 mb-24 w-[80%] items-center justify-center p-6 rounded-sm text-white relative">
        {notifications.length === 0 ? (
          <p className="text-center text-slate-400">No new messages.</p>
        ) : (
          <ul className="space-y-4">
            {notifications.map((note, idx) => (
              <li
                key={idx}
                className="bg-slate-800 border border-slate-600 rounded-md p-4 shadow"
              >
                <p>
                  <span className="font-bold text-purple-400">
                    {note.sender}
                  </span>{" "}
                  sent a message about{" "}
                  <span className="text-blue-300">{note.candidateEmail}</span>
                </p>
                <p className="mt-2 text-slate-200">{note.text}</p>
                <p className="text-xs text-slate-500 mt-1">
                  {new Date(note.timestamp).toLocaleString()}
                </p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  );
};

export default GlobalNotifications;
