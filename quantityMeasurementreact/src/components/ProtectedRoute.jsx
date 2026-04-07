/**
 * ProtectedRoute
 * Renders children if user is authenticated.
 * Otherwise calls onRedirect so the parent can navigate to auth.
 */
export default function ProtectedRoute({ user, onRedirect, children }) {
  if (!user) {
    // Trigger navigation imperatively so the parent controls routing
    onRedirect?.();
    return null;
  }
  return children;
}
