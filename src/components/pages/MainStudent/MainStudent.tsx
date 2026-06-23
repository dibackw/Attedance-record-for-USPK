// MainStudent.tsx — главная страница студента
// Здесь мы просто ИСПОЛЬЗУЕМ компонент Sidebar, не пишем его заново

import Sidebar from '../../ui/Sidebar/Sidebar'; // импортируем компонент
import styles from './MainStudent.module.scss';

const MainStudent = () => {
  return (
    // Общий контейнер страницы — весь экран
    <div className={styles.page}>

      {/* Подключаем боковую панель — просто пишем тег как HTML */}
      <Sidebar />

      {/* Основной контент страницы — справа от сайдбара */}
      <main className={styles.content}>
        {/* Здесь будет контент главной страницы студента */}
        {/* (таблица посещаемости, статистика, баннер опроса) */}
      </main>

    </div>
  );
};

export default MainStudent;