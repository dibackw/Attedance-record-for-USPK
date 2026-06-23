import { useEffect, useState } from 'react';
import { getUser } from '../../../utils/auth';
import styles from './Header.module.scss';
import personIcon from '../../../assets/person.svg';

// Функция для сокращения ФИО: "Кузнецов Артём Александрович" → "Кузнецов А. А."
const getInitials = (fullName: string): string => {
  const parts = fullName.trim().split(' ');
  if (parts.length < 3) return fullName;
  return `${parts[0]} ${parts[1][0]}. ${parts[2][0]}.`;
};

const Header = () => {
  const user = getUser(); // берём пользователя из localStorage
  const [groupName, setGroupName] = useState<string>('');

  useEffect(() => {
    // Запрашиваем название группы по groupId
    if (user?.groupId) {
      fetch(`/api/groups/${user.groupId}`)
        .then(res => res.json())
        .then(group => setGroupName(group.name))
        .catch(() => setGroupName(''));
    }
  }, []);

  return (
    <header className={styles.header}>

      {/* Левая часть — приветствие */}
      <div className={styles.welcome}>
        <h1 className={styles.welcomeTitle}>
          Добро пожаловать, {user?.fullName}.
        </h1>
        <p className={styles.welcomeSub}>
          Студент, группа {groupName}
        </p>
      </div>

      {/* Правая часть — инициалы + иконка */}
      <div className={styles.profile}>
        <div className={styles.profileInfo}>
          <span className={styles.profileName}>
            {user ? getInitials(user.fullName) : ''}
          </span>
          <span className={styles.profileRole}>Студент</span>
        </div>
        {/* Иконка пользователя SVG */}
        <img src={personIcon} alt="Профиль" className={styles.profileIcon} />
      </div>

    </header>
  );
};

export default Header;