import { useState, ChangeEvent, useEffect } from "react";
import { BiSearch } from "react-icons/bi";
import { Link } from "react-router-dom";
import api from "../../../Api/base";
import toast from "react-hot-toast";
function useDebounce<T>(value: T, delay?: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay || 500);

    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);

  return debouncedValue;
}

export const Search = () => {
  const [searchText, setSearchText] = useState("");
  const DebounceValue = useDebounce(searchText);
  const [hidden, setHidden] = useState("hidden");
  const onSearchTextChange = (e: ChangeEvent<HTMLInputElement>) =>
    setSearchText(e.target.value);
  const [result, setResult] = useState([]);
  useEffect(() => {
    const search = async () => {
      try {
        const res = await api.get("/users/search", {
          params: { q: DebounceValue },
        });
        setResult(res.data);
        res.data.length ? setHidden("") : setHidden("hidden");
      } catch (error) {
        toast.error("can't find anyone");
      }
    };
    DebounceValue && search();
  }, [DebounceValue]);
  const clear = () => {
    setHidden("hidden");
    setSearchText("");
    setResult([]);
  };
  return (
    <div className="dropdown hover:cursor-pointer hidden  sm:flex sm:items-center absolute w-80 right-52">
      <input
        tabIndex={0}
        type="text"
        placeholder="Search"
        className={`input w-80 h-8 sm:w-full mr-4 sm:h-12`}
        onChange={onSearchTextChange}
        value={searchText}
      />

      <div className="relative right-14 top-0 w-12 ">
        <BiSearch size="1.4em" />
      </div>
      <ul
        tabIndex={0}
        className={`dropdown-content z-[9999] menu p-2 shadow bg-base-100 rounded-box w-full top-12 ${hidden}`}
      >
        <div className="flex flex-col w-full h-full bg-base-100 z-50">
          {result.map((item: any, index: number) => {
            return (
              <Link key={index} to={`Profile/${item.id}`} onClick={clear}>
                <li className="hover:bg-primary hover:rounded-xl transform duration-500 h-full w-full z-[10000]">
                  <div className="flex items-center gap-2">
                    <div className="avatar">
                      <div className="w-auto rounded-full gap-4 ring ring-primary ring-offset-base-100 ring-offset-2">
                        <img alt="" src={item.avatar.thumbnail} />
                      </div>
                    </div>
                    <span>
                      {item.name.first} {item.name.last}
                    </span>
                  </div>
                </li>
              </Link>
            );
          })}
        </div>
      </ul>
    </div>
  );
};
