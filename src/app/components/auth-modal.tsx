import { Eye, EyeOff, Info, Loader2, X } from 'lucide-react';
import { FormEvent, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { ImageWithFallback } from './figma/ImageWithFallback';
import {
  AuthSession,
  loginUser,
  registerUser,
  requestPasswordReset,
  resetPassword,
} from '../lib/auth';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (session: AuthSession) => void;
  initialResetToken?: string;
}

interface LabelWithInfoProps {
  htmlFor: string;
  label: string;
  info: string;
}

function LabelWithInfo({ htmlFor, label, info }: LabelWithInfoProps) {
  return (
    <div className="mb-2 flex items-center gap-1.5">
      <label htmlFor={htmlFor} className="block text-gray-700 font-semibold text-sm">
        {label}
      </label>
      <span className="group relative inline-flex">
        <button
          type="button"
          aria-label={`${label} guidance`}
          className="inline-flex h-5 w-5 items-center justify-center rounded-full text-gray-400 hover:bg-blue-50 hover:text-blue-600 focus:bg-blue-50 focus:text-blue-600 focus:outline-none"
        >
          <Info className="h-4 w-4" />
        </button>
        <span className="pointer-events-none absolute left-full top-1/2 z-[140] ml-2 hidden w-64 -translate-y-1/2 rounded-lg border border-blue-200 bg-white px-3 py-2 text-xs font-medium leading-5 text-gray-700 shadow-2xl group-hover:block group-focus-within:block">
          {info}
        </span>
      </span>
    </div>
  );
}

export function AuthModal({ isOpen, onClose, onLoginSuccess, initialResetToken }: AuthModalProps) {
  const [activeTab, setActiveTab] = useState<'login' | 'register' | 'forgot' | 'reset'>('login');
  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const [registerData, setRegisterData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  });
  const [forgotEmail, setForgotEmail] = useState('');
  const [resetData, setResetData] = useState({ token: '', password: '', confirmPassword: '' });
  const [forgotError, setForgotError] = useState('');
  const [forgotMessage, setForgotMessage] = useState('');
  const [resetError, setResetError] = useState('');
  const [resetMessage, setResetMessage] = useState('');
  const [loginFieldErrors, setLoginFieldErrors] = useState<Record<string, string>>({});
  const [registerFieldErrors, setRegisterFieldErrors] = useState<Record<string, string>>({});
  const [forgotFieldErrors, setForgotFieldErrors] = useState<Record<string, string>>({});
  const [resetFieldErrors, setResetFieldErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [emailWasSent, setEmailWasSent] = useState(false);
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [showRegisterPassword, setShowRegisterPassword] = useState(false);
  const [showRegisterConfirmPassword, setShowRegisterConfirmPassword] = useState(false);

  // When opened via email reset link, jump straight to reset tab with token pre-filled
  useEffect(() => {
    if (initialResetToken && isOpen) {
      setResetData((current) => ({ ...current, token: initialResetToken }));
      setActiveTab('reset');
    }
  }, [initialResetToken, isOpen]);

  if (!isOpen) return null;

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const phonePattern = /^[+]?[-()\s\d]{10,20}$/;

  const validateLogin = () => {
    const errors: Record<string, string> = {};

    if (!loginData.email.trim()) {
      errors.email = 'Email is required.';
    } else if (!emailPattern.test(loginData.email.trim())) {
      errors.email = 'Enter a valid email address.';
    }

    if (!loginData.password) {
      errors.password = 'Password is required.';
    }

    return errors;
  };

  const validateRegister = () => {
    const errors: Record<string, string> = {};

    if (!registerData.name.trim()) {
      errors.name = 'Full name is required.';
    } else if (registerData.name.trim().length < 2) {
      errors.name = 'Full name must be at least 2 characters.';
    }

    if (!registerData.email.trim()) {
      errors.email = 'Email is required.';
    } else if (!emailPattern.test(registerData.email.trim())) {
      errors.email = 'Enter a valid email address.';
    }

    if (registerData.phone.trim() && !phonePattern.test(registerData.phone.trim())) {
      errors.phone = 'Enter a valid phone number.';
    }

    if (!registerData.password) {
      errors.password = 'Password is required.';
    } else if (registerData.password.length < 8) {
      errors.password = 'Password must be at least 8 characters.';
    }

    if (!registerData.confirmPassword) {
      errors.confirmPassword = 'Please confirm your password.';
    } else if (registerData.password !== registerData.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match.';
    }

    return errors;
  };

  const validateForgotPassword = () => {
    const errors: Record<string, string> = {};

    if (!forgotEmail.trim()) {
      errors.email = 'Email is required.';
    } else if (!emailPattern.test(forgotEmail.trim())) {
      errors.email = 'Enter a valid email address.';
    }

    return errors;
  };

  const validateResetPassword = () => {
    const errors: Record<string, string> = {};

    if (!resetData.token.trim()) {
      errors.token = 'Reset token is required.';
    }

    if (!resetData.password) {
      errors.password = 'New password is required.';
    } else if (resetData.password.length < 8) {
      errors.password = 'Password must be at least 8 characters.';
    }

    if (!resetData.confirmPassword) {
      errors.confirmPassword = 'Please confirm your new password.';
    } else if (resetData.password !== resetData.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match.';
    }

    return errors;
  };

  const handleLoginSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const errors = validateLogin();
    setLoginFieldErrors(errors);

    if (Object.keys(errors).length > 0) {
      return;
    }

    setIsSubmitting(true);

    try {
      const session = await loginUser({
        email: loginData.email.trim(),
        password: loginData.password,
      });
      toast.success('Login successful. Redirecting...');
      await new Promise((resolve) => setTimeout(resolve, 500));
      onLoginSuccess(session);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Login failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRegisterSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const errors = validateRegister();
    setRegisterFieldErrors(errors);

    if (Object.keys(errors).length > 0) {
      return;
    }

    setIsSubmitting(true);

    try {
      await registerUser({
        name: registerData.name.trim(),
        email: registerData.email.trim(),
        phone: registerData.phone.trim() || undefined,
        password: registerData.password,
      });
      toast.success('Account created successfully. Logging you in...');

      const session = await loginUser({
        email: registerData.email.trim(),
        password: registerData.password,
      });

      await new Promise((resolve) => setTimeout(resolve, 500));
      onLoginSuccess(session);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Registration failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleForgotPasswordSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const errors = validateForgotPassword();
    setForgotFieldErrors(errors);
    setForgotError('');
    setForgotMessage('');
    setResetError('');
    setResetMessage('');

    if (Object.keys(errors).length > 0) {
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await requestPasswordReset({ email: forgotEmail.trim() });
      const message = response.message ?? 'If an account exists, the reset flow has been started.';
      setForgotMessage(message);

      if (response.emailSent) {
        // Email was sent — stay on forgot tab, show "check email" UI
        setEmailWasSent(true);
      } else if (response.resetToken) {
        // Dev mode / email not configured — auto-fill token and go to reset tab
        setResetData((current) => ({ ...current, token: response.resetToken ?? current.token }));
        setActiveTab('reset');
      }
      // If neither (user not found), just show the generic message
    } catch (error) {
      setForgotError(error instanceof Error ? error.message : 'Unable to send reset link. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResetPasswordSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const errors = validateResetPassword();
    setResetFieldErrors(errors);
    setResetError('');
    setResetMessage('');

    if (Object.keys(errors).length > 0) {
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await resetPassword({
        token: resetData.token.trim(),
        password: resetData.password,
      });
      setResetMessage(response.message ?? 'Password reset successful. You can log in now.');
      setLoginData({ email: forgotEmail.trim(), password: '' });
      setActiveTab('login');
      setResetData({ token: '', password: '', confirmPassword: '' });
    } catch (error) {
      setResetError(error instanceof Error ? error.message : 'Unable to reset password. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderFieldError = (message?: string) => {
    if (!message) {
      return null;
    }

    return <p className="mt-1 text-sm text-red-600">{message}</p>;
  };

  return (
    <div 
      className="fixed inset-0 z-[100] flex items-center justify-center p-2 sm:p-4" 
      style={{
        backgroundImage: `
          linear-gradient(to right, rgba(200, 200, 200, 0.1) 1px, transparent 1px),
          linear-gradient(to bottom, rgba(200, 200, 200, 0.1) 1px, transparent 1px)
        `,
        backgroundSize: '30px 30px',
        backgroundColor: 'rgba(255, 255, 255, 0.95)'
      }}
      onClick={onClose}
    >
      <div className="bg-white rounded-lg sm:rounded-2xl shadow-2xl w-full max-w-5xl max-h-[95vh] sm:max-h-[90vh] overflow-hidden grid md:grid-cols-2" onClick={(e) => e.stopPropagation()}>
        {/* Left Side - Image */}
        <div className="hidden md:block relative bg-gradient-to-br from-blue-600 to-blue-800">
          <ImageWithFallback
            src="https://images.unsplash.com/photo-1758685734470-a75109299497?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzY2llbmNlJTIwbWF0aGVtYXRpY3MlMjBlZHVjYXRpb24lMjBsYWJvcmF0b3J5fGVufDF8fHx8MTc3MDU1NTczMnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
            alt="Science and Mathematics"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-blue-900/80 via-blue-900/40 to-transparent" />
          <div className="absolute bottom-8 left-8 right-8 text-white">
            <h3 className="text-3xl font-bold mb-2">Welcome to Varsity Maths</h3>
            <p className="text-blue-100">Learn Smart. Learn Deep. Build Your Future 🚀</p>
          </div>
        </div>

        {/* Right Side - Form */}
        <div className="relative z-20 bg-white overflow-y-auto max-h-[95vh] sm:max-h-[90vh]">
          {/* Mobile Header with Logo */}
          <div className="md:hidden bg-gradient-to-r from-blue-600 to-blue-800 p-4 text-center">
            <h3 className="text-xl font-bold text-white mb-1">Varsity Maths<sup className="text-xs">™</sup></h3>
            <p className="text-xs text-blue-100">Learn Smart. Build Your Future 🚀</p>
          </div>

          {/* Header */}
          <div className="relative border-b border-gray-200 p-4 sm:p-6">
            <button
              onClick={onClose}
              className="absolute top-3 right-3 sm:top-4 sm:right-4 text-gray-400 hover:text-gray-600 transition-colors p-2"
              aria-label="Close"
            >
              <X className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 text-center pr-8">
              Get Started
            </h2>
          </div>

          {/* Tabs */}
          <div className="flex border-b border-gray-200">
            <button
              onClick={() => setActiveTab('login')}
              className={`flex-1 py-3 sm:py-3.5 text-center font-semibold transition-colors text-sm sm:text-base ${
                activeTab === 'login'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Login
            </button>
            <button
              onClick={() => setActiveTab('register')}
              className={`flex-1 py-3 sm:py-3.5 text-center font-semibold transition-colors text-sm sm:text-base ${
                activeTab === 'register'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Register
            </button>
          </div>

          {/* Content */}
          <div className="p-4 sm:p-6">
            {activeTab === 'login' ? (
              <form onSubmit={handleLoginSubmit} className="space-y-4">
                {isSubmitting ? (
                  <div className="rounded-lg border border-blue-200 bg-blue-50 px-4 py-3 text-sm text-blue-700">
                    Please wait, signing you in...
                  </div>
                ) : null}

                {resetMessage ? (
                  <div className="rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
                    {resetMessage}
                  </div>
                ) : null}

                <div>
                  <LabelWithInfo
                    htmlFor="login-email"
                    label="Email"
                    info="Use the email you used while registering your account."
                  />
                  <input
                    type="email"
                    id="login-email"
                    value={loginData.email}
                    onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                    placeholder="you@example.com"
                    className="w-full px-3 py-3 sm:px-4 text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                  {renderFieldError(loginFieldErrors.email)}
                </div>

                <div>
                  <LabelWithInfo
                    htmlFor="login-password"
                    label="Password"
                    info="Password must be at least 8 characters. Use a mix of uppercase, lowercase, number, and symbol for stronger security."
                  />
                  <div className="relative">
                    <input
                      type={showLoginPassword ? 'text' : 'password'}
                      id="login-password"
                      value={loginData.password}
                      onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                      placeholder="Enter your password"
                      className="w-full px-3 py-3 pr-12 sm:px-4 sm:pr-12 text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowLoginPassword((current) => !current)}
                      className="absolute inset-y-0 right-3 flex items-center text-gray-500 hover:text-gray-700"
                      aria-label={showLoginPassword ? 'Hide password' : 'Show password'}
                    >
                      {showLoginPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                  {renderFieldError(loginFieldErrors.password)}
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-sm">
                  <label className="flex items-center">
                    <input type="checkbox" className="mr-2 rounded w-4 h-4" />
                    <span className="text-gray-600">Remember me</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      setActiveTab('forgot');
                      setForgotEmail(loginData.email);
                      setForgotError('');
                      setForgotMessage('');
                      setForgotFieldErrors({});
                    }}
                    className="text-left text-blue-600 hover:text-blue-700 font-semibold"
                  >
                    Forgot Password?
                  </button>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex w-full items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-400 text-white font-semibold py-3.5 rounded-lg transition-colors text-base"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin" />
                      Logging in...
                    </>
                  ) : (
                    'Login'
                  )}
                </button>
              </form>
            ) : activeTab === 'register' ? (
              <form onSubmit={handleRegisterSubmit} className="space-y-4">
                {isSubmitting ? (
                  <div className="rounded-lg border border-blue-200 bg-blue-50 px-4 py-3 text-sm text-blue-700">
                    Please wait, creating your account...
                  </div>
                ) : null}

                <div>
                  <LabelWithInfo
                    htmlFor="register-name"
                    label="Full Name"
                    info="Enter your official name so we can personalize your profile and certificates."
                  />
                  <input
                    type="text"
                    id="register-name"
                    value={registerData.name}
                    onChange={(e) => setRegisterData({ ...registerData, name: e.target.value })}
                    placeholder="John Doe"
                    className="w-full px-3 py-3 sm:px-4 text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                  {renderFieldError(registerFieldErrors.name)}
                </div>

                <div>
                  <LabelWithInfo
                    htmlFor="register-email"
                    label="Email"
                    info="Use an active email. Password reset and important updates will be sent here."
                  />
                  <input
                    type="email"
                    id="register-email"
                    value={registerData.email}
                    onChange={(e) => setRegisterData({ ...registerData, email: e.target.value })}
                    placeholder="you@example.com"
                    className="w-full px-3 py-3 sm:px-4 text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                  {renderFieldError(registerFieldErrors.email)}
                </div>

                <div>
                  <LabelWithInfo
                    htmlFor="register-phone"
                    label="Phone Number"
                    info="Optional. Add phone number if you want class alerts and support calls."
                  />
                  <input
                    type="tel"
                    id="register-phone"
                    value={registerData.phone}
                    onChange={(e) => setRegisterData({ ...registerData, phone: e.target.value })}
                    placeholder="+91 9876543210"
                    className="w-full px-3 py-3 sm:px-4 text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  {renderFieldError(registerFieldErrors.phone)}
                </div>

                <div>
                  <LabelWithInfo
                    htmlFor="register-password"
                    label="Password"
                    info="Password guide: minimum 8 characters. Prefer 12+ with uppercase, lowercase, number, and special character."
                  />
                  <div className="relative">
                    <input
                      type={showRegisterPassword ? 'text' : 'password'}
                      id="register-password"
                      value={registerData.password}
                      onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })}
                      placeholder="Create a password"
                      className="w-full px-3 py-3 pr-12 sm:px-4 sm:pr-12 text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowRegisterPassword((current) => !current)}
                      className="absolute inset-y-0 right-3 flex items-center text-gray-500 hover:text-gray-700"
                      aria-label={showRegisterPassword ? 'Hide password' : 'Show password'}
                    >
                      {showRegisterPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                  {renderFieldError(registerFieldErrors.password)}
                </div>

                <div>
                  <LabelWithInfo
                    htmlFor="register-confirm-password"
                    label="Confirm Password"
                    info="Re-enter the same password exactly to avoid typing mistakes."
                  />
                  <div className="relative">
                    <input
                      type={showRegisterConfirmPassword ? 'text' : 'password'}
                      id="register-confirm-password"
                      value={registerData.confirmPassword}
                      onChange={(e) => setRegisterData({ ...registerData, confirmPassword: e.target.value })}
                      placeholder="Confirm your password"
                      className="w-full px-3 py-3 pr-12 sm:px-4 sm:pr-12 text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowRegisterConfirmPassword((current) => !current)}
                      className="absolute inset-y-0 right-3 flex items-center text-gray-500 hover:text-gray-700"
                      aria-label={showRegisterConfirmPassword ? 'Hide password' : 'Show password'}
                    >
                      {showRegisterConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                  {renderFieldError(registerFieldErrors.confirmPassword)}
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex w-full items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-400 text-white font-semibold py-3.5 rounded-lg transition-colors text-base"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin" />
                      Creating account...
                    </>
                  ) : (
                    'Register'
                  )}
                </button>
              </form>
            ) : activeTab === 'forgot' ? (
              emailWasSent ? (
                /* ── Email sent confirmation ── */
                <div className="space-y-4 text-center">
                  <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-3xl">
                    ✉️
                  </div>
                  <h3 className="text-lg font-semibold text-gray-800">Check Your Email</h3>
                  <p className="text-sm leading-6 text-gray-600">
                    We've sent a password reset link to <strong>{forgotEmail}</strong>. Please check your
                    inbox (and spam folder) and click the link to reset your password.
                  </p>
                  <p className="text-xs text-gray-400">The link expires in 30 minutes.</p>

                  <div className="pt-2 space-y-2">
                    <button
                      type="button"
                      onClick={() => { setEmailWasSent(false); setForgotMessage(''); setForgotError(''); }}
                      className="w-full border border-blue-600 text-blue-600 hover:bg-blue-50 font-semibold py-3 rounded-lg transition-colors text-sm"
                    >
                      Try a different email
                    </button>
                    <button
                      type="button"
                      onClick={() => { setActiveTab('reset'); setEmailWasSent(false); }}
                      className="w-full text-sm text-gray-500 hover:text-gray-700 py-2"
                    >
                      I have a reset token — enter it manually
                    </button>
                    <button
                      type="button"
                      onClick={() => { setActiveTab('login'); setEmailWasSent(false); }}
                      className="w-full text-sm text-blue-600 hover:text-blue-700 font-medium py-2"
                    >
                      Back to login
                    </button>
                  </div>
                </div>
              ) : (
              <form onSubmit={handleForgotPasswordSubmit} className="space-y-4">
                <div>
                  <button
                    type="button"
                    onClick={() => setActiveTab('login')}
                    className="text-sm font-semibold text-blue-600 hover:text-blue-700"
                  >
                    Back to login
                  </button>
                </div>

                {forgotError ? (
                  <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                    {forgotError}
                  </div>
                ) : null}

                {forgotMessage ? (
                  <div className="rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
                    {forgotMessage}
                  </div>
                ) : null}

                <div>
                  <LabelWithInfo
                    htmlFor="forgot-email"
                    label="Registered Email"
                    info="Enter the email linked to your account to receive reset instructions."
                  />
                  <input
                    type="email"
                    id="forgot-email"
                    value={forgotEmail}
                    onChange={(e) => setForgotEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="w-full px-3 py-3 sm:px-4 text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                  {renderFieldError(forgotFieldErrors.email)}
                </div>

                <p className="text-sm leading-6 text-gray-600">
                  Enter your email to receive a password reset link.
                </p>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3.5 rounded-lg transition-colors text-base"
                >
                  {isSubmitting ? (
                    <span className="flex items-center justify-center gap-2">
                      <Loader2 className="h-5 w-5 animate-spin" /> Sending…
                    </span>
                  ) : (
                    'Send Reset Link'
                  )}
                </button>
              </form>
              )
            ) : (
              <form onSubmit={handleResetPasswordSubmit} className="space-y-4">
                <div className="flex items-center justify-between gap-4">
                  <button
                    type="button"
                    onClick={() => setActiveTab('forgot')}
                    className="text-sm font-semibold text-blue-600 hover:text-blue-700"
                  >
                    Back to forgot password
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab('login')}
                    className="text-sm font-semibold text-gray-500 hover:text-gray-700"
                  >
                    Back to login
                  </button>
                </div>

                {resetError ? (
                  <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                    {resetError}
                  </div>
                ) : null}

                <div>
                  <LabelWithInfo
                    htmlFor="reset-token"
                    label="Reset Token"
                    info="Paste the reset token from your reset message. This token confirms your password reset request."
                  />
                  <textarea
                    id="reset-token"
                    value={resetData.token}
                    onChange={(e) => setResetData({ ...resetData, token: e.target.value })}
                    placeholder="Paste the reset token here"
                    className="min-h-24 w-full px-3 py-3 sm:px-4 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                  {renderFieldError(resetFieldErrors.token)}
                </div>

                <div>
                  <LabelWithInfo
                    htmlFor="reset-password"
                    label="New Password"
                    info="Set a strong new password. Avoid using your old password or personal details."
                  />
                  <input
                    type="password"
                    id="reset-password"
                    value={resetData.password}
                    onChange={(e) => setResetData({ ...resetData, password: e.target.value })}
                    placeholder="Enter your new password"
                    className="w-full px-3 py-3 sm:px-4 text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                  {renderFieldError(resetFieldErrors.password)}
                </div>

                <div>
                  <LabelWithInfo
                    htmlFor="reset-confirm-password"
                    label="Confirm New Password"
                    info="Type the new password again to confirm it matches exactly."
                  />
                  <input
                    type="password"
                    id="reset-confirm-password"
                    value={resetData.confirmPassword}
                    onChange={(e) => setResetData({ ...resetData, confirmPassword: e.target.value })}
                    placeholder="Confirm your new password"
                    className="w-full px-3 py-3 sm:px-4 text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                  {renderFieldError(resetFieldErrors.confirmPassword)}
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3.5 rounded-lg transition-colors text-base"
                >
                  {isSubmitting ? 'Resetting password...' : 'Reset Password'}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}