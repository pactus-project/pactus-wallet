'use client';
import React from 'react';
import { emojis } from '@/assets';
import Popover from '../popover/Popover';

interface EmojiPickerProps {
  trigger: React.ReactNode;
  onSelect: (emoji: string) => void;
  className?: string;
}

const EmojiPicker: React.FC<EmojiPickerProps> = ({ trigger, onSelect, className }) => {
  return (
    <Popover
      trigger={trigger}
      classNames={{
        trigger: `hover:bg-surface-medium rounded-md p-2 shadow-lg ${className || ''}`,
        content: 'bg-surface-medium rounded-md p-2 shadow-lg max-w-[100vw]'
      }}
      align="start"
      sideOffset={5}
    >
      <div className="bg-surface-medium grid grid-cols-8 gap-2 p-2 max-h-[260px] overflow-y-auto" role="group" aria-label="Emoji selector">
        {emojis.map((emoji, index) => (
          <button
            key={`${index}-emoji`}
            type="button"
            onClick={() => onSelect(emoji)}
            aria-label={`Select emoji ${emoji}`}
            className="text-2xl p-1 rounded-sm hover:bg-surface-light hover:scale-110 transition-transform duration-200"
          >
            {emoji}
          </button>
        ))}
      </div>
    </Popover>
  );
};

export default EmojiPicker; 