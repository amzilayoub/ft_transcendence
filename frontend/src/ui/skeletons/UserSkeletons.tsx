export const UserListItemLoading = () => (
  <li className="w-full animate-pulse p-4">
    <div className="flex items-center gap-x-2 justify-between w-full">
      <div className="w-full flex gap-x-2">
        <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
        <div className="ml-2">
          <div className="text-sm font-medium bg-gray-200 rounded w-32 h-4"></div>
          <div className="text-xs text-gray-400 bg-gray-200 rounded w-24 h-2 mt-4"></div>
        </div>
      </div>
    </div>
    <span className="sr-only">Loading user</span>
  </li>
);

export default UserListItemLoading;
