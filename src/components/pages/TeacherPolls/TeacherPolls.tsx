import { useEffect, useState } from 'react';
import { getUser } from '../../../utils/auth';
import Sidebar from '../../ui/Sidebar/Sidebar';
import Header from '../../ui/Header/Header';
import styles from './TeacherPolls.module.scss';
import mainStyles from '../MainStudent/MainStudent.module.scss';

interface Discipline { id: number; name: string; }
interface Group { id: number; name: string; }
interface Poll {
  id: string;
  disciplineId: number;
  groupId: number;
  teacherId: string;
  datetime: string;
  status: 'active' | 'completed';
  totalStudents: number;
  responded: number;
  timeLeft?: number;
}

const TeacherPolls = () => {
  const user = getUser();
  const [disciplines, setDisciplines] = useState<Discipline[]>([]);
  const [groups, setGroups] = useState<Group[]>([]);
  const [polls, setPolls] = useState<Poll[]>([]);
  const [activePoll, setActivePoll] = useState<Poll | null>(null);
  const [timeLeft, setTimeLeft] = useState(600);

  const [showModal, setShowModal] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState('');
  const [selectedDiscipline, setSelectedDiscipline] = useState('');
  const [selectedDatetime, setSelectedDatetime] = useState('');

  useEffect(() => {
    fetch('/api/disciplines').then(r => r.json()).then(setDisciplines);
    fetch('/api/groups').then(r => r.json()).then(setGroups);
    fetch(`/api/polls?teacherId=${user?.id}`)
      .then(r => r.json())
      .then((list: Poll[]) => {
        setPolls(list);
        const active = list.find(p => p.status === 'active');
        setActivePoll(active ?? null);
      });
  }, []);

  useEffect(() => {
    if (!activePoll) return;
    const interval = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) {
          clearInterval(interval);
          handleFinishPoll();
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [activePoll]);

  const formatTime = (sec: number) => {
    const m = Math.floor(sec / 60).toString().padStart(2, '0');
    const s = (sec % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  const handleStartPoll = async () => {
    if (!selectedGroup || !selectedDiscipline || !selectedDatetime) return;

    const now = new Date();
    const datetime = `${now.getDate().toString().padStart(2,'0')}.${(now.getMonth()+1).toString().padStart(2,'0')}.${now.getFullYear()} ${now.getHours().toString().padStart(2,'0')}:${now.getMinutes().toString().padStart(2,'0')}`;

    const newPoll: Omit<Poll, 'id'> = {
      disciplineId: Number(selectedDiscipline),
      groupId: Number(selectedGroup),
      teacherId: user?.id ?? '',
      datetime,
      status: 'active',
      totalStudents: 25,
      responded: 0,
    };

    const res = await fetch('/api/polls', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newPoll)
    });
    const created = await res.json();
    setActivePoll(created);
    setTimeLeft(600);
    setShowModal(false);
  };

  const handleFinishPoll = async () => {
    if (!activePoll) return;
    await fetch(`/api/polls/${activePoll.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: 'completed' })
    });
    setPolls(prev => prev.map(p =>
      p.id === activePoll.id ? { ...p, status: 'completed' } : p
    ));
    setActivePoll(null);
  };

  const getDisciplineName = (id: number) =>
    disciplines.find(d => d.id === id)?.name ?? '—';

  const getGroupName = (id: number) =>
    groups.find(g => g.id === id)?.name ?? '—';

  const completedPolls = polls.filter(p => p.status === 'completed');

  return (
    <div className={mainStyles.page}>
      <Sidebar role="teacher" />
      <main className={mainStyles.content}>
        {/* ↓ Заголовок: шапка покажет "Посещаемость УСПК. Опросы" */}
        <Header role="teacher" pageTitle="Опросы" />

        <div className={styles.wrapper}> {/* Выбор группы и дисциплины */}
          <div className={styles.controls}>
            <div className={styles.selectGroup}>
              <label className={styles.selectLabel}>Группа</label>
              <select
                className={styles.select}
                value={selectedGroup}
                onChange={e => setSelectedGroup(e.target.value)}
              >
                <option value="">Выберите группу</option>
                {groups.map(g => (
                  <option key={g.id} value={g.id}>{g.name}</option>
                ))}
              </select>
            </div>
            <div className={styles.selectGroup}>
              <label className={styles.selectLabel}>Дисциплина</label>
              <select
                className={styles.select}
                value={selectedDiscipline}
                onChange={e => setSelectedDiscipline(e.target.value)}
              >
                <option value="">Выберите дисциплину</option>
                {disciplines.map(d => (
                  <option key={d.id} value={d.id}>{d.name}</option>
                ))}
              </select>
            </div>
            <button
              className={styles.startBtn}
              onClick={() => setShowModal(true)}
            >
              Запустить опрос присутствия
            </button>
          </div>

          {/* Активный опрос или баннер */}
          {activePoll ? (
            <div className={styles.activePoll}>
              <div className={styles.activePollLeft}>
                {/* ↓ Зелёный лейбл */}
                <p className={styles.activeLabel}>Активный опрос</p>
                <p className={styles.activeSubLabel}>Дисциплина</p>
                <p className={styles.activeValue}>{getDisciplineName(activePoll.disciplineId)}</p>
                <p className={styles.activeSubLabel}>Дата и время занятия</p>
                <p className={styles.activeValue}>{activePoll.datetime}</p>
              </div>
              <div className={styles.activePollRight}>
                <p className={styles.linkLabel}>Ссылка для студентов:</p>
                <p className={styles.pollLink}>http://localhost:3000/poll/{activePoll.id}</p>
                <div className={styles.timerRow}>
                  <span className={styles.timerLabel}>Осталось времени</span>
                  {/* ↓ Зелёный таймер */}
                  <span className={styles.timer}>{formatTime(timeLeft)}</span>
                </div>
                <div className={styles.respondedRow}>
                  <span className={styles.timerLabel}>Подтвердили присутствие</span>
                  {/* ↓ Зелёный счётчик */}
                  <span className={styles.responded}>
                    {activePoll.responded} из {activePoll.totalStudents}
                  </span>
                </div>
                <button className={styles.finishBtn} onClick={handleFinishPoll}>
                  Завершить досрочно
                </button>
              </div>
            </div>
          ) : (
            /* ↓ Зелёный баннер "нет опроса" */
            <div className={styles.noPoll}>
              <p className={styles.noPollTitle}>Активного опроса нет</p>
              <p className={styles.noPollSub}>Сейчас нет активных опросов присутствия.</p>
            </div>
          )}

          {/* История опросов */}
          {completedPolls.length > 0 && (
            <>
              <h3 className={styles.historyTitle}>История опросов</h3>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th className={styles.th}>Дата и время</th>
                    <th className={styles.th}>Дисциплина</th>
                    <th className={styles.th}>Группа</th>
                    <th className={styles.th}>Статус</th>
                    <th className={styles.th}>Ответившие</th>
                  </tr>
                </thead>
                <tbody> {completedPolls.map(p => (
                    <tr key={p.id}>
                      <td className={styles.td}>{p.datetime}</td>
                      <td className={styles.td}>{getDisciplineName(p.disciplineId)}</td>
                      <td className={styles.td}>{getGroupName(p.groupId)}</td>
                      <td className={styles.td}>
                        <span className={styles.statusBadge}>Завершён</span>
                      </td>
                      <td className={styles.td}>{p.responded} из {p.totalStudents}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </>
          )}

        </div>

        {/* Модальное окно */}
        {showModal && (
          <div className={styles.modalOverlay}>
            <div className={styles.modal}>
              <div className={styles.modalHeader}>
                <h3 className={styles.modalTitle}>Запуск опроса присутствия</h3>
                <button className={styles.closeBtn} onClick={() => setShowModal(false)}>✕</button>
              </div>

              <label className={styles.modalLabel}>Группа:</label>
              <select
                className={styles.modalInput}
                value={selectedGroup}
                onChange={e => setSelectedGroup(e.target.value)}
              >
                <option value="">Выберите группу</option>
                {groups.map(g => (
                  <option key={g.id} value={g.id}>{g.name}</option>
                ))}
              </select>

              <label className={styles.modalLabel}>Дисциплина:</label>
              <select
                className={styles.modalInput}
                value={selectedDiscipline}
                onChange={e => setSelectedDiscipline(e.target.value)}
              >
                <option value="">Выберите дисциплину</option>
                {disciplines.map(d => (
                  <option key={d.id} value={d.id}>{d.name}</option>
                ))}
              </select>

              <label className={styles.modalLabel}>Дата и время занятия:</label>
              <input
                className={styles.modalInput}
                type="datetime-local"
                value={selectedDatetime}
                onChange={e => setSelectedDatetime(e.target.value)}
              />

              <div className={styles.modalButtons}>
                <button className={styles.startBtn} onClick={handleStartPoll}>
                  Запустить
                </button>
                <button className={styles.cancelBtn} onClick={() => setShowModal(false)}>
                  Отмена
                </button>
              </div>
            </div>
          </div>
        )}

      </main>
    </div>
  );
};

export default TeacherPolls;