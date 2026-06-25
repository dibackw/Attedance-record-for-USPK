import { useEffect, useState } from 'react';
import { getUser } from '../../../utils/auth';
import Sidebar from '../../ui/Sidebar/Sidebar';
import Header from '../../ui/Header/Header';
import styles from './StudentPolls.module.scss';
import mainStyles from '../MainStudent/MainStudent.module.scss';

interface ActivePoll {
  id: string;
  discipline: string;
  datetime: string;
  disciplineId: number;
  groupId: number;
}

interface HistoryItem {
  id: string;
  discipline: string;
  datetime: string;
  status: string;
  myMark: string; // П, Н, УП
}

const StudentPolls = () => {
  const user = getUser();
  const role = user?.role as 'student' | 'headman';
  const [activePoll, setActivePoll] = useState<ActivePoll | null>(null);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [marked, setMarked] = useState(false);

  const fetchPolls = () => {
    fetch('/api/polls')
      .then(r => r.ok ? r.json() : [])
      .then(async (list: any[]) => {
        // Активный опрос для группы студента
        const active = list.find(
          p => p.status === 'active' && String(p.groupId) === String(user?.groupId)
        );

        if (active) {
          const disc = await fetch(`/api/disciplines/${active.disciplineId}`)
            .then(r => r.json()).catch(() => ({ name: '—' }));
          setActivePoll({
            id: active.id,
            discipline: disc.name,
            datetime: active.datetime,
            disciplineId: active.disciplineId,
            groupId: active.groupId,
          });
        } else {
          setActivePoll(null);
        }

        // История завершённых опросов группы
        const completed = list.filter(
          p => p.status === 'completed' && String(p.groupId) === String(user?.groupId)
        );

        const historyItems = await Promise.all(
          completed.map(async p => {
            const disc = await fetch(`/api/disciplines/${p.disciplineId}`)
              .then(r => r.json()).catch(() => ({ name: '—' }));

            // Ищем отметку студента
            const attendance = await fetch(
              `/api/attendance?pollId=${p.id}&studentId=${user?.id}`
            ).then(r => r.json()).catch(() => []);

            const myMark = attendance[0]?.mark ?? 'Н';

            return {
              id: p.id,
              discipline: disc.name,
              datetime: p.datetime,
              status: 'Завершен',
              myMark,
            };
          })
        );
        setHistory(historyItems);
      })
      .catch(() => {});
  };

  useEffect(() => {
    fetchPolls();
    const interval = setInterval(fetchPolls, 10000); // проверяем каждые 10 сек
    return () => clearInterval(interval);
  }, []);

  const handleMarkPresence = async () => {
    if (!activePoll || !user) return;

    await fetch('/api/attendance', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        pollId: activePoll.id,
        studentId: user.id,
        mark: 'П',
      })
    });

    // Увеличиваем счётчик ответивших
    const poll = await fetch(`/api/polls/${activePoll.id}`).then(r => r.json());
    await fetch(`/api/polls/${activePoll.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ responded: (poll.responded ?? 0) + 1 })
    });

    setMarked(true);
  };

  const markColor = (mark: string) => {
    if (mark === 'П') return styles.markGreen;
    if (mark === 'Н') return styles.markRed;
    return styles.markOrange;
  };

  return (
    <div className={mainStyles.page}>
      <Sidebar role={role} />
      <main className={mainStyles.content}>
        <Header role={role} pageTitle="Опросы присутствия" />

        <div className={styles.wrapper}>

          {/* Баннер активного опроса или "нет опроса" */}
          {activePoll ? (
            <div className={styles.activeBanner}>
              <div className={styles.activeBannerLeft}><p className={styles.activeTitle}>Активный опрос</p>
                <p className={styles.activeLabel}>Дисциплина:</p>
                <p className={styles.activeValue}>{activePoll.discipline}</p>
                <p className={styles.activeLabel}>Дата и время:</p>
                <p className={styles.activeValue}>{activePoll.datetime}</p>
              </div>
              {!marked ? (
                <button className={styles.markBtn} onClick={handleMarkPresence}>
                  Отметить присутствие
                </button>
              ) : (
                <p className={styles.markedText}>✓ Присутствие отмечено</p>
              )}
            </div>
          ) : (
            <div className={styles.noPoll}>
              <p className={styles.noPollTitle}>Активного опроса нет</p>
              <p className={styles.noPollSub}>На данный момент нет активных опросов.</p>
            </div>
          )}

          {/* История опросов */}
          {history.length > 0 && (
            <>
              <h3 className={styles.historyTitle}>История опросов</h3>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th className={styles.th}>Дата и время</th>
                    <th className={styles.th}>Дисциплина</th>
                    <th className={styles.th}>Статус</th>
                    <th className={styles.th}>Ваша отметка</th>
                  </tr>
                </thead>
                <tbody>
                  {history.map(h => (
                    <tr key={h.id}>
                      <td className={styles.td}>{h.datetime}</td>
                      <td className={styles.td}>{h.discipline}</td>
                      <td className={styles.td}>{h.status}</td>
                      <td className={`${styles.td} ${markColor(h.myMark)}`}>
                        {h.myMark}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </>
          )}

        </div>
      </main>
    </div>
  );
};

export default StudentPolls;