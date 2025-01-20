import axios from '../api/axios';
import useAuth from './useAuth';

const useRefreshToken = () => {
    const { auth, setAuth } = useAuth();
    const refresh = async () => {
        const response = await axios.get('http://localhost:3050/auth/refresh', {
            withCredentials: true
        });
        console.log('RESP:', response);
        setAuth(prev => {
            console.log(JSON.stringify(prev));
            console.log(response.data.accessToken);
            return {
                ...prev,
                user: response.data.user,
                id: response.data.user.id,
                username: response.data.user.username,
                email: response.data.user.email,
                accessToken: response.data.accessToken
            }
        });
        return response.data.accessToken;
    }
    return refresh;
};

export default useRefreshToken;
