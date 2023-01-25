const LoadingCircle = () => (
  <svg
    className="mr-3 h-full w-full animate-spin"
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
);

// diffrent loading[something] component
export const LoadingDots = () => (
  <svg
    className="mr-3 h-5 w-5 animate-spin"
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
  >
    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-purple-400 opacity-75"></span>
    <span className="relative inline-flex h-3 w-3 rounded-full bg-purple-500"></span>
  </svg>
);

export default LoadingCircle;
