import styles from './Sidebar.module.scss';
import logo from '../../../assets/logo2F.jpg';
import { NavLink, useNavigate } from 'react-router-dom';
import { logout } from '../../../utils/auth';

const Sidebar = () => {
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

      {/* Главная — активный пункт */}
      <NavLink
        to="/"
        className={styles.mainHeading}
        >
        Главная
      </NavLink>

      {/* Навигационное меню */}
      <nav className={styles.navBlock}>
        <NavLink
          to="/attendance"
          className={({ isActive }) =>
            isActive ? `${styles.navItem} ${styles.active}` : styles.navItem
          }
        >
          Моя посещаемость
        </NavLink>

        <NavLink
          to="/surveys"
          className={({ isActive }) =>
            isActive ? `${styles.navItem} ${styles.active}` : styles.navItem
          }
        >
          Опросы
        </NavLink>

        <NavLink
          to="/profile"
          className={({ isActive }) =>
            isActive ? `${styles.navItem} ${styles.active}` : styles.navItem
          }
        >
          Профиль
        </NavLink>

        {/* Выход — не ссылка, а кнопка */}
        <button onClick={handleLogout} className={styles.navItem}>
          Выход
        </button>
      </nav>

    </aside>
  );
};

export default Sidebar;