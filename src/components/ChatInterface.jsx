"use client";

import React, { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import DetailsPop from "./DetailsPop";
import axios, { Axios } from "axios";
import useUserSession from "@/cusomHooks/useUserSession";
import { useSearchParams } from 'next/navigation';




import io from "socket.io-client";
const socket = io("http://localhost:5000");

const ChatInterface = ({
  userName,

  managersAllowed = [],
  position,
  addedBy,
  selectedCandidate,
  setCurrentCandidatesList,
  setShowModal,
}) => {

//   const searchParams = useSearchParams();
// const candidateEmail = searchParams.get('candidateEmail');
// const candidateId = searchParams.get('candidateId');

  const { user, loading, error } = useUserSession();

  const [newMessage, setNewMessage] = useState("");
  const [showDetails, setShowDetails] = useState(false);
  const [showMentionList, setShowMentionList] = useState(false);
  const inputRef = useRef(null);

  const messagesEndRef = useRef(null);

  


  const [messages, setMessages] = useState([]);
  useEffect(() => {
    if (selectedCandidate?._id) {
      socket.emit("joinRoom", selectedCandidate._id);
    }

    const handleMessage = (msg) => {
      // 🧠 Ignore own message broadcast from server
      if (msg.senderSocketId !== socket.id) {
        setMessages((prev) => [...prev, msg]);
      }
    };

    socket.on("receiveMessage", handleMessage);

    return () => {
      socket.off("receiveMessage", handleMessage);
    };
  }, [selectedCandidate?._id]);


  useEffect(() => {
  messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
}, [messages]);


  useEffect(() => {
    const fetchMessages = async () => {
      if (!selectedCandidate?.email) return;
      try {
        const res = await axios.get(
          `http://localhost:5000/messages/${selectedCandidate.email}`
        );
        setMessages(res.data.data);
      } catch (err) {
        console.error("Error fetching chat messages:", err);
      }
    };

    fetchMessages();
  }, [selectedCandidate]);

  const handleSend = async () => {
    if (!newMessage.trim()) return;

    const receivers = managersAllowed
      .filter((manager) => manager.email !== user?.email)
      .map((manager) => ({
        name: manager.name,
        email: manager.email,
      }));

    const msg = {
      candidateEmail: selectedCandidate?.email || "unknown",
      sender: user?.name || "You",
      senderEmail: user?.email || "unknown",
      text: newMessage.trim(),
      timestamp: new Date(),
      senderSocketId: socket.id,
      receivers: receivers,
    };

    socket.emit("sendMessage", {
      roomId: selectedCandidate._id,
      message: msg,
    });

    setNewMessage("");
    setMessages((prev) => [...prev, msg]);

    try {
      await axios.post("http://localhost:5000/messages", msg);
    } catch (error) {
      console.error("Failed to save message:", error);
    }
  };

  const handleDeleteCandidate = async (candidateId) => {
    try {
      await axios.delete(
        `http://localhost:5000/delete-candidate/${candidateId}`
      );
      alert("Candidate deleted successfully!");
      setCurrentCandidatesList((prev) =>
        prev.filter((c) => c._id !== candidateId)
      );
      setShowModal(false);
    } catch (err) {
      console.error(
        "Error deleting candidate:",
        err.response?.data || err.message
      );
      alert("Failed to delete candidate.");
    }
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setNewMessage(value);

    const atIndex = value.lastIndexOf("@");
    const afterAt = value.slice(atIndex + 1);

    // Show mention list only if @ is not followed by space or already replaced
    if (atIndex !== -1 && !afterAt.includes(" ") && afterAt.length < 30) {
      setShowMentionList(true);
    } else {
      setShowMentionList(false);
    }
  };

  const handleMentionClick = (manager) => {
    const beforeAt = newMessage.lastIndexOf("@");
    const updated = `${newMessage.slice(0, beforeAt)}@${manager.name} `;
    setNewMessage(updated);
    setShowMentionList(false);
    inputRef.current?.focus();
  };

  // console.log(messages)

  //   const onSendMessage = async () => {
  //     console.log("HELLO")
  //   }

  return (
    <div className="p-6 flex items-center justify-center relative">
      <Card className="w-full max-w-3xl bg-slate-900 border-slate-700 relative">
        <CardHeader className="pb-4 flex justify-between items-center">
          <CardTitle className="text-violet-700 text-lg font-medium">
            Chat of {userName} - {position}
          </CardTitle>
          <div className="space-x-2">
            {user?.email?.trim() === addedBy?.trim() && (
              <Button
                onClick={() => handleDeleteCandidate(selectedCandidate._id)}
                className="text-sm px-3 py-1 border border-red-500 text-red-500 hover:bg-red-600 hover:text-white transition"
              >
                Remove Candidate
              </Button>
            )}
            <Button
              onClick={() => setShowDetails(true)}
              className="text-sm px-3 py-1 border border-purple-500 text-violet-500 hover:bg-violet-600 hover:text-white transition"
            >
              View Details
            </Button>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Messages Box */}
          <div className="h-64 overflow-y-auto p-4 border rounded border-slate-700 bg-slate-800 text-white text-sm space-y-3">
            {/* {messages?.length === 0 ? (
              <div className="text-slate-400">No messages yet.</div>
            ) : (
              messages.map((msg, idx) => (
                <div key={idx} className="flex flex-col">
                  <span className="font-semibold">{msg.sender}:</span>
                  <span className="ml-2">{msg.text}</span>
                </div>
              ))
            )} */}
            {messages?.length === 0 ? (
              <div className="text-slate-400">No messages yet.</div>
            ) : (
              <>
                {

messages.map((msg, idx) => {
                // const isSender = msg.senderSocketId === socket.id;
                const isSender = msg.senderEmail === user?.email;
                return (
                  <div
                    key={idx}
                    className={`flex ${
                      isSender ? "justify-end" : "justify-start"
                    }`}
                  >
                    <div
                    
                      className={`max-w-xs px-4 py-2 rounded-lg shadow-md ${
                        isSender
                          ? "bg-violet-700 text-white rounded-br-none"
                          : "bg-slate-600 text-white rounded-bl-none"
                      }`}
                    >
                      {!isSender && (
                        <span className="block text-sm font-semibold mb-1">
                          {msg.sender}
                        </span>
                      )}
                      {/* <span>{msg.text}</span> */}
                      <span
                        dangerouslySetInnerHTML={{
                          __html: msg.text.replace(
                            /@(\w+)/g,
                            '<span class="text-yellow-400 font-semibold">@$1</span>'
                          ),
                        }}
                      />
                    </div>
                   

                  </div>
                  
              );

              })

                }
                <div ref={messagesEndRef} />
              </>
            )}
          </div>

          {/* Mention Suggestion Popup */}
          {showMentionList && (
            <div className="absolute bottom-24 left-6 z-10 w-72 max-h-52 overflow-y-auto bg-purple-800 border border-slate-600 rounded-md shadow-md animate-slide-in-up">
              {managersAllowed.map(
                (manager) =>
                  manager.email !== user?.email && (
                    <div
                      key={manager.id}
                      onClick={() => handleMentionClick(manager)}
                      className="p-2 m-2 hover:bg-slate-700 text-white cursor-pointer transition"
                    >
                      @{manager.name} ({manager.email})
                    </div>
                  )
              )}
            </div>
          )}

          {/* Input Row */}
          <div className="flex items-center space-x-2 relative">
            <Input
              ref={inputRef}
              placeholder="Type your message... (use @ to tag)"
              className="flex-1 bg-transparent border-slate-600 selection:bg-yellow-200 selection:text-black selection:rounded-sm selection:p-1 text-white placeholder:text-slate-400 focus:border-slate-500"
              value={newMessage}
              onChange={handleInputChange}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
            />
            <Button
              onClick={handleSend}
              className="bg-transparent border border-slate-600 text-white hover:bg-violet-800 hover:border-purple-500 transition-all"
            >
              Send
            </Button>
          </div>
        </CardContent>
      </Card>

      {showDetails && (
        <DetailsPop
          managersAllowed={managersAllowed}
          setShowDetails={setShowDetails}
          position={position}
          addedBy={addedBy}
        />
      )}
    </div>
  );
};

export default ChatInterface;
