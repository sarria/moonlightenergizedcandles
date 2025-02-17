import { ReactElement, forwardRef } from 'react';
import Link from 'next/link'
import cx from 'classnames'
import Image from 'next/image'
import LogoHome from '../images/Logo-Home.png'
import LogoInner from '../images/logo-inner-71x420.png'
import styles from './logo.module.scss'

function Logo({ isHomePage }: { isHomePage: boolean }): ReactElement {
	return (
		<div className={cx('pageTop', styles.root, {[styles.isHomePage]: isHomePage}, {[styles.isInnerPage]: !isHomePage})}>
			<div className={styles.wrapper}>
				<div className={styles.logo}>
					<Link href="/" passHref>
						<Image
							alt=''
							src={isHomePage ? LogoHome : LogoInner}
							layout="responsive"
						/>
					</Link>
				</div>
			</div>
		</div>
	)
}

export default Logo