import Image from 'next/image';
import Link from 'next/link'
import parse from 'html-react-parser';
import cx from 'classnames'
import styles from './events.module.scss'
import faLocationDot from '../public/icons/location-dot-red.svg';

const Events = ({data}) => {
	console.log('Events data ::', data.events)
	
	return (
		<div className={styles.root}>
			<div className={styles.wrapper}>
				{data.text && 
					<div className={styles.text}>
						{parse(data.text)}
					</div>
				}
				<div className={cx(styles.items)}>
					{data.events && data.events.map((item, index) =>{
						return (
							<div key={index} className={cx(styles.item)}>
								<div className={cx(styles.innerItem)}>
									<div className={cx(styles.image)}>
										<Image
											alt={item.image.alt}
											src={item.image.sourceUrl}
											layout="fill"
											objectFit='contain'
										/>
									</div>
									<div className={styles.info}>
										<div className={styles.line1}>
											<div className={styles.name}>
												{item.name}
											</div>
											<div className={styles.date}>
												{item.date}
											</div>
										</div>
										<div className={styles.line2}>
											<div className={styles.location}>
												{item.linkToMap ? <Link href={item.linkToMap} passHref>
													<a target="_blank" rel="noopener noreferrer">
														<div className={styles.ico}><Image src={faLocationDot} layout="fill" /></div> {item.location}
													</a>
												</Link> : <div>{item.location}</div>}
												
											</div>
										</div>
									</div>
								</div>
							</div>
						)
					})}
				</div>
			</div>
		</div>
	)
}

export default Events;