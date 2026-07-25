'use client';

import { useState, useMemo } from 'react';
import { WorkNode, buildTree, TreeNode } from '@/lib/tree/buildTree';
import { validateWorkTree } from '@/lib/tree/treeValidation';
import { nanoid } from 'nanoid';
import { Plus, Edit2, Trash2, ChevronRight, ChevronDown } from 'lucide-react';
import WorkTreeNodeForm from './WorkTreeNodeForm';
import toast from 'react-hot-toast';

interface WorkTreeEditorProps {
  nodes: WorkNode[];
  onChange: (nodes: WorkNode[]) => void;
}

export default function WorkTreeEditor({ nodes, onChange }: WorkTreeEditorProps) {
  const [editingNodeId, setEditingNodeId] = useState<string | null>(null);
  const [addingToParentId, setAddingToParentId] = useState<string | null>(null); // 'root' means adding a root node, a string means adding a child to that node, null means not adding
  const [expanded, setExpanded] = useState<Set<string>>(new Set());

  const tree = useMemo(() => buildTree(nodes || []), [nodes]);

  const toggleExpand = (nodeId: string) => {
    setExpanded(prev => {
      const next = new Set(prev);
      if (next.has(nodeId)) next.delete(nodeId);
      else next.add(nodeId);
      return next;
    });
  };

  const handleSaveNode = (data: Partial<WorkNode>) => {
    let newNodes = [...(nodes || [])];
    
    if (editingNodeId) {
      // Update existing
      newNodes = newNodes.map(n => n.nodeId === editingNodeId ? { ...n, ...data } as WorkNode : n);
    } else {
      // Add new
      const newNode: WorkNode = {
        ...data,
        nodeId: nanoid(10),
        parentId: addingToParentId === 'root' ? null : addingToParentId,
        order: newNodes.length,
      } as WorkNode;
      newNodes.push(newNode);
    }

    const validation = validateWorkTree(newNodes);
    if (!validation.isValid) {
      toast.error(validation.errors[0]);
      return;
    }

    onChange(newNodes);
    setEditingNodeId(null);
    setAddingToParentId(null);
  };

  const handleDelete = (nodeId: string) => {
    // Collect node and all descendants
    const toDelete = new Set<string>();
    const collectDescendants = (id: string) => {
      toDelete.add(id);
      nodes.forEach(n => {
        if (n.parentId === id) collectDescendants(n.nodeId);
      });
    };
    collectDescendants(nodeId);
    
    if (window.confirm(`Delete this node and its ${toDelete.size - 1} descendants?`)) {
      const newNodes = nodes.filter(n => !toDelete.has(n.nodeId));
      onChange(newNodes);
    }
  };

  const renderNode = (node: TreeNode, depth: number) => {
    const isExpanded = expanded.has(node.nodeId);
    const hasChildren = node.children.length > 0;
    const canAddChild = depth < 3; // depth 0, 1, 2, 3 (max depth 4)

    return (
      <div key={node.nodeId} className="mb-2">
        <div className="flex items-center gap-2 p-2 bg-[#121212] border border-[#222222] rounded-lg group hover:border-[#333] transition-colors" style={{ marginLeft: `${depth * 24}px` }}>
          <button type="button" onClick={() => toggleExpand(node.nodeId)} className="p-1 text-[#9CA3AF] hover:text-white" style={{ visibility: hasChildren ? 'visible' : 'hidden' }}>
            {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
          </button>
          
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <span className="text-white font-medium">{node.label}</span>
              <span className="text-xs px-2 py-0.5 rounded bg-[#222] text-[#9CA3AF]">{node.type}</span>
            </div>
            {node.description && <div className="text-xs text-[#9CA3AF] truncate max-w-md mt-1">{node.description}</div>}
          </div>

          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <button 
              type="button"
              onClick={() => { setExpanded(prev => new Set(prev).add(node.nodeId)); setAddingToParentId(node.nodeId); setEditingNodeId(null); }}
              disabled={!canAddChild}
              title={canAddChild ? "Add child" : "Max depth reached"}
              className="p-1.5 text-[#9CA3AF] hover:text-[#EA580C] disabled:opacity-30 disabled:hover:text-[#9CA3AF]"
            >
              <Plus size={16} />
            </button>
            <button type="button" onClick={() => { setEditingNodeId(node.nodeId); setAddingToParentId(null); }} className="p-1.5 text-[#9CA3AF] hover:text-white">
              <Edit2 size={16} />
            </button>
            <button type="button" onClick={() => handleDelete(node.nodeId)} className="p-1.5 text-[#9CA3AF] hover:text-red-500">
              <Trash2 size={16} />
            </button>
          </div>
        </div>

        {isExpanded && node.children.map(child => renderNode(child, depth + 1))}
      </div>
    );
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-4">
        <h4 className="text-sm font-medium text-[#9CA3AF]">Work Breakdown Tree</h4>
        <button
          type="button"
          onClick={() => { setAddingToParentId('root'); setEditingNodeId(null); }}
          className="text-sm flex items-center gap-1 text-[#EA580C] hover:text-[#F97316]"
        >
          <Plus size={16} /> Add Root Item
        </button>
      </div>

      {tree.length === 0 && (
        <div className="text-sm text-[#555] italic text-center p-4 border border-dashed border-[#222] rounded-xl">
          No work items added. Build out the breakdown tree here.
        </div>
      )}

      <div className="mt-2">
        {tree.map(rootNode => renderNode(rootNode, 0))}
      </div>

      {(editingNodeId || addingToParentId) && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-[#121212] border border-[#333333] rounded-xl w-full max-w-2xl shadow-2xl relative max-h-[90vh] flex flex-col">
            <div className="flex-1 overflow-y-auto p-2">
              <WorkTreeNodeForm 
                initialData={editingNodeId ? nodes.find(n => n.nodeId === editingNodeId) : undefined} 
                onSubmit={handleSaveNode} 
                onCancel={() => { setEditingNodeId(null); setAddingToParentId(null); }} 
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
