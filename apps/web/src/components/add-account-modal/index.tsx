'use client';
import React, { useState } from 'react';
import Modal from '../modal';
import './style.css';
import { useAccount } from '@/wallet';
import { hidePasswordIcon, showPasswordIcon } from '@/assets';
import Image from 'next/image';
import { emojis } from '@/assets';

interface AddAccountModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const AddAccountModal: React.FC<AddAccountModalProps> = ({ isOpen, onClose }) => {
    const [accountName, setAccountName] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { createAddress, error, clearError } = useAccount();

    const togglePasswordVisibility = () => {
        setShowPassword(prevState => !prevState);
    };

    const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setPassword(value);
        clearError();
    };

    const handleAccountNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setAccountName(e.target.value);
        clearError();
    };

    const handleSubmit = async () => {
        try {
            setIsSubmitting(true);
            await createAddress(accountName, password);

            // Success - reset form and close modal
            setAccountName('');
            setPassword('');
            setShowPassword(false);
            onClose();
        } catch (err) {
            // Error is already handled by the hook
            console.error('Error creating account:', err);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Add Account">
            <div className="add-account-form">
                <div className="modal-input-container">
                    <label className="modal-label" htmlFor="accountName">
                        {'Label'}
                    </label>
                    <input
                        id="accountName"
                        className="modal-input"
                        type="text"
                        placeholder="Enter account name"
                        value={accountName}
                        onChange={handleAccountNameChange}
                    />
                </div>
                <div className="emoji-ChooseNameWallet">
                    {emojis.map((emoji, index) => (
                        <button key={`${index}-emoji`}>{emoji}</button>
                    ))}
                </div>
                <div className="modal-input-container">
                    <label className="modal-label" htmlFor="password">
                        Password
                    </label>

                    <div className="input-MasterPassword">
                        <input
                            type={showPassword ? 'text' : 'password'}
                            placeholder="Enter your password"
                            value={password}
                            onChange={handlePasswordChange}
                            style={{ border: error ? '1px red solid' : 'none' }}
                        />
                        <button onClick={togglePasswordVisibility}>
                            <Image
                                src={showPassword ? hidePasswordIcon : showPasswordIcon}
                                alt={showPassword ? 'Hide password' : 'Show password'}
                                width={24}
                                height={24}
                            />
                        </button>
                    </div>


                </div>

                <div className="add-account-actions">
                    {error && <p className="modal-error-text">{error}</p>}
                    <button
                        type="button"
                        className="modal-button"
                        style={{marginLeft: 'auto'}}
                        onClick={handleSubmit}
                        disabled={isSubmitting || !accountName.trim() || !password.trim()}
                    >
                        {isSubmitting ? 'Creating...' : 'Create'}
                    </button>
                </div>
            </div>
        </Modal>
    );
};

export default AddAccountModal;
