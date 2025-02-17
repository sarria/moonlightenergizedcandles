import Image from 'next/image'
import cx from 'classnames'
import styles from './ImageRatio.module.scss'

const ImageRatio = ({image, ratio}) => {
	return (
		<div className={cx('ratio_container', {[styles.large_container]: !ratio})}>
			<div className='outer' style={{'paddingTop': ratio}}>
			<div className={cx('inner', {[styles.inner]: !ratio})}>
					{image && 
					<Image
						alt={image.altText}
						src={image.sourceUrl}
						layout="fill"
						objectFit="cover"
						objectPosition="center"
					/>}
				</div>
			</div>
		</div>
	)
}

export default ImageRatio;