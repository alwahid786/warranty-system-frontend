import { useState } from "react";

import toast from "react-hot-toast";
import { CheckCheck, Trash2 } from "lucide-react";
import { useDispatch } from "react-redux";

import {
  useGetNotificationsQuery,
  useReadAllNotificationsMutation,
  useClearAllNotificationsMutation
} from "../../../redux/apis/notificationsApis";
import NotificationItem from "./NotificationItem";
import { markAllNotificationsRead } from "../../../redux/slices/notificationsSlice";
import ConfirmationModal from "../../../utils/ConfirmationModal";

const NotificationList = ({
  groupedNotifications = {},
  page = 1,
  limit = 15
}) => {
  const [readAllNotifications, { isLoading: isReadingAll }] =
    useReadAllNotificationsMutation();

  const [clearAllNotifications, { isLoading: isClearingAll }] =
    useClearAllNotificationsMutation();

  const { refetch: notificationsRefetch } = useGetNotificationsQuery({
    page,
    limit
  });

  const dispatch = useDispatch();

  const [isClearModalOpen, setIsClearModalOpen] = useState(false);

  const hasNotifications = Object.keys(groupedNotifications || {}).length > 0;

  const hasUnread = Object.values(groupedNotifications || {}).some((items) =>
    items?.some((n) => !n.isRead)
  );

  const handleReadAll = async () => {
    try {
      const res = await readAllNotifications().unwrap();

      dispatch(markAllNotificationsRead());
      toast.success(res?.message || "All notifications marked as read", {
        duration: 3000
      });
      await notificationsRefetch();
    } catch (err) {
      toast.error(err?.data?.message || "Failed to mark all as read", {
        duration: 3000
      });
    }
  };

  const handleClearAll = async () => {
    try {
      const res = await clearAllNotifications().unwrap();

      toast.success(res?.message || "All notifications cleared", {
        duration: 3000
      });
      await notificationsRefetch();
    } catch (err) {
      toast.error(err?.data?.message || "Failed to clear notifications", {
        duration: 3000
      });
    }
  };

  return (
    <div className="bg-white p-5 rounded-xl shadow">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <h2 className="text-[22px] font-inter font-medium text-dark">
          Notifications
        </h2>
        <div className="flex items-center gap-4">
          {hasUnread && (
            <button
              onClick={handleReadAll}
              disabled={isReadingAll || isClearingAll}
              className="flex items-center gap-1.5 text-xs sm:text-sm font-medium text-primary hover:opacity-80 disabled:opacity-50"
              title="Mark all as read"
            >
              <CheckCheck size={18} />
              Mark all as read
            </button>
          )}
          {hasNotifications && (
            <button
              onClick={() => setIsClearModalOpen(true)}
              disabled={isReadingAll || isClearingAll}
              className="flex items-center gap-1.5 text-xs sm:text-sm font-medium text-red-600 hover:text-red-700 disabled:opacity-50 cursor-pointer"
              title="Clear all notifications"
            >
              <Trash2 size={18} />
              Clear All
            </button>
          )}
        </div>
      </div>
      <p className="text-[16px] text-[#A7A7A7] font-normal mb-4">
        Notification List
      </p>
      {Object.keys(groupedNotifications).length === 0 && (
        <p className="text-sm text-gray-500">No notifications found.</p>
      )}
      {Object.keys(groupedNotifications).map((group) => (
        <div key={group} className="mb-4">
          <h3 className="text-sm font-medium text-dark mb-2">{group}</h3>
          <div>
            {groupedNotifications[group].map((n) => (
              <NotificationItem key={n._id} notification={n} />
            ))}
          </div>
        </div>
      ))}
      <ConfirmationModal
        isOpen={isClearModalOpen}
        onClose={() => setIsClearModalOpen(false)}
        onSave={handleClearAll}
        data={
          <>
            Are you sure you want to clear all notifications?
            <br />
            <span className="text-sm font-normal text-gray-500 block mt-1">
              This action cannot be undone.
            </span>
          </>
        }
      />
    </div>
  );
};

export default NotificationList;
