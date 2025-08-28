import React, { useEffect } from "react";
import NotificationList from "../../../components/admin/notification/NotificationList";
import { useGetNotificationsQuery } from "../../../redux/apis/notificationsApis";

const Notification = () => {
  const { data: notificationsResponse } = useGetNotificationsQuery();
  const notifications = notificationsResponse?.data || [];

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
