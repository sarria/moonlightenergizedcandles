import Image from 'next/image';
import parse from 'html-react-parser';
import styles from './hero.module.scss';
import cx from 'classnames';
import ShopIco from './ShopIco'

const Hero = ({ data, shoppingPage }) => {

	return (
		data?.text && (
			<div className={styles.root}>
				<div className={styles.wrapper}>
					{data.image && typeof data.image.sourceUrl === 'string' && (
						<div className={styles.image}>
							<Image
								alt="Hero Image"
								src={data.image.sourceUrl}
								layout="fill"
								objectFit="cover"
							/>
						</div>
					)}
					{data.text && 
						<div className={styles.textWrapper}>
							<div className={cx(styles.text, {[styles.dark]: data.dark})}>
								{parse(data.text)}
								<div className={styles.shop}>
									<ShopIco shoppingPage={shoppingPage} isButton={true} />
								</div>
							</div>
						</div>
					}					
				</div>
			</div>
		)
	);

};

export default Hero;
