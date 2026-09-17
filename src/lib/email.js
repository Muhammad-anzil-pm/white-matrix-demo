import emailjs from '@emailjs/browser'

const requiredKeys = [
  'VITE_EMAILJS_SERVICE_ID',
  'VITE_EMAILJS_TEMPLATE_ID',
  'VITE_EMAILJS_PUBLIC_KEY',
  'VITE_EMAILJS_RECIPIENT',
]

export function emailIsConfigured() {
  return requiredKeys.every((key) => Boolean(import.meta.env[key]))
}

export function getEmailConfigError() {
  const missing = requiredKeys.filter((key) => !import.meta.env[key])
  return missing.length ? `EmailJS still needs: ${missing.join(', ')}.` : ''
}

export async function sendEnzioReport(profile) {
  if (!emailIsConfigured()) {
    throw new Error('EmailJS is not configured. Add the values from .env.example before sending a report.')
  }

  const submittedAt = new Intl.DateTimeFormat('en-IN', {
    dateStyle: 'full',
    timeStyle: 'short',
  }).format(new Date())

  const templateParams = {
    to_email: import.meta.env.VITE_EMAILJS_RECIPIENT,
    visitor_name: profile.name,
    visitor_age: profile.age,
    visitor_location: profile.location,
    visitor_email: profile.email,
    grievance: profile.grievance,
    submitted_at: submittedAt,
  }

  return emailjs.send(
    import.meta.env.VITE_EMAILJS_SERVICE_ID,
    import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
    templateParams,
    { publicKey: import.meta.env.VITE_EMAILJS_PUBLIC_KEY },
  )
}
