'use client';

import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import Typography from '@/components/common/Typography';
import Title from '@/components/common/title/Title';

interface MarkdownRendererProps {
  content: string;
  className?: string;
}

const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content, className = '' }) => {
  return (
    <div className={className}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          h1: ({ children, ..._props }) => (
            <Typography
              variant="h1"
              className="mb-6 text-gradient text-[26px] md:text-[32px] font-semibold text-center"
              as="h1"
            >
              {children}
            </Typography>
          ),
          h2: ({ children, ..._props }) => {
            // Extract the id from the heading text for aria-labelledby
            const id = children
              ? children
                  .toString()
                  .toLowerCase()
                  .replace(/\s+/g, '-')
                  .replace(/[^\w-]/g, '')
              : '';

            return (
              <div id={id} className="mb-2">
                <Title content={children?.toString() || ''} />
              </div>
            );
          },
          p: ({ children, ...props }) => (
            <p
              className="text-text-secondary tablet:!text-md font-regular !leading-loose text-xs mb-4"
              {...props}
            >
              {children}
            </p>
          ),
          ul: ({ children, ...props }) => (
            <ul
              className="list-disc pl-6 mt-2 text-text-secondary tablet:!text-md font-regular !leading-loose text-xs mb-4"
              {...props}
            >
              {children}
            </ul>
          ),
          li: ({ children, ...props }) => (
            <li className="mb-1" {...props}>
              {children}
            </li>
          ),
          a: ({ children, href, ...props }) => (
            <a
              className="bg-gradient-primary bg-clip-text text-transparent transition-opacity duration-fast [-webkit-background-clip:text] [-webkit-text-fill-color:transparent] hover:opacity-80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary focus-visible:outline-offset-2 focus-visible:opacity-80 [@media(prefers-reduced-motion:reduce)]:transition-none"
              target="_blank"
              rel="noopener noreferrer"
              href={href}
              {...props}
            >
              {children}
            </a>
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
};

export default MarkdownRenderer;
