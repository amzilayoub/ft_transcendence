import LoadingCircle from "./Loading";

const LoadingPage = ({
  message = "LoadingPage...",
  loadingMessage = "Redirecting...",
}) => (
  <div className="flex h-screen w-full flex-col items-center justify-center gap-y-6">
    <span className="text-base font-medium text-gray-500">{message}</span>
    <div className="flex items-center justify-center gap-4 rounded-md border p-4">
      <div className="h-8 w-8">
        <LoadingCircle />
      </div>
      <p className="text-base font-normal text-gray-600">{loadingMessage}</p>
    </div>
  </div>
);

export default LoadingPage;
