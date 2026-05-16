# PRD: Welcome Message

## Overview

Users enter their first and last name on a form; the backend builds a personalized welcome message and the frontend displays it.

## Problem statement

The app needs a simple end-to-end flow demonstrating frontend → backend → frontend data handling with user-provided names.

## Goals

- Collect first name and last name from the user
- Return a welcome message containing the full name
- Display the message on the UI after submit

## User stories

1. As a visitor, I want to enter my first and last name so that I receive a personalized welcome.
2. As a visitor, I want to see the welcome message on the page after submitting the form.

## Functional requirements

1. **FR-1** — The UI provides inputs for first name and last name and a submit control.
2. **FR-2** — On submit, the frontend sends `POST /welcome` with `{ firstName, lastName }`.
3. **FR-3** — The backend validates both names are non-empty after trim.
4. **FR-4** — The backend responds with `{ message: "Welcome, {firstName} {lastName}" }`.
5. **FR-5** — The frontend displays the returned message to the user.

## Non-goals

- User accounts or authentication
- Persisting names to a database
- Internationalization

## Success metrics

- Form submit shows correct full name in welcome message
- All unit, e2e, and frontend tests pass

## Open questions

- None for MVP
