'use client';

import React, { Suspense } from 'react';
import Typography from '@/components/common/Typography';
import Title from '@/components/common/title/Title';
import Description from '@/components/common/description/Description';
import { useI18n } from '@/utils/i18n';

interface TitleWithIdProps {
  content: string;
  id: string;
}

const TitleWithId: React.FC<TitleWithIdProps> = ({ content, id }) => {
  return (
    <div id={id}>
      <Title content={content} />
    </div>
  );
};

const TermsAndConditionsContent: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <Typography
        variant="h1"
        className="mb-6 text-gradient text-[26px] md:text-[32px] font-semibold text-center"
        as="h1"
      >
        Terms and Conditions
      </Typography>

      <div className="space-y-6">
        <section aria-labelledby="acceptance-terms">
          <TitleWithId content="1. Acceptance of Terms" id="acceptance-terms" />
          <Description
            content={
              <>
                By accessing or using the Pactus Web Wallet (&quot;Wallet&quot;), you agree to be
                bound by these Terms and Conditions (&quot;Terms&quot;). If you do not agree with
                these Terms, do not use the Wallet.
              </>
            }
          />
        </section>

        <section aria-labelledby="non-custodial-service">
          <TitleWithId content="2. Non-Custodial Service" id="non-custodial-service" />
          <Description content="Pactus provides a non-custodial wallet service. We do not have access to, store, or control your private keys, passwords, or recovery phrases. You are solely responsible for safeguarding your credentials and managing your digital assets." />
        </section>

        <section aria-labelledby="user-responsibility">
          <TitleWithId content="3. User Responsibility" id="user-responsibility" />
          <Description content="You acknowledge and agree that you are solely responsible for:" />
          <ul className="list-disc pl-6 mt-2 text-text-secondary tablet:!text-md font-regular !leading-loose text-xs">
            <li>Maintaining the security of your private keys, passwords, and recovery phrases.</li>
            <li>Conducting your own due diligence before engaging in any transaction.</li>
            <li>
              Complying with all applicable local, state, national, and international laws and
              regulations.
            </li>
          </ul>
        </section>

        <section aria-labelledby="risk-acknowledgement">
          <TitleWithId content="4. Risk Acknowledgement" id="risk-acknowledgement" />
          <Description content="Using blockchain technology involves inherent risks, including but not limited to system failures, cybersecurity threats, regulatory changes, and market volatility. You acknowledge and accept these risks and agree that Pactus is not responsible for any losses or damages." />
        </section>

        <section aria-labelledby="limitation-liability">
          <TitleWithId content="5. Limitation of Liability" id="limitation-liability" />
          <Description content="To the maximum extent permitted by law, Pactus, its developers, contributors, and affiliates shall not be liable for any direct, indirect, incidental, special, consequential, or exemplary damages arising from your use of, or inability to use, the Wallet." />
        </section>

        <section aria-labelledby="no-warranty">
          <TitleWithId content="6. No Warranty" id="no-warranty" />
          <Description
            content={
              <>
                The Wallet is provided on an &quot;as-is&quot; and &quot;as-available&quot; basis
                without warranties of any kind, either express or implied. Pactus disclaims all
                warranties, including but not limited to merchantability, fitness for a particular
                purpose, and non-infringement.
              </>
            }
          />
        </section>

        <section aria-labelledby="third-party-services">
          <TitleWithId content="7. Third-Party Services" id="third-party-services" />
          <Description content="The Wallet may integrate with or link to third-party services. Pactus does not endorse, control, or assume responsibility for any third-party services. Your use of any third-party services is at your own risk." />
        </section>

        <section aria-labelledby="modifications-terms">
          <TitleWithId content="8. Modifications to Terms" id="modifications-terms" />
          <Description content="Pactus reserves the right to modify or update these Terms at any time without prior notice. Continued use of the Wallet after changes become effective constitutes acceptance of the new Terms." />
        </section>

        <section aria-labelledby="governing-law">
          <TitleWithId content="9. Governing Law" id="governing-law" />
          <Description
            content=" These Terms shall be governed by applicable laws, without regard to
conflict of law principles."
          />
        </section>
      </div>
    </div>
  );
};

const TermsAndConditions: React.FC = () => {
  const { t } = useI18n();

  return (
    <Suspense fallback={<div>{t('loading')}</div>}>
      <div className="flex flex-col min-h-[100dvh] w-full px-4 py-8 items-center">
        <TermsAndConditionsContent />
      </div>
    </Suspense>
  );
};

export default TermsAndConditions;
