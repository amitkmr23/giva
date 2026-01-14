import { useEffect } from "react";
import { useChatStore } from "../store/useChatStore";
import UsersLoadingSkeleton from "./UsersLoadingSkeleton";
import NoChatsFound from "./NoChatsFound";
import { useAuthStore } from "../store/useAuthStore";

function ChatsList() {
  const {
    getMyChatPartners,
    chats,
    isUsersLoading,
    setSelectedUser,
    unreadCounts,
  } = useChatStore();

  const { onlineUsers } = useAuthStore();

  useEffect(() => {
    getMyChatPartners();
  }, [getMyChatPartners]);

  if (isUsersLoading) return <UsersLoadingSkeleton />;
  if (chats.length === 0) return <NoChatsFound />;

  return (
    <>
      {chats.map((chat) => (
        <div
          key={chat._id}
          onClick={() => setSelectedUser(chat)}
          className="flex items-center gap-3 px-4 py-3 cursor-pointer
                     hover:bg-gray-100 dark:hover:bg-gray-800 transition"
        >
          <div className="relative">
            <img
              src={chat.profilePic || "/avatar.png"}
              alt={chat.fullName}
              className="w-12 h-12 rounded-full"
            />
            {onlineUsers.includes(chat._id) && (
              <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500
                               rounded-full border-2 border-white dark:border-gray-900" />
            )}
          </div>

          <div className="flex-1 min-w-0">
            <h4 className="font-medium text-gray-900 dark:text-gray-100 truncate">
              {chat.fullName}
            </h4>
            <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
              {chat.lastMessage || "No messages yet"}
            </p>
          </div>

          {unreadCounts?.[chat._id] > 0 && (
            <span className="bg-green-500 text-white text-xs px-2 rounded-full">
              {unreadCounts[chat._id]}
            </span>
          )}
        </div>
      ))}
    </>
  );
}

export default ChatsList;



