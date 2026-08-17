import { useContext, useEffect } from "react";
import { AuthContext } from "../services/auth.context";
import {
    login,
    register,
    logout,
    getMe,
} from "../services/auth.api";

export const useAuth = () => {
    const context = useContext(AuthContext);

    const {
        user,
        setUser,
        loading,
        setLoading,
    } = context;

    const handleLogin = async ({ email, password }) => {
        setLoading(true);

        try {
            const data = await login({
                email,
                password,
            });

            setUser(data.user);

            return true;
        } catch (err) {
            console.log("Login failed:", err);
            return false;
        } finally {
            setLoading(false);
        }
    };

    const handleRegister = async ({
        username,
        email,
        password,
    }) => {
        setLoading(true);

        try {
            const data = await register({
                username,
                email,
                password,
            });

            setUser(data.user);

            return true;
        } catch (err) {
            console.log("Registration failed:", err);
            return false;
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = async () => {
        setLoading(true);

        try {
            await logout();
            setUser(null);
        } catch (err) {
            console.log("Logout failed:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const getAndSetUser = async () => {
            try {
                const data = await getMe();

                if (data?.user) {
                    setUser(data.user);
                }
            } catch (err) {
                console.log("No authenticated user:", err);
                setUser(null);
            } finally {
                setLoading(false);
            }
        };

        getAndSetUser();
    }, [setUser, setLoading]);

    return {
        user,
        loading,
        handleRegister,
        handleLogin,
        handleLogout,
    };
};