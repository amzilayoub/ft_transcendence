export const UserListItemLoading = () => (
  <li className="w-full animate-pulse p-4">
    <div className="flex w-full items-center justify-between gap-x-2">
      <div className="flex w-full gap-x-2">
        <div className="h-10 w-10 rounded-full bg-gray-200"></div>
        <div className="ml-2">
          <div className="h-4 w-32 rounded bg-gray-200 text-sm font-medium"></div>
          <div className="mt-4 h-2 w-24 rounded bg-gray-200 text-xs text-gray-400"></div>
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
