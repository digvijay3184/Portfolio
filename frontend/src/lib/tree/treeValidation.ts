import { WorkNode } from './buildTree';

export interface TreeValidationResult {
  isValid: boolean;
  errors: string[];
}

export function validateWorkTree(nodes: WorkNode[]): TreeValidationResult {
  const errors: string[] = [];
  if (!Array.isArray(nodes) || nodes.length === 0) {
    return { isValid: true, errors: [] };
  }

  const nodeIds = new Set(nodes.map(n => n.nodeId));
  if (nodeIds.size !== nodes.length) {
    errors.push('Duplicate nodeId found in workTree');
  }

  const nodeMap = new Map(nodes.map(n => [n.nodeId, n]));

  for (const node of nodes) {
    if (!node.nodeId) errors.push('nodeId is required');
    if (!node.label || node.label.trim().length < 1 || node.label.trim().length > 120) {
      errors.push(`Label for node ${node.nodeId} must be between 1 and 120 characters`);
    }

    if (node.parentId && !nodeMap.has(node.parentId)) {
      errors.push(`Parent node ${node.parentId} not found in workTree`);
    }

    let depth = 1;
    let current = node;
    const visited = new Set([current.nodeId]);
    
    while (current.parentId) {
      if (visited.has(current.parentId)) {
        errors.push(`Cycle detected involving node ${current.parentId}`);
        break;
      }
      depth++;
      if (depth > 4) {
        errors.push(`Max depth of 4 exceeded for node ${node.nodeId}`);
        break;
      }
      visited.add(current.parentId);
      const parentNode = nodeMap.get(current.parentId);
      if (!parentNode) break;
      current = parentNode;
    }
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}
