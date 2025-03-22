'use client'
import Image from 'next/image';
import React, { useState } from 'react';
import ThreeDMotion from '../3d-motion';
import { openSourceIcon, secureIcon, simpleIcon } from '@/assets';
import './style.css';
import { useRouter } from 'next/navigation';

const Welcome = () => {
  const navigate = useRouter().push;
  const [isChecked, setIsChecked] = useState(false);

  const data = [
    {
      title: 'Open Source',
      icon: openSourceIcon,
      description: (
        <>
          Pactus Wallet is fully open source, explore and contribute to our code{' '}
          <a className='gradient-GetStarted' href="https://github.com/pactus-project/pactus-wallet" target="_blank">
            here
          </a>.
        </>
      ),
    },
    { title: 'Simple', icon: simpleIcon, description: 'Pactus Wallet is designed for everyone, from beginners to advanced users.' },
    { title: 'Secure', icon: secureIcon, description: 'Pactus Wallet is a fully static wallet. There is no server involved and all data including \n your private keys are stored in your browser.' },
  ];

  return (
    <>
      <div className='titer-GetStarted'>
        <h1>
          Hello!<br />
          <span>Welcome to</span><span style={{ marginLeft: '5px' }} className='gradient-GetStarted'>Pactus Wallet</span>
        </h1>
      </div>

      <div className='section1-GetStarted'>
        <div className='slogans-GetStarted'>
          {data.map((item, i) => (
            <div key={`${i}-slogan`}>
              <Image src={item.icon} alt='' />
              <div>
                <h3>{item.title}</h3>
                <p>{item.description}</p>
              </div>
            </div>
          ))}
        </div>
        <div>
          <ThreeDMotion />
        </div>
      </div>

      <div className='letsCta-GetStarted'>
        <div>
          <input type="checkbox" checked={isChecked} onChange={() => setIsChecked(!isChecked)} />
          <p onClick={() => setIsChecked(!isChecked)}>
            I have read and agreed to the <span className='gradient-GetStarted'> Terms and Conditions</span>.
          </p>
        </div>
        <button onClick={() => navigate('/get-started?step=add-wallet')} disabled={!isChecked}>
          Let’s Start
        </button>
      </div>
    </>
  );
};

export default Welcome;
