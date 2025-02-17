import cx from 'classnames'
import Link from 'next/link'
import ImageRatio from './elements/ImageRatio'
import styles from './imageCard.module.scss'

const ImageCard = ({index, image, ratio, hoverIco, hasPadding, linkPage, imagesLayout}) => {
	const hasLink = image.linkPage?.slug ? 'hasLink' : ''
	const label = image.linkLabel || image.linkPage?.title
	const LinkTo = image.linkPage?.slug || linkPage?.slug || null

	return (
		<a href={LinkTo || 'javascript:void(0)'} target="_blank">
			<div className={cx(styles.root)}>
				<div className={cx(styles.wrapper, styles[hasPadding], {[styles.hasLink]:LinkTo}, hasLink)}>
					<div className={cx(styles.image)}>
						<ImageRatio image={image.image} ratio={ratio} />
					</div>
					{hoverIco && (
					<div className={styles.ico}>
						{hoverIco}
					</div>
					)}						
				</div>
			</div>
		</a>
	)
}

export default ImageCard;