import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./login.module.scss";
import logoImg from "../../../assets/logo.jpg"; // путь поправь под структуру своего проекта
import Input from "../../ui/input/input";
import Button from "../../ui/button/button";
import { authenticateUser, generateToken } from "../../../services/authService";
import { setAuth } from "../../../utils/auth";

export function Login() {
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const user = await authenticateUser(login, password);

      if (!user) {
        setError("Неверный логин или пароль");
        return;
      }

      setAuth(user, generateToken());
      navigate(user.role === "teacher" ? "/teacher" : "/student");
    } catch (err) {
      console.error("РЕАЛЬНАЯ ОШИБКА:", err);
      setError("Не удалось подключиться к серверу. Запустите npm run dev");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.pageWrapper}>
      <form className={styles.authCard} onSubmit={handleSubmit}>
        {/* Первая "шапка": логотип + заголовки */}
        <div className={styles.headerTop}>
          <img src={logoImg} alt="Логотип УСПК" className={styles.logo} />
          <h1 className={styles.title}>Учет посещаемости УСПК</h1>
          <p className={styles.subtitle}>Войдите в систему для продолжения</p>
        </div>

        {/* Вторая "шапка": поля ввода + кнопка */}
        <div className={styles.headerBottom}>
          <Input
            type="text"
            placeholder="Логин"
            value={login}
            onChange={(e) => setLogin(e.target.value)}
          />
          <Input
            type="password"
            placeholder="Пароль"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          {error && <p className={styles.errorMessage}>{error}</p>}

          <Button type="submit" disabled={loading}>
            {loading ? "Загрузка..." : "Войти"}
          </Button>
        </div>
      </form>
    </div>
  );
}

export default Login;