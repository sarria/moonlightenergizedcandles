import parse from 'html-react-parser';
import styles from './thumbnails.module.scss'
import ImageRatio from './elements/ImageRatio'

const Thumbnails = ({data}) => {
	// console.log('thumbnails :: ', data.thumbnails)

	return data?.thumbnails && (
		<div className={styles.root}>
			<div className={styles.wrapper}>
				{data.thumbnails.map((item) => {
					return item.image && (
					<div key={item.image.sourceUrl} className={styles.item}>

						<ImageRatio image={item.image} ratio='60%' />

						<div className={styles.description}>
							{item.description && parse(item.description)}
						</div>

					</div>
					)
				})}
			</div>
		</div>
	)
}

export default Thumbnails;