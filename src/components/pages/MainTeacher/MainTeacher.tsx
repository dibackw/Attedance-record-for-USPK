import Sidebar from '../../ui/Sidebar/Sidebar';
import styles from './MainTeacher.module.scss';
import Header from '../../ui/Header/Header';

const MainTeacher = () => {
  return (
    <div className={styles.page}>
      <Sidebar role='teacher' />
      <main className={styles.content}>
        <Header role='teacher' />
      </main>
    </div>
  );
};

export default MainTeacher;