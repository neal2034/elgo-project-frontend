import { useNavigate } from 'react-router-dom';
import { ROUTE_PATH } from '@config/router/routePath';

export default function useNavigator() {
    const navigator = useNavigate();
    const goLogin = () => navigator(ROUTE_PATH.login);
    return { goLogin };
}
