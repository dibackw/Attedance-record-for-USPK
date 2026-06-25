import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../../ui/Sidebar/Sidebar';
import Header from '../../ui/Header/Header';
import styles from './MainTeacher.module.scss';

interface Group {
  id: string;
  name: string;
  course: number;
  educationForm: string;
  curatorId: string;
}

interface Student {
  id: string;
  groupId: string;
}

interface Discipline {
  id: string;
  name: string;
}

const MainTeacher = () => {
  const navigate = useNavigate();
  const [groups, setGroups] = useState<Group[]>([]);
  const [studentCounts, setStudentCounts] = useState<Record<string, number>>({});
  const [disciplines, setDisciplines] = useState<Discipline[]>([]);

  useEffect(() => {
    fetch('/api/groups')
      .then(res => res.json())
      .then((data: Group[]) => setGroups(data));

    fetch('/api/students')
      .then(res => res.json())
      .then((data: Student[]) => {
        const counts: Record<string, number> = {};
        data.forEach(s => {
          counts[s.groupId] = (counts[s.groupId] || 0) + 1;
        });
        setStudentCounts(counts);
      });

    fetch('/api/disciplines')
      .then(res => res.json())
      .then((data: Discipline[]) => setDisciplines(data));
  }, []);

  const handleOpenGroup = (groupId: string) => {
    navigate(`/tabel?groupId=${groupId}`);
  };

  return (
    <div className={styles.page}>
      <Sidebar role="teacher" />
      <main className={styles.content}>
        <Header role="teacher" />
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Мои группы</h2>
          <p className={styles.sectionSub}>Выберите группу для просмотра табеля посещаемости</p>
          <div className={styles.grid}>
            {groups.map(group => (
              <div key={group.id} className={styles.card}>
                <span className={styles.cardName}>{group.name}</span>
                <p className={styles.cardInfo}>Студентов: {studentCounts[group.id] ?? 0}</p>
                <p className={styles.cardInfo}>Дисциплин: {disciplines.length}</p>
                <button
                  className={styles.cardButton}
                  onClick={() => handleOpenGroup(group.id)}
                >
                  Открыть
                </button>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
};

export default MainTeacher;