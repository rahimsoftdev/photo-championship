import { useEffect, useState } from "react";
import { getSavedUserInfo } from "../../utils/getUserInof";
import useChat from "../../hooks/useChat";
import ChatSidebar from "../../components/userDashbaord/ChatSidebar";
import ChatMessages from "../../components/userDashbaord/ChatMessages";
import ChatInput from "../../components/userDashbaord/ChatInput";
import ChatSkeleton from "../../components/ui/Skeletons/ChatSkeleton";

// UserDashboard এর main এর padding বাদ দিয়ে উচ্চতা:
// মোবাইল: pt-24 + pb-8 = 8rem | ডেস্কটপ (lg): pt-8 + pb-8 = 4rem
const PAGE_HEIGHT = "h-[calc(100dvh-8rem)] lg:h-[calc(100dvh-4rem)]";

export default function ChatPage() {
    const userInfo = getSavedUserInfo();
    const userId = userInfo?.id;

    const {
        isLoading,
        error,
        activeUser,
        activeId,
        conversations,
        groupedMessages,
        availableUsers,
        totalUnread,
        search,
        setSearch,
        selectConversation,
        sendMessage,
        startNewChat,
        formatTime,
    } = useChat(userId);

    // ছোট ডিভাইসে কোনটা দেখাবে: "list" (সাইডবার) অথবা "chat" (মেসেজ)
    const [mobileView, setMobileView] = useState("list");

    // এই পেজে থাকলে বাইরের (পুরো পেজের) স্ক্রল বন্ধ থাকবে
    useEffect(() => {
        const prevBody = document.body.style.overflow;
        const prevHtml = document.documentElement.style.overflow;

        document.body.style.overflow = "hidden";
        document.documentElement.style.overflow = "hidden";

        return () => {
            document.body.style.overflow = prevBody;
            document.documentElement.style.overflow = prevHtml;
        };
    }, []);

    const handleSelect = (id) => {
        selectConversation(id);
        setMobileView("chat");
    };

    const handleStartNewChat = (id) => {
        startNewChat(id);
        setMobileView("chat");
    };

    if (isLoading) return <ChatSkeleton />

    if (error) {
        return (
            <div
                className={`flex w-full items-center justify-center p-4 text-center text-sm text-red-500 ${PAGE_HEIGHT}`}
            >
                {error}
            </div>
        );
    }

    return (
        <div
            className={`flex w-full overflow-hidden rounded-xl border border-[#E5E7EB] ${PAGE_HEIGHT}`}
        >
            {/* সাইডবার: ছোট ডিভাইসে চ্যাট খোলা থাকলে লুকানো */}
            <div
                className={`${mobileView === "chat" ? "hidden" : "flex"
                    } h-full w-full shrink-0 border-[#E5E7EB] bg-white lg:flex lg:w-[300px] lg:border-r xl:w-[330px]`}
            >
                <ChatSidebar
                    currentUserId={userId}
                    conversations={conversations}
                    activeId={activeId}
                    onSelect={handleSelect}
                    search={search}
                    onSearch={setSearch}
                    totalUnread={totalUnread}
                    availableUsers={availableUsers}
                    onStartNewChat={handleStartNewChat}
                    formatTime={formatTime}
                />
            </div>

            {/* মেসেজ + ইনপুট: ব্যাকগ্রাউন্ড transparent, তাই ড্যাশবোর্ডের bg দেখা যাবে */}
            <div
                className={`${mobileView === "list" ? "hidden" : "flex"
                    } h-full min-w-0 flex-1 flex-col overflow-hidden lg:flex`}
            >
                <ChatMessages
                    currentUserId={userId}
                    activeUser={activeUser}
                    groupedMessages={groupedMessages}
                    formatTime={formatTime}
                    onBack={() => setMobileView("list")}
                />
                {activeUser && <ChatInput onSend={sendMessage} />}
            </div>
        </div>
    );
}