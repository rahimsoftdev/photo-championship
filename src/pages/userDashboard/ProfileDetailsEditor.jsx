import React, { useState } from 'react';
import { FiUpload, FiLock, FiCheckCircle, FiX, FiTrash2, FiImage, FiVideo } from 'react-icons/fi';

const ProfileDetailsEditor = () => {
  // Photographer Profile Form State
  const [profileData, setProfileData] = useState({
    fullName: 'Sarah Jenkins',
    username: '@sarahjenkins',
    phone: '041 8884 - 4551',
    email: 'sarah@gyk.com'
  });

  // Portfolio & Social Links State
  const [portfolioData, setPortfolioData] = useState({
    websiteUrl: 'www.israel.com',
    facebookUrl: 'www.facebook.com',
    instagramUrl: '@ismail1256',
    xUrl: '@ismail1256',
    linkedinUrl: '@ismail1256'
  });

  // Security Form State
  const [securityData, setSecurityData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  // File Preview States
  const [coverPhoto, setCoverPhoto] = useState(null);
  const [profilePhoto, setProfilePhoto] = useState(null);
  const [introVideo, setIntroVideo] = useState(null);

  // Modal State
  const [modalConfig, setModalConfig] = useState({
    isOpen: false,
    title: '',
    message: ''
  });

  // Handlers
  const handleProfileChange = (e) => {
    setProfileData({ ...profileData, [e.target.name]: e.target.value });
  };

  const handlePortfolioChange = (e) => {
    setPortfolioData({ ...portfolioData, [e.target.name]: e.target.value });
  };

  const handleSecurityChange = (e) => {
    setSecurityData({ ...securityData, [e.target.name]: e.target.value });
  };

  // Image Upload Handlers
  const handleImageUpload = (e, setPhotoState) => {
    const file = e.target.files[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setPhotoState({ file, url, name: file.name });
    }
  };

  // Video Upload Handler
  const handleVideoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setIntroVideo({
        file,
        name: file.name,
        size: (file.size / (1024 * 1024)).toFixed(2) + ' MB'
      });
    }
  };

  // Modal Helper
  const showSuccessModal = (title, message) => {
    setModalConfig({ isOpen: true, title, message });
  };

  const closeModal = () => {
    setModalConfig({ isOpen: false, title: '', message: '' });
  };

  // Form Submit Handlers
  const handleSaveProfile = (e) => {
    e.preventDefault();
    showSuccessModal(
      'Profile Updated Successfully!',
      'Your photographer profile information has been saved.'
    );
  };

  const handleSavePortfolio = (e) => {
    e.preventDefault();
    showSuccessModal(
      'Portfolio Links Saved!',
      'Your website and social media links have been successfully updated.'
    );
  };

  const handleChangePassword = (e) => {
    e.preventDefault();
    if (!securityData.currentPassword || !securityData.newPassword) {
      alert('Please fill in password fields');
      return;
    }
    if (securityData.newPassword !== securityData.confirmPassword) {
      alert('New password and confirm password do not match!');
      return;
    }
    showSuccessModal(
      'Password Changed Successfully!',
      'Your account security settings have been updated with your new password.'
    );
    setSecurityData({ currentPassword: '', newPassword: '', confirmPassword: '' });
  };

  return (
    <div className="min-h-screen bg-[#FDFDFD] p-6 lg:p-10 text-slate-800 font-sans">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Header Section */}
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">Profile Details Editor</h1>
          <p className="text-gray-500 text-xs sm:text-sm mt-1">
            Manage your artistic identity and account security settings.
          </p>
        </div>

        {/* Top Section: Grid 2 Columns */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Card 1: Your Photographer Profile */}
          <div className="bg-white p-6 sm:p-8 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-between">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Your Photographer Profile</h2>
              <p className="text-xs text-gray-400 mt-0.5 mb-6">
                Control how other photographers and judges see your public bio portfolio
              </p>

              <form onSubmit={handleSaveProfile} className="space-y-4">
                {/* Full Name */}
                <div>
                  <label className="block text-[11px] font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                    FULL NAME
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    value={profileData.fullName}
                    onChange={handleProfileChange}
                    className="w-full px-4 py-2.5 rounded-lg bg-[#F3F4F9] border border-transparent focus:border-gray-300 focus:bg-white text-sm text-slate-800 outline-none transition"
                  />
                </div>

                {/* Username */}
                <div>
                  <label className="block text-[11px] font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                    USERNAME
                  </label>
                  <input
                    type="text"
                    name="username"
                    value={profileData.username}
                    onChange={handleProfileChange}
                    className="w-full px-4 py-2.5 rounded-lg bg-[#F3F4F9] border border-transparent focus:border-gray-300 focus:bg-white text-sm text-slate-800 outline-none transition"
                  />
                </div>

                {/* Phone Number */}
                <div>
                  <label className="block text-[11px] font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                    PHONE NUMBER
                  </label>
                  <input
                    type="text"
                    name="phone"
                    value={profileData.phone}
                    onChange={handleProfileChange}
                    className="w-full px-4 py-2.5 rounded-lg bg-[#F3F4F9] border border-transparent focus:border-gray-300 focus:bg-white text-sm text-slate-800 outline-none transition"
                  />
                </div>

                {/* Email ID */}
                <div>
                  <label className="block text-[11px] font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                    EMAIL ID
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={profileData.email}
                    onChange={handleProfileChange}
                    className="w-full px-4 py-2.5 rounded-lg bg-[#F3F4F9] border border-transparent focus:border-gray-300 focus:bg-white text-sm text-slate-800 outline-none transition"
                  />
                </div>

                {/* Save Button */}
                <div className="pt-2">
                  <button
                    type="submit"
                    className="bg-secondary text-white px-6 py-2 rounded-lg text-xs font-semibold hover:opacity-90 transition shadow-sm active:scale-95"
                  >
                    Save
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* Card 2: Portfolio */}
          <div className="bg-white p-6 sm:p-8 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-between">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Portfolio</h2>
              <p className="text-xs text-gray-400 mt-0.5 mb-6">
                Upload your portfolio and social media link
              </p>

              <form onSubmit={handleSavePortfolio} className="p-5 rounded-xl bg-[#EEF2FC]/50 space-y-4">
                {/* Website URL */}
                <div>
                  <label className="block text-[10px] font-medium text-gray-500 mb-1">
                    Website URL
                  </label>
                  <input
                    type="text"
                    name="websiteUrl"
                    value={portfolioData.websiteUrl}
                    onChange={handlePortfolioChange}
                    className="w-full px-3.5 py-2 rounded-lg bg-white border border-gray-100 text-xs text-slate-800 outline-none focus:border-gray-300"
                  />
                </div>

                {/* Facebook & Instagram */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] font-medium text-gray-500 mb-1">
                      Facebook URL
                    </label>
                    <input
                      type="text"
                      name="facebookUrl"
                      value={portfolioData.facebookUrl}
                      onChange={handlePortfolioChange}
                      className="w-full px-3.5 py-2 rounded-lg bg-white border border-gray-100 text-xs text-slate-800 outline-none focus:border-gray-300"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-medium text-gray-500 mb-1">
                      Instagram URL
                    </label>
                    <input
                      type="text"
                      name="instagramUrl"
                      value={portfolioData.instagramUrl}
                      onChange={handlePortfolioChange}
                      className="w-full px-3.5 py-2 rounded-lg bg-white border border-gray-100 text-xs text-slate-800 outline-none focus:border-gray-300"
                    />
                  </div>
                </div>

                {/* X & Linkedin */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] font-medium text-gray-500 mb-1">
                      X URL
                    </label>
                    <input
                      type="text"
                      name="xUrl"
                      value={portfolioData.xUrl}
                      onChange={handlePortfolioChange}
                      className="w-full px-3.5 py-2 rounded-lg bg-white border border-gray-100 text-xs text-slate-800 outline-none focus:border-gray-300"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-medium text-gray-500 mb-1">
                      LinkedIn URL
                    </label>
                    <input
                      type="text"
                      name="linkedinUrl"
                      value={portfolioData.linkedinUrl}
                      onChange={handlePortfolioChange}
                      className="w-full px-3.5 py-2 rounded-lg bg-white border border-gray-100 text-xs text-slate-800 outline-none focus:border-gray-300"
                    />
                  </div>
                </div>

                {/* Save Button */}
                <div className="pt-2">
                  <button
                    type="submit"
                    className="bg-secondary text-white px-6 py-2 rounded-lg text-xs font-semibold hover:opacity-90 transition shadow-sm active:scale-95"
                  >
                    Save
                  </button>
                </div>
              </form>
            </div>
          </div>

        </div>

        {/* Cover Photo Upload */}
        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-gray-100 shadow-sm">
          <h2 className="text-sm font-bold text-slate-900">Cover Photo</h2>
          <p className="text-xs text-gray-400 mt-0.5 mb-4">
            Help your pro prepare by showing them the work area. Optional but highly recommended.
          </p>

          {coverPhoto ? (
            <div className="relative rounded-xl overflow-hidden border border-gray-200 group h-48 bg-slate-900">
              <img src={coverPhoto.url} alt="Cover Preview" className="w-full h-full object-cover opacity-90" />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center gap-3">
                <label className="bg-white/90 text-slate-800 px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer hover:bg-white transition flex items-center gap-1.5">
                  <FiImage /> Change Photo
                  <input type="file" className="hidden" accept="image/*" onChange={(e) => handleImageUpload(e, setCoverPhoto)} />
                </label>
                <button
                  onClick={() => setCoverPhoto(null)}
                  className="bg-secondary/90 text-white p-2 rounded-lg text-xs hover:bg-secondary transition"
                >
                  <FiTrash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ) : (
            <label className="border-2 border-dashed border-gray-200 rounded-xl p-8 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-gray-50/50 transition">
              <FiUpload className="w-6 h-6 text-gray-400 mb-2" />
              <p className="text-xs font-semibold text-slate-700">Click to upload photos or drag & drop</p>
              <p className="text-[10px] text-gray-400 mt-1">JPG, PNG, — max 20MB each</p>
              <input type="file" className="hidden" accept="image/*" onChange={(e) => handleImageUpload(e, setCoverPhoto)} />
            </label>
          )}
        </div>

        {/* Profile Photo Upload */}
        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-gray-100 shadow-sm">
          <h2 className="text-sm font-bold text-slate-900">Profile Photo</h2>
          <p className="text-xs text-gray-400 mt-0.5 mb-4">
            Help your pro prepare by showing them the work area. Optional but highly recommended.
          </p>

          {profilePhoto ? (
            <div className="flex items-center gap-5 p-4 rounded-xl border border-gray-200 bg-gray-50/50">
              <img src={profilePhoto.url} alt="Profile Preview" className="w-20 h-20 rounded-full object-cover border-2 border-white shadow-sm" />
              <div>
                <p className="text-xs font-semibold text-slate-800">{profilePhoto.name}</p>
                <div className="flex items-center gap-3 mt-2">
                  <label className="text-xs text-primary font-medium hover:underline cursor-pointer">
                    Change Photo
                    <input type="file" className="hidden" accept="image/*" onChange={(e) => handleImageUpload(e, setProfilePhoto)} />
                  </label>
                  <button onClick={() => setProfilePhoto(null)} className="text-xs text-secondary font-medium hover:underline">
                    Remove
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <label className="border-2 border-dashed border-gray-200 rounded-xl p-8 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-gray-50/50 transition">
              <FiUpload className="w-6 h-6 text-gray-400 mb-2" />
              <p className="text-xs font-semibold text-slate-700">Click to upload photos or drag & drop</p>
              <p className="text-[10px] text-gray-400 mt-1">JPG, PNG, — max 20MB each</p>
              <input type="file" className="hidden" accept="image/*" onChange={(e) => handleImageUpload(e, setProfilePhoto)} />
            </label>
          )}
        </div>

        {/* Introduction Video Upload */}
        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-gray-100 shadow-sm">
          <h2 className="text-sm font-bold text-slate-900 mb-4">Introduction Video</h2>

          {introVideo ? (
            <div className="flex items-center justify-between p-4 rounded-xl border border-gray-200 bg-gray-50/50">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-blue-100 text-primary rounded-lg">
                  <FiVideo className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-slate-800">{introVideo.name}</p>
                  <p className="text-[10px] text-gray-400">{introVideo.size}</p>
                </div>
              </div>
              <button onClick={() => setIntroVideo(null)} className="text-secondary p-2 hover:bg-red-50 rounded-lg transition">
                <FiTrash2 className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <label className="border-2 border-dashed border-gray-200 rounded-xl p-12 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-gray-50/50 transition">
              <FiUpload className="w-6 h-6 text-gray-400 mb-2" />
              <p className="text-xs font-semibold text-slate-700">Upload Video</p>
              <p className="text-[10px] text-gray-400 mt-1">MP4 • maximum 3 minute video</p>
              <input type="file" className="hidden" accept="video/mp4,video/mkv" onChange={handleVideoUpload} />
            </label>
          )}
        </div>

        {/* Account Security Section */}
        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-gray-100 shadow-sm">
          <h2 className="text-lg font-bold text-slate-900">Account Security</h2>
          <p className="text-xs text-gray-400 mt-0.5 mb-6">
            Manage your access and safeguard your creative portfolio
          </p>

          <div className="p-6 rounded-xl bg-[#EEF2FC]/50">
            <div className="flex items-center gap-2 text-xs font-semibold text-indigo-900 mb-4">
              <FiLock className="w-4 h-4 text-indigo-600" />
              <span>Set New Password</span>
            </div>

            <form onSubmit={handleChangePassword} className="space-y-4">
              {/* Current Password */}
              <div>
                <label className="block text-[10px] font-medium text-gray-500 mb-1">
                  Current Password
                </label>
                <input
                  type="password"
                  name="currentPassword"
                  placeholder="••••••••"
                  value={securityData.currentPassword}
                  onChange={handleSecurityChange}
                  className="w-full px-3.5 py-2 rounded-lg bg-white border border-gray-100 text-xs text-slate-800 outline-none focus:border-gray-300"
                />
              </div>

              {/* New & Confirm Password */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-medium text-gray-500 mb-1">
                    New Password
                  </label>
                  <input
                    type="password"
                    name="newPassword"
                    placeholder="••••••••"
                    value={securityData.newPassword}
                    onChange={handleSecurityChange}
                    className="w-full px-3.5 py-2 rounded-lg bg-white border border-gray-100 text-xs text-slate-800 outline-none focus:border-gray-300"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-medium text-gray-500 mb-1">
                    Confirm New Password
                  </label>
                  <input
                    type="password"
                    name="confirmPassword"
                    placeholder="••••••••"
                    value={securityData.confirmPassword}
                    onChange={handleSecurityChange}
                    className="w-full px-3.5 py-2 rounded-lg bg-white border border-gray-100 text-xs text-slate-800 outline-none focus:border-gray-300"
                  />
                </div>
              </div>

              {/* Change Password Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  className="bg-secondary text-white px-5 py-2 rounded-lg text-xs font-semibold hover:opacity-90 transition shadow-sm active:scale-95"
                >
                  Change Password
                </button>
              </div>
            </form>
          </div>
        </div>

      </div>

      {/* Confirmation Modal */}
      {modalConfig.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-fadeIn">
          <div className="bg-white w-full max-w-sm rounded-2xl p-6 shadow-2xl text-center space-y-4 relative animate-scaleUp">
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition"
            >
              <FiX className="w-5 h-5" />
            </button>

            <div className="w-14 h-14 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto">
              <FiCheckCircle className="w-8 h-8" />
            </div>

            <div>
              <h3 className="text-lg font-bold text-slate-900">{modalConfig.title}</h3>
              <p className="text-xs text-gray-500 mt-1 leading-relaxed">{modalConfig.message}</p>
            </div>

            <button
              onClick={closeModal}
              className="w-full bg-slate-900 text-white py-2.5 rounded-xl text-xs font-semibold hover:bg-slate-800 transition"
            >
              Done
            </button>
          </div>
        </div>
      )}

    </div>
  );
};

export default ProfileDetailsEditor;