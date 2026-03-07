'use client';

import Image from 'next/image';
import { urlFor } from '@/sanity/lib/client';

interface Block {
  _type: string;
  _key?: string;
  style?: string;
  level?: number;
  children?: Array<{ text: string; mark?: string[] }>;
  listItem?: string;
  text?: string;
  asset?: any;
  alt?: string;
  caption?: string;
}

export interface PortableTextRendererProps {
  blocks: Block[];
  className?: string;
}

export default function PortableTextRenderer({
  blocks,
  className = '',
}: PortableTextRendererProps) {
  if (!blocks || blocks.length === 0) {
    return null;
  }

  const renderChild = (child: any) => {
    let text = child.text || '';

    if (child.mark && child.mark.includes('em')) {
      text = <em>{text}</em>;
    }
    if (child.mark && child.mark.includes('strong')) {
      text = <strong>{text}</strong>;
    }
    if (child.mark && child.mark.includes('code')) {
      text = <code className="bg-surface px-1 py-0.5 rounded text-sm font-mono">{text}</code>;
    }

    return text;
  };

  const renderBlock = (block: Block, index: number) => {
    const key = block._key || index;

    switch (block._type) {
      case 'block':
        const style = block.style || 'normal';
        const children = block.children?.map((child: any, idx: number) => (
          <span key={idx}>{renderChild(child)}</span>
        ));

        switch (style) {
          case 'h1':
            return (
              <h1
                key={key}
                className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-text mb-6 mt-8 first:mt-0"
              >
                {children}
              </h1>
            );
          case 'h2':
            return (
              <h2
                key={key}
                className="text-2xl sm:text-3xl font-serif font-bold text-text mb-4 mt-6"
              >
                {children}
              </h2>
            );
          case 'h3':
            return (
              <h3
                key={key}
                className="text-xl sm:text-2xl font-serif font-bold text-text mb-3 mt-5"
              >
                {children}
              </h3>
            );
          case 'blockquote':
            return (
              <blockquote
                key={key}
                className="border-l-4 border-accent pl-4 sm:pl-6 italic text-text/80 my-6 text-base sm:text-lg"
              >
                {children}
              </blockquote>
            );
          default:
            return (
              <p
                key={key}
                className="text-base sm:text-lg text-text leading-relaxed mb-4 first:mt-0"
              >
                {children}
              </p>
            );
        }

      case 'image':
        if (!block.asset) return null;
        const imageUrl = urlFor(block.asset).width(800).height(600).url();

        return (
          <figure key={key} className="my-8 sm:my-12">
            <div className="relative w-full aspect-video mb-3">
              <Image
                src={imageUrl}
                alt={block.alt || 'Image'}
                fill
                className="object-cover"
              />
            </div>
            {block.caption && (
              <figcaption className="text-sm text-muted text-center italic">
                {block.caption}
              </figcaption>
            )}
          </figure>
        );

      case 'bullet':
        return (
          <li
            key={key}
            className="text-base sm:text-lg text-text leading-relaxed ml-4 list-disc mb-2"
          >
            {block.children?.map((child: any, idx: number) => (
              <span key={idx}>{renderChild(child)}</span>
            ))}
          </li>
        );

      case 'number':
        return (
          <li
            key={key}
            className="text-base sm:text-lg text-text leading-relaxed ml-4 list-decimal mb-2"
          >
            {block.children?.map((child: any, idx: number) => (
              <span key={idx}>{renderChild(child)}</span>
            ))}
          </li>
        );

      default:
        return null;
    }
  };

  // Group list items
  const processedBlocks: (Block | Block[])[] = [];
  let listBuffer: Block[] = [];

  blocks.forEach((block) => {
    if (block._type === 'block' && (block.listItem === 'bullet' || block.listItem === 'number')) {
      listBuffer.push(block);
    } else {
      if (listBuffer.length > 0) {
        processedBlocks.push([...listBuffer]);
        listBuffer = [];
      }
      processedBlocks.push(block);
    }
  });

  if (listBuffer.length > 0) {
    processedBlocks.push([...listBuffer]);
  }

  return (
    <div className={`prose prose-invert max-w-none ${className}`}>
      {processedBlocks.map((block, index) => {
        if (Array.isArray(block)) {
          // Render list items
          const listType = block[0]?.listItem;
          return (
            <ul
              key={`list-${index}`}
              className={listType === 'bullet' ? 'list-disc' : 'list-decimal'}
            >
              {block.map((item, idx) => renderBlock(item, idx))}
            </ul>
          );
        }
        return renderBlock(block, index);
      })}
    </div>
  );
}
