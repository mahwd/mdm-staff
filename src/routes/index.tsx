import React, {Component, ReactElement, useEffect} from 'react';
import {Route, Routes, RouteProps} from 'react-router-dom';
import Dashboard from './pages/Dashboard'
import Layout from './pages/Layout'
import Login from './pages/Login'
import Reports from "./pages/Report/Reports";
import AddReport from "./pages/Report/AddReport";

export interface INavigationProps {

}


const routes: RouteProps[] = [
    {
        path: '/',
        element: <Dashboard/>
    },
    {
        path: 'login/',
        element: <Login/>
    },
    {
        path: 'reports/',
        element: <Reports/>
    },
    {
        path: 'reports/{report_id}',
        element: <AddReport/>
    }
]


function MainNavigation(props: INavigationProps) {

    return (
        <>
            <Routes>
                <Route path={""} element={<Layout/>}>
                    {
                        routes.map((route, index) => {
                            return (<Route path={route.path} element={route.element} key={index}/>)
                        })
                    }
                </Route>
            </Routes>
        </>
    );
}

export default MainNavigation;
