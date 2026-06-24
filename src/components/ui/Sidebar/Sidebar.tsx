import styles from './Sidebar.module.scss';
import logo from '../../../assets/logo2F.jpg';
import { NavLink, useNavigate } from 'react-router-dom';
import { logout } from '../../../utils/auth';

interface SidebarProps {
  role: 'student' | 'teacher' | 'headman';
}

const Sidebar = ({ role }: SidebarProps) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Определяем путь главной по роли
const homePath = role === 'teacher' ? '/teacher' 
: role === 'headman' ? '/headman' 
: '/student';

  // Каждый пункт — отдельный блок со своим фоном
  const navClass = ({ isActive }: { isActive: boolean }) =>
    isActive ? styles.navItemActive : styles.navItemDefault;

  return (
    <aside className={styles.sidebar}>

      {/* Логотип */}
      <div className={styles.logoBlock}>
        <img src={logo} alt="Логотип УСПК" className={styles.logo} />
      </div>

      {/* Главная */}
      <NavLink to={homePath} className={navClass}>
        Главная
      </NavLink>

      {/* Студент */}
      {role === 'student' && (
        <>
          <NavLink to="/mygroup" className={navClass}>Моя группа</NavLink>
          <NavLink to="/surveys" className={navClass}>Опросы</NavLink>
          <NavLink to="/profile" className={navClass}>Профиль</NavLink>
        </>
      )}

      {/* Преподаватель */}
      {role === 'teacher' && (
        <>
          <NavLink to="/groups" className={navClass}>Группы</NavLink>
          <NavLink to="/surveys" className={navClass}>Опросы</NavLink>
          <NavLink to="/tabel" className={navClass}>Табели</NavLink>
          <NavLink to="/reports" className={navClass}>Отчеты</NavLink>
          <NavLink to="/profile" className={navClass}>Профиль</NavLink>
        </>
      )}

      {/* Староста */}
      {role === 'headman' && (
        <>
          <NavLink to="/mygroup" className={navClass}>Моя группа</NavLink>
          <NavLink to="/surveys" className={navClass}>Опросы</NavLink>
          <NavLink to="/tabel" className={navClass}>Табели</NavLink>
          <NavLink to="/reports" className={navClass}>Отчеты</NavLink>
          <NavLink to="/profile" className={navClass}>Профиль</NavLink>
        </>
      )}

      {/* Выход */}
      <button onClick={handleLogout} className={styles.navItemDefault}>
        Выход
      </button>

    </aside>
  );
};

export default Sidebar;