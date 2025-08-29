// components/ChatModal.jsx
import React, { useState, useEffect, useRef } from "react";
import { MdCancel } from "react-icons/md";
import { useGetChatQuery } from "../../../redux/apis/chatApis";
import { useSendMessageMutation } from "../../../redux/apis/chatApis";
import toast from "react-hot-toast";
export default function ChatModal({
  setAnimateIn,
  animateIn,
  isOpen,
  onClose,
  user,
  forInvoice = false,
}) {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [file, setFile] = useState(null);
  const [sendMessageMutation] = useSendMessageMutation();
  const { data } = useGetChatQuery(forInvoice ? user?.Id : user?._id);

  const chatEndRef = useRef(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (data) {
      setMessages(data?.data ?? []);
    }
  }, [data]);

  // Scroll to bottom on new message
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (isOpen) {
      setAnimateIn(true);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;

    if (selectedFile.type === "image/gif") {
      toast.error("GIFs are not supported", { duration: 3000 });
      return;
    }

    setFile(selectedFile);
  };

  const sendMessage = async () => {
    if (!newMessage.trim() && !file) return;

    const formData = new FormData();
    if (newMessage.trim()) formData.append("message", newMessage);
    if (file) formData.append("file", file);
    formData.append("claimId", forInvoice ? user?.Id : user?._id);
    try {
      const res = await sendMessageMutation(formData).unwrap();
      toast.success(res.message, { duration: 3000 });
      setNewMessage("");
      setFile(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch (err) {
      toast.error(err.data.message, { duration: 3000 });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div
        className="absolute inset-0 bg-black opacity-40"
        onClick={onClose}
      ></div>

      <div
        className={`relative w-full max-w-3xl rounded-r-[8px] bg-white h-full shadow-xl flex flex-col transform transition-transform duration-1000 ease-in-out ${
          animateIn ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b p-4">
          <div className="flex items-center gap-3">
            <img src="/profile-pic.png" className="w-[48px]" alt="" />
            <div>
              <h2 className="text-lg font-semibold">{user?.userName}</h2>
              <p className="text-sm text-green-600">{user?.claimId}</p>
            </div>
          </div>
          <div>
            <p className="text-lg text-green-700">
              RO#: {user?.roNumber} - {user?.roSuffix}
            </p>
          </div>
          <button onClick={onClose}>
            <MdCancel fill="#043655" size={24} />
          </button>
        </div>

        {/* Chat Messages */}
        <div className="p-4 flex-1 overflow-y-auto space-y-4">
          {messages.map((msg, idx) => (
            <div
              key={msg._id || idx}
              className={`flex ${
                msg.senderId === user?.owner ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`p-3 rounded-lg max-w-xs ${
                  msg.senderId === user?._id
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200 text-gray-900"
                }`}
              >
                {msg.type === "text" && <p>{msg.content}</p>}

                {msg.type === "file" && msg.fileData && (
                  <>
                    {msg.fileData.format === "jpg" ||
                    msg.fileData.format === "jpeg" ||
                    msg.fileData.format === "png" ? (
                      <img
                        src={msg.fileData.url}
                        alt="attachment"
                        className="max-w-[200px] rounded-md"
                      />
                    ) : (
                      <>
                        <p>{msg.fileData.name}</p>
                        <a
                          href={msg.fileData.url}
                          download
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 underline"
                        >
                          Download{" "}
                          {msg.fileData.format?.toUpperCase() || "File"}
                        </a>
                      </>
                    )}
                  </>
                )}

                {/* Timestamp */}
                <p className="text-[10px] mt-1 opacity-70">
                  {new Date(msg.createdAt).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
            </div>
          ))}
          <div ref={chatEndRef}></div>
        </div>

        <div className="p-4 border-t flex items-center space-x-2">
          {/* Hidden file input */}
          <input
            type="file"
            ref={fileInputRef}
            style={{ display: "none" }}
            accept="*/*"
            onChange={handleFileChange}
          />
          <button
            className="px-3 py-2 bg-gray-200 rounded hover:bg-gray-300"
            onClick={() => fileInputRef.current.click()}
          >
            📎
          </button>

          {file && (
            <span className="text-xs text-gray-600 truncate max-w-[100px]">
              {file.name}
            </span>
          )}

          <input
            type="text"
            className="flex-1 border rounded px-3 py-2 text-sm outline-none"
            placeholder="Type a message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          />
          <button
            className="px-4 py-2 bg-blue-900 text-white rounded hover:bg-blue-700"
            onClick={sendMessage}
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}
