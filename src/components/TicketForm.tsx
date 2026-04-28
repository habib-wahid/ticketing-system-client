import { useState, useEffect, useCallback } from 'react';
import {
  Minus, Square, X, ChevronDown, Package, HelpCircle,
  Lightbulb, Undo2, Redo2, Type, Bold, Italic, Underline,
  Strikethrough, List, ListOrdered, AlignLeft, AlignCenter,
  AlignRight, Smile, Paperclip, Mic, Link2, Image as ImageIcon,
  Cpu, FileText, Share2, Upload, User, Settings, Shield, Zap
} from 'lucide-react';
import type { Ticket, TicketAttachmentDetail } from '../types/ticket';
import { categoryApi } from '../services/api';
import type { ComplaintCategoryResponse } from '../types/category';

interface TicketFormProps {
  initialData?: Ticket;
  onSubmit: (ticket: any) => void;
  onCancel: () => void;
}

export const TicketForm: React.FC<TicketFormProps> = ({ initialData, onSubmit, onCancel }) => {
  const [categories, setCategories] = useState<ComplaintCategoryResponse[]>([]);
  const [fetchingCategories, setFetchingCategories] = useState(true);

  const [formData, setFormData] = useState({
    title: initialData?.title || '',
    description: initialData?.description || '',
    priority: initialData?.priority || 'LOW',
    complaintCategoryId: initialData?.category?.id || '',
    assignedToUserId: initialData?.assignedTo?.userId || '',
    tags: initialData?.tags || [] as string[],
    createdByUserId: initialData?.createdBy?.userId || 'usr_3741f137',
    status: initialData?.status || 'PENDING',
    attachments: initialData?.attachments || [] as TicketAttachmentDetail[],
  });

  const fetchCategories = useCallback(async () => {
    try {
      const data = await categoryApi.findAll(0, 100); // Fetch a good number of categories
      setCategories(data.content || []);
    } catch (err) {
      console.error('Failed to fetch categories:', err);
    } finally {
      setFetchingCategories(false);
    }
  }, []);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const [isFocused, setIsFocused] = useState<{ [key: string]: boolean }>({});
  const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false);

  const isNew = !initialData;

  const handleFocus = (field: string) => setIsFocused(prev => ({ ...prev, [field]: true }));
  const handleBlur = (field: string) => setIsFocused(prev => ({ ...prev, [field]: false }));

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const newAttachments: TicketAttachmentDetail[] = Array.from(files).map(file => ({
        attachmentId: Math.random().toString(36).substr(2, 9),
        filename: file.name,
        fileSize: file.size,
        mimeType: file.type,
        uploadedBy: formData.createdByUserId,
        uploadedAt: new Date().toISOString(),
        // Mocking s3Url for display purposes
        s3Url: URL.createObjectURL(file),
      }));
      setFormData(prev => ({
        ...prev,
        attachments: [...prev.attachments, ...newAttachments]
      }));
    }
  };

  const removeAttachment = (id: string) => {
    setFormData(prev => ({
      ...prev,
      attachments: prev.attachments.filter((a: TicketAttachmentDetail) => a.attachmentId !== id)
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Wrap the flat formData into the structure expected by onSubmit (which should eventually call the POST API)

    console.log("Ticket data " + formData)
    onSubmit({
      ...formData,
      ticketId: initialData?.ticketId,
    });
  };

  const priorityOptions = [
    { value: 'LOW', label: 'Low', color: 'bg-green-500' },
    { value: 'MEDIUM', label: 'Medium', color: 'bg-yellow-500' },
    { value: 'HIGH', label: 'High', color: 'bg-red-500' },
    { value: 'CRITICAL', label: 'Critical', color: 'bg-purple-500' },
  ];

  // Helper to get icon for category name
  const getCategoryIcon = (name: string) => {
    const n = name.toUpperCase();
    if (n.includes('TECH')) return Cpu;
    if (n.includes('BILL')) return Package;
    if (n.includes('ACC')) return User;
    if (n.includes('FEAT') || n.includes('LIGHT')) return Lightbulb;
    if (n.includes('BUG') || n.includes('ISSUE')) return Shield;
    if (n.includes('SPEED') || n.includes('PERF')) return Zap;
    if (n.includes('SETT') || n.includes('CONF')) return Settings;
    return HelpCircle;
  };

  const categoryOptions = categories.map(cat => ({
    value: cat.id,
    label: cat.name,
    icon: getCategoryIcon(cat.name)
  }));

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

            </div>

            <div className="space-y-6">
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                onFocus={() => handleFocus('title')}
                onBlur={() => handleBlur('title')}
                placeholder="Ticket Title"
                className={`w-full text-3xl font-extrabold tracking-tight leading-tight border-none focus:ring-0 p-0 transition-all duration-300 ${isNew && !formData.title && !isFocused.title
                  ? 'text-gray-200 placeholder:text-gray-200 opacity-50 grayscale'
                  : 'text-gray-900 placeholder:text-gray-300 opacity-100 grayscale-0'
                  }`}
              />

              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                onFocus={() => handleFocus('description')}
                onBlur={() => handleBlur('description')}
                placeholder="Type your ticket here..."
                className={`w-full h-64 text-base leading-relaxed border-none focus:ring-0 p-0 resize-none transition-all duration-300 ${isNew && !formData.description && !isFocused.description
                  ? 'text-gray-200 placeholder:text-gray-200 opacity-50'
                  : 'text-gray-600 placeholder:text-gray-300 opacity-100'
                  }`}
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
                  <input
                    id="file-upload"
                    type="file"
                    className="hidden"
                    multiple
                    onChange={handleFileChange}
                  />
                </div>

                {/* Uploaded Files List */}
                {formData.attachments.length > 0 && (
                  <div className="space-y-3 mt-4">
                    {formData.attachments.map((att: TicketAttachmentDetail) => (
                      <div
                        key={att.attachmentId}
                        className="flex items-center gap-3 p-4 rounded-xl border border-gray-100 bg-white hover:border-[#10B981] transition-all group"
                      >
                        <div className="p-2 bg-gray-50 rounded-lg text-gray-400 group-hover:text-[#10B981] group-hover:bg-[#10B981]/10">
                          <Paperclip size={18} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-bold text-gray-900 truncate">
                            {att.filename}
                          </p>
                          <p className="text-xs text-gray-400 font-medium">
                            {(att.fileSize / 1024).toFixed(1)} KB • {att.mimeType || 'File'}
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeAttachment(att.attachmentId)}
                          className="p-2 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                        >
                          <X size={18} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Form Fields */}
        <div className="flex-1 p-8 space-y-8 overflow-y-auto bg-white">
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

          {/* Category */}
          <div className="space-y-3">
            <label className="text-gray-900 font-bold text-sm">Category</label>
            <div className="relative">
              <div
                onClick={() => setIsCategoryDropdownOpen(!isCategoryDropdownOpen)}
                className="w-full bg-white border border-gray-100 rounded-xl px-4 py-3 flex items-center justify-between cursor-pointer hover:bg-gray-50/30 transition-colors"
              >
                <div className="flex items-center gap-3">
                  {(() => {
                    const opt = categoryOptions.find(o => o.value === formData.complaintCategoryId);
                    if (!opt) {
                      return (
                        <>
                          <HelpCircle size={18} className="text-gray-400" />
                          <span className="text-gray-400 font-medium">Select Category</span>
                        </>
                      );
                    }
                    const Icon = opt.icon;
                    return (
                      <>
                        <Icon size={18} className="text-gray-400" />
                        <span className="text-gray-900 font-medium">{opt.label}</span>
                      </>
                    );
                  })()}
                </div>
                <ChevronDown
                  size={18}
                  className={`text-gray-400 transition-transform duration-200 ${isCategoryDropdownOpen ? 'rotate-180' : ''}`}
                />
              </div>

              {/* Dropdown Menu */}
              {isCategoryDropdownOpen && (
                <div className="absolute z-10 w-full bg-white border border-gray-100 rounded-xl shadow-xl mt-2 p-1 overflow-hidden animate-in fade-in zoom-in duration-150">
                  {fetchingCategories ? (
                    <div className="p-4 text-center text-xs text-gray-400 font-bold animate-pulse">Loading categories...</div>
                  ) : categoryOptions.length === 0 ? (
                    <div className="p-4 text-center text-xs text-gray-400 font-bold">No categories available</div>
                  ) : categoryOptions.map((opt) => (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => {
                        setFormData({ ...formData, complaintCategoryId: opt.value });
                        setIsCategoryDropdownOpen(false);
                      }}
                      className={`w-full flex items-center gap-3 px-3 py-3 rounded-lg text-sm transition-all ${formData.complaintCategoryId === opt.value
                        ? 'bg-[#10B981]/10 text-[#10B981] font-bold'
                        : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
                        }`}
                    >
                      <opt.icon
                        size={16}
                        className={formData.complaintCategoryId === opt.value ? 'text-[#10B981]' : 'text-gray-400'}
                      />
                      {opt.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Assignee */}
          <div className="space-y-3">
            <label className="text-gray-900 font-bold text-sm">Assignee</label>
            <div className="relative group">
              <select
                value={formData.assignedToUserId}
                onChange={(e) => setFormData({ ...formData, assignedToUserId: e.target.value })}
                className="w-full appearance-none bg-white border border-gray-100 rounded-xl px-4 py-3 text-gray-900 focus:ring-2 focus:ring-[#10B981]/20 focus:border-[#10B981] outline-none cursor-pointer transition-all"
              >
                <option value="">Select assignee</option>
                <option value="usr_3741f137">Sami Mansour</option>
                <option value="usr_9f62e110">Ahmed Mahmoud</option>
              </select>
              <ChevronDown size={18} className="text-gray-400 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          {/* Tags */}
          <div className="space-y-3">
            <label className="text-gray-900 font-bold text-sm">Tags</label>
            <div className="w-full bg-white border border-gray-100 rounded-xl px-4 py-3 transition-colors focus-within:border-[#10B981] focus-within:ring-2 focus-within:ring-[#10B981]/10 flex flex-wrap gap-2">
              {formData.tags.map((tag, idx) => (
                <span key={idx} className="bg-[#10B981]/10 text-[#10B981] px-2 py-1 rounded-lg text-xs font-bold flex items-center gap-1">
                  {tag}
                  <X size={12} className="cursor-pointer" onClick={() => setFormData({ ...formData, tags: formData.tags.filter((_, i) => i !== idx) })} />
                </span>
              ))}
              <input
                type="text"
                placeholder={formData.tags.length === 0 ? "Add tags..." : ""}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    const value = (e.currentTarget as HTMLInputElement).value.trim();
                    if (value && !formData.tags.includes(value)) {
                      setFormData({ ...formData, tags: [...formData.tags, value] });
                      (e.currentTarget as HTMLInputElement).value = '';
                    }
                  }
                }}
                className="flex-1 min-w-[100px] border-none focus:ring-0 p-0 text-sm outline-none placeholder:text-gray-300"
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
