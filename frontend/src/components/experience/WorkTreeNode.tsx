'use client';

import { useState } from 'react';
import { TreeNode } from '@/lib/tree/buildTree';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, Folder, FileCode, CheckSquare, Target } from 'lucide-react';

interface WorkTreeNodeProps {
  node: TreeNode;
  depth: number;
}

export default function WorkTreeNode({ node, depth }: WorkTreeNodeProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const hasChildren = node.children && node.children.length > 0;

  const getIcon = () => {
    // In a real app we'd map string icons to Lucide components dynamically.
    // For now we use standard fallbacks based on type.
    switch (node.type) {
      case 'project': return <Folder size={16} className="text-[#FBBF24]" />;
      case 'feature': return <FileCode size={16} className="text-[#3B82F6]" />;
      case 'milestone': return <Target size={16} className="text-[#A855F7]" />;
      default: return <CheckSquare size={16} className="text-[#10B981]" />;
    }
  };

  return (
    <div className="w-full">
      <div 
        className={`flex items-start gap-2 py-2 border-b border-[#222222]/50 hover:bg-[#111] transition-colors rounded px-2 group ${hasChildren ? 'cursor-pointer' : ''}`}
        style={{ paddingLeft: `${depth * 1.5 + 0.5}rem` }}
        onClick={() => hasChildren && setIsExpanded(!isExpanded)}
      >
        <button
          className="p-1 text-[#9CA3AF] group-hover:text-white mt-0.5"
          style={{ visibility: hasChildren ? 'visible' : 'hidden' }}
        >
          <motion.div
            animate={{ rotate: isExpanded ? 90 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <ChevronRight size={16} />
          </motion.div>
        </button>

        <div className="mt-1.5 shrink-0">
          {getIcon()}
        </div>

        <div className="flex-1">
          <div className="flex flex-col sm:flex-row sm:items-center gap-2">
            <span className="text-white font-medium">{node.label}</span>
            
            <span className="text-[10px] uppercase tracking-wider px-1.5 py-0.5 rounded bg-[#222] text-[#9CA3AF]">
              {node.type}
            </span>
          </div>
          
          {node.description && (
            <p className="text-sm text-[#9CA3AF] mt-1">
              {node.description}
            </p>
          )}

          {node.techStack && node.techStack.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-2">
              {node.techStack.map((tech, idx) => (
                <span key={idx} className="text-[10px] bg-[#1a1a1a] border border-[#333] px-1.5 py-0.5 rounded text-[#9CA3AF]">
                  {tech}
                </span>
              ))}
            </div>
          )}

          {hasChildren && !isExpanded && (
            <div className="mt-2 text-[11px] text-[#EA580C] font-medium flex items-center gap-1 opacity-80 group-hover:opacity-100 transition-opacity">
              <span>Click to expand {node.children.length} item{node.children.length !== 1 ? 's' : ''}</span>
            </div>
          )}
        </div>
      </div>

      <AnimatePresence initial={false}>
        {isExpanded && hasChildren && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ 
              height: { stiffness: 300, damping: 30 },
              opacity: { duration: 0.2 }
            }}
            className="overflow-hidden"
          >
            {node.children.map(child => (
              <WorkTreeNode key={child.nodeId} node={child} depth={depth + 1} />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
