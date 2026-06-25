import { NavLink } from 'react-router-dom';

// Recursive folder/file node for the sidebar tree.
export default function TreeNode({ node, depth, expanded, toggle, currentRoute }) {
  return (
    <ul className="tree-list" style={{ '--depth': depth }}>
      {node.folders.map((folder) => {
        const isOpen = expanded.has(folder.path);
        const containsCurrent = folderContains(folder, currentRoute);
        return (
          <li key={folder.path} className="tree-folder">
            <button
              className={`tree-folder-btn${containsCurrent ? ' has-current' : ''}`}
              style={{ paddingLeft: `${depth * 14 + 10}px` }}
              onClick={() => toggle(folder.path)}
              aria-expanded={isOpen}
            >
              <span className={`tree-caret${isOpen ? ' open' : ''}`}>▸</span>
              <span className="tree-folder-name">{folder.name}</span>
            </button>
            {isOpen && (
              <TreeNode
                node={folder}
                depth={depth + 1}
                expanded={expanded}
                toggle={toggle}
                currentRoute={currentRoute}
              />
            )}
          </li>
        );
      })}

      {node.files.map((file) => (
        <li key={file.route} className="tree-file">
          <NavLink
            to={file.route}
            className={({ isActive }) =>
              `tree-file-link${isActive ? ' active' : ''}`
            }
            style={{ paddingLeft: `${depth * 14 + 26}px` }}
          >
            {file.icon && <span className="tree-icon">{file.icon}</span>}
            <span className="tree-file-name">{file.title}</span>
          </NavLink>
        </li>
      ))}
    </ul>
  );
}

function folderContains(folder, route) {
  if (!route) return false;
  if (folder.files.some((f) => f.route === route)) return true;
  return folder.folders.some((sub) => folderContains(sub, route));
}
