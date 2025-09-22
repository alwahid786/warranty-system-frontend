const Button = ({ text, icon, color, bg, cn, badge, ...rest }) => {
  return (
    <div className="relative inline-block">
      <button
        {...rest}
        className={`py-3 text-base px-6 rounded-md flex justify-center items-center gap-2 transition-all duration-100 hover:bg-sky-900 ${
          color ? color : "text-white"
        } text-base font-medium ${bg ? bg : "bg-primary"} ${cn}`}
      >
        {icon && <span className="text-base">{icon}</span>}
        {text}
      </button>

      {badge > 0 && (
        <span className="absolute -top-2 -right-2 bg-red-600 text-white text-[10px] px-1.5 py-0.5 rounded-full">
          {badge}
        </span>
      )}
    </div>
  );
};

export default Button;
