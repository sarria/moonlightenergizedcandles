import parse from 'html-react-parser';
import cx from 'classnames'
import styles from './label.module.scss'
import { generateIdFromLabel } from './utils/shared';

const Label = ({data}) => {
	// console.log("label ::", data)
	const id = generateIdFromLabel(data.label);

	return data?.label && (
		<div key={id} id={id} className={styles.root}>
			<div className={cx(styles.wrapper, {[styles.marginLeft]: data.marginLeft})}>
				<h2>{parse(data.label.toUpperCase())}</h2>
				<div className={styles.yellowBar} />
			</div>
		</div>
	)
}

export default Label;