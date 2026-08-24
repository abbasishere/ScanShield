import React, { useState, useRef, useEffect } from 'react';
import { Send, ImagePlus, Link, X, Sparkles, Paperclip, AlertCircle, FileText } from 'lucide-react';

interface InputBarProps {
  onSendMessage: (text: string, imageUrl?: string, pastedUrl?: string) => void;
  isLoading: boolean;
  onSelectQuickPrompt?: (promptText: string) => void;
}

export const InputBar: React.FC<InputBarProps> = ({
  onSendMessage,
  isLoading,
  onSelectQuickPrompt
}) => {
  const [inputText, setInputText] = useState('');
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [extractedUrl, setExtractedUrl] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Detect URLs typed or pasted into text area
  useEffect(() => {
    const urlMatch = inputText.match(/https?:\/\/[^\s]+/i);
    if (urlMatch) {
      setExtractedUrl(urlMatch[0]);
    } else {
      setExtractedUrl(null);
    }
  }, [inputText]);

  // Auto-resize text area
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 160)}px`;
    }
  }, [inputText]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFileName(file.name);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };
  const handlePaste = (e: React.ClipboardEvent<HTMLTextAreaElement>) => {
  const items = e.clipboardData.items;

  for (const item of items) {
    if (item.type.startsWith('image/')) {
      e.preventDefault();

      const file = item.getAsFile();

      if (!file) return;

      setFileName('Pasted screenshot.png');

      const reader = new FileReader();

      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };

      reader.readAsDataURL(file);

      return;
    }
  }
};
  const handleRemoveImage = () => {
    setImagePreview(null);
    setFileName(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if ((!inputText.trim() && !imagePreview) || isLoading) return;

    onSendMessage(inputText, imagePreview || undefined, extractedUrl || undefined);
    setInputText('');
    setImagePreview(null);
    setExtractedUrl(null);
    setFileName(null);
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="sticky bottom-0 z-10 bg-gradient-to-t from-slate-50 via-slate-50 to-transparent pt-3 pb-4 px-3 sm:px-6">
      <div className="mx-auto max-w-3xl">
        {/* Quick Suggestion Chips */}
        {onSelectQuickPrompt && !inputText && !imagePreview && (
          <div className="mb-2.5 flex items-center gap-1.5 overflow-x-auto pb-1 text-xs no-scrollbar">
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider flex-shrink-0 flex items-center gap-1">
              <Sparkles className="h-3 w-3 text-emerald-600" /> Quick Tests:
            </span>
            <button
              onClick={() => onSelectQuickPrompt("Is this Telegram group legit claiming 500% profit in 24h via UPI payment?")}
              className="flex-shrink-0 rounded-full border border-slate-200 bg-white px-3 py-1 text-slate-700 hover:border-emerald-500 hover:bg-emerald-50 hover:text-emerald-800 transition-all shadow-2xs font-medium"
            >
              Telegram Forex Scam
            </button>
            <button
              onClick={() => onSelectQuickPrompt("Check website https://sebi-invest-advisory.in claiming SEBI registration INA000099881")}
              className="flex-shrink-0 rounded-full border border-slate-200 bg-white px-3 py-1 text-slate-700 hover:border-emerald-500 hover:bg-emerald-50 hover:text-emerald-800 transition-all shadow-2xs font-medium"
            >
              Fake SEBI Broker Link
            </button>
            <button
              onClick={() => onSelectQuickPrompt("WhatsApp link offering Flipkart free ₹10,000 Diwali gift card: http://flipkart-free-gifts.xyz")}
              className="flex-shrink-0 rounded-full border border-slate-200 bg-white px-3 py-1 text-slate-700 hover:border-emerald-500 hover:bg-emerald-50 hover:text-emerald-800 transition-all shadow-2xs font-medium"
            >
              Diwali Gift Card Link
            </button>
          </div>
        )}

        {/* Input Card Container */}
        <div className="relative rounded-2xl border border-slate-300/80 bg-white p-2 shadow-chat-input focus-within:border-slate-400 focus-within:ring-2 focus-within:ring-emerald-500/20 transition-all">
          {/* File & URL Previews inside input box */}
          {(imagePreview || extractedUrl) && (
            <div className="mb-2 flex flex-wrap items-center gap-2 p-1.5 bg-slate-50 rounded-xl border border-slate-200">
              {/* Image Preview Thumbnail */}
              {imagePreview && (
                <div className="relative flex items-center gap-2 rounded-lg bg-white p-1 border border-slate-200">
                  <img
                    src={imagePreview}
                    alt="Screenshot preview"
                    className="h-10 w-10 rounded object-cover"
                  />
                  <div className="text-xs">
                    <span className="font-medium text-slate-800 block truncate max-w-[140px]">
                      {fileName || 'Screenshot.png'}
                    </span>
                    <span className="text-[10px] text-emerald-600 font-semibold">OCR Active</span>
                  </div>
                  <button
                    onClick={handleRemoveImage}
                    className="ml-1 rounded-full p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>
              )}

              {/* Detected URL Pill */}
              {extractedUrl && (
                <div className="flex items-center gap-1.5 rounded-lg bg-emerald-50 px-2.5 py-1 text-xs border border-emerald-200 text-emerald-800 font-mono">
                  <Link className="h-3.5 w-3.5 text-emerald-600 flex-shrink-0" />
                  <span className="truncate max-w-[200px]">{extractedUrl}</span>
                </div>
              )}
            </div>
          )}

          {/* Main Textarea Form */}
          <form onSubmit={handleSubmit} className="flex items-end gap-2">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/*"
              className="hidden"
            />

            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="flex h-9 w-9 items-center justify-center rounded-xl text-slate-500 hover:bg-slate-100 hover:text-slate-900 transition-colors"
              title="Upload Screenshot / Promo Image for OCR Analysis"
            >
              <ImagePlus className="h-5 w-5" />
            </button>

            <textarea
              ref={textareaRef}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={handleKeyDown}
              onPaste={handlePaste}
              placeholder="Paste promotion text, link (e.g. https://...), WhatsApp message or upload screenshot..."
              rows={1}
              className="flex-1 resize-none bg-transparent px-1 py-1.5 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none max-h-40 font-sans"
            />

            <button
              type="submit"
              disabled={(!inputText.trim() && !imagePreview) || isLoading}
              className={`flex h-9 w-9 items-center justify-center rounded-xl transition-all shadow-xs ${
                (inputText.trim() || imagePreview) && !isLoading
                  ? 'bg-slate-900 text-white hover:bg-slate-800 active:scale-95'
                  : 'bg-slate-100 text-slate-400 cursor-not-allowed'
              }`}
              title="Submit for Verification"
            >
              <Send className="h-4 w-4" />
            </button>
          </form>
        </div>

        <p className="mt-2 text-center text-[11px] text-slate-600">
          ScamShield India evaluates weighted evidence signals (NLP, URL, SEBI Database, OCR) to explain potential fraud.
        </p>
      </div>
    </div>
  );
};
