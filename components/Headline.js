import parse from 'html-react-parser';
import styles from './headline.module.scss'
import { generateIdFromLabel } from './utils/shared';

const Headline = ({data}) => {
	const id = generateIdFromLabel(data.line1);

	return (
		<div key={id} id={id} className={styles.root}>
			<div className={styles.wrapper}>
				{data.line1 && <h2>{parse(data.line1)}</h2>}
				{data.line2 && <h1>{parse(data.line2)}</h1>}
			</div>
		</div>
	)
}

export default Headline;