import React from "react";

import cn from "classnames";

const BASE_STYLE =
  "px-3 py-2 ml-0 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white";

const PaginationButton = ({
  onClick,
  disabled,
  name,
}: {
  onClick: () => void;
  disabled?: boolean;
  name: string;
}) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className={cn(BASE_STYLE, {
      "rounded-l-lg": name === "Previous",
      "rounded-r-lg": name === "Next",
    })}
  >
    {name}
  </button>
);
const PaginationActions = ({
  currentPage,
  onPrevious,
  onNext,
}: {
  currentPage: number;
  onPrevious: () => void;
  onNext: () => void;
}) => {
  return (
    <nav>
      <ul className="inline-flex -space-x-px">
        <li>
          <PaginationButton name="Previous" onClick={() => onPrevious()} />
        </li>
        <li className={BASE_STYLE}>{currentPage}</li>
        <li>
          <PaginationButton name="Next" onClick={() => onNext()} />
        </li>
      </ul>
    </nav>
  );
};

export default PaginationActions;
