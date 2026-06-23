import Sidebar from '../../ui/Sidebar/Sidebar';
import styles from './MainStudent.module.scss';
import Header from '../../ui/Header/Header';

const MainStudent = () => {
  return (
    <div className={styles.page}>
      <Sidebar />
      <main className={styles.content}>
        <Header />
      </main>
    </div>
  );
};

export default MainStudent;