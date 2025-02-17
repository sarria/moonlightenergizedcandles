import parse from 'html-react-parser';
import styles from './text.module.scss'

const Text = ({data}) => {

	return data?.text && (
		<div className={styles.root}>
			<div className={styles.wrapper}>
				{parse(data.text)}
			</div>
			
		</div>
	)
}

export default Text;