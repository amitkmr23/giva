import { XIcon, Moon, Sun } from "lucide-react";
import { useChatStore } from "../store/useChatStore";
import { useAuthStore } from "../store/useAuthStore";
import { useThemeStore } from "../store/useThemeStore";

function ChatHeader() {
  const { selectedUser, setSelectedUser, isTyping } = useChatStore();
  const { onlineUsers } = useAuthStore();
  const { dark, toggleTheme } = useThemeStore();

  if (!selectedUser) return null;

  const isOnline = onlineUsers.includes(selectedUser._id);

  return (
    <div className="flex items-center justify-between px-4 py-3
                    bg-white dark:bg-gray-900 border-b dark:border-gray-800">
      <div>
        <h3 className="font-medium text-gray-900 dark:text-gray-100">
          {selectedUser.fullName}
        </h3>

        {isTyping ? (
          <p className="text-xs text-green-500">Typing…</p>
        ) : (
          <p className="text-xs text-green-500">
            {isOnline ? "Online" : "Offline"}
          </p>
        )}
      </div>

      <div className="flex items-center gap-3">
        <button onClick={toggleTheme}>
          {dark ? (
            <Sun className="w-5 h-5 text-yellow-400" />
          ) : (
            <Moon className="w-5 h-5 text-gray-500" />
          )}
        </button>

        <button onClick={() => setSelectedUser(null)}>
          <XIcon className="w-5 h-5 text-gray-500 hover:text-gray-800 dark:hover:text-white" />
        </button>
      </div>
    </div>
  );
}

export default ChatHeader;

