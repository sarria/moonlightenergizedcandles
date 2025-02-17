import parse from 'html-react-parser';
import Link from 'next/link'
import ImageRatio from './elements/ImageRatio'
import styles from './article.module.scss'

const Article = ({data}) => {
	// console.log('Article ::', data)
	
	return  data.text && (
		<div className={styles.root}>
			<div className={styles.wrapper}>
				<div className={styles.left}>
					<ImageRatio image={data.image} ratio='140%' />
				</div>
				<div className={styles.right}>
					{data.headline && <div className={styles.headline}>
						{parse(data.headline)}
					</div>}
					{data.text && <div className={styles.text}>
						{parse(data.text)}
					</div>}
					{/* {styles.link && <div className={styles.link}>
						{data.linkPage?.slug && <Link href={data.linkPage.slug} passHref>
							{data.linkLabel}
						</Link>}
						&nbsp;&nbsp;<gold>&gt;</gold>
					</div>} */}
				</div>
			</div>
		</div>
	)
}

export default Article;