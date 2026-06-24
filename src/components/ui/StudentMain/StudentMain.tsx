import styles from './StudentMain.module.scss';

// Тип для одной строки таблицы посещаемости
interface AttendanceRow {
  date: string;
  discipline: string;
  mark: string; // "П" или "Н"
}

// Тип для статистики
interface Stats {
  total: number;
  missed: number;
  attended: number;
  percentage: string;
}

// Пропсы компонента
interface StudentMainProps {
  attendance: AttendanceRow[];
  stats: Stats;
  hasPoll: boolean; // есть ли активный опрос
}

const StudentMain = ({ attendance, stats, hasPoll }: StudentMainProps) => {
  return (
    <div className={styles.wrapper}>

      {/* ===== Шапка "Моя посещаемость" ===== */}
      <div className={styles.titleBlock}>
        <h2 className={styles.title}>Моя посещаемость</h2>
      </div>

      {/* ===== Блок с таблицей и статистикой ===== */}
      <div className={styles.mainBlock}>

        {/* Таблица посещаемости */}
        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th className={styles.th}>Дата</th>
                <th className={styles.th}>Дисциплина</th>
                <th className={styles.th}>Отметка</th>
              </tr>
            </thead>
            <tbody>
              {attendance.map((row, i) => (
                <tr key={i}>
                  <td className={styles.td}>{row.date}</td>
                  <td className={styles.td}>{row.discipline}</td>
                  <td className={styles.td}>{row.mark}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Статистика */}
        <div className={styles.statsWrapper}>
          <h3 className={styles.statsTitle}>Статистика</h3>
          <div className={styles.statsGrid}>
            <div className={styles.statLabel}>Всего занятий</div>
            <div className={styles.statValue}>{stats.total}</div>

            <div className={styles.statLabel}>Пропущено</div>
            <div className={styles.statValue}>{stats.missed}</div>

            <div className={styles.statLabel}>Посещено</div>
            <div className={styles.statValue}>{stats.attended}</div>

            <div className={styles.statLabel}>Посещаемость</div>
            <div className={`${styles.statValue} ${styles.statValueGreen}`}>
              {stats.percentage}
            </div>
          </div>
        </div>

      </div>

      {/* ===== Баннер опроса ===== */}
      <div className={styles.pollBlock}>
        <div className={styles.pollBanner}>
          {hasPoll ? (
            <p className={styles.pollActive}>Активный опрос!</p>
          ) : (
            <>
              <p className={styles.pollTitle}>Активного опроса нет</p>
              <p className={styles.pollSub}>
                Когда преподаватель запустит опрос, здесь появится кнопка отметки присутствия.
              </p>
            </>
          )}
        </div>
      </div>

    </div>
  );
};

export default StudentMain;