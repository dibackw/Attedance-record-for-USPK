import styles from './Sidebar.module.scss';
import logo from '../../../assets/logo2F.jpg';
import { NavLink, useNavigate } from 'react-router-dom';
import { logout } from '../../../utils/auth';

// Пропсы — параметры которые передаём в компонент снаружи
interface SidebarProps {
  role: 'student' | 'teacher'; // роль определяет какие пункты показывать
}

const Sidebar = ({ role }: SidebarProps) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <aside className={styles.sidebar}>

      {/* Логотип */}
      <div className={styles.logoBlock}>
        <img src={logo} alt="Логотип УСПК" className={styles.logo} />
      </div>

      {/* Главная — одинакова для всех */}
      <NavLink
        to="/"
        className={styles.mainHeading}
      >
        Главная
      </NavLink>

      {/* Навигационное меню — разное для студента и преподавателя */}
      <nav className={styles.navBlock}>

        {role === 'student' && (
          <>
            <NavLink to="/attendance" className={({ isActive }) =>
              isActive ? `${styles.navItem} ${styles.active}` : styles.navItem
            }>
              Моя посещаемость
            </NavLink>

            <NavLink to="/surveys" className={({ isActive }) =>
              isActive ? `${styles.navItem} ${styles.active}` : styles.navItem
            }>
              Опросы
            </NavLink>

            <NavLink to="/profile" className={({ isActive }) =>
              isActive ? `${styles.navItem} ${styles.active}` : styles.navItem
            }>
              Профиль
            </NavLink>
          </>
        )}

        {role === 'teacher' && (
          <>
            <NavLink to="/groups" className={({ isActive }) =>
              isActive ? `${styles.navItem} ${styles.active}` : styles.navItem
            }>
              Группы
            </NavLink>

            <NavLink to="/surveys" className={({ isActive }) =>
              isActive ? `${styles.navItem} ${styles.active}` : styles.navItem
            }>
              Опросы
            </NavLink>

            <NavLink to="/tabel" className={({ isActive }) =>
              isActive ? `${styles.navItem} ${styles.active}` : styles.navItem
            }>
              Табели
            </NavLink>

            <NavLink to="/reports" className={({ isActive }) =>
              isActive ? `${styles.navItem} ${styles.active}` : styles.navItem
            }>
              Отчеты
            </NavLink>

            <NavLink to="/profile" className={({ isActive }) =>
              isActive ? `${styles.navItem} ${styles.active}` : styles.navItem
            }>
              Профиль
            </NavLink>
          </>
        )}

        <button onClick={handleLogout} className={styles.navItem}>
          Выход
        </button>

      </nav>
    </aside>
  );
};

export default Sidebar;