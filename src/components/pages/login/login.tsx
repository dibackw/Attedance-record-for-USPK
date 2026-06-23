import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./login.module.scss";
import logoImg from "../../../assets/logo.jpg"; // путь поправь под структуру своего проекта
import Input from "../../ui/input/input";
import Button from "../../ui/button/button";
import { login as loginUser } from "../../utils/auth"; // путь поправь под структуру своего проекта

export function Login() {
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!login || !password) {
      setError("Заполните логин и пароль");
      return;
    }

    setLoading(true);

    // Имитация запроса на сервер: сервера пока нет,
    // поэтому "грузимся" 800мс и потом проверяем локально.
    // Когда появится backend — замени этот setTimeout на настоящий fetch/axios.
    setTimeout(() => {
      const role = loginUser(login, password);
      setLoading(false);

      if (!role) {
        setError("Неверный логин или пароль");
        return;
      }

      navigate(role === "teacher" ? "/teacher" : "/student");
    }, 800);
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