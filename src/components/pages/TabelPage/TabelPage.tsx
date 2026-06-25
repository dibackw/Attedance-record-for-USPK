import { useEffect, useState } from 'react';
import { Navigate, useSearchParams } from 'react-router-dom';
import Sidebar from '../../ui/Sidebar/Sidebar';
import Header from '../../ui/Header/Header';
import styles from './TabelPage.module.scss';

interface Discipline {
  id: string;
  name: string;
}

interface Student {
  id: string;
  fullName: string;
  groupId: string;
}

interface Group {
  id: string;
  name: string;
}

interface AttendanceRecord {
  id: string;
  studentId: string;
  disciplineId: number;
  groupId: number;
  date: string;
  status: 'п' | 'н' | 'уп';
}

const STATUS_COLOR: Record<string, string> = {
  п: 'var(--IsPresent)',
  н: 'var(--therewasno)',
  уп: 'var(--ThereIsAReason)',
};

const TabelPage = () => {
  const [searchParams] = useSearchParams();
  const groupIdFromUrl = searchParams.get('groupId');

  const [groups, setGroups] = useState<Group[]>([]);
  const [disciplines, setDisciplines] = useState<Discipline[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [attendance, setAttendance] = useState<AttendanceRecord[]>([]);
  const [dates, setDates] = useState<string[]>([]);

  const [selectedGroup, setSelectedGroup] = useState<string>('');
  const [selectedDiscipline, setSelectedDiscipline] = useState<string>('');

  // Загрузка групп и дисциплин
  useEffect(() => {
    fetch('/api/groups')
      .then(res => res.json())
      .then(setGroups);

    fetch('/api/disciplines')
      .then(res => res.json())
      .then(setDisciplines);
  }, []);

  // Установка группы из URL
  useEffect(() => {
    if (groupIdFromUrl) {
      setSelectedGroup(groupIdFromUrl);
    }
  }, [groupIdFromUrl]);

  // Загрузка студентов при смене группы
  useEffect(() => {
    if (!selectedGroup) {
      setStudents([]);
      setAttendance([]);
      setDates([]);
      return;
    }
    fetch(`/api/students?groupId=${selectedGroup}`)
      .then(res => res.json())
      .then(setStudents);
  }, [selectedGroup]);

  // Загрузка посещаемости при смене группы или дисциплины
  useEffect(() => {
    if (!selectedGroup || !selectedDiscipline) {
      setAttendance([]);
      setDates([]);
      return;
    }
    fetch(`/api/attendance?groupId=${selectedGroup}&disciplineId=${selectedDiscipline}`,{ cache: "no-store"})
      .then(res => res.json())
      .then((data: AttendanceRecord[]) => {
        setAttendance(data);
        const uniqueDates = [...new Set(data.map(r => r.date))].sort();
        setDates(uniqueDates);
      });
  }, [selectedGroup, selectedDiscipline]);

  const getStatus = (studentId: string, date: string) => {
    return attendance.find(r => r.studentId === studentId && r.date === date)?.status ?? null;
  };

  const userRole = localStorage.getItem('role') as 'student' | 'teacher' | 'headman';
    if (userRole === 'student') {
      return <Navigate to="/student" replace />;
    }

  return (
    <div className={styles.page}>
      <Sidebar role={userRole} />
      <main className={styles.content}>
        <Header role={userRole} pageTitle="Табель посещаемости." />
        <section className={styles.section}>
          <div className={styles.toolbar}>
          

            <div className={styles.disciplineSelect}>
              <label>Группа:</label>
              <select
                value={selectedGroup}
                onChange={e => {
                  setSelectedGroup(e.target.value);
                  setSelectedDiscipline('');
                }}
              >
                <option value="">— не выбрано —</option>
                {groups.map(g => (
                  <option key={g.id} value={g.id}>{g.name}</option>
                ))}
              </select>
            </div>

            <div className={styles.disciplineSelect}>
              <label>Дисциплина:</label>
              <select
                value={selectedDiscipline}
                onChange={e => setSelectedDiscipline(e.target.value)}
                disabled={false}>
                <option value="">— не выбрано —</option>
                {disciplines.map(d => (
                  <option key={d.id} value={d.id}>{d.name}</option>
                ))}
              </select>
            </div>

            <button className={styles.exportBtn}>Экспорт в Word</button>
          </div>

          <div className={styles.tableWrapper}>
            {!selectedGroup || !selectedDiscipline ? (
              <p className={styles.empty}>
                {!selectedGroup
                  ? 'Выберите группу и дисциплину для просмотра табеля'
                  : 'Выберите дисциплину для просмотра табеля'}
              </p>
            ) : dates.length === 0 ? (
              <p className={styles.empty}>Нет данных по выбранной дисциплине</p>
            ) : (
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>Студент</th>
                    {dates.map(date => (
                      <th key={date}>{date}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {students.map(student => (
                    <tr key={student.id}>
                      <td>{student.fullName}</td>
                      {dates.map(date => {
                        const status = getStatus(student.id, date);
                        return (
                          <td
                            key={date}
                            style={{
                              color: status ? STATUS_COLOR[status] : 'var(--text2)',
                              textAlign: 'center',
                              fontWeight: 600,
                            }}
                          >
                            {status ?? '—'}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </section>
      </main>
    </div>
  );
};

export default TabelPage;