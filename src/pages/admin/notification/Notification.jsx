import { useSelector } from "react-redux";
import NotificationList from "../../../components/admin/notification/NotificationList";
import { useGetNotificationsQuery } from "../../../redux/apis/notificationsApis";

const dedupeNotifications = (...collections) => {
  const map = new Map();

  collections
    .flat()
    .filter(Boolean)
    .forEach((item) => {
      if (!item?._id) return;
      map.set(item._id, item);
    });

  return Array.from(map.values()).sort(
    (a, b) => new Date(b?.createdAt || 0) - new Date(a?.createdAt || 0)
  );
};

const Notification = () => {
  const { data, isLoading, isFetching } = useGetNotificationsQuery();
  const notificationsApp = useSelector((state) => state.notifications.items);
  const notifications = dedupeNotifications(data?.data || [], notificationsApp || []);

  const grouped = groupByDate(notifications);

  return (
    <div className="space-y-6">
      {(isLoading || (isFetching && notifications.length === 0)) && (
        <div className="bg-white p-5 rounded-xl shadow">
          <p className="text-sm text-gray-500">Loading notifications...</p>
        </div>
      )}
      {!isLoading && <NotificationList groupedNotifications={grouped} />}
    </div>
  );
};

const groupByDate = (notifications) => {
  return notifications.reduce((acc, item) => {
    const createdAt = new Date(item.createdAt);
    const today = new Date();
    let group = createdAt.toDateString();

    if (createdAt.toDateString() === today.toDateString()) {
      group = "Today";
    } else {
      const yesterday = new Date();
      yesterday.setDate(today.getDate() - 1);
      if (createdAt.toDateString() === yesterday.toDateString()) {
        group = "Yesterday";
      }
    }

    acc[group] = acc[group] || [];
    acc[group].push(item);
    return acc;
  }, {});
};

export default Notification;
