# Enzio

Enzio is a React + Vite superhero help portal for the WhiteMatrix TechAscent machine test.

The experience is built around one idea: a visitor should be able to sit down and talk to Enzio like a person, explain what happened, and send the report without filling in a conventional form.

## Stack

- React 19
- Vite 7
- ESLint 9
- EmailJS
- pnpm

## Setup

```bash
pnpm install
cp .env.example .env
pnpm dev
```

Open the local Vite URL shown in the terminal.

## EmailJS configuration

Add these values to `.env`:

```env
VITE_EMAILJS_SERVICE_ID=service_your_service
VITE_EMAILJS_TEMPLATE_ID=template_your_template
VITE_EMAILJS_PUBLIC_KEY=your_public_key
VITE_EMAILJS_RECIPIENT=your-email@example.com
```

Create the EmailJS template using `EMAILJS_TEMPLATE.md`.

The browser sends the case directly through EmailJS. No private EmailJS secret is stored in the project.

## Checks

```bash
pnpm lint
pnpm build
pnpm preview
```

## Structure

```text
src/
  assets/enzio-portrait.svg
  components/
    ChatPanel.jsx
    EnzioMark.jsx
  lib/
    conversationEngine.js
    email.js
  App.jsx
  index.css
  main.jsx
public/
  favicon.svg
```

The conversation logic is deliberately local so the portal works without an AI API. A model-backed service can be added later behind the same conversation boundary if needed.

## Deployment

The app is a static Vite site. Vercel, Netlify, or another Vite-compatible host can serve the build.

For a deployment, add the four `VITE_EMAILJS_*` variables in the host's environment settings before building.
