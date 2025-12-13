'use client';

import React, { useState, useEffect } from 'react';
import { FileText, Download, Trash2, Eye, Calendar, Clock, AlertCircle } from 'lucide-react';
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
          <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-xs font-medium">
            <div className="w-2 h-2 bg-green-400 rounded-full"></div>
            Готово
          </span>
        );
      case 'generating':
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 bg-amber-500/20 text-amber-400 rounded-full text-xs font-medium">
            <div className="w-2 h-2 bg-amber-400 rounded-full animate-pulse"></div>
            Генерується...
          </span>
        );
      case 'error':
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 bg-red-500/20 text-red-400 rounded-full text-xs font-medium">
            <AlertCircle size={12} />
            Помилка
          </span>
        );
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="p-8">
        <div className="flex items-center justify-center py-20">
          <div className="w-16 h-16 border-4 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Мої документи</h1>
        <p className="text-gray-400">Всі ваші згенеровані календарні плани</p>
      </div>

      {/* Documents List */}
      {documents.length === 0 ? (
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-12 text-center">
          <FileText className="mx-auto mb-4 text-gray-600" size={48} />
          <h3 className="text-xl font-semibold text-white mb-2">Поки що немає документів</h3>
          <p className="text-gray-400 mb-6">
            Створіть свій перший календарний план на головній сторінці
          </p>
          <a
            href="/dashboard"
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-xl hover:shadow-lg transition-all duration-300"
          >
            <Calendar size={20} />
            Створити план
          </a>
        </div>
      ) : (
        <div className="grid gap-4">
          {documents.map((doc) => (
            <div
              key={doc.id}
              className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all duration-300"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4 flex-1">
                  <div className="w-12 h-12 bg-gradient-to-br from-amber-400 to-amber-600 rounded-xl flex items-center justify-center flex-shrink-0">
                    <FileText className="text-white" size={24} />
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold text-white">{doc.title}</h3>
                      {getStatusBadge(doc.status)}
                    </div>
                    
                    <div className="flex items-center gap-4 text-sm text-gray-400">
                      <div className="flex items-center gap-1">
                        <Calendar size={14} />
                        <span>{new Date(doc.created_at).toLocaleDateString('uk-UA')}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock size={14} />
                        <span>{new Date(doc.created_at).toLocaleTimeString('uk-UA', { hour: '2-digit', minute: '2-digit' })}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {doc.status === 'ready' && doc.file_url && (
                    <>
                      <a
                        href={doc.file_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-all duration-300"
                        title="Переглянути"
                      >
                        <Eye size={20} />
                      </a>
                      <a
                        href={doc.file_url}
                        download
                        className="p-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-all duration-300"
                        title="Завантажити"
                      >
                        <Download size={20} />
                      </a>
                    </>
                  )}
                  <button
                    onClick={() => handleDelete(doc.id)}
                    className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all duration-300"
                    title="Видалити"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Stats */}
      {documents.length > 0 && (
        <div className="mt-8 grid grid-cols-3 gap-4">
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-4">
            <div className="text-2xl font-bold text-white mb-1">
              {documents.length}
            </div>
            <div className="text-sm text-gray-400">Всього документів</div>
          </div>
          
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-4">
            <div className="text-2xl font-bold text-green-400 mb-1">
              {documents.filter(d => d.status === 'ready').length}
            </div>
            <div className="text-sm text-gray-400">Готові</div>
          </div>
          
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-4">
            <div className="text-2xl font-bold text-amber-400 mb-1">
              {documents.filter(d => d.status === 'generating').length}
            </div>
            <div className="text-sm text-gray-400">Генеруються</div>
          </div>
        </div>
      )}
    </div>
  );
}
