export default function EnzioMark({ compact = false }) {
  return (
    <span className={compact ? 'enzio-mark enzio-mark--compact' : 'enzio-mark'}>
      <svg viewBox="0 0 160 160" aria-hidden="true">
        <circle cx="80" cy="80" r="72" fill="none" stroke="currentColor" strokeWidth="2" opacity="0.45" />
        <path d="M33 111 51 45l29-16 29 16 18 66-27-17H60Z" fill="none" stroke="currentColor" strokeWidth="4" strokeLinejoin="round" />
        <path d="M62 67 80 54l18 13v23l-18 12-18-12Z" fill="currentColor" opacity="0.1" />
        <path d="M68 71h24M72 84h16" stroke="currentColor" strokeWidth="4" strokeLinecap="square" />
        <path d="M25 50h15M120 50h15M80 18v12M80 130v12" stroke="currentColor" strokeWidth="3" />
      </svg>
      {!compact && <span>Enzio</span>}
    </span>
  )
}
