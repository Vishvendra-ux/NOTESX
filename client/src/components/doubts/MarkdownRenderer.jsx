import { useState } from 'react';
import { Copy, Check } from 'lucide-react';

export default function MarkdownRenderer({ content, className = '' }) {
  if (!content) return null;

  // Split into blocks: code blocks, tables, blockquotes, lists, paragraphs
  const lines = content.split('\n');
  const elements = [];
  let inCodeBlock = false;
  let codeLanguage = '';
  let codeBuffer = [];
  let tableBuffer = [];
  let listBuffer = [];
  let listType = null; // 'ul' | 'ol'

  const flushList = () => {
    if (listBuffer.length === 0) return;
    if (listType === 'ul') {
      elements.push(
        <ul key={`ul-${elements.length}`} className="my-2.5 space-y-1 list-disc list-inside text-slate-800 dark:text-slate-200 text-sm">
          {listBuffer.map((item, idx) => (
            <li key={idx} className="leading-relaxed">
              {renderInlineFormatting(item)}
            </li>
          ))}
        </ul>
      );
    } else {
      elements.push(
        <ol key={`ol-${elements.length}`} className="my-2.5 space-y-1 list-decimal list-inside text-slate-800 dark:text-slate-200 text-sm">
          {listBuffer.map((item, idx) => (
            <li key={idx} className="leading-relaxed">
              {renderInlineFormatting(item)}
            </li>
          ))}
        </ol>
      );
    }
    listBuffer = [];
    listType = null;
  };

  const flushTable = () => {
    if (tableBuffer.length === 0) return;
    const headerRow = tableBuffer[0];
    const dataRows = tableBuffer.slice(2); // Skip separator row

    elements.push(
      <div key={`table-${elements.length}`} className="my-3 overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-2xs">
        <table className="w-full text-left border-collapse text-xs sm:text-sm">
          <thead>
            <tr className="bg-slate-50 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200">
              {headerRow.map((cell, idx) => (
                <th key={idx} className="px-3.5 py-2.5 font-bold uppercase tracking-wider text-[11px]">
                  {renderInlineFormatting(cell.trim())}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {dataRows.map((row, rIdx) => (
              <tr key={rIdx} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
                {row.map((cell, cIdx) => (
                  <td key={cIdx} className="px-3.5 py-2 text-slate-700 dark:text-slate-300">
                    {renderInlineFormatting(cell.trim())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
    tableBuffer = [];
  };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Code block open/close
    if (line.trim().startsWith('```')) {
      if (inCodeBlock) {
        // End of code block
        const codeText = codeBuffer.join('\n');
        elements.push(<CodeBlock key={`code-${elements.length}`} code={codeText} language={codeLanguage} />);
        codeBuffer = [];
        inCodeBlock = false;
        codeLanguage = '';
      } else {
        // Start of code block
        flushList();
        flushTable();
        inCodeBlock = true;
        codeLanguage = line.trim().slice(3).trim();
      }
      continue;
    }

    if (inCodeBlock) {
      codeBuffer.push(line);
      continue;
    }

    // Markdown Table row
    if (line.trim().startsWith('|') && line.trim().endsWith('|')) {
      flushList();
      const cells = line.trim().split('|').slice(1, -1);
      // Check if separator row
      if (cells.every(c => /^[\s\-:]+$/.test(c))) {
        tableBuffer.push(cells);
      } else {
        tableBuffer.push(cells);
      }
      continue;
    } else if (tableBuffer.length > 0) {
      flushTable();
    }

    // Headings
    if (line.startsWith('### ')) {
      flushList();
      elements.push(
        <h4 key={`h4-${i}`} className="text-base sm:text-lg font-bold text-slate-900 dark:text-white mt-4 mb-1.5 tracking-tight">
          {renderInlineFormatting(line.slice(4))}
        </h4>
      );
      continue;
    }
    if (line.startsWith('## ')) {
      flushList();
      elements.push(
        <h3 key={`h3-${i}`} className="text-lg sm:text-xl font-extrabold text-slate-900 dark:text-white mt-5 mb-2 tracking-tight">
          {renderInlineFormatting(line.slice(3))}
        </h3>
      );
      continue;
    }
    if (line.startsWith('# ')) {
      flushList();
      elements.push(
        <h2 key={`h2-${i}`} className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white mt-6 mb-2 tracking-tight">
          {renderInlineFormatting(line.slice(2))}
        </h2>
      );
      continue;
    }

    // Blockquote
    if (line.startsWith('> ')) {
      flushList();
      elements.push(
        <blockquote key={`quote-${i}`} className="border-l-4 border-indigo-500 bg-indigo-50/50 dark:bg-indigo-950/20 px-3.5 py-2 my-2 rounded-r-xl text-xs sm:text-sm text-slate-700 dark:text-slate-300 italic">
          {renderInlineFormatting(line.slice(2))}
        </blockquote>
      );
      continue;
    }

    // Unordered List
    if (/^[\*\-]\s+/.test(line.trim())) {
      const itemText = line.trim().replace(/^[\*\-]\s+/, '');
      if (listType !== 'ul') {
        flushList();
        listType = 'ul';
      }
      listBuffer.push(itemText);
      continue;
    }

    // Ordered List
    if (/^\d+\.\s+/.test(line.trim())) {
      const itemText = line.trim().replace(/^\d+\.\s+/, '');
      if (listType !== 'ol') {
        flushList();
        listType = 'ol';
      }
      listBuffer.push(itemText);
      continue;
    }

    // Empty line
    if (!line.trim()) {
      flushList();
      continue;
    }

    // Regular paragraph
    flushList();
    elements.push(
      <p key={`p-${i}`} className="my-2 text-sm text-slate-800 dark:text-slate-200 leading-relaxed break-words">
        {renderInlineFormatting(line)}
      </p>
    );
  }

  flushList();
  flushTable();

  if (inCodeBlock && codeBuffer.length > 0) {
    elements.push(<CodeBlock key={`code-end`} code={codeBuffer.join('\n')} language={codeLanguage} />);
  }

  return <div className={`prose-sm max-w-none ${className}`}>{elements}</div>;
}

// Inline formatting helper: Bold, Italic, Code, Math $...$ and $$...$$
function renderInlineFormatting(text) {
  if (typeof text !== 'string') return text;

  // Split on inline patterns: math $...$, display math $$...$$, code `...`, bold **...**, links [text](url)
  const regex = /(\$\$[^\$]+\$\$|\$[^\$]+\$|`[^`]+`|\*\*[^\*]+\*\*|\*[^\*]+\*|\[[^\]]+\]\([^\)]+\))/g;
  const parts = text.split(regex);

  return parts.map((part, index) => {
    if (!part) return null;

    // Display Math $$ ... $$
    if (part.startsWith('$$') && part.endsWith('$$') && part.length > 4) {
      const math = part.slice(2, -2).trim();
      return (
        <span key={index} className="block my-2 text-center overflow-x-auto py-1.5 px-3 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700 font-mono text-xs sm:text-sm text-indigo-700 dark:text-indigo-300 font-semibold tracking-wide">
          {math}
        </span>
      );
    }

    // Inline Math $ ... $
    if (part.startsWith('$') && part.endsWith('$') && part.length > 2) {
      const math = part.slice(1, -1);
      return (
        <span key={index} className="inline-block px-1.5 py-0.5 mx-0.5 rounded-md bg-indigo-50/80 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 border border-indigo-200/60 dark:border-indigo-900/60 font-mono text-[12px] sm:text-[13px] font-semibold">
          {math}
        </span>
      );
    }

    // Inline Code ` ... `
    if (part.startsWith('`') && part.endsWith('`') && part.length > 2) {
      return (
        <code key={index} className="px-1.5 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-mono text-[12px] sm:text-xs font-bold border border-slate-200/60 dark:border-slate-700">
          {part.slice(1, -1)}
        </code>
      );
    }

    // Bold ** ... **
    if (part.startsWith('**') && part.endsWith('**') && part.length > 4) {
      return (
        <strong key={index} className="font-extrabold text-slate-900 dark:text-white">
          {part.slice(2, -2)}
        </strong>
      );
    }

    // Italic * ... *
    if (part.startsWith('*') && part.endsWith('*') && part.length > 2) {
      return <em key={index} className="italic text-slate-700 dark:text-slate-300">{part.slice(1, -1)}</em>;
    }

    // Link [text](url)
    const linkMatch = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
    if (linkMatch) {
      const url = linkMatch[2].trim();
      // Anti-XSS: only allow http, https, mailto, and relative paths
      const isSafeUrl = /^(https?:\/\/|mailto:|tel:|\/|#)/i.test(url);
      
      if (!isSafeUrl) {
        return <span key={index} className="text-slate-500 italic">[{linkMatch[1]} (blocked link)]</span>;
      }

      return (
        <a key={index} href={url} target="_blank" rel="noreferrer" className="text-indigo-600 dark:text-indigo-400 font-semibold hover:underline">
          {linkMatch[1]}
        </a>
      );
    }

    return part;
  });
}

function CodeBlock({ code, language }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative my-3 rounded-2xl overflow-hidden border border-slate-800 bg-[#0d1117] text-slate-100 shadow-md">
      <div className="flex items-center justify-between px-4 py-2 border-b border-slate-800 bg-slate-900/90 text-xs text-slate-400 font-mono">
        <span>{language || 'code'}</span>
        <button
          type="button"
          onClick={handleCopy}
          className="flex items-center gap-1.5 px-2 py-1 rounded-md hover:bg-slate-800 text-slate-300 hover:text-white transition cursor-pointer"
        >
          {copied ? <Check size={13} className="text-emerald-400" /> : <Copy size={13} />}
          <span className="text-[11px] font-semibold">{copied ? 'Copied' : 'Copy'}</span>
        </button>
      </div>
      <pre className="p-4 text-xs sm:text-sm font-mono overflow-x-auto leading-relaxed text-emerald-400">
        <code>{code}</code>
      </pre>
    </div>
  );
}
