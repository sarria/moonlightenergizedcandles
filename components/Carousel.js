import Slider from "react-slick";
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";
import styles from './carousel.module.scss'
import Image from 'next/image'

// https://react-slick.neostack.com/docs/get-started

const Carousel = ({carousel}) => {
	// console.log("carousel ::", carousel)

	const settings = {
		autoplay: true,
		dots: true,
		infinite: true,
		speed: 500,
		slidesToShow: 1,
		slidesToScroll: 1
	};

	return (
		<>
			<div className={'carousel ' + styles.root}>
				<div className={styles.wrapper}>
					<Slider {...settings}>
					{carousel && carousel.map((image, idx) => (
						<div key={idx}>
							<div className={styles.image}>
								<Image
									alt={image.altText}
									src={image.sourceUrl}
									layout='fill'
									objectFit='cover'
									
								/>
							</div>
						</div>
					))}
					</Slider>
				</div>
			</div>
			<div className={styles.topMargin} />
			<div className={styles.homePageWrapper}><div></div></div>
		</>
	)
}

export default Carousel;