import { useEffect, useState } from 'react';
import { getUser } from '../../../utils/auth';
import styles from './MyGroup.module.scss';

interface Group {
  id: number;
  name: string;
  course: number;
  educationForm: string;
  curatorId: string;
}

interface Teacher {
  id: string;
  fullName: string;
}

interface Student {
  id: string;
  fullName: string;
  groupId: number;
  role?: string;
}

const MyGroup = () => {
  const user = getUser();
  const isHeadman = user?.role === 'headman';
  const [group, setGroup] = useState<Group | null>(null);
  const [curator, setCurator] = useState<Teacher | null>(null);
  const [students, setStudents] = useState<Student[]>([]);
  const [headman, setHeadman] = useState<Student | null>(null);

  useEffect(() => {
    if (!user?.groupId) return;

    // Загружаем группу
    fetch(`/api/groups/${user.groupId}`)
      .then(res => res.json())
      .then((g: Group) => {
        setGroup(g);

        // Загружаем куратора
        fetch(`/api/teachers/${g.curatorId}`)
          .then(res => res.json())
          .then(setCurator);
      });

    // Загружаем студентов группы
    fetch(`/api/students?groupId=${user.groupId}`)
      .then(res => res.json())
      .then((list: Student[]) => {
        setStudents(list.sort((a, b) => a.fullName.localeCompare(b.fullName, 'ru')));
        const h = list.find(s => s.role === 'headman');
        setHeadman(h ?? null);
      });
  }, []);

  return (
    <div className={styles.wrapper}>

      {/* Шапка */}
      <div className={styles.titleBlock}>
        <h2 className={styles.title}>Группа {group?.name}</h2>
      </div>

      {/* Блок информации о группе */}
      <div className={styles.infoBlock}>
        <div className={styles.infoCell}>
          <span className={styles.infoLabel}>Куратор</span>
          <span className={styles.infoValue}>{curator?.fullName}</span>
        </div>
        <div className={styles.infoCell}>
          <span className={styles.infoLabel}>Староста</span>
          <span className={styles.infoValue}>{headman?.fullName ?? '—'}</span>
        </div>
        <div className={styles.infoCell}>
          <span className={styles.infoLabel}>Курс</span>
          <span className={styles.infoValue}>{group?.course}</span>
        </div>
        <div className={styles.infoCell}>
          <span className={styles.infoLabel}>Всего студентов</span>
          <span className={styles.infoValue}>{students.length}</span>
        </div>
        <div className={styles.infoCell}>
          <span className={styles.infoLabel}>Форма обучения</span>
          <span className={styles.infoValue}>{group?.educationForm}</span>
        </div>
        <div className={styles.infoCell}>
            <span className={styles.infoLabel}>Являюсь старостой</span>
            <span className={`${styles.infoValue} ${isHeadman ? styles.greenValue : ''}`}>
                {isHeadman ? 'Да' : 'Нет'}
            </span>
        </div>
      </div>

      {/* Список студентов */}
      <div className={styles.titleBlock}>
        <h2 className={styles.title}>Список студентов группы</h2>
      </div>

      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th className={styles.th}>№</th>
              <th className={styles.th}>ФИО</th>
              <th className={styles.th}>Роль</th>
            </tr>
          </thead>
          <tbody>
            {students.map((s, i) => (
              <tr key={s.id}>
                <td className={styles.td}>{i + 1}</td>
                <td className={styles.td}>{s.fullName}</td>
                <td className={styles.td}>
                  {s.role === 'headman' ? 'Староста' : 'Студент'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  );
};

export default MyGroup;