import InputField from "../InputField";
import AuthButton from "../AuthButton";

export default function LoginForm({ username, setUsername, password, setPassword, onSubmit }) {
    return (
        <form onSubmit={onSubmit}>
            <InputField
                label="Логин"
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="username"
            />
            <InputField
                label="Пароль"
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
            />
            <AuthButton text="Вход" type="submit" />
        </form>
    );
}
