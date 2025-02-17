import { ReactElement } from 'react';
import Image from 'next/image';
import parse from 'html-react-parser';
import styles from './hero.module.scss';
import cx from 'classnames';

const Hero = ({ data }) => {
	console.log('data', data)
	return (
		data?.text && (
			<div className={styles.root}>
				<div className={styles.wrapper}>
					{data.image && typeof data.image.sourceUrl === 'string' && (
						<div className={styles.image}>
							<Image
								alt="Hero Image"
								src={data.image.sourceUrl}
								// width={199} // Provide explicit width
								// height={83} // Provide explicit height
								layout="fill" // Optional: Adjust layout as needed
								objectFit="cover" // Ensures image scales properly
							/>
						</div>
					)}
					{data.text && 
						<div className={styles.textWrapper}>
							<div className={cx(styles.text, {[styles.dark]: data.dark})}>{parse(data.text)}</div>
						</div>
					}					
				</div>
			</div>
		)
	);

	// return (
	// 	<div className={styles.hero}>
	// 	  <div className={styles.image}>
	// 		<Image
	// 		  src={imageSrc}
	// 		  alt="Background"
	// 		  layout="fill" // Covers the entire div
	// 		  objectFit="cover" // Ensures image scales properly
	// 		  priority // Optimizes for faster loading
	// 		/>
	// 	  </div>
	// 	  <div className={styles.text}>
	// 		{text}
	// 	  </div>
	// 	</div>
	//   );	
};

export default Hero;
