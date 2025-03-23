"use client";
import { useSearchParams } from 'next/navigation';
import { useEffect, useState, Suspense, JSX } from 'react';
import AddWallet from './components/add-wallet';
import ImportWallet from './components/import-wallet';
import MasterPassword from './components/master-password';
import RecoveryPhrase from './components/recovery-phrase';
import Welcome from './components/welcome';


import './style.css';
import dynamic from 'next/dynamic';
import ChooseNameWallet from './components/choose-name-wallet';
const GetStartedContent = () => {
  const searchParams = useSearchParams();
  const [step, setStep] = useState<string | null>(null);
  useEffect(() => {
    setStep(searchParams.get('step'));
  }, [searchParams]);

  const stepsMap: Record<string, JSX.Element> = {
    'welcome': <Welcome />,
    'add-wallet': <AddWallet />,
    'master-password': <MasterPassword />,
    'import-wallet': <ImportWallet />,
    'recovery-phrase': <RecoveryPhrase />,
    'choose-name-wallet': <ChooseNameWallet />,
  };

  return (
    <div className='container-GetStarted'>
      {stepsMap[step || 'welcome']}
    </div>
  );
};

const GetStarted = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <GetStartedContent />
    </Suspense>
  );
};

export default GetStarted;
