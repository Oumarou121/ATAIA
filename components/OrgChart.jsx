import { ORG } from "@/lib/data";

function Node({ node }) {
  return (
    <li>
      <div className={`org-node${node.kind ? " " + node.kind : ""}`}>{node.label}</div>
      {node.children?.length > 0 && (
        <ul>
          {node.children.map((c) => (
            <Node key={c.label} node={c} />
          ))}
        </ul>
      )}
    </li>
  );
}

export default function OrgChart() {
  return (
    <div className="org-wrap">
      <p className="org-title">Organigramme de la société</p>
      <div className="tree">
        <ul>
          <Node node={ORG} />
        </ul>
      </div>
    </div>
  );
}
