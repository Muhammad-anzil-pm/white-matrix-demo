const GREETINGS = [
  "Hey. I'm Enzio. I look into scams that hide behind convincing technology. What's your name?",
  "You're through to Enzio. When technology gets used to deceive someone, I start with the person. What should I call you?",
  "Hi. Enzio here. If something felt wrong, you don't need the perfect explanation before we talk. What's your name?",
]

const NAME_ACKNOWLEDGEMENTS = [
  (name) => `Good to meet you, ${name}. I'll ask a few quick things, then you can give me the whole story.`,
  (name) => `Thanks, ${name}. Let's get the basics out of the way, then we'll slow down and look at what happened.`,
  (name) => `Got you, ${name}. Just a little context first, then you can tell it exactly as you remember it.`,
]

const REPAIR_MESSAGES = {
  age: 'A number is enough here. How old are you?',
  location: 'A city, town, or district is enough. Where are you based?',
  email: 'I need a reachable email for follow-up. Try something like name@example.com.',
  grievance: 'Take your time. Tell me what happened, what you were promised, or what started to feel suspicious.',
}

const CASUAL_OPENERS = /^(hi|hello|hey|hiya|yo|good morning|good afternoon|good evening)[!.\s]*$/i

export const STEPS = ['name', 'age', 'location', 'email', 'grievance', 'complete']

export const createEmptyProfile = () => ({
  name: '',
  age: '',
  location: '',
  email: '',
  grievance: '',
})

export const createMessageId = () => {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID()
  }
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`
}

export const initialMessages = () => [
  {
    id: createMessageId(),
    role: 'enzio',
    text: GREETINGS[Math.floor(Math.random() * GREETINGS.length)],
  },
]

const normalize = (value) => value.trim().replace(/\s+/g, ' ')

const extractName = (value) => {
  const match = value.match(/^(?:my name is|i(?:'| a)m|call me)\s+(.+)$/i)
  return normalize(match ? match[1] : value)
}

const looksLikeEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim())

const looksLikeLocation = (value) => value.length >= 2 && /[a-z]/i.test(value)

const ageFromText = (value) => {
  const match = value.match(/\b(\d{1,3})\b/)
  if (!match) return null
  const age = Number(match[1])
  return Number.isInteger(age) && age >= 1 && age <= 120 ? age : null
}

const questionFor = (step, profile) => {
  if (step === 'age') return `One quick thing, ${profile.name}. How old are you?`
  if (step === 'location') return 'And where are you based? City or town is enough.'
  if (step === 'email') return 'What email address should I use if I need to follow up with you?'
  if (step === 'grievance') return `Alright, ${profile.name}. I have the basics. Tell me what happened in your own words. No form-speak needed.`
  return 'Tell me what happened.'
}

const nextStep = (current) => {
  const index = STEPS.indexOf(current)
  return STEPS[Math.min(index + 1, STEPS.length - 1)]
}

export function processUserMessage({ step, value, profile }) {
  const text = normalize(value)

  if (!text) {
    return {
      nextStep: step,
      profile,
      reply: REPAIR_MESSAGES[step] ?? 'Say that again in your own words.',
      accepted: false,
    }
  }

  if (step === 'name') {
    if (CASUAL_OPENERS.test(text)) {
      return {
        nextStep: step,
        profile,
        reply: "Hey. I'm listening. What should I call you?",
        accepted: false,
      }
    }

    const name = extractName(text)
    if (name.length < 2 || /\d/.test(name)) {
      return {
        nextStep: step,
        profile,
        reply: 'Give me a name I can use. What should I call you?',
        accepted: false,
      }
    }

    const updated = { ...profile, name }
    const next = nextStep(step)
    const acknowledgement = NAME_ACKNOWLEDGEMENTS[Math.floor(Math.random() * NAME_ACKNOWLEDGEMENTS.length)](name)
    return {
      nextStep: next,
      profile: updated,
      reply: `${acknowledgement} ${questionFor(next, updated)}`,
      accepted: true,
    }
  }

  if (step === 'age') {
    const age = ageFromText(text)
    if (!age) {
      return { nextStep: step, profile, reply: REPAIR_MESSAGES.age, accepted: false }
    }
    const updated = { ...profile, age: String(age) }
    const next = nextStep(step)
    return { nextStep: next, profile: updated, reply: questionFor(next, updated), accepted: true }
  }

  if (step === 'location') {
    if (!looksLikeLocation(text)) {
      return { nextStep: step, profile, reply: REPAIR_MESSAGES.location, accepted: false }
    }
    const updated = { ...profile, location: text }
    const next = nextStep(step)
    return { nextStep: next, profile: updated, reply: questionFor(next, updated), accepted: true }
  }

  if (step === 'email') {
    if (!looksLikeEmail(text)) {
      return { nextStep: step, profile, reply: REPAIR_MESSAGES.email, accepted: false }
    }
    const updated = { ...profile, email: text.toLowerCase() }
    const next = nextStep(step)
    return { nextStep: next, profile: updated, reply: questionFor(next, updated), accepted: true }
  }

  if (step === 'grievance') {
    if (text.length < 16) {
      return {
        nextStep: step,
        profile,
        reply: 'I need a little more to work with. What happened, in your own words?',
        accepted: false,
      }
    }

    const updated = { ...profile, grievance: text }
    return {
      nextStep: 'complete',
      profile: updated,
      reply: "I've got it. You won't need to repeat yourself. The report is ready on my side of the desk.",
      accepted: true,
    }
  }

  return {
    nextStep: 'complete',
    profile,
    reply: 'The report is ready. Send it when you are comfortable.',
    accepted: true,
  }
}
