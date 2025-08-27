import React from "react";
import { mockNotifications } from "../../../data/data";
import NotificationList from "../../../components/admin/notification/NotificationList";

const Notification = () => {
  const grouped = groupByDate(mockNotifications);
  return (
    <div className=" space-y-6">
      <NotificationList groupedNotifications={grouped} />
    </div>
  );
};
const groupByDate = (notifications) => {
  return notifications.reduce((acc, item) => {
    const group = item.dateGroup;
    acc[group] = acc[group] || [];
    acc[group].push(item);
    return acc;
  }, {});
};

export default Notification;
