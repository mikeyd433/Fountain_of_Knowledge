import { NavLink } from 'react-router-dom';

function collectFolderFiles(folder, acc = []) {
  for (const f of folder.files) acc.push(f.relPath);
  for (const sub of folder.folders) collectFolderFiles(sub, acc);
  return acc;
}

// The built-in Authoring Kit (under _meta/) is protected — don't offer delete.
const isMeta = (relPath) => String(relPath).startsWith('_meta/');

// Recursive folder/file node for the sidebar tree.
export default function TreeNode({ node, depth, expanded, toggle, currentRoute, onDelete }) {
  return (
    <ul className="tree-list" style={{ '--depth': depth }}>
      {node.folders.map((folder) => {
        const isOpen = expanded.has(folder.path);
        const containsCurrent = folderContains(folder, currentRoute);
        const folderFiles = collectFolderFiles(folder);
        const metaOnly = folderFiles.length > 0 && folderFiles.every(isMeta);
        return (
          <li key={folder.path} className="tree-folder">
            <div className={`tree-row${containsCurrent ? ' has-current' : ''}`}>
              <button
                className="tree-folder-btn"
                style={{ paddingLeft: `${depth * 14 + 10}px` }}
                onClick={() => toggle(folder.path)}
                aria-expanded={isOpen}
              >
                <span className={`tree-caret${isOpen ? ' open' : ''}`}>▸</span>
                <span className="tree-folder-name">{folder.name}</span>
              </button>
              {onDelete && !metaOnly && (
                <button
                  className="tree-del"
                  title={`Delete "${folder.name}" and everything in it`}
                  aria-label={`Delete ${folder.name}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete(folderFiles, folder.name, folderFiles.length);
                  }}
                >
                  🗑
                </button>
              )}
            </div>
            {isOpen && (
              <TreeNode
                node={folder}
                depth={depth + 1}
                expanded={expanded}
                toggle={toggle}
                currentRoute={currentRoute}
                onDelete={onDelete}
              />
            )}
          </li>
        );
      })}

      {node.files.map((file) => (
        <li key={file.route} className="tree-file">
          <div className="tree-row">
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
            {onDelete && !isMeta(file.relPath) && (
              <button
                className="tree-del"
                title={`Delete "${file.title}"`}
                aria-label={`Delete ${file.title}`}
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete([file.relPath], file.title, 1);
                }}
              >
                🗑
              </button>
            )}
          </div>
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
