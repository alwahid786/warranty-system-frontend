// components/ChatModal.jsx
import React, { useState, useEffect, useRef, useMemo } from "react";

import { MdCancel } from "react-icons/md";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { MentionsInput, Mention } from "react-mentions";
import { User, Users } from "lucide-react";

import chatApis, {
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
  const [newMessage, setNewMessage] = useState("");
  const [file, setFile] = useState(null);
  const [expandedImage, setExpandedImage] = useState(null);
  const [sendMessageMutation, { isLoading }] = useSendMessageMutation();

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

  const chatEndRef = useRef(null);
  const fileInputRef = useRef(null);

  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const messages = useMemo(() => data?.data ?? [], [data?.data]);

  const suggestionsData = (suggestionData?.data || []).map((u) => ({
    id: normalizeId(u._id),
    display: `${u.name},`,
    ...u
  }));

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

    let timeoutId;

    const handleNewMessage = (payload) => {
      const payloadClaimId = normalizeId(payload?.claimId);

      if (payloadClaimId === activeClaimId) {
        dispatch(
          chatApis.util.updateQueryData(
            "getChat",
            forInvoice ? row?.Id : row?._id,
            (draft) => {
              const incomingMessage = payload?.message;

              if (!incomingMessage) return;
              const incomingId = normalizeId(incomingMessage?._id);

              if (!draft.data) draft.data = [];

              const alreadyExists = draft.data.some(
                (m) => normalizeId(m?._id) === incomingId
              );

              if (!alreadyExists) {
                draft.data.push(incomingMessage);
              }
            }
          )
        );
      }

      if (timeoutId) clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        dispatch(claimsApis.util.invalidateTags(["Claims"]));
      }, 500);
    };

    SOCKET.on("chat:message", handleNewMessage);

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
      if (activeClaimId) {
        SOCKET.emit("leave:chat", activeClaimId);
      }
      SOCKET.off("chat:message", handleNewMessage);
    };
  }, [activeClaimId, dispatch, isOpen, forInvoice, row?.Id, row?._id]);

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

    const formData = new FormData();

    if (newMessage.trim()) formData.append("message", newMessage);
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
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center p-6">
              <div className="w-16 h-16 rounded-full bg-blue-50 flex items-center justify-center mb-3">
                <Users size={28} className="text-blue-500" />
              </div>
              <h3 className="text-sm font-semibold text-gray-800">
                No messages yet
              </h3>
              <p className="text-xs text-gray-400 mt-1 max-w-[220px]">
                Start the conversation! Send a message or attach a file below.
              </p>
            </div>
          ) : (
            messages.map((msg, idx) => (
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
                  {msg.content && (
                    <p
                      className={`whitespace-pre-wrap break-words ${msg.type === "file" ? "mb-2" : ""}`}
                    >
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
                          className="max-w-[200px] rounded-md cursor-pointer hover:brightness-90 transition-all active:scale-95"
                          onClick={() => setExpandedImage(msg.fileData.url)}
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
            ))
          )}
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
            <div className="flex items-center space-x-1 bg-gray-100 px-2 py-1 rounded border">
              <span
                className="text-xs text-gray-600 truncate max-w-[100px]"
                title={file.name}
              >
                {file.name}
              </span>
              <button
                onClick={() => {
                  setFile(null);
                  if (fileInputRef.current) fileInputRef.current.value = "";
                }}
                className="text-gray-500 hover:text-red-500 flex-shrink-0"
                title="Remove file"
              >
                <MdCancel size={14} />
              </button>
            </div>
          )}

          <div className="flex-1 relative mentions-wrapper">
            <MentionsInput
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type a message... (Use @ to mention, Shift+Enter for new line)"
              style={{
                control: {
                  fontSize: 14,
                  fontWeight: "normal",
                  fontFamily: "inherit",
                  lineHeight: "1.5"
                },
                highlighter: {
                  padding: "8px 12px",
                  border: "1px solid transparent",
                  boxSizing: "border-box"
                },
                input: {
                  margin: 0,
                  border: "1px solid #e5e7eb",
                  borderRadius: "0.25rem",
                  padding: "8px 12px",
                  outline: "none",
                  minHeight: "40px",
                  maxHeight: "120px",
                  overflowY: "auto",
                  boxSizing: "border-box"
                },
                suggestions: {
                  list: {
                    backgroundColor: "white",
                    border: "1px solid #e5e7eb",
                    borderRadius: "0.5rem",
                    boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
                    fontSize: 14,
                    maxHeight: "240px",
                    overflowY: "auto",
                    bottom: "100%",
                    position: "absolute",
                    marginBottom: "8px",
                    width: "256px",
                    zIndex: 100
                  },
                  item: {
                    padding: "0",
                    borderBottom: "1px solid #f3f4f6"
                  }
                }
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  // react-mentions prevents default when selecting a suggestion.
                  if (!e.defaultPrevented) {
                    e.preventDefault();
                    setTimeout(() => sendMessage(), 0);
                  }
                }
              }}
            >
              <Mention
                trigger="@"
                markup="@[__display__](__id__)"
                data={suggestionsData}
                displayTransform={(id, display) => `@${display}`}
                appendSpaceOnAdd={true}
                renderSuggestion={(
                  suggestion,
                  search,
                  highlightedDisplay,
                  index,
                  focused
                ) => (
                  <div
                    className={`flex items-center gap-3 px-3 py-2 cursor-pointer transition-colors ${
                      focused ? "bg-blue-50" : "hover:bg-gray-50"
                    }`}
                  >
                    <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden flex-shrink-0">
                      {suggestion.isSpecial ? (
                        <Users size={16} className="text-blue-600" />
                      ) : suggestion.image?.url ? (
                        <img
                          src={suggestion.image.url}
                          alt=""
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <User size={16} className="text-gray-400" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-800 truncate">
                        {suggestion.name}
                      </p>
                      <p className="text-[10px] text-gray-500 capitalize">
                        {suggestion.displayRole}
                      </p>
                    </div>
                  </div>
                )}
                style={{
                  backgroundColor: "rgba(37, 99, 235, 0.2)",
                  borderRadius: "4px"
                }}
              />
            </MentionsInput>
          </div>
          <button
            className="px-4 py-2 bg-blue-900 text-white rounded hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={sendMessage}
            disabled={isLoading || (!newMessage.trim() && !file)}
          >
            {isLoading ? "Sending..." : "Send"}
          </button>
        </div>
      </div>

      {/* Expanded Image Modal / Lightbox */}
      {expandedImage && (
        <div
          className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/85 backdrop-blur-sm transition-opacity duration-300"
          onClick={() => setExpandedImage(null)}
        >
          <button
            className="absolute top-4 right-4 text-white/80 hover:text-white bg-black/40 hover:bg-black/60 p-2.5 rounded-full transition-all duration-200"
            onClick={() => setExpandedImage(null)}
          >
            <MdCancel size={28} />
          </button>
          <div
            className="relative max-w-[90%] max-h-[90%] flex items-center justify-center p-2"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={expandedImage}
              alt="Expanded preview"
              className="max-w-full max-h-[85vh] rounded-lg shadow-2xl object-contain animate-in fade-in zoom-in duration-200"
            />
          </div>
        </div>
      )}
    </div>
  );
}
