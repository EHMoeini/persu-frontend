# Persu

Persu (پرسو) is a sports-hall and court booking platform: venues list their halls and time slots, users book them. The product is Persian-first and RTL.

## Language

### Product

**Persu**:
The product this repository builds — the booking platform itself.
_Avoid_: Persue, Perso, "the app"

### Accounts and sign-in

**User**:
A person who signs in to Persu. Identified by their Phone Number.
_Avoid_: customer, client, member

**Account**:
A User's registered record on Persu. A Phone Number has an Account once registration completes; until then it is only a pending number.
_Avoid_: profile, membership

**Phone Number**:
The credential that identifies a User — an Iranian mobile number in local form (`09xxxxxxxxx`).
_Avoid_: mobile, cell, "number"

**Check User**:
The step that decides whether a Phone Number belongs to an existing Account and routes the visitor to Login or Register accordingly.
_Avoid_: user check, phone check, lookup

**OTP**:
The one-time SMS code that proves control of a Phone Number.
_Avoid_: verification code, passcode, token

**Login**:
The sign-in flow for a Phone Number that already has an Account: prove the OTP, enter the app.
_Avoid_: sign in, log in

**Register**:
The flow that creates an Account for a Phone Number that does not have one yet.
_Avoid_: sign up, signup, enrolment
