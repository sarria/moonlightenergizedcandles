import parse from 'html-react-parser';
import cx from 'classnames'
import Slider from "react-slick";
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";
import styles from './quotes.module.scss'

const Quotes = ({data}) => {
	const {quotes} = data;
	// console.log('Quotes ::', quotes);

	const settings = {
		autoplay: false, //true,
		dots: false,
		infinite: true,
		speed: 500,
		slidesToShow: 1,
		slidesToScroll: 1,
		nextArrow: <NextArrow />,
		prevArrow: <PrevArrow />
	};

	return quotes && (
		<div className={styles.root}>
			<div className={styles.wrapper}>
				<Slider {...settings}>
				{quotes.map((quote, idx) => quote.quote && (
					<div key={idx} className={styles.quote}>
						{quote.quote && <div className={styles.text}>
							{parse(quote.quote)}
						</div>}
						{quote.authorLine1 &&
						<div className={styles.authorLine1}>
							{parse(quote.authorLine1)}
						</div>}
						{quote.authorLine2 && <div className={styles.authorLine2}>
							{parse(quote.authorLine2)}
						</div>}
					</div>
				))}
				</Slider>
			</div>
		</div>
	)
}

export default Quotes;

function NextArrow(props) {
	const { className, onClick } = props;
	return (
	  <div
		className={cx(className, styles.nextButton)}
		onClick={onClick}
	  >
		  Next &gt;
	  </div>
	);
}

function PrevArrow() {
	return <></>
}
