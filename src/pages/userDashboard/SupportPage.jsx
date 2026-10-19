import React, { useState } from 'react';
import { 
  FiSend, 
  FiMail, 
  FiChevronRight, 
  FiX, 
  FiPaperclip, 
  FiLock 
} from 'react-icons/fi';
import { HiCheckBadge } from 'react-icons/hi2';

const SupportPage = () => {
  // Form State
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    subject: '',
    message: ''
  });

  // Filter State (All, Pending, Replied)
  const [activeFilter, setActiveFilter] = useState('All');

  // Conversations List State
  const [conversations, setConversations] = useState([
    {
      id: 1,
      subject: 'Unable to export analytics report',
      lastMessage: 'Thanks for the details — we\'ve pushed a fix. Could you try again?',
      status: 'Replied',
      time: '2h ago',
      messages: [
        {
          id: 101,
          sender: 'user',
          text: 'When I try to export the weekly analytics report as CSV, the download fails silently after ~5 seconds. Chrome, latest version.',
          time: '9:42 AM',
          read: true
        },
        {
          id: 102,
          sender: 'support',
          senderInitial: 'S',
          text: 'Hey Alex — thanks for reporting this. We reproduced the issue on our side and it\'s tied to reports with more than 10k rows. We\'ve deployed a patch.',
          time: '10:15 AM'
        },
        {
          id: 103,
          sender: 'support',
          senderInitial: 'S',
          text: 'Could you retry the export and let us know if it completes? Attaching a screenshot of the fixed flow for reference.',
          attachment: {
            name: 'export-flow-fix.png',
            size: '184 KB'
          },
          time: '10:16 AM'
        }
      ]
    },
    {
      id: 2,
      subject: 'Unable to export analytics report',
      lastMessage: 'Thanks for the details — we\'ve pushed a fix. Could you try again?',
      status: 'Replied',
      time: '2h ago',
      messages: [
        {
          id: 201,
          sender: 'user',
          text: 'Issue with downloading report.',
          time: '9:00 AM',
          read: true
        }
      ]
    },
    {
      id: 3,
      subject: 'Unable to export analytics report',
      lastMessage: 'Thanks for the details — we\'ve pushed a fix. Could you try again?',
      status: 'Pending',
      time: '2h ago',
      messages: [
        {
          id: 301,
          sender: 'user',
          text: 'Still waiting for response on my query.',
          time: '11:00 AM',
          read: false
        }
      ]
    },
    {
      id: 4,
      subject: 'Unable to export analytics report',
      lastMessage: 'Thanks for the details — we\'ve pushed a fix. Could you try again?',
      status: 'Replied',
      time: '2h ago',
      messages: []
    }
  ]);

  // Modal Selected Conversation State
  const [selectedConversation, setSelectedConversation] = useState(null);

  // Handle Input Changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle Form Submit
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.fullName || !formData.email || !formData.subject || !formData.message) {
      alert('Please fill in all fields');
      return;
    }

    const newConversation = {
      id: Date.now(),
      subject: formData.subject,
      lastMessage: formData.message,
      status: 'Pending',
      time: 'Just now',
      messages: [
        {
          id: Date.now() + 1,
          sender: 'user',
          text: formData.message,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          read: false
        }
      ]
    };

    setConversations([newConversation, ...conversations]);
    setFormData({ fullName: '', email: '', subject: '', message: '' });
  };

  // Filter Conversations
  const filteredConversations = conversations.filter((conv) => {
    if (activeFilter === 'All') return true;
    return conv.status === activeFilter;
  });

  return (
    <div className="min-h-screen bg-[#FDFDFD] p-6 lg:p-12 text-slate-800 font-sans">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10">
        
        {/* Left Column: Contact Support Form */}
        <div>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Contact Support</h1>
          <p className="text-gray-500 mb-6 text-sm">
            Need help? Send us a message and our support team will get back to you as soon as possible.
          </p>

          <div className="bg-white p-6 sm:p-8 rounded-2xl border border-gray-100 shadow-sm">
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Full Name */}
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    placeholder="Enter your full name"
                    className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:border-gray-400 text-sm text-slate-800 placeholder-gray-400"
                  />
                </div>

                {/* Email Address */}
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="Enter your email"
                    className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:border-gray-400 text-sm text-slate-800 placeholder-gray-400"
                  />
                </div>
              </div>

              {/* Subject */}
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                  Subject
                </label>
                <input
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleInputChange}
                  placeholder="Choose a subject"
                  className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:border-gray-400 text-sm text-slate-800 placeholder-gray-400"
                />
              </div>

              {/* Message */}
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                  Message
                </label>
                <textarea
                  name="message"
                  rows={6}
                  value={formData.message}
                  onChange={handleInputChange}
                  placeholder="Write your message here..."
                  className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:border-gray-400 text-sm text-slate-800 placeholder-gray-400 resize-none"
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full bg-secondary text-white py-3.5 px-6 rounded-full font-medium hover:opacity-95 transition-all flex items-center justify-center gap-2 shadow-sm"
              >
                <FiSend className="w-4 h-4 rotate-45" />
                <span>Send Message</span>
              </button>
            </form>
          </div>
        </div>

        {/* Right Column: Your Conversations */}
        <div>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Your conversations</h1>
          <p className="text-gray-500 mb-6 text-sm">
            Track and revisit previous support threads.
          </p>

          <div className="bg-white p-6 sm:p-8 rounded-2xl border border-gray-100 shadow-sm min-h-[500px]">
            {/* Filter Tabs */}
            <div className="flex items-center gap-2 mb-6">
              {['All', 'Pending', 'Replied'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveFilter(tab)}
                  className={`px-5 py-1.5 rounded-full text-xs font-medium transition-all ${
                    activeFilter === tab
                      ? 'bg-primary text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* Conversation List */}
            <div className="space-y-3">
              {filteredConversations.length > 0 ? (
                filteredConversations.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => setSelectedConversation(item)}
                    className="flex items-center justify-between p-4 rounded-xl border border-transparent hover:border-gray-100 hover:bg-gray-50/60 transition cursor-pointer group"
                  >
                    <div className="flex items-start gap-4">
                      {/* Mail Icon Container */}
                      <div className="w-10 h-10 rounded-lg bg-blue-50/70 text-primary flex items-center justify-center flex-shrink-0 mt-0.5">
                        <FiMail className="w-5 h-5" />
                      </div>

                      {/* Content */}
                      <div>
                        <h3 className="font-semibold text-slate-800 text-sm mb-0.5">
                          {item.subject}
                        </h3>
                        <p className="text-xs text-gray-500 line-clamp-1 mb-2">
                          {item.lastMessage}
                        </p>

                        <div className="flex items-center gap-2 text-[11px]">
                          {item.status === 'Replied' ? (
                            <span className="inline-flex items-center gap-1 bg-green-100/70 text-green-700 px-2 py-0.5 rounded-full font-medium">
                              <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
                              Replied
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 bg-amber-100/70 text-amber-700 px-2 py-0.5 rounded-full font-medium">
                              <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                              Pending
                            </span>
                          )}
                          <span className="text-gray-400">• {item.time}</span>
                        </div>
                      </div>
                    </div>

                    <FiChevronRight className="w-4 h-4 text-gray-400 group-hover:text-gray-600 transition" />
                  </div>
                ))
              ) : (
                <p className="text-center text-gray-400 py-12 text-sm">
                  No conversations found in {activeFilter}.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Conversation Modal */}
      {selectedConversation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
          <div className="bg-white w-full max-w-xl rounded-2xl shadow-xl overflow-hidden flex flex-col max-h-[90vh]">
            
            {/* Modal Header */}
            <div className="p-6 border-b border-gray-100 flex items-start justify-between">
              <div>
                <div className="flex items-center gap-3">
                  <h2 className="text-lg font-bold text-slate-800">
                    {selectedConversation.subject}
                  </h2>
                  <span className="inline-flex items-center gap-1 bg-green-100 text-green-700 text-xs px-2.5 py-0.5 rounded-full font-medium">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
                    {selectedConversation.status}
                  </span>
                </div>
                <p className="text-xs text-gray-400 mt-1">
                  Last updated {selectedConversation.time} •
                </p>
              </div>

              <button
                onClick={() => setSelectedConversation(null)}
                className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100 transition"
              >
                <FiX className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body / Chat Area */}
            <div className="p-6 overflow-y-auto space-y-6 flex-1 bg-[#FAFAFA]">
              {/* Date Divider */}
              <div className="flex justify-center">
                <span className="text-[11px] bg-gray-100 text-gray-500 px-3 py-1 rounded-full">
                  Today
                </span>
              </div>

              {/* Messages */}
              {selectedConversation.messages && selectedConversation.messages.length > 0 ? (
                selectedConversation.messages.map((msg) => (
                  <div key={msg.id}>
                    {msg.sender === 'user' ? (
                      /* User Message Right Aligned */
                      <div className="flex items-start justify-end gap-3">
                        <div className="flex flex-col items-end max-w-[80%]">
                          <div className="bg-primary text-white p-4 rounded-2xl rounded-tr-none text-xs leading-relaxed shadow-sm">
                            {msg.text}
                          </div>
                          <div className="flex items-center gap-1 mt-1 text-[10px] text-gray-400">
                            <span>{msg.time}</span>
                            <span>•</span>
                            <span className="flex items-center gap-0.5">
                              <HiCheckBadge className="w-3.5 h-3.5 text-gray-400" /> Read
                            </span>
                          </div>
                        </div>

                        <div className="w-8 h-8 rounded-full bg-primary text-white font-bold text-xs flex items-center justify-center flex-shrink-0 uppercase">
                          YOU
                        </div>
                      </div>
                    ) : (
                      /* Support Message Left Aligned */
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-full bg-slate-800 text-white font-bold text-xs flex items-center justify-center flex-shrink-0">
                          {msg.senderInitial || 'S'}
                        </div>

                        <div className="flex flex-col max-w-[80%]">
                          <div className="bg-white p-4 rounded-2xl rounded-tl-none border border-gray-100 text-xs text-slate-700 leading-relaxed shadow-sm">
                            <p>{msg.text}</p>

                            {/* Attachment File Preview if exists */}
                            {msg.attachment && (
                              <div className="mt-3 p-3 bg-gray-50 rounded-xl border border-gray-100 flex items-center gap-3">
                                <div className="p-2 bg-gray-200/60 rounded-lg text-gray-600">
                                  <FiPaperclip className="w-4 h-4" />
                                </div>
                                <div>
                                  <p className="font-semibold text-xs text-slate-800">
                                    {msg.attachment.name}
                                  </p>
                                  <p className="text-[10px] text-gray-400">
                                    {msg.attachment.size}
                                  </p>
                                </div>
                              </div>
                            )}
                          </div>
                          <span className="text-[10px] text-gray-400 mt-1">{msg.time}</span>
                        </div>
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <p className="text-center text-xs text-gray-400">No message history available.</p>
              )}
            </div>

            {/* Modal Footer / Disabled Notice */}
            <div className="p-4 bg-white border-t border-gray-100">
              <div className="p-4 bg-gray-50/80 rounded-xl border border-dashed border-gray-200 flex items-start gap-3">
                <FiLock className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                <p className="text-xs text-gray-500 leading-relaxed">
                  Please wait for the support team to reply. New messages can only be sent after receiving a response.
                </p>
              </div>
            </div>

          </div>
        </div>
      )}
    </div>
  );
};

export default SupportPage;