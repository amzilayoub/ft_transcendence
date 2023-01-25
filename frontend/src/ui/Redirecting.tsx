import React from "react";

const Redirecting = ({
  title = "Redirecting...",
  description = "Please wait while we redirect you to the requested page.",
}: {
  title?: string;
  description?: string;
}) => {
  return (
    <div className="flex h-screen w-full flex-col items-center justify-center gap-y-4">
      <p>
        <span className="text-lg font-normal text-gray-600 ">
          {description}
        </span>
      </p>
      <div className="flex rounded-lg border py-2 px-4">
        <svg
          className="mr-3 h-5 w-5 animate-spin"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          ></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8v8H4z"
          ></path>
        </svg>
        <span className="text-sm font-medium text-gray-500">{title}</span>
      </div>
    </div>
  );
};

export default Redirecting;
