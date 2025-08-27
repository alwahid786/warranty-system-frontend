const Input = ({ label, type = 'text', shadow = false, className = '', ...rest }) => {
  return (
    <div>
      <label className="text-sm md:text-base lg:text-sm text-dark-text">{label}</label>
      <input
        {...rest}
        type={type}
        className={`mt-2 outline-none px-4 h-[48px] rounded-md w-full text-sm lg:text-lg text-[#535353] ${
          shadow ? 'shadow-input' : ''
        } bg-[#EEEEEE] ${className}`}
      />
    </div>
  );
};

export default Input;
