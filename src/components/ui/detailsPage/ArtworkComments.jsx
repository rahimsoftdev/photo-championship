import React, { useState } from "react";
import { FaCheckCircle } from "react-icons/fa"; // react-icons থেকে ভেরিফায়েড আইকন
import { getSavedUserInfo } from "../../../utils/getUserInof";

const ArtworkComments = ({ artwork, isDashboard = false }) => {
  const [comments, setComments] = useState(artwork?.comments || []);
  const [newComment, setNewComment] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isDashboard) return; // dashboard-e comment kora jabe na
    if (!newComment.trim()) return;


    const userInfo = getSavedUserInfo()

    // নতুন কমেন্ট অবজেক্ট তৈরি (আপনার ডেটা স্ট্রাকচার অনুযায়ী)
    const commentObj = {
      userId: userInfo.id, // আপনার অথেন্টিকেশন সিস্টেম অনুযায়ী ইউজার আইডি দিন
      author: userInfo.name, // ডেমো ইউজার নেম বা লগইন করা ইউজারের নাম
      avatar: userInfo.image, // ডিফল্ট বা ইউজার অবতার
      text: newComment,
      isVerified: true, // চাইলে ডাইনামিক করতে পারেন
      createdAt: new Date().toISOString(),
    };

    setComments([commentObj, ...comments]);
    setNewComment("");
  };

  return (
    <div
      className="w-full rounded-2xl p-4 sm:p-6 md:p-8 mt-10 sm:mt-12 lg:mt-section shadow-sm"
      style={{ backgroundColor: "#F8FAFC" }}
    >
      {/* Comments Header */}
      <h2
        className="text-lg sm:text-xl md:text-2xl font-semibold mb-6"
        style={{ color: "#101112" }}
      >
        Comments
      </h2>

      {/* Comments List Container */}
      <div className={`space-y-6 ${isDashboard ? "" : "mb-8"}`}>
        {comments.length > 0 ? (
          comments.map((comment, index) => (
            <div key={index} className="pb-6 border-b border-gray-200 last:border-b-0">
              <div className="flex items-center justify-between flex-wrap gap-2 mb-2">
                <div className="flex items-center gap-3">
                  <img
                    src={comment.avatar || "https://picsum.photos/seed/user/100/100"}
                    alt={comment.author || "User"}
                    className="h-6 w-6 sm:w-12 sm:h-12 rounded-full object-cover shadow-sm"
                  />
                  <span
                    className="font-medium text-xs sm:text-base"
                    style={{ color: "#191C1F" }}
                  >
                    {comment.author || "Darrell Steward"}
                  </span>
                </div>

                {/* Verified Badge */}
                {comment.isVerified !== false && (
                  <span className="bg-primary text-white text-xs px-1.5  md:px-2.5 py-1 rounded-full flex items-center gap-1 font-medium">
                    <FaCheckCircle className="text-[10px]" /> Verified
                  </span>
                )}
              </div>

              {/* Comment Text */}
              <p
                className="mt-1 h-auto max-w-5xl break-words text-xs sm:text-base pl-13 sm:pl-13"
                style={{ color: "#475156" }}
              >
                {comment.text}
              </p>
            </div>
          ))
        ) : (
          <p className="text-sm text-gray-500">
            {isDashboard ? "No comments yet." : "No comments yet. Be the first to comment!"}
          </p>
        )}
      </div>

      {/* Add Comment Container (dashboard-e dekhabe na) */}
      {!isDashboard && (
        <div
          className="rounded-xl p-2 md:p-4 sm:p-6"
          style={{ backgroundColor: "#E6F0F8" }}
        >
          <h3
            className="text-sm sm:text-lg font-semibold mb-3"
            style={{ color: "#101112" }}
          >
            Comment
          </h3>

          <form onSubmit={handleSubmit}>
            {/* Comment Input Box */}
            <textarea
              rows="3"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Write your comment"
              className="w-full p-4 rounded-lg outline-none resize-none text-xs sm:text-base text-gray-800 placeholder-gray-400 border border-transparent focus:border-gray-300 transition-all"
              style={{ backgroundColor: "#FFFFFF" }}
              required
            ></textarea>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full mt-4 py-2 md-py-3 px-6 rounded-lg text-white font-medium bg-secondary hover:opacity-90 transition-opacity cursor-pointer text-sm sm:text-base"
            >
              Submit
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default ArtworkComments;