import { Link }           from 'react-router-dom'
import styles from './index.less';

export default function IndexPage() {
  return (
    <div>
      <h1 className={styles.title}>Page index</h1>
      <ul>
        <li><Link to="/uploader">uploader</Link></li>
        <li><Link to="/users">users</Link></li>
      </ul>
    </div>
  );
}
