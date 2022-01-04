import React, {Component, ReactElement, useEffect} from 'react';
import {Route, Routes, RouteProps} from 'react-router-dom';
import Dashboard from './pages/Dashboard'
import Layout from './pages/Layout'
import Login from './pages/Login'
import Reports from "./pages/Report/Reports";
import ReportDetail from "./pages/Report/ReportDetail";
import {isEmpty} from "lodash";

export interface INavigationProps {
    id: string,
    path: string,
    element: ReactElement|null,
    children?: INavigationProps[]
}

export type MainNavigationProps = {

}


const routes: INavigationProps[] = [
    {
        id: 'index',
        path: '/',
        element: <Dashboard/>
    },
    {
        id: 'login',
        path: 'login/',
        element: <Login/>
    },
    {
        id: 'reports',
        path: 'reports/',
        element: null,
        children: [
            {
                id: 'reports_list',
                path: '',
                element: <Reports/>
            },
            {
                id: 'report_detail',
                path: ':report_id',
                element: <ReportDetail/>
            },
        ]
    }
]


function MainNavigation(props: MainNavigationProps) {

    return (
        <>
            <Routes>
                <Route path={""} element={<Layout/>}>
                    {
                        routes.map((route) => {
                            if (isEmpty(route.children)) {
                                return (<Route path={route.path} element={route.element} key={route.id}/>)
                            } else {
                                return (<Route path={route.path} key={route.id}>
                                    {route.children?.map(childRoute => (
                                        <Route path={childRoute.path} element={childRoute.element} key={childRoute.id}/>
                                    ))}
                                </Route>)
                            }
                        })
                    }
                </Route>
            </Routes>
        </>
    );
}

export default MainNavigation;
