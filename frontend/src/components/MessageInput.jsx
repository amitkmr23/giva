import { useRef, useState } from "react";
import { useChatStore } from "../store/useChatStore";
import { useAuthStore } from "../store/useAuthStore";
import toast from "react-hot-toast";
import { ImageIcon, SendIcon, XIcon } from "lucide-react";

function MessageInput() {
  const [text, setText] = useState("");
  const [imagePreview, setImagePreview] = useState(null);

  const fileInputRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  const { sendMessage, selectedUser } = useChatStore();
  const socket = useAuthStore.getState().socket;

  const handleTyping = () => {
    if (!selectedUser || !socket) return;

    socket.emit("typing", { to: selectedUser._id });
    clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => {
      socket.emit("stopTyping", { to: selectedUser._id });
    }, 1000);
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!text.trim() && !imagePreview) return;

    socket?.emit("stopTyping", { to: selectedUser._id });

    sendMessage({ text: text.trim(), image: imagePreview });

    setText("");
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <form
      onSubmit={handleSendMessage}
      className="flex items-center gap-3 px-4 py-3
                 bg-white dark:bg-gray-900 border-t dark:border-gray-800"
    >
      <input
        value={text}
        onChange={(e) => {
          setText(e.target.value);
          handleTyping();
        }}
        placeholder="Type a message"
        className="flex-1 bg-gray-100 dark:bg-gray-800
                   rounded-full px-4 py-2 outline-none
                   text-gray-900 dark:text-gray-100"
      />

      <button
        type="submit"
        className="bg-green-500 hover:bg-green-600
                   text-white p-2 rounded-full"
      >
        <SendIcon className="w-5 h-5" />
      </button>
    </form>
  );
}

export default MessageInput;



