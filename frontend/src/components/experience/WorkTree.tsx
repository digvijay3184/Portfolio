'use client';

import { useMemo } from 'react';
import { WorkNode, buildTree } from '@/lib/tree/buildTree';
import WorkTreeNode from './WorkTreeNode';

interface WorkTreeProps {
  nodes: WorkNode[];
}

export default function WorkTree({ nodes }: WorkTreeProps) {
  const tree = useMemo(() => buildTree(nodes || []), [nodes]);

  if (!tree || tree.length === 0) {
    return (
      <div className="text-center py-8 text-[#9CA3AF] italic">
        No detailed breakdown added yet.
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full">
      {tree.map((rootNode) => (
        <WorkTreeNode key={rootNode.nodeId} node={rootNode} depth={0} />
      ))}
    </div>
  );
}
