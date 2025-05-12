// components/copy-to-clipboard.tsx
'use client';

import { useState } from 'react';
import { ClipboardDocumentIcon, CheckIcon } from '@heroicons/react/24/outline';

export default function CopyToClipboard({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      onClick={handleCopy}
      className="p-1 rounded-md hover:bg-gray-100 transition-colors absolute top-2 right-2"
      title="Copy to clipboard"
    >
      {copied ? (
        <CheckIcon className="h-4 w-4 text-green-500" />
      ) : (
        <ClipboardDocumentIcon className="h-4 w-4 text-gray-500" />
      )}
    </button>
  );
}