const META = {
  tip: { label: 'Tip', icon: '💡' },
  note: { label: 'Note', icon: '📝' },
  warning: { label: 'Warning', icon: '⚠️' },
  danger: { label: 'Danger', icon: '🛑' },
};

export default function Callout({ type, children }) {
  const meta = META[type] || META.note;
  return (
    <div className={`callout callout-${type}`}>
      <div className="callout-title">
        <span className="callout-icon" aria-hidden="true">{meta.icon}</span>
        <span>{meta.label}</span>
      </div>
      <div className="callout-body">{children}</div>
    </div>
  );
}
