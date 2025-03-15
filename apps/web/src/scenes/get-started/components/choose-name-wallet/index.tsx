import {  walletNameLottie } from '@/assets'
import React, { useContext } from 'react'
import './style.css'
import { useRouter } from 'next/navigation'
import { GuardContext } from '@/providers/guard'
import dynamic from 'next/dynamic'
const LottiePlayer = dynamic(() => import('react-lottie-player'), { ssr: false });
const ChooseNameWallet = () => {
    const navigate = useRouter().replace;
    const { setHasWallet } = useContext(GuardContext);

    const handleEnableWallet = () => {
        setHasWallet(true);
        navigate('/');
    };

    const emojis = [
        "😀", "😃", "😄", "😁", "😆", "😅", "😂", "🤣", "🥲", "🥹", "☺️", "😊", "😇", "🙂", "🙃", "😉", "😌",
        "😍", "🥰", "😘", "😗", "😙", "😚", "😋", "😛", "😝", "😜", "🤪", "🤨", "🧐", "🤓", "😎", "🥸", "🤩",
        "🥳", "🙂‍↕️", "😏", "😒", "🙂‍↔️", "😞", "😔", "😟", "😕", "🙁", "☹️", "😣", "😖", "😫", "😩", "🥺",
        "😢", "😭", "😮‍💨", "😤", "😠", "😡", "🤬", "🤯", "😳", "🥵", "🥶", "😱", "😨", "😰", "😥", "😓", "🫣",
        "🤗", "🫡", "🤔", "🫢", "🤭", "🤫", "🤥", "😶", "😶‍🌫️", "😐", "😑", "😬", "🫨", "🫠", "🙄", "😯", "😦",
        "😧", "😮", "😲", "🥱", "😴", "🤤", "😪", "😵", "😵‍💫", "🫥", "🤐", "🥴", "🤢", "🤮", "🤧", "😷", "🤒",
        "🤕", "🤑", "🤠", "😈", "👿", "👹", "👺", "🤡", "💩", "👻", "💀", "☠️", "👽", "👾", "🤖", "🎃", "😺", "😸",
        "😹", "😻", "😼", "😽", "🙀", "😿", "😾"
    ];

    return (
        <div className='container-ChooseNameWallet' >
            <LottiePlayer
                animationData={walletNameLottie}
                loop={false}
                play
                style={{ height: '200px' }}
            />
            <h1>Name your Wallet</h1>
            <p>Name yor wallet to easily identify it using the Pactus wallet. these names are stored locally, and can only be seen by you.</p>
            <div className='input-ChooseNameWallet'>
                <input
                    type='text'
                    placeholder="Wallet name"
                />

            </div>
            <div className='emoji-ChooseNameWallet' >
                {emojis.map((emoji, index) => (<button key={`${index}-emoji`} >{emoji}</button>))}
            </div>
            <button className='cta-ChooseNameWallet' onClick={() => handleEnableWallet()}  >Finish</button>
        </div>
    )
}

export default ChooseNameWallet