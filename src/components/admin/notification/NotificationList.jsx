import NotificationItem from "./NotificationItem";
import {
  useGetNotificationsQuery,
  useReadAllNotificationsMutation,
} from "../../../redux/apis/notificationsApis";
import toast from "react-hot-toast";
import { CheckCheck } from "lucide-react";
import { useDispatch } from "react-redux";
import { markAllNotificationsRead } from "../../../redux/slices/notificationsSlice";

const NotificationList = ({ groupedNotifications = {} }) => {
  const [readAllNotifications, { isLoading }] =
    useReadAllNotificationsMutation();
  const { refetch: notificationsRefetch } = useGetNotificationsQuery();
  const dispatch = useDispatch();

  const hasUnread = Object.values(groupedNotifications || {}).some((items) =>
    items?.some((n) => !n.isRead)
  );

  const handleReadAll = async () => {
    try {
      const res = await readAllNotifications().unwrap();
      dispatch(markAllNotificationsRead());
      toast.success(res?.message || "All notifications marked as read", {
        duration: 3000,
      });
      await notificationsRefetch();
    } catch (err) {
      toast.error(err?.data?.message || "Failed to mark all as read", {
        duration: 3000,
      });
    }
  };

  return (
    <div className="bg-white p-5 rounded-xl shadow">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-[22px] font-inter font-medium text-dark">
          Notifications
        </h2>
        {hasUnread && (
          <button
            onClick={handleReadAll}
            disabled={isLoading}
            className="flex items-center gap-2 text-sm font-medium text-primary hover:opacity-80 disabled:opacity-50"
            title="Mark all as read"
          >
            <CheckCheck size={18} />
            Mark all as read
          </button>
        )}
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
              <NotificationItem
                key={n._id}
                notification={n}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default NotificationList;
