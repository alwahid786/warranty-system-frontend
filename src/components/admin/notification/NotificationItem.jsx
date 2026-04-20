import { useState } from "react";
import {
  useDeleteNotificationMutation,
  useReadNotificationMutation,
  useGetNotificationsQuery,
} from "../../../redux/apis/notificationsApis";
import { Trash2, CheckCheck } from "lucide-react";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { markNotificationRead } from "../../../redux/slices/notificationsSlice";
import { useNavigate } from "react-router-dom";

const NotificationItem = ({ notification }) => {
  const {
    _id: id,
    title,
    message,
    createdAt: time,
    isRead,
    claimId,
    invoiceNumber,
  } = notification || {};
  const [deleteNotification] = useDeleteNotificationMutation();
  const [readNotification] = useReadNotificationMutation();
  const { refetch: notificationsRefetch } = useGetNotificationsQuery();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [showActions, setShowActions] = useState(false);

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
        dispatch(markNotificationRead(id));
        toast.success(res.message || "Marked as read", { duration: 3000 });
        await notificationsRefetch();
      } catch (err) {
        toast.error(err?.data?.message || "Failed to mark read", {
          duration: 3000,
        });
      }
    }
  };

  const handleOpen = async () => {
    if (!id) return;

    if (!isRead) {
      try {
        await readNotification(id).unwrap();
        dispatch(markNotificationRead(id));
      } catch (err) {
        toast.error(err?.data?.message || "Failed to mark read", {
          duration: 3000,
        });
        return;
      }
    }

    if (claimId) {
      navigate("/dashboard/actions", {
        state: {
          openChatClaimId: claimId,
          fromNotificationId: id,
        },
      });
      return;
    }

    if (invoiceNumber) {
      navigate("/dashboard/invoices");
      return;
    }

    setShowActions((prev) => !prev);
  };

  return (
    <div
      className={`group flex justify-between items-start gap-2 py-3 border-t first:border-none px-2 rounded-lg transition-colors ${
        isRead ? "bg-gray-100" : "bg-white hover:bg-gray-50"
      }`}
      onClick={handleOpen}
    >
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

      <div className="flex items-center gap-2">
        <span className="text-xs text-gray-500 whitespace-nowrap">
          {new Date(time).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </span>

        <div
          className={`items-center gap-2 ${
            showActions ? "flex" : "hidden group-hover:flex"
          }`}
        >
          {!isRead && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleRead();
              }}
              className="p-1 rounded-full hover:bg-green-100 text-green-600"
              title="Mark as read"
            >
              <CheckCheck size={18} />
            </button>
          )}
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleDelete();
            }}
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
