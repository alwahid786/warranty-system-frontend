import { IoSearchOutline } from "react-icons/io5";

const SearchInput = ({ cn, ...rest }) => {
  return (
    <div
      className={`flex items-center gap-2 bg-white py-[14px] px-5 rounded-sm w-[500px] border border-[#E4E4E7] ${cn}`}
    >
      <IoSearchOutline />
      <input
        type="search"
        className="bg-transparent outline-none flex-1 text-sm text-dark-text placeholder:text-dark-text "
        placeholder="Search.."
        {...rest}
      />
    </div>
  );
};

export default SearchInput;
