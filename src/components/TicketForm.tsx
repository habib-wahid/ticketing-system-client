import React, { useState } from 'react';
import {
  Minus, Square, X, ChevronDown, Flame, Package, HelpCircle,
  Lightbulb, Undo2, Redo2, Type, Bold, Italic, Underline,
  Strikethrough, List, ListOrdered, AlignLeft, AlignCenter,
  AlignRight, Smile, Paperclip, Mic, Link2, Image as ImageIcon,
  Cpu, FileText, Share2, Upload
} from 'lucide-react';
import type { Ticket } from '../types/ticket';

interface TicketFormProps {
  initialData?: Ticket;
  onSubmit: (ticket: Omit<Ticket, 'id' | 'createdAt'>) => void;
  onCancel: () => void;
}

export const TicketForm: React.FC<TicketFormProps> = ({ initialData, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    title: initialData?.title || 'Your Order Cancellation Process',
    description: initialData?.description || "Hi Martin Ødegaard,\n\nWe've received your request for us to cancel your order. it typically takes us between 1-2 working days to complete a cancellation.\n\nYou'll receive a notification from us once the cancellations is confirmed, and we may reach out to you if any additional account info is needed.",
    priority: initialData?.priority || 'low',
    status: initialData?.status || 'open',
    type: initialData?.type || 'incident',
    product: initialData?.product || 'E-Invoice',
    employee: initialData?.employee || 'Fikri Studio Support',
    company: initialData?.company || 'Burger King',
    startDate: initialData?.startDate || '2023-10-27',
    endDate: initialData?.endDate || '2023-11-27',
    assignee: initialData?.assignee || '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData as Omit<Ticket, 'id' | 'createdAt'>);
  };

  const priorityOptions: { value: 'low' | 'medium' | 'high'; label: string; color: string }[] = [
    { value: 'low', label: 'Low', color: 'bg-green-500' },
    { value: 'medium', label: 'Medium', color: 'bg-yellow-500' },
    { value: 'high', label: 'High', color: 'bg-red-500' },
  ];

  const typeOptions = [
    { value: 'incident', label: 'Incident', icon: Flame },
    { value: 'problem', label: 'Problem', icon: Package },
    { value: 'question', label: 'Question', icon: HelpCircle },
    { value: 'suggestion', label: 'Suggestion', icon: Lightbulb },
  ];

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 flex flex-col h-full w-full font-sans overflow-hidden">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 px-6 py-4 flex justify-between items-center shrink-0">
        <div className="flex items-center gap-3">
          <div className="bg-[#10B981]/20 p-1.5 rounded-lg text-[#10B981]">
            <TicketIcon size={18} strokeWidth={3} />
          </div>
          <h1 className="text-gray-900 font-bold text-lg">{initialData ? 'Edit Ticket' : 'Create New Ticket'}</h1>
        </div>
        <div className="flex items-center gap-4 text-gray-400">
          <Minus size={20} className="cursor-pointer hover:text-gray-600" />
          <Square size={14} className="cursor-pointer hover:text-gray-600" />
          <X size={20} className="cursor-pointer hover:text-red-500" onClick={onCancel} />
        </div>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-1 overflow-hidden">
        {/* Left Column - Message Area */}
        <div className="flex-[1.5] flex flex-col border-r border-gray-100 bg-white">
          <div className="p-8 space-y-8 flex-1 overflow-y-auto">
            <div className="flex flex-col gap-6">
              <div className="text-gray-500 font-bold text-sm tracking-wide uppercase">Message</div>

              <div className="flex items-center gap-4">
                <span className="text-gray-400 text-sm">From</span>
                <div className="flex-1 relative group">
                  <select
                    value={formData.employee}
                    onChange={(e) => setFormData({ ...formData, employee: e.target.value })}
                    className="w-full appearance-none bg-gray-50 rounded-lg px-4 py-2 border border-transparent hover:border-gray-200 focus:border-[#10B981] outline-none text-gray-900 font-medium cursor-pointer transition-all"
                  >
                    <option value="Fikri Studio Support">Fikri Studio Support</option>
                    <option value="Ahmed Mahmoud">Ahmed Mahmoud</option>
                    <option value="Sara Ali">Sara Ali</option>
                  </select>
                  <ChevronDown size={18} className="text-gray-400 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Message Subject"
                className="w-full text-3xl font-extrabold text-gray-900 tracking-tight leading-tight border-none focus:ring-0 p-0 placeholder:text-gray-200"
              />

              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Type your message here..."
                className="w-full h-64 text-gray-600 text-base leading-relaxed border-none focus:ring-0 p-0 resize-none placeholder:text-gray-200"
              />

              {/* File Upload Section */}
              <div className="pt-8 border-t border-gray-50 space-y-4">
                <div className="text-gray-500 font-bold text-sm tracking-wide uppercase">Attachments</div>
                <div 
                  className="border-2 border-dashed border-gray-100 rounded-2xl p-10 flex flex-col items-center justify-center gap-4 hover:border-[#10B981] hover:bg-green-50/10 transition-all cursor-pointer group"
                  onClick={() => document.getElementById('file-upload')?.click()}
                >
                  <div className="bg-gray-50 p-4 rounded-full group-hover:bg-[#10B981]/10 group-hover:text-[#10B981] transition-colors">
                    <Upload size={32} className="text-gray-400 group-hover:text-[#10B981]" />
                  </div>
                  <div className="text-center">
                    <div className="text-gray-900 font-bold">Click to upload or drag and drop</div>
                    <div className="text-gray-400 text-sm">PDF, DOC, JPG or PNG (max. 10MB)</div>
                  </div>
                  <input id="file-upload" type="file" className="hidden" multiple />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Form Fields */}
        <div className="flex-1 p-8 space-y-8 overflow-y-auto bg-white">
          {/* Ticket Name */}
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <label className="text-gray-900 font-bold text-sm">Ticket Name</label>
              <FileText size={18} className="text-gray-300 hover:text-gray-500 cursor-pointer" />
            </div>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Help me cancel my order."
              className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-gray-900 focus:ring-2 focus:ring-[#10B981]/20 focus:border-[#10B981] transition-all outline-none"
            />
            <div className="flex justify-end pt-1">
              <Share2 size={18} className="text-gray-300 hover:text-gray-500 cursor-pointer" />
            </div>
          </div>

          {/* Priority */}
          <div className="space-y-4">
            <label className="text-gray-900 font-bold text-sm">Priority</label>
            <div className="grid grid-cols-3 gap-3">
              {priorityOptions.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setFormData({ ...formData, priority: opt.value })}
                  className={`flex items-center justify-center gap-2 py-3 rounded-xl border-2 transition-all font-medium ${formData.priority === opt.value
                    ? 'bg-[#10B981]/5 border-[#10B981] text-[#10B981]'
                    : 'border-gray-100 text-gray-400 hover:border-gray-200'
                    }`}
                >
                  <div className={`w-1.5 h-1.5 rounded-full ${opt.color}`}></div>
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Ticket Type */}
          <div className="space-y-3">
            <label className="text-gray-900 font-bold text-sm">Ticket Type</label>
            <div className="relative group">
              <div className="w-full bg-white border border-[#3B82F6] rounded-xl px-4 py-3 flex items-center justify-between cursor-pointer group-hover:bg-blue-50/30 transition-colors shadow-sm shadow-blue-100">
                <div className="flex items-center gap-3">
                  {(() => {
                    const opt = typeOptions.find(o => o.value === formData.type) || typeOptions[0];
                    const Icon = opt.icon;
                    return (
                      <>
                        <Icon size={18} className="text-gray-400" />
                        <span className="text-gray-900">{opt.label}</span>
                      </>
                    );
                  })()}
                </div>
                <ChevronDown size={18} className="text-gray-400" />
              </div>

              <div className="bg-white border border-gray-100 rounded-xl shadow-lg mt-2 p-1 space-y-0.5">
                {typeOptions.map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => setFormData({ ...formData, type: opt.value as any })}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${formData.type === opt.value ? 'bg-blue-50 text-gray-900' : 'text-gray-500 hover:bg-gray-50'
                      }`}
                  >
                    <opt.icon size={16} className={formData.type === opt.value ? 'text-gray-700' : 'text-gray-400'} />
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Assignee */}
          <div className="space-y-3">
            <label className="text-gray-900 font-bold text-sm">Assignee</label>
            <div className="relative group">
              <select
                value={formData.assignee}
                onChange={(e) => setFormData({ ...formData, assignee: e.target.value })}
                className="w-full appearance-none bg-white border border-gray-100 rounded-xl px-4 py-3 text-gray-900 focus:ring-2 focus:ring-[#10B981]/20 focus:border-[#10B981] outline-none cursor-pointer transition-all"
              >
                <option value="">Select assignee</option>
                <option value="Sami Mansour">Sami Mansour</option>
                <option value="Ahmed Mahmoud">Ahmed Mahmoud</option>
              </select>
              <ChevronDown size={18} className="text-gray-400 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          {/* Tags */}
          <div className="space-y-3">
            <label className="text-gray-900 font-bold text-sm">Tags</label>
            <div className="w-full bg-white border border-gray-100 rounded-xl px-4 py-3 transition-colors focus-within:border-[#10B981] focus-within:ring-2 focus-within:ring-[#10B981]/10">
              <input
                type="text"
                placeholder="Add tags..."
                className="w-full border-none focus:ring-0 p-0 text-sm outline-none placeholder:text-gray-300"
              />
            </div>
          </div>

          {/* Followers */}
          <div className="space-y-3">
            <label className="text-gray-900 font-bold text-sm">Followers</label>
            <div className="w-full bg-white border border-gray-100 rounded-xl px-4 py-3 transition-colors focus-within:border-[#10B981] focus-within:ring-2 focus-within:ring-[#10B981]/10">
              <input
                type="text"
                placeholder="Add followers"
                className="w-full border-none focus:ring-0 p-0 text-sm outline-none placeholder:text-gray-300"
              />
            </div>
          </div>
        </div>
      </form>

      {/* Footer */}
      <div className="bg-white border-t border-gray-100 px-8 py-5 flex justify-end items-center gap-6 shrink-0">
        <button
          type="button"
          onClick={onCancel}
          className="text-gray-900 font-bold hover:text-gray-600 transition-colors px-4 py-2"
        >
          Cancel
        </button>
        <div className="flex">
          <button
            type="submit"
            onClick={handleSubmit}
            className="bg-[#10B981] hover:bg-[#059669] text-white px-8 py-3 rounded-l-xl font-bold transition-colors shadow-lg shadow-green-100 border-r border-white/20"
          >
            {initialData ? 'Update Ticket' : 'Submit as New'}
          </button>
          <button
            type="button"
            className="bg-[#10B981] hover:bg-[#059669] text-white px-3 py-3 rounded-r-xl transition-colors shadow-lg shadow-green-100"
          >
            <ChevronDown size={20} strokeWidth={3} />
          </button>
        </div>
      </div>
    </div>
  );
};

const ToolbarButton = ({ icon: Icon }: { icon: any }) => (
  <button
    type="button"
    className="p-1.5 text-gray-500 hover:bg-gray-50 hover:text-gray-900 rounded-lg transition-colors"
  >
    <Icon size={18} />
  </button>
);

const TicketIcon = ({ size, className, strokeWidth }: { size: number, className?: string, strokeWidth?: number }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={strokeWidth || 2}
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z" />
    <path d="M13 5v2" />
    <path d="M13 17v2" />
    <path d="M13 11v2" />
  </svg>
);
