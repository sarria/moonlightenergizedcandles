import parse from 'html-react-parser';
import cx from 'classnames'
import styles from './footer.module.scss'
import Link from 'next/link'
import Text from './Text'
import Images from './Images'
import Image from "next/image";
import Logo from './Logo'
import LogoImage from '../images/Moonlight Logo-02.svg'
import faInstagramBlack from '../public/icons/instagram-black.svg'

const Footer = ({global, buttons}) => {
	const textData =                 {
		"text": global.instagramFeedHeader
	}

	const instagramImages = global.instagramFeed.map(item => {
		return {
			"image": item.image,
			"ratio": '98.4%',
			"linkPage": {
				"slug": item.link
			},
			"instagram": true
		}
	})

	const img5ColData = {
		"imagesLayout": "5col",
		"imagePadding": true,
		"images": instagramImages
	}

	return (
		<div className={styles.root}>
			<div className={styles.wrapper}>
				<Text data={textData} />
				<Images data={img5ColData} />
				<Logo className={styles.logo} image={LogoImage} />
				
				<div className={styles.ico}>
					<a href={global.instagram} target='_blank'>
						<Image src={faInstagramBlack} layout='fill' />
					</a>
				</div>
				
				<div className={styles.copyRight}>{parse(global.copyRight)}</div>
			</div>
		</div>
	)
}

export default Footer;
