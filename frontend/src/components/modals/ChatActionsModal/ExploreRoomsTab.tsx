import { AiFillLock } from "react-icons/ai";

const ExploreRoomsTab = ({}: {}) => {
  return (
    <div className="bg-gray-200 rounded-xl">
      <ul className="px-4 py-2">
        {[].map((room) => (
          <li
            key={room.id}
            className="flex items-center justify-between gap-x-2 py-2 border-b border-gray-300"
          >
            <div className="text-lg font-medium">{room.roomName}</div>
            {room.password !== null && (
              <AiFillLock className="w-6 h-6 text-red-600" />
            )}
            <button
              className="bg-blue-500 text-white py-1 px-2 rounded-md hover:bg-blue-600 w-24"
              onClick={() =>
                room.isJoined ? handleUnjoin(room) : handleJoin(room)
              }
            >
              {room.isJoined ? "Unjoin" : "Join"}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ExploreRoomsTab;
