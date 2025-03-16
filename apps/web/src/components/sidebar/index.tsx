'use client';
import React from 'react';
import './style.css';
import Image from 'next/image';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import {
    activityIcon,
    documentationIcon,
    FAQsIcon,
    gradientArrowToRightIcon,
    gradientCopyIcon,
    lockIcon,
    overviewIcon,
    plusIcon,
    ReportIcon,
    searchIcon,
    settingsIcon
} from '@/assets';
import BorderBeam from '../border-beam';


const Sidebar = () => {
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const navigate = useRouter().push;
    const accountList = [
        {
            name: 'Account 1',
            balance: '0.00',
            address: '0x2',
            emoji: '🤝'
        },
        {
            name: 'Account 2',
            balance: '0.00',
            address: '0x1',
            emoji: '😁'
        }
    ];
    const parseRoute = (route: string) => {
        const [path, queryString] = route.split('?');
        const queryParams = new URLSearchParams(queryString);
        return { path, queryParams };
    };

    const isActiveRoute = (route: string) => {
        const { path, queryParams } = parseRoute(route);
        if (pathname !== path) return false;
        for (const [key, value] of queryParams) {
            if (searchParams.get(key) !== value) return false;
        }
        return true;
    };


    return (
        <div className="sidebarContainer">
            <div className="walletName-sidebar">
                <span>😀</span>
                <h2>Wallet 1</h2>
                <Image src={lockIcon} alt="lock-icon" />
            </div>
            <div className="addAccount-sidebar">
                <button>
                    <Image src={plusIcon} alt="plus-icon" />
                    <p>Add Account</p>
                </button>
                <button>
                    <Image src={searchIcon} alt="search-icon" />
                </button>
            </div>
                   <div className="accountList-sidebar">
                <button
                    className={`route-sidebar ${isActiveRoute('/') ? 'activeRoute-sidebar' : ''}`}
                    onClick={() => navigate('/')}
                >
                    <Image src={overviewIcon} alt="overview-icon" />
                    <h3>Overview</h3>
                </button>
                <div>
                    <hr />
                    <div className="accountItems-sidebar">
                        {accountList.map((item, i) => (
                            <button style={{ background: isActiveRoute(`/wallet?address=${item?.address}`) ? '#15191C' : 'none' }}
                             onClick={() => navigate(`/wallet?address=${item?.address}`)} 
                             key={`${i}-account`}>
                                <span>{item.emoji}</span>
                                <p>{item.name}</p>
                            </button>
                        ))}
                    </div>
                </div>
            </div>
            <button
                className={`route-sidebar ${isActiveRoute('/activity') ? 'activeRoute-sidebar' : ''}`}
                onClick={() => navigate('/activity')}
                style={{ marginTop: '0px' }}
            >
                <Image src={activityIcon} alt="activity-icon" />
                <h3>Activity</h3>
            </button>
            <button
                className={`route-sidebar ${isActiveRoute('/settings') ? 'activeRoute-sidebar' : ''}`}
                style={{ marginTop: 'auto' }}
            >
                <Image src={settingsIcon} alt="settings-icon" />
                <h3>Settings</h3>
            </button>
            <button
                className={`route-sidebar ${isActiveRoute('/documentation') ? 'activeRoute-sidebar' : ''}`}
            >
                <Image src={documentationIcon} alt="documentation-icon" />
                <h3>Documentation</h3>
            </button>
            <button
                className={`route-sidebar ${isActiveRoute('/frequently-asked-questions') ? 'activeRoute-sidebar' : ''}`}
            >
                <Image src={FAQsIcon} alt="faqs-icon" />
                <h3>FAQs</h3>
            </button>
            <button
                className={`route-sidebar ${isActiveRoute('/report-bug') ? 'activeRoute-sidebar' : ''}`}
            >
                <Image src={ReportIcon} alt="report-icon" />
                <h3>Report Bug</h3>
            </button>

            <div id='contributing-parent' className='Contributing-sidebar' >
                <Image src={gradientCopyIcon} alt='gradientCopyIcon' />
                <div>
                    <h4>Contributing</h4>
                    <p>You can contribute to the Pactus wallet project at any time.</p>
                    <button>Join<Image src={gradientArrowToRightIcon} alt='gradientArrowToRightIcon' /> </button>
                </div>
                <BorderBeam
                    duration={4}
                    size={100}
                    colorFrom='#064560'
                    colorTo='#0FEF9E'
                    boxShadow={{
                        color: '#0FEF9E',
                        blur: 95,
                        spread: -60
                    }}
                    parentId="contributing-parent"
                    
                />
            </div>
        </div>
    );
};

export default Sidebar;