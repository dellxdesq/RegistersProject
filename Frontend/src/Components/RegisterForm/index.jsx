import InputField from "../InputField";
import AuthButton from "../AuthButton";

export default function RegisterForm({
     email,
     setEmail,
     username,
     setUsername,
     password,
     setPassword,
     repeatPassword,
     setRepeatPassword,

     onSubmit,
 }) {
    return (
        <form onSubmit={onSubmit}>
            <InputField
                id="username"
                label="Логин"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="username"
            />
            <InputField
                id="email"
                label="Почта"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
            />
            <InputField
                id="password"
                label="Пароль"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
            />
            <InputField
                id="repeatPassword"
                label="Повтор пароля"
                type="password"
                value={repeatPassword}
                onChange={(e) => setRepeatPassword(e.target.value)}
                placeholder="••••••••"
            />
            <AuthButton text="Регистрация" type="submit" />
        </form>
    );
}
