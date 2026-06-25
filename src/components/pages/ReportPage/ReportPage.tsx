import { useEffect, useState } from 'react';
import { getUser } from '../../../utils/auth';
import Sidebar from '../../ui/Sidebar/Sidebar';
import Header from '../../ui/Header/Header';
import styles from './ReportPage.module.scss';
import mainStyles from '../MainStudent/MainStudent.module.scss';

interface Student { id: string; fullName: string; groupId: number; }
interface Discipline { id: number; name: string; }
interface AttendanceRecord {
  id: string;
  studentId: string;
  disciplineId: number;
  groupId: number;
  date: string;
  status: string;
}
interface ReportRow {
  fullName: string;
  date: string;
  status: string;
  discipline: string;
}

const ReportsPage = () => {
  const user = getUser();
  const role = user?.role as 'teacher' | 'headman';

  const [disciplines, setDisciplines] = useState<Discipline[]>([]);
  const [selectedDiscipline, setSelectedDiscipline] = useState('');
  const [period, setPeriod] = useState<'day' | 'week' | 'month'>('month');
  const [rows, setRows] = useState<ReportRow[]>([]);
  const [generated, setGenerated] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState('');
  const [groups, setGroups] = useState<{id: number; name: string}[]>([]);

  // Модальное окно экспорта
  const [showExportModal, setShowExportModal] = useState(false);
  const [exportDiscipline, setExportDiscipline] = useState('');
  const [exportDateFrom, setExportDateFrom] = useState('');
  const [exportDateTo, setExportDateTo] = useState('');

  useEffect(() => {
    fetch('/api/disciplines').then(r => r.json()).then(setDisciplines);
    fetch('/api/groups').then(r => r.json()).then(setGroups); // ← добавь
  }, []);

  const getDateRange = () => {
    const now = new Date();
    const to = new Date(now);
    to.setHours(23, 59, 59); // конец сегодняшнего дня
    const from = new Date(now);
    if (period === 'day') from.setDate(now.getDate() - 1);
    else if (period === 'week') from.setDate(now.getDate() - 7);
    else from.setMonth(now.getMonth() - 1);
    from.setHours(0, 0, 0);
    return { from, to };
  };

  const parseDate = (str: string) => {
    if (!str) return new Date(0); // если дата пустая — возвращаем очень старую дату
    const [datePart] = str.split(' ');
    if (!datePart) return new Date(0);
    const parts = datePart.split('.');
    if (parts.length < 3) return new Date(0);
    return new Date(Number(parts[2]), Number(parts[1]) - 1, Number(parts[0]));
  };

  const handleGenerate = async () => {
    const { from, to } = getDateRange();

    // Получаем посещаемость
    const attendance: AttendanceRecord[] = await fetch('/api/attendance')
      .then(r => r.json());

    // Получаем студентов группы (для старосты — своя группа, для препода — все)
    const students: Student[] = await fetch('/api/students').then(r => r.json());

    const filtered = attendance.filter(a => {
      const date = parseDate(a.date);
      const inPeriod = date >= from && date <= to;
      const byDiscipline = selectedDiscipline
        ? String(a.disciplineId) === selectedDiscipline
        : true;
        const byGroup = role === 'headman'
        ? String(a.groupId) === String(user?.groupId)
        : selectedGroup
          ? String(a.groupId) === selectedGroup  // ← для препода
          : true;
      return inPeriod && byDiscipline && byGroup;
    });

    const result: ReportRow[] = filtered.map(a => {
        const student = students.find(s => s.id === a.studentId);
        const disc = disciplines.find(d => String(d.id) === String(a.disciplineId));
        return {
          fullName: student?.fullName ?? '—',
          date: a.date,
          status: a.status,
          discipline: disc?.name ?? '—', // ← добавь эту строку
        };
      });

    setRows(result);
    setGenerated(true);
  };

  const handleExport = () => {
    if (rows.length === 0) return;

    // Генерируем простой текстовый файл (имитация Word)
    const discName = disciplines.find(d => String(d.id) === exportDiscipline)?.name ?? 'Все дисциплины';
    let content = `Отчёт посещаемости\n`;
    content += `Дисциплина: ${discName}\n`;
    content += `Период: с ${exportDateFrom} по ${exportDateTo}\n\n`;
    content += `ФИО студента\t\tДата и время\t\tОтметка\n`;
    content += `${'─'.repeat(60)}\n`;
    rows.forEach(r => {
      content += `${r.fullName}\t\t${r.date}\t\t${r.status}\n`;
    });

    const blob = new Blob([content], { type: 'application/msword' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
        a.href = url;
        a.download = `Отчёт_${discName}_${exportDateFrom}-${exportDateTo}.doc`;
        a.click();
        URL.revokeObjectURL(url);
        setShowExportModal(false);
    };
    const getMarkColor = (mark: string) => {
        if (mark === 'п') return styles.markGreen;
        if (mark === 'н') return styles.markRed;
        return styles.markOrange;
    };
  return (
    <div className={mainStyles.page}>
      <Sidebar role={role} />
      <main className={mainStyles.content}>
        <Header role={role} pageTitle="Отчеты" />

        <div className={styles.wrapper}>

          {/* Фильтры */}
          <div className={styles.filters}>
            <div className={styles.filterGroup}>
              <label className={styles.filterLabel}>Дисциплина:</label>
              <select
                className={styles.select}
                value={selectedDiscipline}
                onChange={e => setSelectedDiscipline(e.target.value)}
              >
                <option value="">Все дисциплины</option>
                {disciplines.map(d => (
                  <option key={d.id} value={d.id}>{d.name}</option>
                ))}
              </select>
            </div>

            <div className={styles.filterGroup}>
              <label className={styles.filterLabel}>Период:</label>
              <select
                className={styles.select}
                value={period}
                onChange={e => setPeriod(e.target.value as 'day' | 'week' | 'month')}
              >
                <option value="day">Однодневный</option>
                <option value="week">Недельный</option>
                <option value="month">Месячный</option>
              </select>
            </div>
            {role === 'teacher' && (
            <div className={styles.filterGroup}>
                <label className={styles.filterLabel}>Группа:</label>
                <select
                className={styles.select}
                value={selectedGroup}
                onChange={e => setSelectedGroup(e.target.value)}
                >
                <option value="">Все группы</option>
                {groups.map(g => (
                    <option key={g.id} value={g.id}>{g.name}</option>
                ))}
                </select>
            </div>
            )}

            <button className={styles.generateBtn} onClick={handleGenerate}>
              Сформировать отчёт
            </button>

            <button
              className={styles.exportBtn}
              onClick={() => setShowExportModal(true)}
              disabled={!generated}
            >
              Экспорт в Word
            </button>
          </div>

          {/* Таблица результатов */}
          {generated && (
            rows.length > 0 ? (
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th className={styles.th}>ФИО студента</th>
                    <th className={styles.th}>Дата и время занятия</th>
                    <th className={styles.th}>Отметка</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((r, i) => (
                    <tr key={i}>
                      <td className={styles.td}>{r.fullName}</td>
                      <td className={styles.td}>{r.date}</td>
                      <td className={`${styles.td} ${getMarkColor(r.status)}`}>
                        {r.status}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p className={styles.noData}>Нет данных за выбранный период.</p>
            )
          )}

        </div>

        {/* Модальное окно экспорта */}
        {showExportModal && (
          <div className={styles.modalOverlay}>
            <div className={styles.modal}>
              <div className={styles.modalHeader}>
                <h3 className={styles.modalTitle}>Экспорт табеля в Word</h3>
                <button className={styles.closeBtn} onClick={() => setShowExportModal(false)}>✕</button>
              </div>

              <label className={styles.modalLabel}>Дисциплина:</label>
              <select
                className={styles.modalInput}
                value={exportDiscipline}
                onChange={e => setExportDiscipline(e.target.value)}
              >
                <option value="">Все дисциплины</option>
                {disciplines.map(d => (
                  <option key={d.id} value={d.id}>{d.name}</option>
                ))}
              </select>

              <label className={styles.modalLabel}>Период:</label>
              <div className={styles.periodRow}><span className={styles.periodLabel}>с</span>
                <input
                  className={styles.modalInputSmall}
                  type="date"
                  value={exportDateFrom}
                  onChange={e => setExportDateFrom(e.target.value)}
                />
                <span className={styles.periodLabel}>по</span>
                <input
                  className={styles.modalInputSmall}
                  type="date"
                  value={exportDateTo}
                  onChange={e => setExportDateTo(e.target.value)}
                />
              </div>

              <div className={styles.modalButtons}>
                <button className={styles.generateBtn} onClick={handleExport}>
                  Экспорт в Word
                </button>
                <button className={styles.cancelBtn} onClick={() => setShowExportModal(false)}>
                  Отмена
                </button>
              </div>
            </div>
          </div>
        )}

      </main>
    </div>
  );
};

export default ReportsPage;