import React, { useState } from 'react';
import { Copy, Check } from 'lucide-react';

interface CopyIpButtonProps {
  ip?: string;
  className?: string;
  variant?: 'compact' | 'full' | 'hero';
}

export const CopyIpButton: React.FC<CopyIpButtonProps> = ({
  ip = 'play.ironcloudmc.fun',
  className = '',
  variant = 'compact',
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await navigator.clipboard.writeText(ip);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // Fallback
      const textArea = document.createElement('textarea');
      textArea.value = ip;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  if (variant === 'hero') {
    return (
      <div
        id="hero-copy-ip-container"
        className={`group inline-flex items-center bg-black/40 border border-white/10 p-1 rounded-sm backdrop-blur-md transition-all hover:border-white/20 shadow-lg ${className}`}
      >
        <div className="px-4 text-xs font-mono text-purple-300 tracking-wider select-all">
          {ip}
        </div>
        <button
          type="button"
          id="hero-copy-ip-button"
          onClick={handleCopy}
          className="bg-purple-600 hover:bg-purple-500 text-white px-4 py-2.5 rounded-sm text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-1.5 cursor-pointer active:scale-95"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-300" />
              <span>Copied!</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5 text-white" />
              <span>Copy IP</span>
            </>
          )}
        </button>
      </div>
    );
  }

  return (
    <div
      id="copy-ip-container"
      className={`group inline-flex items-center bg-black/40 border border-white/10 p-0.5 rounded-sm backdrop-blur-sm transition-all hover:border-white/20 ${className}`}
    >
      <span className="px-2.5 text-[11px] font-mono text-purple-300 select-all">
        {ip}
      </span>
      <button
        type="button"
        id="copy-ip-button"
        onClick={handleCopy}
        title="Click to copy server IP"
        className="bg-purple-600 hover:bg-purple-500 text-white px-2.5 py-1 rounded-sm text-[10px] font-bold uppercase tracking-wider transition-all flex items-center gap-1 cursor-pointer active:scale-95"
      >
        {copied ? (
          <>
            <Check className="w-3 h-3 text-emerald-300" />
            <span>Copied</span>
          </>
        ) : (
          <>
            <Copy className="w-3 h-3 text-white" />
            <span>Copy</span>
          </>
        )}
      </button>
    </div>
  );
};
