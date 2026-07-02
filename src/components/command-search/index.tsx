import React, { useEffect, useState } from 'react';
import Modal from '@/components/modal';
import { searchIcon } from '@/assets';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useAccount } from '@/wallet/hooks/use-account';
import './style.css';

interface CommandSearchProps {
  isOpen: boolean;
  onClose: () => void;
}

const CommandSearch: React.FC<CommandSearchProps> = ({ isOpen, onClose }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const { accountList } = useAccount();
  const navigate = useRouter().push;
  const [filteredAccounts, setFilteredAccounts] = useState(accountList || []);

  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredAccounts(accountList || []);
      return;
    }

    const normalized = searchQuery.toLowerCase();
    const filtered = accountList?.filter(
      account =>
        account.name.toLowerCase().includes(normalized) ||
        account.address.toLowerCase().includes(normalized) ||
        account.emoji.includes(normalized)
    );

    setFilteredAccounts(filtered || []);
  }, [searchQuery, accountList]);

  const handleAccountClick = (address: string) => {
    navigate(`/wallet?address=${address}`);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Search Accounts" showCloseButton={true}>
      <div className="command-search">
        <div className="command-search__input-container">
          <Image
            src={searchIcon}
            alt=""
            width={16}
            height={16}
            className="command-search__icon"
            aria-hidden="true"
          />
          <input
            type="text"
            className="command-search__input"
            placeholder="Search by account name or address..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            autoComplete="off"
            autoFocus
          />
          <div className="command-search__shortcut">
            <kbd>ESC</kbd>
            <span>to close</span>
          </div>
        </div>

        <div className="command-search__results">
          {filteredAccounts.map((account) => (
            <button
              key={account.address}
              className="command-search__result"
              onClick={() => handleAccountClick(account.address)}
            >
              <span className="command-search__result-emoji">{account.emoji}</span>
              <div className="command-search__result-details">
                <span className="command-search__result-name">{account.name}</span>
                <span className="command-search__result-address">{account.address}</span>
              </div>
            </button>
          ))}
          {filteredAccounts.length === 0 && searchQuery && (
            <div className="command-search__no-results">
              No accounts found
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
};

export default CommandSearch;
