
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router";
import {
  FiMail,
  FiLock,
  FiEye,
  FiEyeOff,
  FiArrowRight,
  FiArrowLeft,
} from "react-icons/fi";

import cervidaeImage from "../../assets/images/Cervidae.jpg";

const LoginPage = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!success) return;

    const timer = setTimeout(() => {
      navigate("/", { replace: true });
    }, 1500);

    return () => clearTimeout(timer);
  }, [success, navigate]);

  const handleSubmit = (event) => {
    event.preventDefault();

    setError("");
    setSuccess("");

    const trimmedEmail = email.trim();

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(trimmedEmail)) {
      setError("Please enter a valid email address.");
      return;
    }

    if (password.length < 8 || password.length > 15) {
      setError("Password must be between 8 and 15 characters.");
      return;
    }

    setIsSubmitting(true);

    try {
      if (rememberMe) {
        localStorage.setItem("rememberedEmail", trimmedEmail);
      } else {
        localStorage.removeItem("rememberedEmail");
      }

      setSuccess("Login successful! Redirecting to home...");
    } catch {
      setError("Unable to save your preference. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen w-screen bg-white p-0">
      <div className="flex min-h-screen w-full overflow-hidden bg-white">

        {/* Left side: Image and branding */}
        <section className="relative hidden min-h-screen w-1/2 shrink-0 overflow-hidden md:block">
          <img
            src={cervidaeImage}
            alt="Deer standing in a peaceful forest"
            className="absolute inset-0 h-full w-full object-cover"
          />

          <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-black/5" />

          <div className="absolute bottom-8 left-7 right-7 lg:bottom-12 lg:left-8 lg:right-8">
            <div className="inline-block max-w-full rounded-xl border border-white/40 bg-black/10 px-3 py-2.5 backdrop-blur-[2px] sm:px-4 sm:py-3">
              <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl lg:text-4xl">
                My12Photos
              </h1>

              <p className="mt-1.5 text-[10px] font-medium tracking-[0.13em] text-white/90 sm:text-xs">
                CAPTURE. COMPETE. CELEBRATE.
              </p>
            </div>
          </div>
        </section>

        {/* Right side: Login form */}
        <section className="flex min-h-screen w-full flex-col bg-white md:w-1/2">

          {/* Mobile branding */}
          <div className="relative flex min-h-[180px] items-end overflow-hidden md:hidden">
            <img
              src={cervidaeImage}
              alt="Deer in the forest"
              className="absolute inset-0 h-full w-full object-cover"
            />

            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

            <div className="relative z-10 p-5">
              <h1 className="text-3xl font-bold text-white">
                My12Photos
              </h1>

              <p className="mt-1 text-xs tracking-widest text-white/90">
                CAPTURE. COMPETE. CELEBRATE.
              </p>
            </div>
          </div>

          <div className="flex flex-1 items-center justify-center px-5 py-10 sm:px-10 md:px-8 lg:px-12 xl:px-16">
            <div className="w-full max-w-[360px]">

              {/* Back to home */}
              <Link
                to="/"
                className="mb-8 inline-flex items-center gap-2 text-xs text-[#777482] transition hover:text-secondary"
              >
                <FiArrowLeft size={15} />
                Back to Home
              </Link>

              {/* Heading */}
              <div className="mb-8 text-center">
                <h2 className="text-2xl font-semibold tracking-tight text-[#20232E] sm:text-[26px]">
                  Welcome Back
                </h2>

                <p className="mx-auto mt-2 max-w-[270px] text-xs leading-5 text-[#777482]">
                  Sign in to join competitions and showcase your photography
                </p>
              </div>

              {/* Error feedback */}
              {error && (
                <div
                  role="alert"
                  className="mb-5 rounded-lg border border-red-200 bg-red-50 px-3 py-3 text-xs leading-5 text-red-600"
                >
                  {error}
                </div>
              )}

              {/* Success feedback */}
              {success && (
                <div
                  role="status"
                  className="mb-5 rounded-lg border border-green-200 bg-green-50 px-3 py-3 text-xs leading-5 text-green-700"
                >
                  {success}
                </div>
              )}

              {/* Login form */}
              <form onSubmit={handleSubmit} noValidate>

                {/* Email */}
                <div className="mb-5">
                  <label
                    htmlFor="login-email"
                    className="mb-1.5 block text-xs font-medium text-[#555260]"
                  >
                    Email Address
                  </label>

                  <div className="flex h-11 items-center gap-3 rounded-md border border-[#DAD6E5] px-3 transition focus-within:border-secondary focus-within:ring-2 focus-within:ring-secondary/10">
                    <FiMail
                      size={17}
                      className="shrink-0 text-[#898396]"
                    />

                    <input
                      id="login-email"
                      type="email"
                      name="email"
                      value={email}
                      onChange={(event) => {
                        setEmail(event.target.value);
                        setError("");
                      }}
                      placeholder="name@example.com"
                      autoComplete="email"
                      className="h-full w-full bg-transparent text-sm text-[#373737] outline-none placeholder:text-[#8C8C8C]"
                      required
                    />
                  </div>
                </div>

                {/* Password */}
                <div className="mb-4">
                  <div className="mb-1.5 flex items-center justify-between gap-2">
                    <label
                      htmlFor="login-password"
                      className="block text-xs font-medium text-[#555260]"
                    >
                      Password
                    </label>

                    <button
                      type="button"
                      onClick={() =>
                        setError(
                          "Forgot password is not configured in this frontend-only demo."
                        )
                      }
                      className="text-xs text-secondary transition hover:underline"
                    >
                      Forgot Password?
                    </button>
                  </div>

                  <div className="flex h-11 items-center gap-3 rounded-md border border-[#DAD6E5] px-3 transition focus-within:border-secondary focus-within:ring-2 focus-within:ring-secondary/10">
                    <FiLock
                      size={17}
                      className="shrink-0 text-[#898396]"
                    />

                    <input
                      id="login-password"
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={password}
                      onChange={(event) => {
                        setPassword(event.target.value);
                        setError("");
                      }}
                      placeholder="Enter your password"
                      autoComplete="current-password"
                      minLength={8}
                      maxLength={15}
                      className="h-full w-full bg-transparent text-sm text-[#373737] outline-none placeholder:text-[#8C8C8C]"
                      required
                    />

                    <button
                      type="button"
                      onClick={() => setShowPassword((prev) => !prev)}
                      aria-label={
                        showPassword ? "Hide password" : "Show password"
                      }
                      className="shrink-0 text-[#898396] transition hover:text-[#373737]"
                    >
                      {showPassword ? (
                        <FiEyeOff size={17} />
                      ) : (
                        <FiEye size={17} />
                      )}
                    </button>
                  </div>

                  <p className="mt-1.5 text-[10px] text-[#8C8C8C]">
                    Password must be 8–15 characters.
                  </p>
                </div>

                {/* Remember me */}
                <label className="mb-5 flex cursor-pointer items-center gap-2 text-[11px] text-[#777482]">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(event) =>
                      setRememberMe(event.target.checked)
                    }
                    className="h-3.5 w-3.5 cursor-pointer accent-[#F21D2B]"
                  />

                  Remember me for 30 days
                </label>

                {/* Submit button */}
                <button
                  type="submit"
                  disabled={isSubmitting || Boolean(success)}
                  className="flex h-11 w-full items-center justify-center gap-2 rounded-md bg-secondary px-4 text-sm font-medium text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {isSubmitting ? (
                    "Signing In..."
                  ) : success ? (
                    "Login Successful"
                  ) : (
                    <>
                      Sign In
                      <FiArrowRight size={16} />
                    </>
                  )}
                </button>
              </form>

              {/* Divider */}
              <div className="my-7 flex items-center gap-3">
                <div className="h-px flex-1 bg-[#DDD8E7]" />
                <span className="text-xs text-[#898396]">OR</span>
                <div className="h-px flex-1 bg-[#DDD8E7]" />
              </div>

              {/* Register link */}
              <p className="text-center text-xs text-[#777482]">
                Don't have an account?{" "}
                <Link
                  to="/register"
                  className="font-medium text-secondary transition hover:underline"
                >
                  Create Account
                </Link>
              </p>

            </div>
          </div>
        </section>
      </div>
    </main>
  );
};

export default LoginPage;
