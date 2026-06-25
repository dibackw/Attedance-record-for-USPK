import { useState } from 'react';
import styles from './StudentMain.module.scss';
import logoImg from '../../../assets/logo.jpg';

interface AttendanceRow {
  date: string;
  discipline: string;
  mark: string;
}

interface Stats {
  total: number;
  missed: number;
  attended: number;
  percentage: string;
}

interface ActivePoll {
  id: string;
  discipline: string;
  datetime: string;
  disciplineId: number;
  groupId: number;
}

interface Props {
  attendance: AttendanceRow[];
  stats: Stats;
  hasPoll: boolean;
  activePoll?: ActivePoll | null;
  studentId?: string;
}

const StudentMain = ({ attendance, stats, hasPoll, activePoll, studentId }: Props) => {
  const [showModal, setShowModal] = useState(false);
  const [confirmed, setConfirmed] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleConfirm = async () => {
    if (!activePoll || !studentId) return;
    setLoading(true);
    try {
      const now = new Date();
      const date = `${now.getDate().toString().padStart(2,'0')}.${(now.getMonth()+1).toString().padStart(2,'0')}.${now.getFullYear()}`;
      await fetch('/api/attendance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          studentId,
          disciplineId: activePoll.disciplineId,
          groupId: activePoll.groupId,
          date,
          status: 'п',
        }),
      });
      setConfirmed(true);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
      setShowModal(false);
    }
  };

  const getMarkColor = (mark: string) => {
    if (mark === 'П') return styles.markPresent;
    if (mark === 'Н') return styles.markAbsent;
    if (mark === 'УП') return styles.markReason;
    return '';
  };

  return (
    <div className={styles.wrapper}>

      {/* Заголовок */}
      <div className={styles.titleBlock}>
        <p className={styles.title}>Моя посещаемость</p>
      </div>

      {/* Баннер опроса */}
      <div className={styles.pollBlock}>
        {!hasPoll ? (
          <div className={styles.noPollBanner}>
            <p className={styles.noPollTitle}>Активного опроса нет</p>
            <p className={styles.noPollSub}>Преподаватель ещё не запустил опрос присутствия.</p>
          </div>
        ) : confirmed ? (
          <div className={styles.pollBanner}>
            <p className={styles.pollTitle}>✓ Присутствие подтверждено</p>
            <p className={styles.pollSub}>Вы успешно отметились на занятии.</p>
          </div>
        ) : (
          <div className={styles.pollBanner}>
            <p className={styles.pollActive}>Сейчас идёт опрос</p>
            <p className={styles.pollSub}>
              Преподаватель запустил опрос. Подтвердите своё присутствие на занятии.
            </p>
            <button className={styles.pollBtn} onClick={() => setShowModal(true)}>
              Отметиться
            </button>
          </div>
        )}
      </div>

      {/* Таблица + статистика */}
      <div className={styles.mainBlock}>

        <div className={styles.tableWrapper}>
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
              {attendance.map((row, index) => (
                <tr key={index}>
                  <td className={styles.td}>{row.date}</td>
                  <td className={styles.td}>{row.discipline}</td>
                  <td className={styles.td}>Завершен</td>
                  <td className={`${styles.td} ${getMarkColor(row.mark)}`}>
                    {row.mark}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Статистика */}<div className={styles.statsWrapper}>
          <p className={styles.statsTitle}>Статистика</p>
          <div className={styles.statsGrid}>
            <span className={styles.statLabel}>Всего занятий</span>
            <span className={styles.statValue}>{stats.total}</span>

            <span className={styles.statLabel}>Пропущено</span>
            <span className={styles.statValue}>{stats.missed}</span>

            <span className={styles.statLabel}>Посещаемость</span>
            <span className={`${styles.statValue} ${styles.statValueGreen}`}>
              {stats.percentage}
            </span>
          </div>
        </div>

      </div>

      {/* Модальное окно */}
      {showModal && activePoll && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <div className={styles.modalLogo}>
              <img src={logoImg} alt="УСПК" className={styles.modalLogoImg} />
            </div>
            <h3 className={styles.modalTitle}>Подтверждение присутствия</h3>
            <div className={styles.modalField}>
              <span className={styles.modalLabel}>Дисциплина:</span>
              <div className={styles.modalInputBox}>{activePoll.discipline}</div>
            </div>
            <div className={styles.modalField}>
              <span className={styles.modalLabel}>Дата и время занятия:</span>
              <div className={styles.modalInputBox}>{activePoll.datetime}</div>
            </div>
            <button
              className={styles.confirmBtn}
              onClick={handleConfirm}
              disabled={loading}
            >
              {loading ? 'Отправка...' : 'Подтвердить'}
            </button>
          </div>
        </div>
      )}

    </div>
  );
};

export default StudentMain;