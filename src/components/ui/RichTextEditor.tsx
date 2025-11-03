'use client';

import React, { useMemo } from 'react';
import dynamic from 'next/dynamic';

const ReactQuill = dynamic(
  () => import('react-quill').then(mod => {
    require('react-quill/dist/quill.snow.css');
    return mod;
  }),
  {
    ssr: false,
    loading: () => <div className="h-32 bg-gray-100 rounded animate-pulse" />
  }
);

interface RichTextEditorProps {
  value: string;
  onChange: (content: string) => void;
  placeholder?: string;
  readOnly?: boolean;
}

export const RichTextEditor: React.FC<RichTextEditorProps> = ({
  value,
  onChange,
  placeholder = 'Write something...',
  readOnly = false,
}) => {
  const modules = useMemo(
    () => ({
      toolbar: [
        ['bold', 'italic', 'underline', 'strike'],
        ['blockquote', 'code-block'],
        [{ 'header': 1 }, { 'header': 2 }],
        [{ 'list': 'ordered'}, { 'list': 'bullet' }],
        [{ 'script': 'sub'}, { 'script': 'super' }],
        [{ 'indent': '-1'}, { 'indent': '+1' }],
        [{ 'direction': 'rtl' }],
        [{ 'size': ['small', false, 'large', 'huge'] }],
        [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
        [{ 'color': [] }, { 'background': [] }],
        [{ 'font': [] }],
        [{ 'align': [] }],
        ['link'],
        ['clean'],
      ],
    }),
    [],
  );

  const formats = [
    'bold',
    'italic',
    'underline',
    'strike',
    'blockquote',
    'code-block',
    'header',
    'list',
    'script',
    'indent',
    'direction',
    'size',
    'color',
    'background',
    'font',
    'align',
    'link',
  ];

  return (
    <div className="rich-text-editor rounded-lg border border-gray-300 overflow-hidden bg-white">
      <style>{`
        .ql-container {
          font-size: 14px;
          font-family: inherit;
        }
        .ql-editor {
          min-height: 120px;
          padding: 12px;
        }
        .ql-toolbar {
          border: none;
          border-bottom: 1px solid #e5e7eb;
          background-color: #f9fafb;
          padding: 8px;
        }
        .ql-toolbar button:hover,
        .ql-toolbar button:focus,
        .ql-toolbar button.ql-active,
        .ql-toolbar select:hover,
        .ql-toolbar select:focus,
        .ql-toolbar select.ql-active {
          color: #3b82f6;
        }
        .ql-toolbar button.ql-active {
          background-color: #dbeafe;
        }
        .ql-snow a {
          color: #3b82f6;
        }
      `}</style>
      <ReactQuill
        theme={readOnly ? 'bubble' : 'snow'}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        modules={readOnly ? {} : modules}
        formats={readOnly ? [] : formats}
        readOnly={readOnly}
      />
    </div>
  );
};
