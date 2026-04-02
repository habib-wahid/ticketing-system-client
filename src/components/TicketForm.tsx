import React, { useState } from 'react';
import { ChevronDown, Calendar } from 'lucide-react';
import type { Ticket } from '../types/ticket';

interface TicketFormProps {
  initialData?: Ticket;
  onSubmit: (ticket: Omit<Ticket, 'id' | 'createdAt'>) => void;
  onCancel: () => void;
}

export const TicketForm: React.FC<TicketFormProps> = ({ initialData, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    title: initialData?.title || '',
    description: initialData?.description || '',
    priority: initialData?.priority || 'low',
    status: initialData?.status || 'open',
    product: initialData?.product || 'E-Invoice',
    employee: initialData?.employee || 'Ahmed Mahmoud',
    company: initialData?.company || 'Burger King',
    startDate: initialData?.startDate || '2023-10-27',
    endDate: initialData?.endDate || '2023-11-27',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData as Omit<Ticket, 'id' | 'createdAt'>);
  };

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
      <div className="bg-[#433878] text-white py-4 px-6 text-center font-bold text-xl">
        {initialData ? 'Edit Ticket' : 'Create New Ticket'}
      </div>
      
      <form onSubmit={handleSubmit} className="flex flex-col md:flex-row min-h-[400px]">
        {/* Left Column */}
        <div className="flex-1 border-r border-gray-100 flex flex-col">
          {/* Title */}
          <div className="flex items-center border-b border-gray-100 p-6">
            <label htmlFor="title" className="w-32 flex items-center font-bold text-lg">
              Title<span className="text-red-500 ml-1">*</span>
            </label>
            <input
              id="title"
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
              className="flex-1 bg-transparent border-none focus:ring-0 text-xl text-gray-700 text-center"
            />
          </div>

          {/* Product */}
          <div className="flex items-center border-b border-gray-100 p-6">
            <label htmlFor="product" className="w-32 flex items-center font-bold text-lg">
              Product<span className="text-red-500 ml-1">*</span>
              <ChevronDown className="ml-auto mr-4 text-black" size={24} strokeWidth={3} />
            </label>
            <input
              id="product"
              type="text"
              value={formData.product}
              onChange={(e) => setFormData({...formData, product: e.target.value})}
              className="flex-1 bg-transparent border-none focus:ring-0 text-xl text-gray-700 text-center"
            />
          </div>

          {/* Employee */}
          <div className="flex items-center border-b border-gray-100 p-6">
            <label htmlFor="employee" className="w-32 flex items-center font-bold text-lg">
              Employee<span className="text-red-500 ml-1">*</span>
              <ChevronDown className="ml-auto mr-4 text-black" size={24} strokeWidth={3} />
            </label>
            <input
              id="employee"
              type="text"
              value={formData.employee}
              onChange={(e) => setFormData({...formData, employee: e.target.value})}
              className="flex-1 bg-transparent border-none focus:ring-0 text-xl text-gray-700 text-center"
            />
          </div>

          {/* Company */}
          <div className="flex items-center border-b border-gray-100 p-6">
            <label htmlFor="company" className="w-32 flex items-center font-bold text-lg">
              Company<span className="text-red-500 ml-1">*</span>
              <ChevronDown className="ml-auto mr-4 text-black" size={24} strokeWidth={3} />
            </label>
            <input
              id="company"
              type="text"
              value={formData.company}
              onChange={(e) => setFormData({...formData, company: e.target.value})}
              className="flex-1 bg-transparent border-none focus:ring-0 text-xl text-gray-700 text-center"
            />
          </div>

          {/* Start Date */}
          <div className="flex items-center border-b border-gray-100 p-6">
            <label htmlFor="startDate" className="w-32 flex items-center font-bold text-lg text-[#B23B2B]">
              Start Date<span className="text-red-500 ml-1">*</span>
            </label>
            <div className="flex-1 flex justify-center items-center gap-4">
              <input
                id="startDate"
                type="date"
                value={formData.startDate}
                onChange={(e) => setFormData({...formData, startDate: e.target.value})}
                className="bg-transparent border-none focus:ring-0 text-xl text-gray-700 text-center"
              />
              <Calendar className="text-black" size={32} strokeWidth={2} />
            </div>
          </div>

          {/* End Date */}
          <div className="flex items-center p-6">
            <label htmlFor="endDate" className="w-32 flex items-center font-bold text-lg text-[#B23B2B]">
              End Date<span className="text-red-500 ml-1">*</span>
            </label>
            <div className="flex-1 flex justify-center items-center gap-4">
              <input
                id="endDate"
                type="date"
                value={formData.endDate}
                onChange={(e) => setFormData({...formData, endDate: e.target.value})}
                className="bg-transparent border-none focus:ring-0 text-xl text-gray-700 text-center"
              />
              <Calendar className="text-black" size={32} strokeWidth={2} />
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="flex-1 bg-[#F1F1F1] p-8 flex flex-col relative">
          <label htmlFor="description" className="font-bold text-xl mb-4">
            Task Description<span className="text-red-500 ml-1">*</span>
          </label>
          <textarea
            id="description"
            value={formData.description}
            onChange={(e) => setFormData({...formData, description: e.target.value})}
            placeholder="Lorem ipsum dolor sit amet..."
            className="flex-1 bg-white p-6 rounded-lg border-none focus:ring-0 text-gray-500 text-sm leading-relaxed shadow-inner"
          />
          
          <div className="flex mt-8 -mx-8 -mb-8 h-20">
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 bg-[#E89E44] text-white text-3xl font-medium hover:bg-[#d98d36] transition-colors"
            >
              Close
            </button>
            <button
              type="submit"
              className="flex-1 bg-[#2D336B] text-white text-3xl font-medium hover:bg-[#232855] transition-colors"
            >
              {initialData ? 'Update Ticket' : 'Create Ticket'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};
