const CloseButton = ({
  onClick,
  className = "",
  type = "button",
  ...props
}) => {
  return (
    <button
      type={type}
      onClick={onClick}
      className={`absolute top-7 right-8 text-gray-500 hover:text-black text-2xl ${className}`}
      {...props}
    >
      ✖
    </button>
  );
};

export default CloseButton;
