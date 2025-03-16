import {showPasswordIcon, hidePasswordIcon, masterPasswordLottie } from '@/assets'
import Image from 'next/image'
import React, { useState } from 'react'
import './style.css'
import { useRouter } from 'next/navigation'
import dynamic from 'next/dynamic'
const LottiePlayer = dynamic(() => import('react-lottie-player'), { ssr: false });
const MasterPassword = () => {
    const navigate = useRouter().push;
    const [showPassword, setShowPassword] = useState<boolean>(false)
    const togglePasswordVisibility = () => {
        setShowPassword(prevState => !prevState)
    }
    return (
        <div className='container-MasterPassword'>
            <LottiePlayer
                animationData={masterPasswordLottie}
                loop={false}
                play
                style={{ height: '250px' }}
            />
            <h1>Create Master Password</h1>
            <p>Set a strong password to protect your wallet and keep your funds safe.</p>

            <div className='input-MasterPassword'>
                <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter your password"
                />
                <button onClick={togglePasswordVisibility}>
                    <Image
                        src={showPassword ? hidePasswordIcon : showPasswordIcon}
                        alt={showPassword ? 'Hide password' : 'Show password'}
                    />
                </button>
            </div>

            <div className='input-MasterPassword'>
                <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Confirm your password"
                />
                <button onClick={togglePasswordVisibility}>
                    <Image
                        src={showPassword ? hidePasswordIcon : showPasswordIcon}
                        alt={showPassword ? 'Hide password' : 'Show password'}
                    />
                </button>
            </div>

            <div className='terms-MasterPassword'>
                <input type="checkbox" />
                <p>
                    I understand that Pactus cannot recover this password for me.
                    <span className='gradient-MasterPassword'>Learn more</span>
                </p>
            </div>

            <button className='cta-MasterPassword' onClick={() => navigate('/get-started?step=choose-name-wallet')} >Continue</button>
        </div>
    )
}

export default MasterPassword
