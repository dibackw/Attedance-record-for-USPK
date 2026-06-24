import Sidebar from '../../ui/Sidebar/Sidebar';
import styles from './MainHeadman.module.scss';
import Header from '../../ui/Header/Header';
import StudentMain from '../../ui/StudentMain/StudentMain';

const MainHeadman = () => {
  return (
    <div className={styles.page}>
      <Sidebar role="headman" />
      <main className={styles.content}>
        <Header role="headman" />
        <StudentMain
          attendance={[
            { date: '12.05.2026 8:10:56', discipline: 'Математика', mark: 'П' },
            { date: '12.05.2026 10:10:36', discipline: 'Физика', mark: 'П' },
            { date: '12.05.2026 12:00:24', discipline: 'Русский язык', mark: 'П' },
            { date: '8.05.2026 8:37:52', discipline: 'Литература', mark: 'Н' },
            { date: '8.05.2026 9:40:11', discipline: 'Физкультура', mark: 'Н' },
            { date: '8.05.2026 10:50:43', discipline: 'Компьютерные сети', mark: 'Н' },
          ]}
          stats={{
            total: 130,
            missed: 30,
            attended: 100,
            percentage: '76,9%'
          }}
          hasPoll={false}
        />
      </main>
    </div>
  );
};

export default MainHeadman;