import { useEffect, useState } from 'react';
import { getUser, setAuth } from '../../../utils/auth';
import { generateToken } from '../../../services/authService';
import Sidebar from '../../ui/Sidebar/Sidebar';
import Header from '../../ui/Header/Header';
import styles from './ProfilePage.module.scss';
import mainStyles from '../MainStudent/MainStudent.module.scss';

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

const ProfilePage = () => {
  const user = getUser();
  const role = user?.role as 'student' | 'teacher' | 'headman';

  const [group, setGroup] = useState<Group | null>(null);
  const [curator, setCurator] = useState<Teacher | null>(null);
  const [headman, setHeadman] = useState<Student | null>(null);

  // Редактируемые поля
  const [login, setLogin] = useState(user?.login ?? '');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (!user?.groupId) return;

    fetch(`/api/groups/${user.groupId}`)
      .then(res => res.json())
      .then((g: Group) => {
        setGroup(g);
        fetch(`/api/teachers/${g.curatorId}`)
          .then(res => res.json())
          .then(setCurator);
      });

    fetch(`/api/students?groupId=${user.groupId}`)
      .then(res => res.json())
      .then((list: Student[]) => {
        const h = list.find(s => s.role === 'headman');
        setHeadman(h ?? null);
      });
  }, []);

  const handleSave = async () => {
    if (!user) return;

    // Обновляем логин в базе
    await fetch(`/api/students/${user.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        login,
        ...(password ? { password } : {})
      })
    });

    // Обновляем пользователя в localStorage
    setAuth({ ...user, login }, generateToken());
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className={mainStyles.page}>
      <Sidebar role={role} />
      <main className={mainStyles.content}>
        <Header role={role} pageTitle="Профиль" />

        <div className={styles.wrapper}>
          <table className={styles.table}>
            <tbody>

              {/* ФИО — только просмотр */}
              <tr>
                <td className={styles.label}>ФИО</td>
                <td className={styles.value}>{user?.fullName}</td>
              </tr>

                <tr>
                    <td className={styles.label}>Роль</td>
                    <td className={styles.value}>
                        {role === 'teacher' ? 'Преподаватель' 
                        : role === 'headman' ? 'Староста' 
                        : 'Студент'}
                    </td>
                </tr>

              {/* Группа — только просмотр */}
              {group && (
                <tr>
                  <td className={styles.label}>Группа</td>
                  <td className={styles.value}>{group.name}</td>
                </tr>
              )}

              {/* Курс — только просмотр */}
              {group && (
                <tr>
                  <td className={styles.label}>Курс</td>
                  <td className={styles.value}>{group.course}</td>
                </tr>
              )}

              {/* Куратор — только просмотр */}
              {curator && (
                <tr>
                  <td className={styles.label}>Куратор</td>
                  <td className={styles.value}>{curator.fullName}</td>
                </tr>
              )}

              {/* Староста — только просмотр */}
              {headman && (
                <tr>
                  <td className={styles.label}>Староста</td>
                  <td className={styles.value}>{headman.fullName}</td>
                </tr>
              )}

              {/* Логин — редактируемый */}
              <tr>
                <td className={styles.label}>Логин</td>
                <td className={styles.value}>
                  <input
                    className={styles.input}
                    value={login}
                    onChange={e => setLogin(e.target.value)}
                  />
                </td>
              </tr>

              {/* Пароль — редактируемый с глазиком */}
              <tr>
                <td className={styles.label}>Пароль</td>
                <td className={styles.value}>
                  <div className={styles.passwordRow}>
                    <input
                      className={styles.input}
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      placeholder="Новый пароль"
                      onChange={e => setPassword(e.target.value)}
                    />
                        <button
                            className={styles.eyeBtn}
                            onClick={() => setShowPassword(!showPassword)}
                            type="button"
                            >
                            {showPassword ? (
                                // Глаз закрытый
                                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#A2A2A2" strokeWidth="2">
                                <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
                                <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
                                <line x1="1" y1="1" x2="23" y2="23"/>
                                </svg>
                            ) : (
                                // Глаз открытый
                                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#A2A2A2" strokeWidth="2">
                                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                                <circle cx="12" cy="12" r="3"/>
                                </svg>
                            )}
                        </button>
                  </div>
                </td>
              </tr>

            </tbody>
          </table>

          <button className={styles.saveBtn} onClick={handleSave}>
            {saved ? 'Сохранено!' : 'Изменить данные'}
          </button>
        </div>

      </main>
    </div>
  );
};

export default ProfilePage;