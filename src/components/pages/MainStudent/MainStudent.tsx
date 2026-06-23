import Sidebar from '../../ui/Sidebar/Sidebar';
import styles from './MainStudent.module.scss';
import Header from '../../ui/Header/Header';

const MainStudent = () => {
  return (
    <div className={styles.page}>
      <Sidebar role='student' />
      <main className={styles.content}>
        <Header role='student' />
      </main>
    </div>
  );
};

export default MainStudent;