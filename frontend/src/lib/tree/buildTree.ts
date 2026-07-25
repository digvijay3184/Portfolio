export interface WorkNode {
  nodeId: string;
  parentId: string | null;
  label: string;
  description?: string;
  type: 'project' | 'feature' | 'task' | 'milestone';
  icon?: string;
  techStack?: string[];
  order: number;
}

export interface TreeNode extends WorkNode {
  children: TreeNode[];
}

export function buildTree(nodes: WorkNode[]): TreeNode[] {
  if (!nodes || nodes.length === 0) return [];
  
  const nodeMap = new Map<string, TreeNode>();
  const roots: TreeNode[] = [];

  // Initialize nodes
  for (const node of nodes) {
    nodeMap.set(node.nodeId, { ...node, children: [] });
  }

  // Build tree
  for (const node of nodes) {
    const treeNode = nodeMap.get(node.nodeId)!;
    if (node.parentId === null) {
      roots.push(treeNode);
    } else {
      const parent = nodeMap.get(node.parentId);
      if (parent) {
        parent.children.push(treeNode);
      } else {
        // If parent is missing, treat as root to avoid losing data
        roots.push(treeNode);
      }
    }
  }

  // Sort nodes by order
  const sortNodes = (nodesList: TreeNode[]) => {
    nodesList.sort((a, b) => (a.order || 0) - (b.order || 0));
    for (const node of nodesList) {
      if (node.children.length > 0) {
        sortNodes(node.children);
      }
    }
  };

  sortNodes(roots);
  return roots;
}
