
import { useState } from "react";
import { FiUser, FiCheckCircle, FiAlertCircle } from "react-icons/fi";

const initialProfile = {
  name: "Chowdhury Group Of Industries",
  email: "chowdhury@gmail.com",
};

const initialPassword = {
  currentPassword: "",
  newPassword: "",
  confirmPassword: "",
};

export default function MyProfile() {
  const [profile, setProfile] = useState(initialProfile);
  const [password, setPassword] = useState(initialPassword);

  const [profileMessage, setProfileMessage] = useState(null);
  const [passwordMessage, setPasswordMessage] = useState(null);

  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  function handleProfileChange(event) {
    const { name, value } = event.target;

    setProfile((previous) => ({
      ...previous,
      [name]: value,
    }));

    setProfileMessage(null);
  }

  function handlePasswordChange(event) {
    const { name, value } = event.target;

    setPassword((previous) => ({
      ...previous,
      [name]: value,
    }));

    setPasswordMessage(null);
  }

  function handleProfileSubmit(event) {
    event.preventDefault();

    const name = profile.name.trim();
    const email = profile.email.trim();

    if (!name || !email) {
      setProfileMessage({
        type: "error",
        text: "Name and email are required.",
      });
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setProfileMessage({
        type: "error",
        text: "Please enter a valid email address.",
      });
      return;
    }

    setIsUpdatingProfile(true);

    // Replace this with your profile update API request.
    setProfile({ name, email });

    setProfileMessage({
      type: "success",
      text: "Profile updated successfully.",
    });

    setIsUpdatingProfile(false);
  }

  function handlePasswordSubmit(event) {
    event.preventDefault();

    const { currentPassword, newPassword, confirmPassword } = password;

    if (!currentPassword || !newPassword || !confirmPassword) {
      setPasswordMessage({
        type: "error",
        text: "Please fill in all password fields.",
      });
      return;
    }

    if (newPassword.length < 8) {
      setPasswordMessage({
        type: "error",
        text: "New password must contain at least 8 characters.",
      });
      return;
    }

    if (currentPassword === newPassword) {
      setPasswordMessage({
        type: "error",
        text: "New password must differ from the current password.",
      });
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordMessage({
        type: "error",
        text: "New password and confirm password do not match.",
      });
      return;
    }

    setIsChangingPassword(true);

    // Replace this with your change password API request.
    // Never change a password using frontend state alone.
    setPasswordMessage({
      type: "error",
      text: "Connect your change-password API to update your password.",
    });

    setIsChangingPassword(false);
  }

  const inputClass =
    "mt-1.5 block w-full rounded-md border border-gray-300 bg-white px-3 py-2.5 text-xs text-gray-800 outline-none transition placeholder:text-gray-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 disabled:cursor-not-allowed disabled:bg-gray-100";

  const labelClass = "block text-xs font-medium text-gray-600";

  function Message({ message }) {
    if (!message) return null;

    const isSuccess = message.type === "success";

    return (
      <div
        role="status"
        className={`mt-3 flex items-start gap-2 rounded-md border px-3 py-2 text-xs ${
          isSuccess
            ? "border-green-200 bg-green-50 text-green-700"
            : "border-red-200 bg-red-50 text-red-600"
        }`}
      >
        {isSuccess ? (
          <FiCheckCircle className="mt-0.5 shrink-0" size={14} />
        ) : (
          <FiAlertCircle className="mt-0.5 shrink-0" size={14} />
        )}
        <span>{message.text}</span>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-5 font-sans text-gray-800 sm:px-6 sm:py-7">
      <div className="mx-auto max-w-[1400px]">
        {/* Page heading */}
        <header className="mb-5">
          <h1 className="text-xl font-semibold tracking-tight text-gray-900">
            My Profile
          </h1>

          <p className="mt-1 text-xs text-gray-500">
            Manage your account and store preferences.
          </p>
        </header>

        {/* Profile card */}
        <section className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm sm:p-6">
          {/* User information */}
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gray-100 text-gray-500">
              <FiUser size={25} />
            </div>

            <div className="min-w-0">
              <h2 className="truncate text-sm font-semibold text-gray-900">
                {profile.name || "Your Name"}
              </h2>

              <p className="mt-1 truncate text-xs text-gray-500">
                {profile.email || "your@email.com"}
              </p>
            </div>
          </div>

          {/* Account information */}
          <form onSubmit={handleProfileSubmit} className="mt-7">
            <h3 className="mb-4 text-xs font-medium text-gray-600">
              Account Information
            </h3>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <label htmlFor="profile-name" className={labelClass}>
                  Name
                </label>

                <input
                  id="profile-name"
                  type="text"
                  name="name"
                  value={profile.name}
                  onChange={handleProfileChange}
                  placeholder="Enter your name"
                  autoComplete="name"
                  maxLength={100}
                  required
                  className={inputClass}
                />
              </div>

              <div>
                <label htmlFor="profile-email" className={labelClass}>
                  Email
                </label>

                <input
                  id="profile-email"
                  type="email"
                  name="email"
                  value={profile.email}
                  onChange={handleProfileChange}
                  placeholder="Enter your email"
                  autoComplete="email"
                  maxLength={254}
                  required
                  className={inputClass}
                />
              </div>
            </div>

            <Message message={profileMessage} />

            <div className="mt-3 flex justify-end">
              <button
                type="submit"
                disabled={isUpdatingProfile}
                className="rounded-md bg-indigo-600 px-4 py-2.5 text-xs font-medium text-white transition hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-300 disabled:opacity-60"
              >
                {isUpdatingProfile ? "Updating..." : "Update Profile"}
              </button>
            </div>
          </form>

          {/* Divider */}
          <div className="my-7 border-t border-gray-100" />

          {/* Change password */}
          <form onSubmit={handlePasswordSubmit}>
            <h3 className="mb-4 text-xs font-medium text-gray-600">
              Change Password
            </h3>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              <div>
                <label htmlFor="current-password" className={labelClass}>
                  Current Password
                </label>

                <input
                  id="current-password"
                  type="password"
                  name="currentPassword"
                  value={password.currentPassword}
                  onChange={handlePasswordChange}
                  placeholder="Enter current password"
                  autoComplete="current-password"
                  className={inputClass}
                  required
                />
              </div>

              <div>
                <label htmlFor="new-password" className={labelClass}>
                  New Password
                </label>

                <input
                  id="new-password"
                  type="password"
                  name="newPassword"
                  value={password.newPassword}
                  onChange={handlePasswordChange}
                  placeholder="Enter new password"
                  autoComplete="new-password"
                  minLength={8}
                  className={inputClass}
                  required
                />
              </div>

              <div>
                <label htmlFor="confirm-password" className={labelClass}>
                  Confirm New Password
                </label>

                <input
                  id="confirm-password"
                  type="password"
                  name="confirmPassword"
                  value={password.confirmPassword}
                  onChange={handlePasswordChange}
                  placeholder="Confirm new password"
                  autoComplete="new-password"
                  minLength={8}
                  className={inputClass}
                  required
                />
              </div>
            </div>

            <Message message={passwordMessage} />

            <div className="mt-3 flex justify-end">
              <button
                type="submit"
                disabled={isChangingPassword}
                className="rounded-md bg-indigo-600 px-4 py-2.5 text-xs font-medium text-white transition hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-300 disabled:opacity-60"
              >
                {isChangingPassword ? "Changing..." : "Change Password"}
              </button>
            </div>
          </form>
        </section>
      </div>
    </main>
  );
}
