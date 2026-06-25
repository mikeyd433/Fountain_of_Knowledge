export default function Breadcrumb({ file }) {
  const crumbs = [file.category, ...(file.section ? file.section.split(' / ') : []), file.title].filter(
    Boolean
  );
  return (
    <nav className="breadcrumb" aria-label="Breadcrumb">
      {crumbs.map((c, i) => (
        <span key={i} className="crumb-part">
          <span className={i === crumbs.length - 1 ? 'crumb-current' : 'crumb'}>
            {c}
          </span>
          {i < crumbs.length - 1 && <span className="crumb-sep">›</span>}
        </span>
      ))}
    </nav>
  );
}
