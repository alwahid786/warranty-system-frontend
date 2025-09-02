import { useSelector } from "react-redux";
import NotificationList from "../../../components/admin/notification/NotificationList";

const Notification = () => {
  const notificationsApp = useSelector((state) => state.notifications.items);
  const notifications = notificationsApp || [];

  const grouped = groupByDate(notifications);

  return (
    <div className="space-y-6">
      <NotificationList groupedNotifications={grouped} />
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
