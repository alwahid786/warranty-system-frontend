const Button = ({ text, icon, color, bg, cn, ...rest }) => {
  return (
    <button
      {...rest}
      className={`py-3 text-base px-6 rounded-md flex justify-center items-center gap-2 transition-all duration-100 hover:bg-sky-900 ${
        color ? color : 'text-white'
      } text-base font-medium ${bg ? bg : 'bg-primary'} ${cn}`}
    >
      {icon && <span className="text-base">{icon}</span>}
      {text}
    </button>
  );
};

export default Button;
