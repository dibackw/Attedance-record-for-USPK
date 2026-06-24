import { useEffect, useState } from 'react';
import { getUser } from '../../../utils/auth';
import styles from './Header.module.scss';
import personIcon from '../../../assets/person.svg';

const getInitials = (fullName: string): string => {
  const parts = fullName.trim().split(' ');
  if (parts.length < 3) return fullName;
  return `${parts[0]} ${parts[1][0]}. ${parts[2][0]}.`;
};

interface HeaderProps {
  role: 'student' | 'teacher' | 'headman';
  pageTitle?: string; // название раздела — необязательный пропс
}

const Header = ({ role, pageTitle }: HeaderProps) => {
  const user = getUser();
  const today = new Date().toLocaleDateString('ru-RU', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });
  const [groupName, setGroupName] = useState<string>('');

  useEffect(() => {
    if ((role === 'student' || role === 'headman') && user?.groupId) {
      fetch(`/api/groups/${user.groupId}`)
        .then(res => res.json())
        .then(group => setGroupName(group.name))
        .catch(() => setGroupName(''));
    }
  }, []);

  const roleLabel = role === 'teacher'
    ? 'Преподаватель'
    : role === 'headman'
    ? `Староста, группа ${groupName}`
    : `Студент, группа ${groupName}`;

  return (
    <header className={styles.header}>
      <div className={styles.welcome}>
        {/* Если есть pageTitle — показываем его, иначе приветствие */}
        {pageTitle ? (
          <>
            <h1 className={styles.welcomeTitle}>Посещаемость УСПК. {pageTitle}</h1>
            <p className={styles.welcomeSub}>{today}</p>
          </>
        ) : (
          <>
            <h1 className={styles.welcomeTitle}>
              Добро пожаловать, {user?.fullName}.
            </h1>
            <p className={styles.welcomeSub}>{today}</p>
          </>
        )}
      </div>

      <div className={styles.profile}>
        <div className={styles.profileInfo}>
          <span className={styles.profileName}>
            {user ? getInitials(user.fullName) : ''}
          </span>
          <span className={styles.profileRole}>{roleLabel}</span>
        </div>
        <img src={personIcon} alt="Профиль" className={styles.profileIcon} />
      </div>
    </header>
  );
};

export default Header;