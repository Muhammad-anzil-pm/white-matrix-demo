import { useEffect, useRef, useState } from 'react'
import {
  createEmptyProfile,
  createMessageId,
  initialMessages,
  processUserMessage,
} from '../lib/conversationEngine'
import { emailIsConfigured, getEmailConfigError, sendEnzioReport } from '../lib/email'

function Message({ message }) {
  return (
    <article className={`chat-message chat-message--${message.role}`}>
      <span className="chat-message__role">{message.role === 'enzio' ? 'Enzio' : 'You'}</span>
      <p>{message.text}</p>
    </article>
  )
}

function TypingMessage() {
  return (
    <article className="chat-message chat-message--enzio">
      <span className="chat-message__role">Enzio</span>
      <div className="typing" aria-label="Enzio is typing">
        <span />
        <span />
        <span />
      </div>
    </article>
  )
}

export default function ChatPanel() {
  const [messages, setMessages] = useState(() => initialMessages())
  const [profile, setProfile] = useState(() => createEmptyProfile())
  const [step, setStep] = useState('name')
  const [draft, setDraft] = useState('')
  const [thinking, setThinking] = useState(false)
  const [sending, setSending] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')
  const threadRef = useRef(null)
  const inputRef = useRef(null)
  const timeoutRef = useRef(null)

  const resetConversation = () => {
    setMessages(initialMessages())
    setProfile(createEmptyProfile())
    setStep('name')
    setDraft('')
    setThinking(false)
    setSending(false)
    setSent(false)
    setError('')
  }

  useEffect(() => {
    return () => {
      if (timeoutRef.current) window.clearTimeout(timeoutRef.current)
    }
  }, [])

  useEffect(() => {
    const node = threadRef.current
    if (node) node.scrollTo({ top: node.scrollHeight, behavior: 'smooth' })
  }, [messages, thinking])

  useEffect(() => {
    if (!thinking && !sending && !sent) inputRef.current?.focus()
  }, [step, thinking, sending, sent])

  const isComplete = step === 'complete'
  const helper = sent
    ? 'Report delivered. Enzio has the case.'
    : sending
      ? 'Sending the report to the case desk.'
      : thinking
        ? 'Enzio is reading that…'
        : error || 'Nothing leaves this page until you send the report.'

  const pushMessage = (role, text) => {
    setMessages((current) => [...current, { id: createMessageId(), role, text }])
  }

  const handleMessageSubmit = (event) => {
    event.preventDefault()
    const value = draft.trim()
    if (!value || thinking || sending || sent) return

    pushMessage('user', value)
    setDraft('')
    setError('')
    setThinking(true)

    timeoutRef.current = window.setTimeout(() => {
      const result = processUserMessage({ step, value, profile })
      setProfile(result.profile)
      setStep(result.nextStep)
      pushMessage('enzio', result.reply)
      setThinking(false)
    }, 420)
  }

  const handleReportSend = async () => {
    setError('')

    if (!emailIsConfigured()) {
      setError(getEmailConfigError())
      return
    }

    setSending(true)
    try {
      await sendEnzioReport(profile)
      setSent(true)
      pushMessage('enzio', 'It’s on its way. You did the hard part by telling the story.')
    } catch (sendError) {
        console.error('EmailJS error:', sendError)

        setError(
          sendError?.text ||
          sendError?.message ||
          `EmailJS error: ${sendError?.status ?? 'unknown'}`
  )
    }
  }

  return (
    <section className="chat-panel" aria-labelledby="chat-title">
      <header className="chat-panel__header">
        <div>
          <span className="panel-kicker">Open channel</span>
          <h2 id="chat-title">Talk to Enzio</h2>
        </div>
        <div
          className={`status-indicator ${sending ? 'status-indicator--busy' : sent ? 'status-indicator--sent' : ''}`}
          aria-label={sent ? 'Report sent' : sending ? 'Sending report' : 'Channel ready'}
        >
          <span />
          <span>{sent ? 'Closed' : sending ? 'Sending' : 'Ready'}</span>
        </div>
      </header>

      <div className="chat-thread" ref={threadRef} aria-live="polite" aria-label="Conversation with Enzio">
        {messages.map((message) => <Message key={message.id} message={message} />)}
        {thinking && <TypingMessage />}
      </div>

      <footer className="chat-panel__footer">
        <p className={`chat-helper ${error ? 'chat-helper--error' : ''}`} aria-live="polite">{helper}</p>

        {!isComplete && !sent && (
          <form className="chat-input" onSubmit={handleMessageSubmit}>
            <input
              ref={inputRef}
              name="message"
              type={step === 'email' ? 'email' : 'text'}
              inputMode={step === 'age' ? 'numeric' : 'text'}
              autoComplete={step === 'email' ? 'email' : 'off'}
              value={draft}
              onChange={(event) => setDraft(event.target.value)}
              aria-label="Message Enzio"
              placeholder={step === 'name' ? 'Type your name' : step === 'grievance' ? 'Tell me what happened' : 'Type your answer'}
              disabled={thinking || sending}
              maxLength={1200}
            />
            <button type="submit" className="chat-submit" disabled={!draft.trim() || thinking || sending}>
              Send
            </button>
          </form>
        )}

        {isComplete && !sent && (
          <div className="report-action">
            <div>
              <strong>Your report is ready.</strong>
              <p>Your details and story will be sent to the case desk.</p>
            </div>
            <button type="button" className="chat-submit" onClick={handleReportSend} disabled={sending}>
              {sending ? 'Sending…' : 'Send report'}
            </button>
          </div>
        )}

        {sent && (
          <div className="report-sent" role="status">
            <div className="report-sent__content">
              <span className="report-sent__mark" aria-hidden="true">✓</span>
              <div>
                <strong>Report sent.</strong>
                <p>Thanks for trusting Enzio with it.</p>
              </div>
            </div>
            <button type="button" className="chat-restart" onClick={resetConversation}>Start again</button>
          </div>
        )}
      </footer>
    </section>
  )
}
