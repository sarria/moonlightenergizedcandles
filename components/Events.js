import Image from 'next/image';
import Link from 'next/link'
import parse from 'html-react-parser';
import cx from 'classnames'
import styles from './events.module.scss'

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
				<div className={cx(styles.events)}>
					{data.events && data.events.map((item, index) =>{
						return (
							<div key={index} className={cx(styles.item)}>
								<div className={cx(styles.image)}>
									<Image
										alt="Hero Image"
										src={item.image.sourceUrl}
										// width={199} // Provide explicit width
										// height={83} // Provide explicit height
										layout="fill" // Optional: Adjust layout as needed
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
											<Link href={item.linkToMap} passHref>
												<a target="_blank" rel="noopener noreferrer">
													{item.location}
												</a>
											</Link>
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