// components/ChatModal.jsx
import React, { useState, useEffect, useRef } from "react";

import { MdCancel } from "react-icons/md";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import { User, Users } from "lucide-react";

import {
  useGetChatQuery,
  useGetMentionSuggestionsQuery
} from "../../../redux/apis/chatApis";
import { useSendMessageMutation } from "../../../redux/apis/chatApis";
import { SOCKET } from "../../../utils/socket";
import claimsApis from "../../../redux/apis/claimsApis";
import notificationsApis from "../../../redux/apis/notificationsApis";
import { getInitials } from "../../../utils/getInitials";

const normalizeId = (value) => {
  if (!value) return "";
  if (typeof value === "string") return value;
  if (typeof value === "object" && value.$oid) return value.$oid;
  if (typeof value.toString === "function") return value.toString();

  return String(value);
};

export default function ChatModal({
  setAnimateIn,
  animateIn,
  isOpen,
  onClose,
  row,
  forInvoice = false
}) {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [file, setFile] = useState(null);
  const [sendMessageMutation] = useSendMessageMutation();

  const { data } = useGetChatQuery(forInvoice ? row?.Id : row?._id, {
    refetchOnMountOrArgChange: true
  });

  const activeClaimId = normalizeId(forInvoice ? row?.Id : row?._id);

  const { data: suggestionData } = useGetMentionSuggestionsQuery(
    activeClaimId,
    {
      skip: !activeClaimId
    }
  );

  const [showMentions, setShowMentions] = useState(false);
  const [mentionSearch, setMentionSearch] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [mentionsMap, setMentionsMap] = useState({});

  const chatEndRef = useRef(null);
  const fileInputRef = useRef(null);
  const inputRef = useRef(null);

  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const filteredSuggestions = (suggestionData?.data || []).filter((u) =>
    u.name.toLowerCase().includes(mentionSearch.toLowerCase())
  );

  const handleInputChange = (e) => {
    const value = e.target.value;

    setNewMessage(value);

    const cursorPosition = e.target.selectionStart;
    const textBeforeCursor = value.substring(0, cursorPosition);
    const lastAtIndex = textBeforeCursor.lastIndexOf("@");

    if (lastAtIndex !== -1) {
      const query = textBeforeCursor.substring(lastAtIndex + 1);

      if (!query.includes(" ")) {
        setMentionSearch(query);
        setShowMentions(true);
        setSelectedIndex(0);
      } else {
        setShowMentions(false);
      }
    } else {
      setShowMentions(false);
    }
  };

  const insertMention = (mentionedUser) => {
    const cursorPosition = inputRef.current.selectionStart;
    const textBeforeCursor = newMessage.substring(0, cursorPosition);
    const lastAtIndex = textBeforeCursor.lastIndexOf("@");
    const textAfterCursor = newMessage.substring(cursorPosition);

    const displayName = `@${mentionedUser.name}`;

    setMentionsMap((prev) => ({
      ...prev,
      [displayName]: normalizeId(mentionedUser._id)
    }));

    const updatedMessage =
      newMessage.substring(0, lastAtIndex) +
      displayName +
      " " +
      textAfterCursor;

    setNewMessage(updatedMessage);
    setShowMentions(false);
    inputRef.current.focus();
  };

  const handleKeyDown = (e) => {
    if (showMentions) {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIndex((prev) => (prev + 1) % filteredSuggestions.length);
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIndex(
          (prev) =>
            (prev - 1 + filteredSuggestions.length) % filteredSuggestions.length
        );
      } else if (e.key === "Enter" || e.key === "Tab") {
        e.preventDefault();
        if (filteredSuggestions[selectedIndex]) {
          insertMention(filteredSuggestions[selectedIndex]);
        }
      } else if (e.key === "Escape") {
        setShowMentions(false);
      }
    } else if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const renderMessageContent = (content, isOwn) => {
    if (!content) return null;
    const mentionRegex = /@\[([^\]]+)\]\(([^)]+)\)/g;
    const parts = content.split(mentionRegex);
    const result = [];

    for (let i = 0; i < parts.length; i++) {
      if (i % 3 === 0) {
        result.push(<span key={i}>{parts[i]}</span>);
      } else if (i % 3 === 1) {
        result.push(
          <span
            key={i}
            className={`font-bold px-1 rounded mx-0.5 ${
              isOwn ? "bg-white/20 text-white" : "bg-blue-600/10 text-blue-700"
            }`}
          >
            @{parts[i]}
          </span>
        );
      }
    }

    return result;
  };

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
  }, [isOpen, setAnimateIn]);

  useEffect(() => {
    if (!isOpen) return;

    if (activeClaimId) {
      SOCKET.emit("join:chat", activeClaimId);
    }

    const handleNewMessage = (payload) => {
      const payloadClaimId = normalizeId(payload?.claimId);

      if (payloadClaimId === activeClaimId) {
        setMessages((prev) => {
          // Prevent duplicates
          const incomingMessage = payload?.message;
          const incomingId = normalizeId(incomingMessage?._id);

          const alreadyExists = prev.some(
            (m) => normalizeId(m?._id) === incomingId
          );

          if (alreadyExists) return prev;

          return [...prev, incomingMessage];
        });
      }

      dispatch(claimsApis.util.invalidateTags(["Claims"]));
    };

    SOCKET.on("chat:message", handleNewMessage);

    return () => {
      if (activeClaimId) {
        SOCKET.emit("leave:chat", activeClaimId);
      }
      SOCKET.off("chat:message", handleNewMessage);
    };
  }, [activeClaimId, dispatch, isOpen]);

  useEffect(() => {
    if (!isOpen || !data) return;
    dispatch(claimsApis.util.invalidateTags(["Claims"]));
    dispatch(notificationsApis.util.invalidateTags(["notifications"]));
  }, [data, dispatch, isOpen]);

  if (!isOpen) return null;

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];

    if (!selectedFile) return;

    const MAX_FILE_SIZE = 10 * 1024 * 1024;

    if (selectedFile.size > MAX_FILE_SIZE) {
      toast.error("File size is too large. Max limit is 10MB.", {
        duration: 3000
      });
      e.target.value = "";

      return;
    }

    if (selectedFile.type === "image/gif") {
      toast.error("GIFs are not supported", { duration: 3000 });

      return;
    }

    setFile(selectedFile);
  };

  const sendMessage = async () => {
    if (!newMessage.trim() && !file) return;

    // Convert short-hand mentions (@Name) back to full markdown format (@[Name](ID))
    let finalMessage = newMessage;

    const sortedTags = Object.keys(mentionsMap).sort(
      (a, b) => b.length - a.length
    );

    sortedTags.forEach((tag) => {
      const name = tag.substring(1);
      const id = mentionsMap[tag];
      const escapedTag = tag.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      const regex = new RegExp(escapedTag + "(?![\\w])", "g");

      finalMessage = finalMessage.replace(regex, `@[${name}](${id})`);
    });

    const formData = new FormData();

    if (finalMessage.trim()) formData.append("message", finalMessage);
    if (file) formData.append("file", file);
    formData.append("claimId", forInvoice ? row?.Id : row?._id);
    if (user?._id) formData.append("senderId", user?._id);
    try {
      const res = await sendMessageMutation(formData).unwrap();

      setNewMessage("");
      setFile(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
      toast.success(res?.message || "Message sent successfully", {
        duration: 2000
      });
    } catch (err) {
      if (err.status === 413) {
        toast.error("File is too large. Please upload a smaller file.", {
          duration: 4000
        });
      } else {
        toast.error(
          err.data?.message || "An error occurred while sending the message",
          { duration: 3000 }
        );
      }
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
            <div className="w-[48px] h-[48px] rounded-full overflow-hidden">
              {row?.customerName ? (
                <div className="w-full h-full bg-primary flex items-center justify-center text-white font-bold">
                  {getInitials(row.customerName)}
                </div>
              ) : (
                <img
                  src="/profile-pic.png"
                  className="w-full h-full object-cover"
                  alt=""
                />
              )}
            </div>
          </div>
          <div>
            <p className="text-lg text-green-700">
              RO#: {row?.roNumber} - {row?.roSuffix}
            </p>
          </div>
          <button onClick={onClose}>
            <MdCancel fill="#043655" size={24} />
          </button>
        </div>

        {/* Chat Messages ---------- */}
        <div className="p-4 flex-1 overflow-y-auto space-y-4">
          {messages.map((msg, idx) => (
            <div
              key={msg._id || idx}
              className={`flex flex-col ${
                normalizeId(msg.senderId) === normalizeId(user?._id)
                  ? "items-end"
                  : "items-start"
              }`}
            >
              <p className="text-[11px] font-semibold text-gray-500 mb-1 px-1">
                {msg.senderName ||
                  (normalizeId(msg.senderId) === normalizeId(user?._id)
                    ? user?.name || "You"
                    : "User")}
              </p>

              <div
                className={`p-3 rounded-lg max-w-xs ${
                  normalizeId(msg.senderId) === normalizeId(user?._id)
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200 text-gray-900"
                }`}
              >
                {msg.type === "text" && (
                  <p className="whitespace-pre-wrap break-words">
                    {renderMessageContent(
                      msg.content,
                      normalizeId(msg.senderId) === normalizeId(user?._id)
                    )}
                  </p>
                )}

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
                        <p>{msg.fileData.filename}</p>
                        <a
                          href={msg.fileData.url}
                          download={msg.fileData.filename}
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

                {/* Timestamp inside the bubble */}
                <p className="text-[10px] mt-1 opacity-70">
                  {new Date(msg.createdAt).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit"
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

          <div className="flex-1 relative">
            <AnimatePresence>
              {showMentions && filteredSuggestions.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute bottom-full left-0 w-64 bg-white border rounded-lg shadow-2xl mb-2 overflow-hidden z-50"
                >
                  <div className="bg-gray-50 px-3 py-2 border-b text-[11px] font-bold text-gray-500 uppercase tracking-wider">
                    Suggestions
                  </div>
                  <div className="max-h-60 overflow-y-auto">
                    {filteredSuggestions.map((u, idx) => (
                      <div
                        key={u._id}
                        className={`flex items-center gap-3 px-3 py-2 cursor-pointer transition-colors ${
                          idx === selectedIndex
                            ? "bg-blue-50"
                            : "hover:bg-gray-50"
                        }`}
                        onClick={() => insertMention(u)}
                      >
                        <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden flex-shrink-0">
                          {u.isSpecial ? (
                            <Users size={16} className="text-blue-600" />
                          ) : u.image?.url ? (
                            <img
                              src={u.image.url}
                              alt=""
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <User size={16} className="text-gray-400" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-gray-800 truncate">
                            {u.name}
                          </p>
                          <p className="text-[10px] text-gray-500 capitalize">
                            {u.displayRole}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <textarea
              ref={inputRef}
              className="w-full border rounded px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all resize-none min-h-[40px] max-h-[120px]"
              placeholder="Type a message... (Use @ to mention, Shift+Enter for new line)"
              rows={1}
              value={newMessage}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              onInput={(e) => {
                e.target.style.height = "auto";
                e.target.style.height = e.target.scrollHeight + "px";
              }}
            />
          </div>
          <button
            className="px-4 py-2 bg-blue-900 text-white rounded hover:bg-blue-700 transition-colors font-medium"
            onClick={sendMessage}
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}
