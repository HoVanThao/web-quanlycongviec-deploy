import Wrapper from '../assets/wrappers/Dashboard';
import { Navbar, BigSidebar, SmallSidebar, Loading } from '../components';
import { useState, createContext, useContext } from 'react';
import { Outlet, redirect, useNavigate, useNavigation } from 'react-router-dom';
import customFetch from '../utils/customFetch';
import { toast } from 'react-toastify';
import { useQuery } from '@tanstack/react-query';


const userQuery = {
    queryKey: ['user'],
    queryFn: async () => {
        const { data } = await customFetch('/users/current-user');
        return data;
    },
};

export const loader = (queryClient) => async () => {
    try {
        return await queryClient.ensureQueryData(userQuery);
    } catch (error) {
        return redirect('/');
    }
};



const DashboardContext = createContext();

const DashboardLayout = ({ isDarkThemeEnabled, queryClient }) => {
    const { user } = useQuery(userQuery)?.data;
    const navigation = useNavigation();
    const isPageLoading = navigation.state === 'loading';

    const [showSidebar, setShowSidebar] = useState(false);
    const [isDarkTheme, setIsDarkTheme] = useState(isDarkThemeEnabled);

    const navigate = useNavigate();

    const toggleDarkTheme = () => {
        const newDarkTheme = !isDarkTheme;
        setIsDarkTheme(newDarkTheme);
        document.body.classList.toggle('dark-theme', newDarkTheme);
        localStorage.setItem('darkTheme', newDarkTheme);
    };

    const toggleSidebar = () => {
        setShowSidebar(!showSidebar);
    };


    const logoutUser = async () => {
        navigate('/');
        await customFetch.get('/auth/logout');
        queryClient.invalidateQueries();
        toast.success('Đăng xuất thành công');
    };

    return (
        <DashboardContext.Provider
            value={{
                user,
                showSidebar,
                isDarkTheme,
                toggleDarkTheme,
                toggleSidebar,
                logoutUser,
            }}
        >
            <Wrapper>
                <main className='dashboard'>
                    <SmallSidebar />
                    <BigSidebar />
                    <div>
                        <Navbar />
                        <div className='dashboard-page'>
                            {/* <Loading /> */}
                            {isPageLoading ? <Loading /> : <Outlet context={{ user }} />}
                        </div>
                    </div>
                </main>
            </Wrapper>
        </DashboardContext.Provider>
    );
};

export const useDashboardContext = () => useContext(DashboardContext);

export default DashboardLayout;