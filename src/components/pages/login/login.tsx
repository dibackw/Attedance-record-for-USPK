import { useState } from 'react'
import styles from './login.module.scss'

export const Login = () => {
  const [login, setLogin] = useState('')
  const [password, setPassword] = useState('')

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <img
          src="/logo.svg"
          alt="Логотип"
          className={styles.logo}
        />

        <div className={styles.titleBlock}>
          <h1>Учет посещаемости УСПК</h1>
          <p>Войдите в систему для продолжения</p>
        </div>

        <div className={styles.formFields}>
          <input
            type="text"
            placeholder="Логин"
            value={login}
            onChange={(e) => setLogin(e.target.value)}
          />

          <input
            type="password"
            placeholder="Пароль"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <button>Войти</button>
      </div>
    </div>
  )
}

export default Login