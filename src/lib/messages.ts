const AUTH_ERROR_MAP: Record<string, string> = {
  "Invalid login credentials":
    "Incorrect email or password. Please check your details and try again.",
  "Email not confirmed":
    "Your email isn't confirmed yet. Check your inbox for the confirmation link, then try logging in again.",
  "User already registered":
    "An account with this email already exists. Try logging in instead.",
  "Password should be at least 6 characters":
    "Password must be at least 6 characters long.",
  "Signup requires a valid password":
    "Please enter a valid password (at least 6 characters).",
  "Unable to validate email address: invalid format":
    "Please enter a valid email address.",
  "Email address not authorized":
    "This email can't receive sign-up messages right now. Try a different email or contact support.",
  "For security purposes, you can only request this once every 60 seconds":
    "Please wait a minute before trying again.",
};

const AUTH_PARTIAL_MATCHES: { match: string; message: string }[] = [
  {
    match: "rate limit",
    message: "Too many attempts. Please wait a few minutes and try again.",
  },
  {
    match: "network",
    message: "Connection problem. Check your internet and try again.",
  },
];

export const mapAuthError = (message: string): string => {
  if (AUTH_ERROR_MAP[message]) {
    return AUTH_ERROR_MAP[message];
  }

  const partial = AUTH_PARTIAL_MATCHES.find(({ match }) =>
    message.toLowerCase().includes(match),
  );
  if (partial) {
    return partial.message;
  }

  return "Something went wrong. Please try again.";
};

export type AuthErrorAction = "login" | "signup" | "resend";

export const getAuthErrorAction = (message: string): AuthErrorAction | null => {
  if (
    message.includes("already exists") ||
    message.includes("already registered")
  ) {
    return "login";
  }
  if (message.includes("isn't confirmed") || message.includes("not confirmed")) {
    return "signup";
  }
  if (message.includes("Incorrect email or password")) {
    return "signup";
  }
  return null;
};

const API_ERROR_MAP: Record<string, string> = {
  Unauthorized: "Please log in to continue.",
  "Profile already exists":
    "You already have a profile. Go to your dashboard to manage bookmarks.",
  "Handle is already taken":
    "That handle is taken. Try a different one.",
  "Bookmark not found":
    "We couldn't find that bookmark. It may have been deleted.",
  "Invalid JSON": "Something went wrong. Please try again.",
  "Invalid input": "Please check your input and try again.",
  "No fields to update": "Nothing to update. Change a field and try again.",
  "Failed to create profile": "We couldn't save your profile. Please try again.",
  "Failed to create bookmark": "We couldn't save your bookmark. Please try again.",
  "Failed to update bookmark": "We couldn't update your bookmark. Please try again.",
  "Failed to delete bookmark": "We couldn't delete your bookmark. Please try again.",
  "Profile not found": "This profile doesn't exist or may have been removed.",
  "Failed to fetch bookmarks": "We couldn't load bookmarks. Please try again.",
};

export const mapApiError = (
  error: string | undefined,
  fallback: string,
): string => {
  if (!error) {
    return fallback;
  }
  return API_ERROR_MAP[error] ?? error ?? fallback;
};

/** Server-side API error keys (mapped to friendly text on the client). */
export const apiErrors = {
  unauthorized: "Unauthorized",
  profileExists: "Profile already exists",
  handleTaken: "Handle is already taken",
  bookmarkNotFound: "Bookmark not found",
  invalidJson: "Invalid JSON",
  invalidInput: "Invalid input",
  noFieldsToUpdate: "No fields to update",
  profileNotFound: "Profile not found",
  fetchBookmarksFailed: "Failed to fetch bookmarks",
  serverError: "Something went wrong. Please try again.",
} as const;

export const messages = {
  signup: {
    successTitle: "Check your email",
    successBody: (email: string) =>
      `We sent a confirmation link to ${email}. Open it to activate your account.`,
    duplicateEmail:
      "An account with this email already exists. Try logging in instead.",
  },
  login: {
    genericFailure: "Unable to sign in. Please try again.",
  },
  onboarding: {
    saveFailed: "We couldn't save your handle. Please try again.",
  },
  bookmarks: {
    createFailed: "We couldn't add your bookmark. Please try again.",
    updateFailed: "We couldn't save your changes. Please try again.",
    deleteFailed: "We couldn't delete this bookmark. Please try again.",
    empty: "No bookmarks yet. Add your first one above.",
    created: "Bookmark added.",
    updated: "Bookmark updated.",
    deleted: "Bookmark deleted.",
  },
  loading: {
    signup: "Creating your account…",
    login: "Signing you in…",
    onboarding: "Saving your profile…",
    logout: "Signing you out…",
    bookmarkCreate: "Adding bookmark…",
    bookmarkUpdate: "Saving changes…",
    bookmarkDelete: "Deleting bookmark…",
  },
  toast: {
    networkError: "Connection problem. Check your internet and try again.",
    loginSuccess: "Welcome back!",
    onboardingSuccess: "Profile saved! Redirecting to dashboard…",
    logoutSuccess: "You've been signed out.",
  },
} as const;
