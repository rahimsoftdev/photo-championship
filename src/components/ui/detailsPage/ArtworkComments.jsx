import React, { useState } from "react";
import { FaCheckCircle } from "react-icons/fa"; // react-icons থেকে ভেরিফায়েড আইকন

const ArtworkComments = ({ artwork }) => {
  const [comments, setComments] = useState(artwork?.comments || []);
  const [newComment, setNewComment] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    // নতুন কমেন্ট অবজেক্ট তৈরি (আপনার ডেটা স্ট্রাকচার অনুযায়ী)
    const commentObj = {
      userId: "current_user", // আপনার অথেন্টিকেশন সিস্টেম অনুযায়ী ইউজার আইডি দিন
      author: "Rahim Sikdar", // ডেমো ইউজার নেম বা লগইন করা ইউজারের নাম
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80", // ডিফল্ট বা ইউজার অবতার
      text: newComment,
      isVerified: true, // চাইলে ডাইনামিক করতে পারেন
      createdAt: new Date().toISOString(),
    };

    setComments([commentObj, ...comments]);
    setNewComment("");
  };

  return (
    <div
      className="w-full rounded-2xl p-4 sm:p-6 md:p-8 mt-6 shadow-sm"
      style={{ backgroundColor: "#F8FAFC" }}
    >
      {/* Comments Header */}
      <h2
        className="text-xl sm:text-2xl font-semibold mb-6"
        style={{ color: "#101112" }}
      >
        Comments
      </h2>

      {/* Comments List Container */}
      <div className="space-y-6 mb-8">
        {comments.length > 0 ? (
          comments.map((comment, index) => (
            <div key={index} className="pb-6 border-b border-gray-200 last:border-b-0">
              <div className="flex items-center justify-between flex-wrap gap-2 mb-2">
                <div className="flex items-center gap-3">
                  <img
                    src={comment.avatar || "https://picsum.photos/seed/user/100/100"}
                    alt={comment.author || "User"}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <span
                    className="font-medium text-sm sm:text-base"
                    style={{ color: "#191C1F" }}
                  >
                    {comment.author || "Darrell Steward"}
                  </span>
                </div>

                {/* Verified Badge */}
                {comment.isVerified !== false && (
                  <span className="bg-primary text-white text-xs px-2.5 py-1 rounded-full flex items-center gap-1 font-medium">
                    <FaCheckCircle className="text-[10px]" /> Verified
                  </span>
                )}
              </div>

              {/* Comment Text */}
              <p
                className="text-sm sm:text-base pl-13 sm:pl-13 mt-1"
                style={{ color: "#475156" }}
              >
                {comment.text}
              </p>
            </div>
          ))
        ) : (
          <p className="text-sm text-gray-500">No comments yet. Be the first to comment!</p>
        )}
      </div>

      {/* Add Comment Container */}
      <div
        className="rounded-xl p-4 sm:p-6"
        style={{ backgroundColor: "#E6F0F8" }}
      >
        <h3
          className="text-base sm:text-lg font-semibold mb-3"
          style={{ color: "#101112" }}
        >
          Comment
        </h3>

        <form onSubmit={handleSubmit}>
          {/* Comment Input Box */}
          <textarea
            rows="4"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Write your comment"
            className="w-full p-4 rounded-lg outline-none resize-none text-sm sm:text-base text-gray-800 placeholder-gray-400 border border-transparent focus:border-gray-300 transition-all"
            style={{ backgroundColor: "#FFFFFF" }}
            required
          ></textarea>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full mt-4 py-3 px-6 rounded-lg text-white font-medium bg-secondary hover:opacity-90 transition-opacity cursor-pointer text-sm sm:text-base"
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};

export default ArtworkComments;