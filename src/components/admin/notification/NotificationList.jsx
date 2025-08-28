import NotificationItem from "./NotificationItem";

const NotificationList = ({ groupedNotifications }) => {
  return (
    <div className="bg-white p-5 rounded-xl shadow">
      <h2 className="text-[22px] font-inter font-medium text-dark">
        Notifications
      </h2>
      <p className="text-[16px] text-[#A7A7A7] font-normal mb-4">
        Notification List
      </p>
      {Object.keys(groupedNotifications).map((group) => (
        <div key={group} className="mb-4">
          <h3 className="text-sm font-medium text-dark mb-2">{group}</h3>
          <div>
            {groupedNotifications[group].map((n) => (
              <NotificationItem
                key={n._id}
                id={n._id}
                title={n.title}
                message={n.message}
                time={n.createdAt}
                isRead={n.isRead}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default NotificationList;
