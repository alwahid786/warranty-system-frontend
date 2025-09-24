import { useState } from "react";
import {
  useDeleteNotificationMutation,
  useReadNotificationMutation,
  useGetNotificationsQuery,
} from "../../../redux/apis/notificationsApis";
import { Trash2, CheckCheck } from "lucide-react";
import toast from "react-hot-toast";

const NotificationItem = ({ id, title, message, time, isRead }) => {
  const [deleteNotification] = useDeleteNotificationMutation();
  const [readNotification] = useReadNotificationMutation();
  const { refetch: notificationsRefetch } = useGetNotificationsQuery();

  const handleDelete = async () => {
    try {
      const res = await deleteNotification(id).unwrap();
      toast.success(res.message || "Notification deleted", { duration: 3000 });
      await notificationsRefetch();
    } catch (err) {
      toast.error(err?.data?.message || "Failed to delete", { duration: 3000 });
    }
  };

  const handleRead = async () => {
    if (!isRead) {
      try {
        const res = await readNotification(id).unwrap();
        toast.success(res.message || "Marked as read", { duration: 3000 });
        await notificationsRefetch();
      } catch (err) {
        toast.error(err?.data?.message || "Failed to mark read", {
          duration: 3000,
        });
      }
    }
  };

  return (
    <div
      className={`group flex justify-between items-start gap-2 py-3 border-t first:border-none px-2 rounded-lg transition-colors ${
        isRead ? "bg-gray-100" : "bg-white hover:bg-gray-50"
      }`}
    >
      {/* Left side */}
      <div className="flex items-start gap-3">
        <div
          className={`w-5 h-5 rounded-full ${
            isRead ? "bg-green-400" : "bg-gray-300"
          }`}
        />
        <div className="flex flex-col">
          <p className="font-inter font-medium text-[16px] text-[#333]">
            {title}
          </p>
          <p className="font-inter font-normal text-[14px] text-[#5F5F5F]">
            {message}
          </p>
        </div>
      </div>

      {/* Right side */}
      <div className="flex items-center gap-2">
        <span className="text-xs text-gray-500 whitespace-nowrap">
          {new Date(time).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </span>

        {/* Hover actions */}
        <div className="hidden group-hover:flex items-center gap-2">
          {/* Read Icon */}
          {!isRead && (
            <button
              onClick={handleRead}
              className="p-1 rounded-full hover:bg-green-100 text-green-600"
              title="Mark as read"
            >
              <CheckCheck size={18} />
            </button>
          )}
          {/* Delete Icon */}
          <button
            onClick={handleDelete}
            className="p-1 rounded-full hover:bg-red-100 text-red-600"
            title="Delete"
          >
            <Trash2 size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotificationItem;
