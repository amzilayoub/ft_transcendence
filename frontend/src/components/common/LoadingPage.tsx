import LoadingCircle from "./Loading";

const LoadingPage = ({
  message = "LoadingPage...",
  loadingMessage = "Redirecting...",
}) => (
  <div className="flex flex-col items-center justify-center w-full h-screen gap-y-6">
    <span className="text-base font-medium text-gray-500">{message}</span>
    <div className="flex items-center justify-center gap-4 p-4 border rounded-md">
      <div className="w-8 h-8">
        <LoadingCircle />
      </div>
      <p className="text-base font-normal text-gray-600">{loadingMessage}</p>
    </div>
  </div>
);

export default LoadingPage;
