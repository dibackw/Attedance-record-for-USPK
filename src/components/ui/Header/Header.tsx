import { useEffect, useState } from 'react';
import { getUser } from '../../../utils/auth';
import styles from './Header.module.scss';
import personIcon from '../../../assets/person.svg';

// Функция: "Кузнецов Артём Александрович" → "Кузнецов А. А."
const getInitials = (fullName: string): string => {
  const parts = fullName.trim().split(' ');
  if (parts.length < 3) return fullName;
  return `${parts[0]} ${parts[1][0]}. ${parts[2][0]}.`;
};

interface HeaderProps {
  role: 'student' | 'teacher';
}

const Header = ({ role }: HeaderProps) => {
  const user = getUser();
  const [groupName, setGroupName] = useState<string>('');

  useEffect(() => {
    // Группу запрашиваем только для студента
    if (role === 'student' && user?.groupId) {
      fetch(`/api/groups/${user.groupId}`)
        .then(res => res.json())
        .then(group => setGroupName(group.name))
        .catch(() => setGroupName(''));
    }
  }, []);

  // Подпись под именем — разная для студента и преподавателя
  const subText = role === 'student'
    ? `Студент, группа ${groupName}`
    : 'Преподаватель';

  const roleLabel = role === 'student' ? 'Студент' : 'Преподаватель';

  return (
    <header className={styles.header}>

      {/* Левая часть — приветствие */}
      <div className={styles.welcome}>
        <h1 className={styles.welcomeTitle}>
          Добро пожаловать, {user?.fullName}.
        </h1>
        <p className={styles.welcomeSub}>
          {subText}
        </p>
      </div>

      {/* Правая часть — инициалы + иконка */}
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