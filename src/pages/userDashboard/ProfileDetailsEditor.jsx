import React, { useState, useEffect } from 'react';
import { FiUpload, FiLock, FiCheckCircle, FiX, FiTrash2, FiImage, FiVideo } from 'react-icons/fi';

const inputProfile =
  'w-full px-4 py-2.5 rounded-lg bg-[#F1F3FF] border border-transparent focus:border-gray-300 focus:bg-white text-sm text-slate-800 outline-none transition';
const inputSmall =
  'w-full px-3.5 py-2 rounded-lg bg-white border border-gray-100 text-xs text-slate-800 outline-none focus:border-gray-300';
const labelProfile =
  'block text-[11px] font-semibold text-gray-500 uppercase tracking-wider mb-1.5';
const labelSmall = 'block text-[10px] font-medium text-gray-500 mb-1';
const saveBtn =
  'bg-secondary text-white px-6 py-2 rounded-lg text-xs font-semibold hover:opacity-90 transition shadow-sm active:scale-95';
const card = 'bg-white p-4 sm:p-6 lg:p-8 rounded-2xl border border-gray-100 shadow-sm';

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

  // Lock background scroll while modal is open + close on Escape
  useEffect(() => {
    if (!modalConfig.isOpen) return;

    const scrollBarWidth = window.innerWidth - document.documentElement.clientWidth;
    const prevOverflow = document.body.style.overflow;
    const prevPaddingRight = document.body.style.paddingRight;

    document.body.style.overflow = 'hidden';
    if (scrollBarWidth > 0) {
      document.body.style.paddingRight = `${scrollBarWidth}px`;
    }

    const onKeyDown = (e) => {
      if (e.key === 'Escape') {
        setModalConfig({ isOpen: false, title: '', message: '' });
      }
    };
    window.addEventListener('keydown', onKeyDown);

    return () => {
      document.body.style.overflow = prevOverflow;
      document.body.style.paddingRight = prevPaddingRight;
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [modalConfig.isOpen]);

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
    <div className="min-h-screen  text-slate-800 font-sans overflow-x-hidden">
      {/* Modal animations */}
      <style>{`
        @keyframes pd-fade-in { from { opacity: 0 } to { opacity: 1 } }
        @keyframes pd-slide-up { from { transform: translateY(100%) } to { transform: translateY(0) } }
        @keyframes pd-pop-in { from { opacity: 0; transform: translateY(12px) scale(.96) } to { opacity: 1; transform: translateY(0) scale(1) } }
        .pd-backdrop { animation: pd-fade-in .2s ease-out both }
        .pd-panel { animation: pd-slide-up .3s cubic-bezier(.32,.72,0,1) both }
        @media (min-width: 640px) { .pd-panel { animation: pd-pop-in .22s ease-out both } }
      `}</style>

      <div className=" space-y-6 sm:space-y-8">

        {/* Header Section */}
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">Profile Details Editor</h1>
          <p className="text-gray-500 text-xs sm:text-sm mt-1">
            Manage your artistic identity and account security settings.
          </p>
        </div>

        {/* Top Section: Grid 2 Columns */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">

          {/* Card 1: Your Photographer Profile */}
          <div className={`${card} min-w-0`}>
            <h2 className="text-base sm:text-lg font-bold text-slate-900">Your Photographer Profile</h2>
            <p className="text-xs text-gray-400 mt-0.5 mb-5 sm:mb-6">
              Control how other photographers and judges see your public bio portfolio
            </p>

            <form onSubmit={handleSaveProfile} className="space-y-4">
              <div>
                <label className={labelProfile}>FULL NAME</label>
                <input
                  type="text"
                  name="fullName"
                  value={profileData.fullName}
                  onChange={handleProfileChange}
                  className={inputProfile}
                />
              </div>

              <div>
                <label className={labelProfile}>USERNAME</label>
                <input
                  type="text"
                  name="username"
                  value={profileData.username}
                  onChange={handleProfileChange}
                  className={inputProfile}
                />
              </div>

              <div>
                <label className={labelProfile}>PHONE NUMBER</label>
                <input
                  type="text"
                  name="phone"
                  value={profileData.phone}
                  onChange={handleProfileChange}
                  className={inputProfile}
                />
              </div>

              <div>
                <label className={labelProfile}>EMAIL ID</label>
                <input
                  type="email"
                  name="email"
                  value={profileData.email}
                  onChange={handleProfileChange}
                  className={inputProfile}
                />
              </div>

              <div className="pt-2">
                <button type="submit" className={saveBtn}>
                  Save
                </button>
              </div>
            </form>
          </div>

          {/* Card 2: Portfolio */}
          <div className={`${card} min-w-0`}>
            <h2 className="text-base sm:text-lg font-bold text-slate-900">Portfolio</h2>
            <p className="text-xs text-gray-400 mt-0.5 mb-5 sm:mb-6">
              Upload your portfolio and social media link
            </p>

            <form
              onSubmit={handleSavePortfolio}
              className="p-4 sm:p-5 rounded-xl bg-[#F1F3FF] space-y-4"
            >
              <div>
                <label className={labelSmall}>Website URL</label>
                <input
                  type="text"
                  name="websiteUrl"
                  value={portfolioData.websiteUrl}
                  onChange={handlePortfolioChange}
                  className={inputSmall}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className={labelSmall}>Facebook URL</label>
                  <input
                    type="text"
                    name="facebookUrl"
                    value={portfolioData.facebookUrl}
                    onChange={handlePortfolioChange}
                    className={inputSmall}
                  />
                </div>
                <div>
                  <label className={labelSmall}>Instagram URL</label>
                  <input
                    type="text"
                    name="instagramUrl"
                    value={portfolioData.instagramUrl}
                    onChange={handlePortfolioChange}
                    className={inputSmall}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className={labelSmall}>X URL</label>
                  <input
                    type="text"
                    name="xUrl"
                    value={portfolioData.xUrl}
                    onChange={handlePortfolioChange}
                    className={inputSmall}
                  />
                </div>
                <div>
                  <label className={labelSmall}>LinkedIn URL</label>
                  <input
                    type="text"
                    name="linkedinUrl"
                    value={portfolioData.linkedinUrl}
                    onChange={handlePortfolioChange}
                    className={inputSmall}
                  />
                </div>
              </div>

              <div className="pt-2">
                <button type="submit" className={saveBtn}>
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Cover Photo Upload */}
        <div className={card}>
          <h2 className="text-sm font-bold text-slate-900">Cover Photo</h2>
          <p className="text-xs text-gray-400 mt-0.5 mb-4">
            Help your pro prepare by showing them the work area. Optional but highly recommended.
          </p>

          {coverPhoto ? (
            <div className="relative rounded-xl overflow-hidden border border-gray-200 group h-40 sm:h-48 lg:h-56 bg-slate-900">
              <img
                src={coverPhoto.url}
                alt="Cover Preview"
                className="w-full h-full object-cover opacity-90"
              />
              {/* Always visible on touch devices, hover-only on desktop */}
              <div className="absolute inset-0 bg-black/40 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition flex items-center justify-center gap-3 p-2">
                <label className="bg-white/90 text-slate-800 px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer hover:bg-white transition flex items-center gap-1.5">
                  <FiImage /> Change Photo
                  <input
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={(e) => handleImageUpload(e, setCoverPhoto)}
                  />
                </label>
                <button
                  type="button"
                  onClick={() => setCoverPhoto(null)}
                  aria-label="Remove cover photo"
                  className="bg-secondary/90 text-white p-2 rounded-lg text-xs hover:bg-secondary transition"
                >
                  <FiTrash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ) : (
            <label className="border-2 border-dashed border-gray-200 rounded-xl p-6 sm:p-8 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-gray-50/50 transition">
              <FiUpload className="w-6 h-6 text-gray-400 mb-2" />
              <p className="text-xs font-semibold text-slate-700">
                Click to upload photos or drag & drop
              </p>
              <p className="text-[10px] text-gray-400 mt-1">JPG, PNG, — max 20MB each</p>
              <input
                type="file"
                className="hidden"
                accept="image/*"
                onChange={(e) => handleImageUpload(e, setCoverPhoto)}
              />
            </label>
          )}
        </div>

        {/* Profile Photo Upload */}
        <div className={card}>
          <h2 className="text-sm font-bold text-slate-900">Profile Photo</h2>
          <p className="text-xs text-gray-400 mt-0.5 mb-4">
            Help your pro prepare by showing them the work area. Optional but highly recommended.
          </p>

          {profilePhoto ? (
            <div className="flex items-center gap-4 sm:gap-5 p-3 sm:p-4 rounded-xl border border-gray-200 bg-gray-50/50">
              <img
                src={profilePhoto.url}
                alt="Profile Preview"
                className="w-16 h-16 sm:w-20 sm:h-20 rounded-full object-cover border-2 border-white shadow-sm flex-shrink-0"
              />
              <div className="min-w-0">
                <p className="text-xs font-semibold text-slate-800 truncate">{profilePhoto.name}</p>
                <div className="flex items-center gap-3 mt-2">
                  <label className="text-xs text-primary font-medium hover:underline cursor-pointer">
                    Change Photo
                    <input
                      type="file"
                      className="hidden"
                      accept="image/*"
                      onChange={(e) => handleImageUpload(e, setProfilePhoto)}
                    />
                  </label>
                  <button
                    type="button"
                    onClick={() => setProfilePhoto(null)}
                    className="text-xs text-secondary font-medium hover:underline"
                  >
                    Remove
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <label className="border-2 border-dashed border-gray-200 rounded-xl p-6 sm:p-8 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-gray-50/50 transition">
              <FiUpload className="w-6 h-6 text-gray-400 mb-2" />
              <p className="text-xs font-semibold text-slate-700">
                Click to upload photos or drag & drop
              </p>
              <p className="text-[10px] text-gray-400 mt-1">JPG, PNG, — max 20MB each</p>
              <input
                type="file"
                className="hidden"
                accept="image/*"
                onChange={(e) => handleImageUpload(e, setProfilePhoto)}
              />
            </label>
          )}
        </div>

        {/* Introduction Video Upload */}
        <div className={card}>
          <h2 className="text-sm font-bold text-slate-900 mb-4">Introduction Video</h2>

          {introVideo ? (
            <div className="flex items-center justify-between gap-3 p-3 sm:p-4 rounded-xl border border-gray-200 bg-gray-50/50">
              <div className="flex items-center gap-3 min-w-0">
                <div className="p-3 bg-blue-100 text-primary rounded-lg flex-shrink-0">
                  <FiVideo className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-semibold text-slate-800 truncate">{introVideo.name}</p>
                  <p className="text-[10px] text-gray-400">{introVideo.size}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIntroVideo(null)}
                aria-label="Remove video"
                className="text-secondary p-2 hover:bg-red-50 rounded-lg transition flex-shrink-0"
              >
                <FiTrash2 className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <label className="border-2 border-dashed border-gray-200 rounded-xl p-8 sm:p-12 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-gray-50/50 transition">
              <FiUpload className="w-6 h-6 text-gray-400 mb-2" />
              <p className="text-xs font-semibold text-slate-700">Upload Video</p>
              <p className="text-[10px] text-gray-400 mt-1">MP4 • maximum 3 minute video</p>
              <input
                type="file"
                className="hidden"
                accept="video/mp4,video/mkv"
                onChange={handleVideoUpload}
              />
            </label>
          )}
        </div>

        {/* Account Security Section */}
        <div className={card}>
          <h2 className="text-base sm:text-lg font-bold text-slate-900">Account Security</h2>
          <p className="text-xs text-gray-400 mt-0.5 mb-5 sm:mb-6">
            Manage your access and safeguard your creative portfolio
          </p>

          <div className="p-4 sm:p-6 rounded-xl bg-[#F1F3FF]">
            <div className="flex items-center gap-2 text-xs font-semibold text-indigo-900 mb-4">
              <FiLock className="w-4 h-4 text-indigo-600" />
              <span>Set New Password</span>
            </div>

            <form onSubmit={handleChangePassword} className="space-y-4">
              <div>
                <label className={labelSmall}>Current Password</label>
                <input
                  type="password"
                  name="currentPassword"
                  placeholder="••••••••"
                  value={securityData.currentPassword}
                  onChange={handleSecurityChange}
                  className={inputSmall}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className={labelSmall}>New Password</label>
                  <input
                    type="password"
                    name="newPassword"
                    placeholder="••••••••"
                    value={securityData.newPassword}
                    onChange={handleSecurityChange}
                    className={inputSmall}
                  />
                </div>

                <div>
                  <label className={labelSmall}>Confirm New Password</label>
                  <input
                    type="password"
                    name="confirmPassword"
                    placeholder="••••••••"
                    value={securityData.confirmPassword}
                    onChange={handleSecurityChange}
                    className={inputSmall}
                  />
                </div>
              </div>

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

      {/* Confirmation Modal — bottom sheet on mobile, centered dialog on sm+ */}
      {modalConfig.isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center sm:p-4"
          role="dialog"
          aria-modal="true"
        >
          {/* Blurred backdrop (click to close) */}
          <div
            className="pd-backdrop absolute inset-0 bg-slate-900/40 backdrop-blur-md"
            onClick={closeModal}
          />

          {/* Panel */}
          <div className="pd-panel relative bg-white w-full sm:max-w-sm rounded-t-3xl sm:rounded-2xl shadow-2xl text-center max-h-[90vh] max-h-[90dvh] overflow-y-auto overscroll-contain">
            {/* Mobile drag handle */}
            <div className="sm:hidden flex justify-center pt-2.5">
              <span className="w-10 h-1 rounded-full bg-gray-200"></span>
            </div>

            <div className="relative p-6 space-y-4 pb-[max(1.5rem,env(safe-area-inset-bottom))]">
              <button
                type="button"
                onClick={closeModal}
                aria-label="Close"
                className="absolute top-3 right-3 sm:top-4 sm:right-4 text-gray-400 hover:text-gray-600 p-1.5 rounded-full hover:bg-gray-100 transition"
              >
                <FiX className="w-5 h-5" />
              </button>

              <div className="w-14 h-14 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto">
                <FiCheckCircle className="w-8 h-8" />
              </div>

              <div>
                <h3 className="text-lg font-bold text-slate-900 break-words">{modalConfig.title}</h3>
                <p className="text-xs text-gray-500 mt-1 leading-relaxed break-words">
                  {modalConfig.message}
                </p>
              </div>

              <button
                type="button"
                onClick={closeModal}
                className="w-full bg-slate-900 text-white py-2.5 rounded-xl text-xs font-semibold hover:bg-slate-800 transition"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileDetailsEditor;