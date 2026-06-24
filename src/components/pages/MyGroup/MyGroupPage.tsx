import Sidebar from '../../ui/Sidebar/Sidebar';
import Header from '../../ui/Header/Header';
import MyGroup from './MyGroup';
import styles from '../MainStudent/MainStudent.module.scss';
import { getUser } from '../../../utils/auth';

const MyGroupPage = () => {
  const user = getUser();
  const role = user?.role as 'student' | 'headman';

  return (
    <div className={styles.page}>
      <Sidebar role={role} />
      <main className={styles.content}>
        <Header role={role} pageTitle='Моя группа' />
        <MyGroup />
      </main>
    </div>
  );
};

export default MyGroupPage;