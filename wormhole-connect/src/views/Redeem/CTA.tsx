import React from 'react';
import Button from '../../components/Button';
import InputContainer from '../../components/InputContainer';
import Spacer from '../../components/Spacer';
import AddToWallet from './AddToWallet';

type Props = {
  ctaText: string;
  cta?: React.MouseEventHandler<HTMLDivElement>;
};

function CTA(props: Props) {
  return (
    <div>
      <InputContainer>
        <div>The bridge is now complete.</div>
        <div>
          Click the button below to begin using your new Wormhole assets.
        </div>
        <AddToWallet />
      </InputContainer>
      <Spacer />
      <Button onClick={props.cta} action elevated>
        {props.ctaText}
      </Button>
    </div>
  );
}

export default CTA;
