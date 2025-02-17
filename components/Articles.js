import Image from 'next/image';
import parse from 'html-react-parser';
import cx from 'classnames'
import styles from './articles.module.scss'

const Articles = ({data}) => {
	// console.log('Articles data ::', data)
	
	return data?.articles &&  (
		<div className={styles.root} id='articles'>
			<div className={styles.wrapper}>
			{data.articles.map((item, idx) => item.text && (
				<div className={cx(styles.item)}>
					<div className={styles.content}>
						<div className={styles.photo}>
							<div className={styles.image}>
								<Image
									alt="Hero Image"
									src={item.photo.sourceUrl}
									// width={199} // Provide explicit width
									// height={83} // Provide explicit height
									layout="fill" // Optional: Adjust layout as needed
								/>
							</div>
						</div>
						<div className={styles.textWrapper}>
							<div className={styles.text}>
								{item.headline && <h2 className={styles.headline}>{item.headline}</h2>}
								{parse(item.text)}
							</div>
						</div>
					</div>
				</div>	
			))}
			</div>
		</div>
	)
}

export default Articles;