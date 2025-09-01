import React, { useEffect, useState } from "react";
import NotificationList from "../../../components/admin/notification/NotificationList";
import { useGetNotificationsQuery } from "../../../redux/apis/notificationsApis";
import { io } from "socket.io-client";
import getEnv from "../../../configs/config";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import { useRef } from "react";

const Notification = () => {
  const { data: notificationsResponse } = useGetNotificationsQuery();
  const [liveNotifications, setLiveNotifications] = useState([]);
  const user = useSelector((state) => state.auth.user);

  const notifications = [
    ...(notificationsResponse?.data || []),
    ...liveNotifications,
  ];

  const socketRef = useRef(null);

  useEffect(() => {
    if (!socketRef.current) {
      socketRef.current = io(getEnv("SERVER_URL"), {
        withCredentials: true,
      });
    }

    const socket = socketRef.current;

    socket.on("connect", () => {
      console.log("Socket connected:", socket.id);
      if (user?._id) {
        socket.emit("registerUser", user._id);
        console.log("User registered on socket:", user._id);
      }
    });

    socket.on("notification:new", (data) => {
      toast.success(data?.message || "New Notification", { duration: 5000 });
      setLiveNotifications((prev) => [...prev, data]);
    });

    socket.on("notification:update", (data) => {
      setLiveNotifications((prev) =>
        prev.map((n) => (n._id === data._id ? { ...n, ...data.updatedDoc } : n))
      );
    });

    socket.on("notification:delete", ({ _id }) => {
      setLiveNotifications((prev) => prev.filter((n) => n._id !== _id));
    });

    return () => {
      socket.off("connect");
      socket.off("notification:new");
      socket.off("notification:update");
      socket.off("notification:delete");
    };
  });

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
