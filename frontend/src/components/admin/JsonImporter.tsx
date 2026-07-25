import { useState } from 'react';
import { ZodSchema } from 'zod';
import { FileJson, AlertCircle, CheckCircle2 } from 'lucide-react';

interface JsonImporterProps {
  schema: ZodSchema<any>;
  onValidData: (data: any) => void;
  label?: string;
  exampleTemplate?: string;
}

export default function JsonImporter({ schema, onValidData, label = 'Import JSON', exampleTemplate = '' }: JsonImporterProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [jsonInput, setJsonInput] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleOpen = () => {
    setJsonInput(exampleTemplate);
    setError(null);
    setIsOpen(true);
  };

  const handleImport = () => {
    try {
      setError(null);
      
      if (!jsonInput.trim()) {
        throw new Error('Please paste some JSON data first.');
      }

      // 1. Parse standard JSON
      const parsed = JSON.parse(jsonInput);

      // 2. Validate against secure Zod Schema
      const validated = schema.parse(parsed);

      // 3. Success
      onValidData(validated);
      setIsOpen(false);
      setJsonInput('');
      
    } catch (err: any) {
      if (err.name === 'SyntaxError') {
        setError('Invalid JSON syntax. Please check for missing quotes or commas.');
      } else if (err.issues) {
        // Zod validation error
        const messages = err.issues.map((i: any) => `${i.path.join('.')}: ${i.message}`).join(', ');
        setError(`Schema validation failed: ${messages}`);
      } else {
        setError(err.message || 'An unknown error occurred');
      }
    }
  };

  if (!isOpen) {
    return (
      <button
        type="button"
        onClick={handleOpen}
        className="flex items-center gap-2 px-4 py-2 bg-[#1A1A1A] border border-[#333333] hover:bg-[#222222] text-[#9CA3AF] hover:text-white rounded-md transition-colors text-sm font-medium"
      >
        <FileJson size={16} />
        {label}
      </button>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="bg-[#121212] border border-[#333333] p-6 rounded-xl w-full max-w-2xl relative shadow-2xl">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-white text-lg font-semibold flex items-center gap-2">
            <FileJson size={20} className="text-[#EA580C]" />
            Secure JSON Import
          </h3>
          <button 
            type="button"
            onClick={() => setIsOpen(false)}
            className="text-[#9CA3AF] hover:text-white text-sm bg-[#1A1A1A] px-3 py-1 rounded-md"
          >
            Cancel
          </button>
        </div>
        
        <p className="text-sm text-[#9CA3AF] mb-3">Paste your JSON payload below. An example schema structure has been provided.</p>
        
        <textarea
          value={jsonInput}
          onChange={(e) => setJsonInput(e.target.value)}
          spellCheck={false}
          className="w-full h-80 bg-[#050505] border border-[#222222] text-[#E5E7EB] font-mono text-sm rounded-md p-4 focus:outline-none focus:border-[#EA580C] mb-4"
        />

        {error && (
          <div className="bg-red-900/20 border border-red-500/50 text-red-400 p-3 rounded-md mb-4 flex items-start gap-3 text-sm">
            <AlertCircle size={16} className="mt-0.5 flex-shrink-0" />
            <p>{error}</p>
          </div>
        )}

        <div className="flex justify-end gap-4 mt-6">
          <button
            type="button"
            onClick={handleImport}
            className="flex items-center gap-2 bg-[#EA580C] hover:bg-[#F97316] text-white px-6 py-2 rounded-md transition-colors font-medium"
          >
            <CheckCircle2 size={18} />
            Validate & Import
          </button>
        </div>
      </div>
    </div>
  );
}
