import ChatPanel from './components/ChatPanel'
import EnzioMark from './components/EnzioMark'
import EnzioPortrait from './assets/assassin.png'

const fieldNotes = [
  ['Impersonation', 'Borrowed names, copied faces, fake profiles, and messages written to sound familiar.'],
  ['Synthetic voices', 'Calls that use a familiar voice to create urgency, fear, or pressure to pay.'],
  ['Manufactured proof', 'Screenshots, messages, documents, and “official” evidence made to end the questions.'],
]

const caseNotes = [
  ['Specialty', 'AI fraud and impersonation'],
  ['Method', 'Listen first. Trace second.'],
  ['Rule', 'No victim gets blamed.'],
]

function SectionLabel({ children }) {
  return <p className="section-label">{children}</p>
}

export default function App() {
  return (
    <div className="site-shell">
      <header className="topbar">
        <a className="brand-lockup" href="#top" aria-label="Enzio home">
          <EnzioMark compact />
          <span>Enzio / case desk</span>
        </a>
        <a className="topbar__link" href="#field-notes">How he helps</a>
      </header>

      <main id="top">
        <section className="hero" aria-labelledby="hero-title">
          <div className="hero__intro">
            <SectionLabel>AI fraud investigator</SectionLabel>
            <h1 id="hero-title">When a machine lies, Enzio listens.</h1>
           
            <div className="hero__visual" aria-hidden="true">
              <img src={EnzioPortrait} alt="" />
              <div className="hero__visual-note">
                <span>Case desk sketch</span>
                <strong>Keep the story. Find the break in it.</strong>
              </div>
            </div>

            <blockquote className="hero__quote">
              <p>“Every story leaves something behind. Start from the beginning.”</p>
              <cite>Enzio</cite>
            </blockquote>
          </div>

          <div className="hero__chat-wrap">
            <p className="chat-context">Private intake. One conversation.</p>
            <ChatPanel />
          </div>
        </section>

        <section className="identity" id="how-he-helps" aria-labelledby="identity-title">
          <div className="identity__main">
            <SectionLabel>Origin</SectionLabel>
            <h2 id="identity-title">He watches for the moment a believable story stops matching the evidence.</h2>
            <p>Enzio works in the shadows where people and machines become difficult to tell apart.
He hunts spoofed identities, synthetic voices, copied faces, fake job offers, fabricated screenshots, and stories built to sound convincing.</p>
            <p>He is not a cop, a judge, or a wizard. He is the person who stays curious after the first explanation stops making sense.</p>
          </div>

          <aside className="identity__notes" aria-label="Enzio case notes">
            {caseNotes.map(([label, value]) => (
              <div className="case-note" key={label}>
                <span>{label}</span>
                <strong>{value}</strong>
              </div>
            ))}
          </aside>
        </section>

        <section className="field-notes" id="field-notes" aria-labelledby="field-notes-title">
          <div className="field-notes__heading">
            <SectionLabel>Field notes</SectionLabel>
            <h2 id="field-notes-title">What Enzio is trained to notice.</h2>
          </div>

          <div className="field-notes__list">
            {fieldNotes.map(([title, body]) => (
              <article className="field-note" key={title}>
                <div className="field-note__rule" aria-hidden="true" />
                <div>
                  <h3>{title}</h3>
                  <p>{body}</p>
                </div>
              </article>
            ))}
          </div>
        </section>
        <section className="method" aria-labelledby="method-title">
          <div className="method__statement">
            <SectionLabel>Enzio’s rule</SectionLabel>
            <h2 id="method-title">You do not have to prove your pain before you can explain it.</h2>
          </div>
          <div className="method__copy">
            <p>I ask one useful question at a time. I waits until the whole story is on the table before answering you.</p>
            <p>Once you choose <strong>Send report</strong>, the case desk receives the details you gave to me, including your story.</p>
          </div>
        </section>
      </main>

      <footer className="footer">
        <div className="footer__brand">
          <EnzioMark compact />
          <div>
            <strong>Enzio</strong>
            <p><b>The hidden one</b></p>
          </div>
        </div>
      </footer>
    </div>
  )
}
