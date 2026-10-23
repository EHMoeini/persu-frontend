# Auth pages live in their own route group

The auth-flow screens (Check User, and later Login, Register, OTP) share chrome that is neither the app shell (Header/Footer) nor absent chrome: a brand app bar with a back button, and the legal-terms note. We gave them a third route group, `src/app/(auth)/`, whose layout owns that chrome so pages stay content-only and shell/no-shell stay focused on their owns rules. The alternative — rendering the app bar inside each page under `(no-shell)` — was rejected because every new auth page would duplicate the chrome.
