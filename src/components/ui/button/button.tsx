import styles from "./button.module.scss";

interface ButtonProps {
  children: React.ReactNode;
  type?: "button" | "submit";
  onClick?: () => void;
  disabled?: boolean;
}

export default function Button({ children, type = "button", onClick, disabled = false }: ButtonProps) {
  return (
    <button type={type} onClick={onClick} disabled={disabled} className={styles.submitButton}>
      {children}
    </button>
  );
}