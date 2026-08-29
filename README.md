# Guardian AI (65)

Build a professional, responsive AI Emergency Assistant web app MVP.

Goal

Create a modern healthcare/safety platform that helps users monitor emergency situations, manage medical information and contacts, and respond quickly to possible falls or emergencies.

Design

Use a premium, trustworthy healthcare UI:

Deep navy + calm blue as primary colors

White/light gray backgrounds

Muted green for safe states

Amber for warnings

Red ONLY for emergency states

Rounded cards, subtle shadows, clean borders and modern icons

Excellent spacing, typography and accessibility

Fully responsive on desktop, tablet and mobile

Include light/dark mode with a simple sun/moon toggle

Avoid neon colors, excessive animations and generic admin-dashboard styling

Main Pages

Create these pages with working navigation:

Login / Signup

Email/User ID

Password

Signup with name, email, user ID, password and phone

Basic validation

Logout

Dashboard
Show:

Safety Status

Fall Detection Status

Medical Profile summary

Emergency Contacts

Live Location status

Emergency History

Quick Emergency button

AI Fall Detection
Create a simulated monitoring interface with states:

Standing

Walking

Lying

Fall Detected

When "Fall Detected" is triggered:

Show clear emergency warning

Start a 20-second countdown

Show "I'm OK" button

If clicked, cancel emergency and save a false-alarm event

If countdown reaches zero, activate emergency mode

Show emergency contacts notified, location sharing active and medical profile available

Save the event in Emergency History

This is a UI simulation only. Do not claim real AI/camera/GPS detection is active.

Emergency Contacts
Allow users to add, edit and delete contacts.
Fields:

Name

Relationship

Phone number

User ID
Include Call and emergency-notification status UI.

Medical Profile
Allow users to save/edit:

Blood group

Age

Weight

Height

Medical conditions

Current medicines

Allergies

AI Emergency Assistant
Add a floating chatbot button.
Open a modern chat panel with simulated AI responses.
Include:

User/AI messages

Typing indicator

Timestamps

Send button

Emergency button
During a fall alert, show: "I detected a possible fall. Are you okay?"
Buttons: "I'm OK" and "I Need Help"

Live Location
Create a map-style UI showing:

Location status

Sharing status

Last updated

Share Location / Stop Sharing

Use mock location data for the prototype and clearly structure it so a real map/GPS API can be connected later.

Emergency History
Show events in a clean timeline:

Fall Detected

False Alarm

Emergency Activated

Medical Alert

User Requested Help

Include date, time, status and response.

First Aid
Create simple cards for:

Heart Attack

CPR

Burns

Bleeding

Stroke

Choking

Each card opens concise step-by-step emergency guidance with a clear disclaimer that it does not replace professional emergency services.

Navigation

Use a responsive sidebar:
Dashboard, Fall Detection, Medical Profile, Emergency Contacts, AI Assistant, Live Location, Emergency History, First Aid.

On mobile, use a hamburger menu.

Technical Requirements

Use:

React

Tailwind CSS

Reusable components

Clean component structure

Local/mock data for the MVP

Functional buttons, forms, navigation, countdown and state changes

Keep the architecture ready for a future Python/FastAPI backend, real authentication, database, AI fall detection, GPS, notifications and emergency APIs.

Important

Do NOT build unnecessary advanced backend infrastructure now.
Do NOT pretend that AI fall detection, GPS, emergency calls or medical-device integration are actually connected.
Use realistic mock data where integrations are unavailable.

Prioritize:
Safety + Clarity + Trust + Accessibility + Professional UI

Make the final result look like a real modern AI safety product, NOT a student project or generic admin dashboard... DESIGN ACCORDING TO THIS COMMAND MAKE SURE TO FOLLOW EVERY INSTRUCTION CAREFULLY

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/5c043c81-6cc7-4111-b875-f2fe33363411).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
