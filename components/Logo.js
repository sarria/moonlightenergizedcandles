import { ReactElement } from 'react';
import Link from 'next/link';
import cx from 'classnames';
import Image from 'next/image';
// import LogoImage from '../images/Moonlight Logo-01.svg';
import LogoImage from '../images/moonlight-energized-candles.png';
import styles from './logo.module.scss';

function Logo({ className, image }) {
  const img = image ? image : LogoImage;
  
  return (
    <div className={styles.root}>
      <div className={cx(className, styles.wrapper)}>
        <Link href="/" passHref>
          <a>
            <Image
              alt="Moonlight Logo"
              src={img}
            />
          </a>
        </Link>
      </div>
    </div>
  );
}

export default Logo;
