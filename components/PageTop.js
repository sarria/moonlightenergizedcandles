import { useState } from 'react';
import Burger from './Burger'
import Logo from './Logo'
import TopNav from './TopNav'
import ShopButton from './ShopButton'
import styles from './pageTop.module.scss'

function PageTop({isHomePage, global}) {
	const [isOpen, setIsOpen] = useState(false);
	const navigation = global.navigation

	const toggleMenu = (status) => {
	  setIsOpen(!isOpen); // Toggle the state
	};

	return (
		<div className={styles.root}>
			<div className={styles.wrapper}>
				<div className={styles.header}>
					<Logo />
					<div className={styles.navigation}>
						<TopNav global={global} isOpen={isOpen} toggleMenu={toggleMenu} />
						<div className={styles.shopButton}>
							<ShopButton isMobilePageTop={true} />
						</div>
						<Burger isOpen={isOpen} toggleMenu={toggleMenu} />
					</div>
				</div>
			</div>
		</div>
	)
}

export default PageTop