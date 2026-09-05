import React, { useState } from 'react';
import { MemoryCapsule } from '../../types';
import { BRANCH_CATEGORIES } from '../../data/legacyTreeData';
import {
  Clock,
  BookOpen,
  Flame,
  Sun,
  Coins,
  Palette,
  HeartPulse,
  Shield,
  Edit3,
  Check,
  Sparkles,
  Calendar
} from 'lucide-react';

interface MemoryCapsulesListProps {
  capsules: MemoryCapsule[];
  onSaveNote: (capsuleId: string, note: string) => void;
  soundEnabled: boolean;
}

export const MemoryCapsulesList: React.FC<MemoryCapsulesListProps> = ({
  capsules,
  onSaveNote
}) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [noteText, setNoteText] = useState<string>('');

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'education':
        return BookOpen;
      case 'fitness':
        return Flame;
      case 'faith':
        return Sun;
      case 'career':
        return Coins;
      case 'creativity':
        return Palette;
      case 'health':
        return HeartPulse;
      default:
        return Shield;
    }
  };

  const handleStartEdit = (capsule: MemoryCapsule) => {
    setEditingId(capsule.id);
    setNoteText(capsule.userNote || '');
  };

  const handleSave = (id: string) => {
    onSaveNote(id, noteText);
    setEditingId(null);
  };

  if (capsules.length === 0) {
    return (
      <div className="p-8 text-center bg-[#101726]/40 rounded-2xl border border-cyan-500/10 space-y-3">
        <Clock className="w-8 h-8 text-cyan-500/40 mx-auto" />
        <h4 className="text-sm font-bold text-zinc-300">No Memory Capsules Recorded Yet</h4>
        <p className="text-xs text-zinc-500 max-w-md mx-auto leading-relaxed">
          Memory Capsules are permanently etched into your Legacy Tree whenever a major branch expands.
          Achieve your first milestone to record your awakening moment.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-bold text-zinc-200 tracking-tight flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-cyan-400" />
            <span>Memory Capsules Archive ({capsules.length})</span>
          </h3>
          <p className="text-[11px] text-zinc-500 mt-0.5">
            Living timestamps of each pivotal moment your Legacy Tree grew.
          </p>
        </div>
      </div>

      <div className="space-y-3">
        {capsules.map(capsule => {
          const meta = BRANCH_CATEGORIES[capsule.category] || BRANCH_CATEGORIES.discipline;
          const Icon = getCategoryIcon(capsule.category);
          const isEditing = editingId === capsule.id;

          return (
            <div
              key={capsule.id}
              className="p-4 bg-[#101726]/60 rounded-xl border border-cyan-500/15 hover:border-cyan-500/30 transition-all space-y-3 shadow-md"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 border"
                    style={{
                      borderColor: `${meta.color}40`,
                      backgroundColor: `${meta.color}15`,
                      color: meta.color
                    }}
                  >
                    <Icon className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-zinc-200 tracking-tight">
                        {capsule.milestoneTitle}
                      </span>
                      <span
                        className="text-[9px] font-mono px-1.5 py-0.5 rounded border"
                        style={{
                          borderColor: `${meta.color}30`,
                          color: meta.color,
                          backgroundColor: `${meta.color}10`
                        }}
                      >
                        {capsule.branchName}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-[10px] font-mono text-zinc-500 mt-0.5">
                      <Calendar className="w-3 h-3 text-zinc-600" />
                      <span>{capsule.date}</span>
                      <span>•</span>
                      <span>Level {capsule.level}</span>
                      <span>•</span>
                      <span className="text-cyan-400">{capsule.rank}</span>
                    </div>
                  </div>
                </div>

                {!isEditing && (
                  <button
                    onClick={() => handleStartEdit(capsule)}
                    className="p-1 text-zinc-500 hover:text-cyan-400 transition-colors cursor-pointer"
                    title="Add Operator Note"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {/* Reflection quote */}
              <div className="p-2.5 bg-[#0A0F1A]/80 rounded-lg border border-cyan-500/10 text-xs italic text-zinc-400 leading-relaxed font-serif">
                "{capsule.reflection}"
              </div>

              {/* User Note */}
              {isEditing ? (
                <div className="space-y-2 pt-1">
                  <textarea
                    value={noteText}
                    onChange={(e) => setNoteText(e.target.value)}
                    placeholder="Write a personal reflection on what this milestone meant to you..."
                    className="w-full h-16 bg-[#080C16] border border-cyan-500/25 rounded-lg p-2.5 text-xs text-zinc-200 focus:outline-none focus:border-cyan-400 resize-none font-mono"
                  />
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() => setEditingId(null)}
                      className="px-2.5 py-1 text-[10px] font-mono text-zinc-500 hover:text-zinc-300 cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => handleSave(capsule.id)}
                      className="px-3 py-1 bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-400 border border-cyan-500/30 rounded-lg text-[10px] font-mono flex items-center gap-1 cursor-pointer"
                    >
                      <Check className="w-3 h-3" />
                      <span>Save Memory</span>
                    </button>
                  </div>
                </div>
              ) : capsule.userNote ? (
                <div className="text-[11px] text-cyan-300/80 bg-cyan-950/20 p-2 rounded border border-cyan-500/10 font-mono">
                  <span className="text-zinc-500 font-semibold mr-1">Operator Note:</span>
                  {capsule.userNote}
                </div>
              ) : null}
            </div>
          );
        })}
      </div>
    </div>
  );
};
