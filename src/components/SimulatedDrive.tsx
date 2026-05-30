import React, { useState } from 'react';
import { FolderOpen, FileText, Search, Trash2, Plus, ArrowLeft } from 'lucide-react';
import { VirtualFile } from '../types';
import { playSound } from '../utils/audioSynthesizer';

interface SimulatedDriveProps {
  files: VirtualFile[];
  onSelectFile: (file: VirtualFile) => void;
  onDeleteFile: (id: string) => void;
  onCreateFile: (name: string, content: string) => void;
  selectedFile: VirtualFile | null;
}

export default function SimulatedDrive({
  files,
  onSelectFile,
  onDeleteFile,
  onCreateFile,
  selectedFile,
}: SimulatedDriveProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [newFileName, setNewFileName] = useState('');
  const [newFileContent, setNewFileContent] = useState('');
  const [isCreating, setIsCreating] = useState(false);

  const filteredFiles = files.filter(f =>
    f.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    f.content.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelect = (file: VirtualFile) => {
    playSound('click');
    onSelectFile(file);
  };

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    playSound('warning');
    onDeleteFile(id);
  };

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFileName.trim()) return;

    playSound('success');
    onCreateFile(newFileName, newFileContent);
    setNewFileName('');
    setNewFileContent('');
    setIsCreating(false);
  };

  return (
    <div className="bg-slate-950/40 border border-cyan-500/15 rounded-xl p-5 backdrop-blur-tech h-full flex flex-col gap-4">
      <div className="flex items-center justify-between border-b border-cyan-500/10 pb-3">
        <h2 className="font-display text-sm font-semibold uppercase tracking-wider text-cyan-400 flex items-center gap-2">
          <FolderOpen className="w-4.5 h-4.5 text-cyan-400" />
          Virtual Mainframe Drive
        </h2>
        
        {selectedFile && (
          <button
            onClick={() => {
              playSound('click');
              onSelectFile(null as any);
            }}
            className="flex items-center gap-1 font-mono text-[9px] px-1.5 py-0.5 border border-cyan-500/20 rounded text-cyan-300 hover:bg-cyan-500/10 transition-colors"
          >
            <ArrowLeft className="w-2.5 h-2.5" />
            BACK_TO_DRIVE
          </button>
        )}
      </div>

      {selectedFile ? (
        /* File Reader View */
        <div className="flex-1 flex flex-col gap-3 min-h-[220px]">
          <div className="flex items-center justify-between font-mono bg-black/40 px-3 py-2 border border-cyan-500/10 rounded">
            <div className="flex items-center gap-2 text-xs text-cyan-200">
              <FileText className="w-4 h-4 text-cyan-400" />
              <span>{selectedFile.name}</span>
            </div>
            <span className="text-[9px] text-slate-500">SIZE: {selectedFile.size}B</span>
          </div>
          
          <textarea
            readOnly
            value={selectedFile.content}
            className="flex-1 bg-black/50 border border-cyan-500/5 rounded p-3 font-mono text-xs text-slate-300 focus:outline-none resize-none overflow-y-auto leading-relaxed"
          />
          <div className="font-mono text-[8px] text-slate-500 text-right">
            UPDATED: {new Date(selectedFile.updatedAt).toLocaleTimeString()}
          </div>
        </div>
      ) : isCreating ? (
        /* File Creator Form */
        <form onSubmit={handleCreateSubmit} className="flex-col flex flex-1 gap-3 min-h-[220px]">
          <input
            type="text"
            required
            placeholder="File name (e.g., flight_telemetry.md)"
            value={newFileName}
            onChange={e => setNewFileName(e.target.value)}
            className="bg-black/40 border border-cyan-500/15 rounded px-3 py-2 text-xs font-mono text-cyan-200 focus:outline-none focus:border-cyan-400/40"
          />
          <textarea
            required
            rows={6}
            placeholder="Enter diagnostics, system notes, or custom JARVIS directives..."
            value={newFileContent}
            onChange={e => setNewFileContent(e.target.value)}
            className="flex-1 bg-black/40 border border-cyan-500/15 rounded p-3 text-xs font-mono text-slate-300 focus:outline-none focus:border-cyan-400/40 resize-none leading-relaxed"
          />
          <div className="flex gap-2 justify-end">
            <button
              type="button"
              onClick={() => {
                playSound('click');
                setIsCreating(false);
              }}
              className="font-mono text-[9px] px-2.5 py-1.5 border border-slate-800 rounded text-slate-400 hover:bg-slate-900 transition-colors"
            >
              CANCEL
            </button>
            <button
              type="submit"
              className="font-mono text-[9px] bg-cyan-500/20 border border-cyan-400/30 px-3 py-1.5 rounded text-cyan-200 hover:bg-cyan-500/35 transition-colors"
            >
              COMMIT_FILE
            </button>
          </div>
        </form>
      ) : (
        /* Standard File Explorer */
        <div className="flex-1 flex flex-col gap-3 min-h-[220px]">
          {/* Action and Search bar */}
          <div className="flex gap-2">
            <div className="flex-1 bg-black/30 border border-cyan-500/10 rounded flex items-center px-2.5 gap-2 group focus-within:border-cyan-400/35">
              <Search className="w-3.5 h-3.5 text-cyan-500/50" />
              <input
                type="text"
                placeholder="Query file registry..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="w-full bg-transparent text-xs text-slate-100 placeholder-slate-500 py-1.5 focus:outline-none font-mono"
              />
            </div>
            
            <button
              onClick={() => {
                playSound('click');
                setIsCreating(true);
              }}
              className="bg-cyan-500/15 border border-cyan-400/25 text-cyan-300 hover:bg-cyan-500/25 p-2 rounded transition-colors flex items-center justify-center"
              title="Add New File"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>

          {/* Files List */}
          <div className="flex-1 overflow-y-auto space-y-1.5 pr-1 max-h-[190px]">
            {filteredFiles.length === 0 ? (
              <div className="text-center py-8 text-xs font-mono text-slate-500">
                DRIVE EMPTY / NO MATCHING REGISTRIES
              </div>
            ) : (
              filteredFiles.map(file => (
                <div
                  key={file.id}
                  onClick={() => handleSelect(file)}
                  className="bg-black/30 border border-cyan-500/5 rounded hover:border-cyan-400/20 px-3 py-2.5 flex items-center justify-between cursor-pointer group transition-all"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <FileText className="w-4 h-4 text-cyan-500/60 group-hover:text-cyan-400" />
                    <div className="truncate">
                      <div className="text-xs font-mono text-slate-200 group-hover:text-cyan-300 transition-colors truncate">
                        {file.name}
                      </div>
                      <div className="text-[8px] font-mono text-slate-500 mt-0.5 truncate uppercase">
                        Size: {file.size} Bytes • Updated: {new Date(file.updatedAt).toLocaleTimeString()}
                      </div>
                    </div>
                  </div>
                  
                  <button
                    onClick={(e) => handleDelete(file.id, e)}
                    className="p-1.5 text-slate-600 hover:text-red-400 rounded opacity-0 group-hover:opacity-100 transition-opacity"
                    title="Purge File"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
