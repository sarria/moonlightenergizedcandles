import cx from 'classnames'
import Link from 'next/link'
import Image from "next/image";
import ImageRatio from './elements/ImageRatio'
import styles from './imageCard.module.scss'
import faInstagram from '../public/icons/instagram-white.svg'

const ImageCard = ({index, image, ratio, instagram, hasPadding, linkPage, imagesLayout}) => {
	const hasLink = image.linkPage?.slug ? 'hasLink' : ''
	const label = image.linkLabel || image.linkPage?.title
	const LinkTo = image.linkPage?.slug || linkPage?.slug || null

	// console.log("instagram", instagram)

	return (
		<a href={LinkTo || 'javascript:void(0)'} target="_blank">
			<div className={cx(styles.root)}>
				<div className={cx(styles.wrapper, styles[hasPadding], {[styles.hasLink]:LinkTo}, hasLink)}>
					<div className={cx(styles.image)}>
						<ImageRatio image={image.image} ratio={ratio} />
					</div>
					{instagram && (
					<div className={styles.ico}>
						<img src={faInstagram.src} layout='fill' />
					</div>
					)}						
				</div>
			</div>
		</a>
	)
}

export default ImageCard;