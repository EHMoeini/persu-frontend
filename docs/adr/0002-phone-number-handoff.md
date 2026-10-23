# The phone number travels between auth steps as a query parameter

Check User must hand the entered Phone Number to Login or Register (`/login?phone=09xxxxxxxxx`). We chose the query parameter over a client store (zustand) or a cookie because it is stateless: it survives refreshes, works in server components without extra lifecycle code, and makes each auth page independently deep-linkable. The trade-off is that the number is visible in the URL and history; if that becomes a privacy concern, switch to a short-lived cookie behind the same page-facing contract.
