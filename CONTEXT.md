# Persu

Persu (پرسو) is a sports-hall and court booking platform: venues list their halls and time slots, users book them. The product is Persian-first and RTL.

## Language

### Product

**Persu**:
The product this repository builds — the booking platform itself.
_Avoid_: Persue, Perso, "the app"

### Chrome

**Header**:
The persistent brand bar at the top of shell pages: the logo mark, پرسو, and the product tagline.
_Avoid_: navbar, app bar

**Landing Brand**:
The large centered logo mark and پرسو at the top of the landing page. It is not the Header: it stands in for it while it is in the viewport, and the Header takes over once the Landing Brand scrolls fully out, until the Landing Brand returns.
_Avoid_: hero logo, splash logo

### Accounts and sign-in

**User**:
A person who signs in to Persu. Identified by their Phone Number.
_Avoid_: customer, client, member

**Account**:
A User's registered record on Persu. A Phone Number has an Account once registration completes; until then it is only a pending number.
_Avoid_: membership

**Profile**:
The public display projection of an Account: the Display Name and avatar, plus the Phone Number it exposes. A Profile is not the Account — changing it does not change sign-in identity. UI screen: حساب کاربری.
_Avoid_: account, user

**Display Name**:
The name shown on a Profile. It may be the full name captured at Register; when empty, the Profile falls back to the Phone Number.
_Avoid_: nickname

**Phone Number**:
The credential that identifies a User — an Iranian mobile number in local form (`09xxxxxxxxx`).
_Avoid_: mobile, cell, "number"

**Check User**:
The step that decides whether a Phone Number belongs to an existing Account and routes the visitor to Login or Register accordingly.
_Avoid_: user check, phone check, lookup

**OTP**:
The one-time SMS code that proves control of a Phone Number. OTP login also creates the Account when the Phone Number is new (passwordless signup).
_Avoid_: verification code, passcode, token

**Login**:
The sign-in flow for a Phone Number that already has an Account: prove the OTP, enter the app.
_Avoid_: sign in, log in

**Register**:
The flow that creates an Account for a Phone Number that does not have one yet.
_Avoid_: sign up, signup, enrolment

**Session**:
A User's authenticated presence on a device, created by Login or Register and ended by Logout. A Session is not the Account: ending it does not delete the Account.
_Avoid_: auth state, login state, token

### Venues and booking

**Venue**:
A sports facility listed on Persu that offers one or more bookable Courts. UI term: مجموعه ورزشی.
_Avoid_: club, facility

**Court**:
A bookable playing surface at a Venue — a football pitch, volleyball court, tennis court, futsal hall, padel court, etc. UI term: زمین / سالن.
_Avoid_: field, location

**Time Slot**:
A fixed date and time interval on a Court that a User can book. UI term: سانس.
_Avoid_: session, appointment

**Booking**:
A User's confirmed reservation of a Time Slot. UI term: رزرو.
_Avoid_: order, ticket
