import { Fragment, useEffect, useState } from "react";

import { Popover, Transition } from "@headlessui/react";
import cn from "classnames";
import { IoSearch, IoSearchOutline } from "react-icons/io5";

interface SearchbarProps {
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  placeholder?: string;
}

const Searchbar = (props: SearchbarProps) => {
  const [hasInput, setHasInput] = useState(false);

  useEffect(() => {}, [hasInput]);

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        props.onSubmit(e);
      }}
      className="group relative h-10 w-full max-w-lg"
    >
      <label className="absolute top-2 left-3 flex items-center justify-center text-gray-400">
        <button type="submit" className="h-full w-full cursor-default">
          <IoSearchOutline className="group-focus-within:text-secondary group-hover:text-secondary h-6  w-6 text-gray-400" />
        </button>
      </label>
      <input
        type="search"
        className={cn(
          "h-full w-full rounded-xl border py-2 pl-12 text-gray-500 list-none duration-150 focus-within:border-secondary hover:border-secondary outline-none",
          {
            "pr-3": hasInput,
          }
        )}
        placeholder={props.placeholder}
        spellCheck="false"
        onChange={(e) => {
          setHasInput(e.target.value.length > 0);
          props.onChange(e);
        }}
      />
    </form>
  );
};

export const SearchbarPopover = (props: SearchbarProps) => {
  const [isHydrated, setIsHydrated] = useState(false);
  useEffect(() => {
    setIsHydrated(true);
  }, []);
  if (!isHydrated) {
    return null;
  }

  return (
    <div className="flex w-full justify-end px-2">
      <Popover className="relative w-full">
        {({ open }: { open: boolean }) => (
          <>
            <Popover.Button
              className={`
                ${
                  open
                    ? "ring-secondary"
                    : "text-secondary/70 ring-secondary/70"
                }
                group text-secondary hover:text-secondary hover:ring-secondary inline-flex items-center rounded-full bg-white p-3 text-base font-medium ring-1 focus:outline-none`}
            >
              <IoSearch
                className={`${open ? "" : "text-secondary/70"}
                   group-hover:text-secondary h-5 w-5 transition duration-150 ease-in-out`}
                aria-hidden="true"
              />
            </Popover.Button>
            <Transition
              as={Fragment}
              enter="transition ease-out duration-200"
              enterFrom="opacity-0 translate-y-1"
              enterTo="opacity-100 translate-y-0"
              leave="transition ease-in duration-150"
              leaveFrom="opacity-100 translate-y-0"
              leaveTo="opacity-0 translate-y-1"
            >
              <Popover.Panel className="absolute z-40 mt-2 w-full rounded-xl shadow-xl">
                <Searchbar {...props} />
              </Popover.Panel>
            </Transition>
          </>
        )}
      </Popover>
    </div>
  );
};

export default Searchbar;
