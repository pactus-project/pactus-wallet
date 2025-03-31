'use client';
import React, { useState } from 'react';
import Modal from '../modal';
import './style.css';
import { useWallet } from '@/wallet';
import { hidePasswordIcon, showPasswordIcon } from '@/assets';
import Image from 'next/image';
import { validatePassword } from '@/utils/password-validator';
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
    const { wallet } = useWallet();

    const [errors, setErrors] = useState<{
        accountName: string | null;
        password: string | null;
    }>({
        accountName: null,
        password: null
    });

    const togglePasswordVisibility = () => {
        setShowPassword(prevState => !prevState);
    };

    const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setPassword(value);
        if (value && !validatePassword(value)) {
            setErrors(prevState => ({
                ...prevState,
                password:
                    'Password must be at least 8 characters long and include uppercase, lowercase, number, and special character.'
            }));
        } else {
            setErrors(prevState => ({
                ...prevState,
                password: ''
            }));
        }
    };

    const validateForm = () => {
        const newErrors: {
            accountName: string | null;
            password: string | null;
        } = {
            accountName: null,
            password: null
        };

        let isValid = true;
        if (!accountName.trim()) {
            newErrors.accountName = 'Account name is required';
            isValid = false;
        } else {
            newErrors.accountName = null;
        }

        if (!password.trim()) {
            newErrors.password = 'Password is required';
            isValid = false;
        } else if (password.length < 8) {
            newErrors.password = 'Password must be at least 8 characters';
            isValid = false;
        }

        setErrors(newErrors);
        return isValid;
    };

    const handleSubmit = async () => {
        if (!validateForm()) {
            return;
        }

        try {
            setIsSubmitting(true);

            if (wallet) {
                await wallet.createAddress(accountName, password);
            } else {
                throw new Error('Wallet is not initialized');
            }

            await new Promise(resolve => setTimeout(resolve, 1000));

            setAccountName('');
            setPassword('');
            setShowPassword(false);
            onClose();
        } catch (err) {
            setErrors({
                ...errors,
                accountName: 'Failed to create account. Please try again.'
            });
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
                        onChange={e => {
                            setAccountName(e.target.value);
                            if (errors.accountName) {
                                setErrors({
                                    ...errors,
                                    accountName: null
                                });
                            }
                        }}
                    />
                    {errors.accountName && <p className="modal-error-text">{errors.accountName}</p>}
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
                            style={{ border: errors.password ? '1px red solid' : 'none' }}
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
                    {errors.password && <p className="modal-error-text">{errors.password}</p>}
                </div>

                <div className="add-account-actions">
                    <button
                        type="button"
                        className="modal-button"
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
