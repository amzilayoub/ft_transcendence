export const UserListItemLoading = () => (
  <li className="w-full animate-pulse p-4">
    <div className="flex items-center gap-x-2 justify-between w-full">
      <div className="w-full flex gap-x-2">
        <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
        <div className="ml-2">
          <div className="text-sm font-medium bg-gray-200 rounded w-32 h-4"></div>
          <div className="text-xs text-gray-400 bg-gray-200 rounded w-24 h-2 mt-4"></div>
        </div>
      </div>
    </div>
    <span className="sr-only">Loading user</span>
  </li>
);

// const BenLoading = () => (
//   <div className="w-[200px] bg-black/80 rounded-lg">
//     <div className="relative space-y-5 overflow-hidden rounded-2xl bg-white/5 p-4 shadow-xl shadow-black/5 before:absolute before:inset-0 before:-translate-x-full before:-skew-x-12 before:animate-[shimmer_2s_infinite] before:border-t before:border-white/10 before:bg-gradient-to-r before:from-transparent before:via-white/10 before:to-transparent">
//       <div className="h-24 rounded-lg bg-white/5"></div>
//       <div className="space-y-3">
//         <div className="h-3 w-3/5 rounded-lg bg-white/5"></div>
//         <div className="h-3 w-4/5 rounded-lg bg-white/10"></div>
//         <div className="h-3 w-2/5 rounded-lg bg-white/5"></div>
//       </div>
//     </div>
//   </div>
// );

export default UserListItemLoading;
