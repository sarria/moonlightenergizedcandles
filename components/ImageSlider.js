import parse from 'html-react-parser';
import cx from 'classnames'
import Link from 'next/link'
import Slider from "react-slick";
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";
import styles from './imageSlider.module.scss'
import Image from 'next/image'
import arrowLeft from '../images/arrow-left.png'
import arrowRight from '../images/arrow-right.png'

const ImageSlider = ({data}) => {
	const {slider, linkPage} = data;
	// console.log('ImageSlider ::', slider);

	const settings = {
		autoplay: true,
		dots: false,
		infinite: true,
		speed: 500,
		slidesPerRow: 8,
		className: styles.imageSliderWrapper,
		prevArrow: <Arrow direction='left' />,
		nextArrow: <Arrow direction='right' />
	};

	return (
		<div className={styles.root} id='imageSlider'>
			<div className={styles.wrapper}>
				<Slider {...settings}>
				{slider && slider.map((image, idx) => {
					const linkTo = image.customImagesFields?.linkto?.slug || linkPage?.slug;
					const anchor = image.customImagesFields?.anchor;
					// console.log('linkTo :: ', image.sourceUrl, linkTo, anchor)
					return (
					<div key={idx} className={styles.image}>
						<Link href={linkTo ? linkTo+'/#'+anchor : 'javascript:void(0)'} passHref>
							<Image
								alt={image.altText}
								src={image.sourceUrl}
								layout='fill'
								objectFit='cover'
							/>
						</Link>
					</div>
				)})}
				</Slider>
			</div>
		</div>
	)
}

export default ImageSlider;

function Arrow(props) {
	const { className, onClick, direction } = props;
	return (
	  <div
		className={cx(className, styles.arrow, styles[direction])}
		onClick={onClick}
	  >
		  <div className=''>
		  		<Image
					alt=''
					src={direction==='left' ? arrowLeft : arrowRight}
					width={21}
					height={40}
				/>
		  </div>
	  </div>
	);
}