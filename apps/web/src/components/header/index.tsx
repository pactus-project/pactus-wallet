'use client';
import { useAccount, WalletContext } from '@/wallet';
import { useContext, useState } from 'react';
import { useI18n } from '@/utils/i18n';
import { useSearchParams } from 'next/navigation';
import EmojiPicker from '../emoji-picker';

const Header: React.FC = () => {
  const searchParams = useSearchParams();
  const address = searchParams?.get('address') ?? '';
  const { updateAccountName, updateAccountEmoji } = useAccount();
  const { headerTitle, setHeaderTitle, emoji, setEmoji } = useContext(WalletContext);
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(headerTitle);
  const { t } = useI18n();

  const handleClick = () => {
    setIsEditing(true);
    setEditedTitle(headerTitle);
  };

  const handleBlur = () => {
    setIsEditing(false);
    if (editedTitle.trim() !== headerTitle) {
      setHeaderTitle(editedTitle.trim());
      updateAccountName(address, editedTitle.trim());
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleBlur();
    } else if (e.key === 'Escape') {
      setIsEditing(false);
      setEditedTitle(headerTitle);
    }
  };

  const handleEmojiSelect = (newEmoji: string) => {
    setEmoji(newEmoji);
    if (address) {
      updateAccountEmoji(address, newEmoji);
    }
  };

  return (
    <header className="w-full border-b border-surface-medium">
      <div className="h-14 flex justify-between items-center w-full pl-7 pr-4">
        <div className="flex items-center gap-2">
          {emoji && <EmojiPicker
            trigger={
              <span className="text-sm text-[#D2D3E0] font-semibold mb-[1px] cursor-pointer hover:opacity-80 transition-opacity">
                {emoji}
              </span>
            }
            onSelect={handleEmojiSelect}
          />}
          {isEditing ? (
            <input
              type="text"
              value={editedTitle}
              onChange={(e) => setEditedTitle(e.target.value)}
              onBlur={handleBlur}
              onKeyDown={handleKeyDown}
              className="text-sm text-[#D2D3E0] font-semibold bg-transparent border border-[#4C4F6B] rounded px-2 py-1 focus:outline-none focus:border-[#D2D3E0]"
              autoFocus
            />
          ) : address ? (
            <h1 
              className="text-sm text-[#D2D3E0] font-semibold cursor-text border-b border-transparent hover:border-b hover:border-[#4C4F6B] transition-colors duration-200"
              onClick={handleClick}
              title={t('clickToEdit')}
            >
              {headerTitle}
            </h1>
          ) : (
            <h1 className="text-sm text-[#D2D3E0] font-semibold">{headerTitle}</h1>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
