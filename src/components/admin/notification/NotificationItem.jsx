const NotificationItem = ({ message, time }) => {
  return (
    <div className="flex justify-between items-start gap-2 py-3 border-t first:border-none ">
      <div className="flex items-start gap-3 ">
        <div className="w-5 h-5 rounded-full bg-gray-300" />
        <p className="font-inter font-normal text-[16px] text-[#5F5F5F]">{message}</p>
      </div>
      <span className="text-xs text-gray-500 whitespace-nowrap">{time}</span>
    </div>
  );
};

export default NotificationItem;
