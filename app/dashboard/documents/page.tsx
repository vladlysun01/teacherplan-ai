'use client';

import React, { useState, useEffect } from 'react';
import { FileText, Download, Trash2, Calendar, Clock, AlertCircle } from 'lucide-react';
import { supabase } from '@/lib/supabase';

interface Document {
  id: string;
  title: string;
  type: string;
  created_at: string;
  status: 'ready' | 'generating' | 'error';
  file_url?: string;
}

export default function DocumentsPage() {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDocuments();
  }, []);

  const loadDocuments = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) return;

      const { data, error } = await supabase
        .from('documents')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      setDocuments(data || []);
    } catch (error) {
      console.error('Error loading documents:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Ви впевнені що хочете видалити цей документ?')) return;

    try {
      const { error } = await supabase
        .from('documents')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setDocuments(documents.filter(doc => doc.id !== id));
    } catch (error) {
      console.error('Error deleting document:', error);
      alert('Помилка при видаленні документа');
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'ready':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-green-500/20 text-green-400 rounded-full text-xs font-medium">
            <div className="w-1.5 h-1.5 bg-green-400 rounded-full"></div>
            Готово
          </span>
        );
      case 'generating':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-amber-500/20 text-amber-400 rounded-full text-xs font-medium">
            <div className="w-1.5 h-1.5 bg-amber-400 rounded-full animate-pulse"></div>
            Генерується
          </span>
        );
      case 'error':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-red-500/20 text-red-400 rounded-full text-xs font-medium">
            <AlertCircle size={10} />
            Помилка
          </span>
        );
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="p-4 sm:p-8">
        <div className="flex items-center justify-center py-20">
          <div className="w-12 h-12 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-8">
      {/* Header - Compact */}
      <div className="mb-4 sm:mb-6">
        <h1 className="text-xl sm:text-2xl font-bold text-white mb-1">Мої документи</h1>
        <p className="text-xs sm:text-sm text-gray-400">Всі ваші згенеровані плани</p>
      </div>

      {/* Documents List */}
      {documents.length === 0 ? (
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-8 text-center">
          <FileText className="mx-auto mb-3 text-gray-600" size={40} />
          <h3 className="text-lg font-semibold text-white mb-2">Поки що немає документів</h3>
          <p className="text-sm text-gray-400 mb-4">
            Створіть свій перший план
          </p>
          <a
            href="/dashboard"
            className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-cyan-500 to-teal-500 text-white rounded-lg hover:shadow-lg transition-all duration-300 text-sm"
          >
            <Calendar size={16} />
            Створити план
          </a>
        </div>
      ) : (
        <div className="space-y-3">
          {documents.map((doc) => (
            <div
              key={doc.id}
              className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-lg p-3 sm:p-4 hover:bg-white/10 transition-all duration-300"
            >
              {/* ULTRA COMPACT Mobile Layout */}
              <div className="space-y-2">
                {/* Row 1: Icon + Title + Status */}
                <div className="flex items-start gap-2">
                  <div className="w-10 h-10 bg-gradient-to-br from-cyan-400 to-teal-500 rounded-lg flex items-center justify-center flex-shrink-0">
                    <FileText className="text-white" size={18} />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm sm:text-base font-semibold text-white truncate mb-1">
                      {doc.title}
                    </h3>
                    <div className="flex items-center gap-2 text-xs text-gray-400">
                      <Calendar size={11} />
                      <span>{new Date(doc.created_at).toLocaleDateString('uk-UA', { day: '2-digit', month: '2-digit', year: '2-digit' })}</span>
                      <Clock size={11} />
                      <span>{new Date(doc.created_at).toLocaleTimeString('uk-UA', { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                  </div>

                  {getStatusBadge(doc.status)}
                </div>

                {/* Row 2: Action Buttons - BIG and EASY TO TAP */}
                {doc.status === 'ready' && doc.file_url && (
                  <div className="flex gap-2 pt-1">
                    <a
                      href={doc.file_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-500/30 text-cyan-400 rounded-lg transition-all duration-300 text-sm font-medium"
                    >
                      <Download size={16} />
                      <span>Скачати</span>
                    </a>
                    
                    <button
                      onClick={() => handleDelete(doc.id)}
                      className="px-4 py-2.5 bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-red-400 rounded-lg transition-all duration-300"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Stats - Ultra Compact */}
      {documents.length > 0 && (
        <div className="mt-4 grid grid-cols-3 gap-2 sm:gap-3">
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-lg p-2.5 sm:p-3">
            <div className="text-xl sm:text-2xl font-bold text-white leading-none mb-1">
              {documents.length}
            </div>
            <div className="text-xs text-gray-400">Всього</div>
          </div>
          
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-lg p-2.5 sm:p-3">
            <div className="text-xl sm:text-2xl font-bold text-green-400 leading-none mb-1">
              {documents.filter(d => d.status === 'ready').length}
            </div>
            <div className="text-xs text-gray-400">Готові</div>
          </div>
          
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-lg p-2.5 sm:p-3">
            <div className="text-xl sm:text-2xl font-bold text-amber-400 leading-none mb-1">
              {documents.filter(d => d.status === 'generating').length}
            </div>
            <div className="text-xs text-gray-400">В процесі</div>
          </div>
        </div>
      )}
    </div>
  );
}
