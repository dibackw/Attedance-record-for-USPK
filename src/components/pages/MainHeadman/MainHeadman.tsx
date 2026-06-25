import { useEffect, useState } from 'react';
import { getUser } from '../../../utils/auth';
import Sidebar from '../../ui/Sidebar/Sidebar';
import styles from './MainHeadman.module.scss';
import Header from '../../ui/Header/Header';
import StudentMain from '../../ui/StudentMain/StudentMain';

interface ActivePoll {
  id: string;
  discipline: string;
  datetime: string;
  disciplineId: number;
  groupId: number;
}

const MainHeadman = () => {
  const user = getUser();
  const [activePoll, setActivePoll] = useState<ActivePoll | null>(null);
  const [hasPoll, setHasPoll] = useState(false);

  const fetchActivePoll = () => {
    fetch('/api/polls')
      .then(r => r.ok ? r.json() : [])
      .then((list: any[]) => {
        const poll = list.find(
          p => p.status === 'active' && String(p.groupId) === String(user?.groupId)
        ) ?? null;

        if (poll) {
          fetch(`/api/disciplines/${poll.disciplineId}`)
            .then(r => r.ok ? r.json() : null)
            .then((disc: { name: string } | null) => {
              setActivePoll({
                id: poll.id,
                discipline: disc?.name ?? '—',
                datetime: poll.datetime,
                disciplineId: Number(poll.disciplineId),
                groupId: Number(poll.groupId),
              });
              setHasPoll(true);
            })
            .catch(() => {
              setActivePoll({
                id: poll.id,
                discipline: '—',
                datetime: poll.datetime,
                disciplineId: Number(poll.disciplineId),
                groupId: Number(poll.groupId),
              });
              setHasPoll(true);
            });
        } else {
          setActivePoll(null);
          setHasPoll(false);
        }
      })
      .catch(() => {});
  };

  useEffect(() => {
    fetchActivePoll();
    const interval = setInterval(fetchActivePoll, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className={styles.page}>
      <Sidebar role="headman" />
      <main className={styles.content}>
        <Header role="headman" />
        <StudentMain
          attendance={[
            { date: '12.05.2026 8:10:56',  discipline: 'Математика',       mark: 'П' },
            { date: '12.05.2026 10:10:36', discipline: 'Физика',            mark: 'П' },
            { date: '12.05.2026 12:00:24', discipline: 'Русский язык',      mark: 'П' },
            { date: '8.05.2026 8:37:52',   discipline: 'Литература',        mark: 'Н' },
            { date: '8.05.2026 9:40:11',   discipline: 'Физкультура',       mark: 'Н' },
            { date: '8.05.2026 10:50:43',  discipline: 'Компьютерные сети', mark: 'Н' },
          ]}
          stats={{
            total: 130,
            missed: 30,
            attended: 100,
            percentage: '76,9%'
          }}
          hasPoll={hasPoll}
          activePoll={activePoll}
          studentId={user?.id}
        />
      </main>
    </div>
  );
};

export default MainHeadman;