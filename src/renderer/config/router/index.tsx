import React, { ElementType, Suspense, lazy } from 'react';
import { Navigate, useRoutes } from 'react-router-dom';
import { AccountPageStatus } from '@pages/account/account';

const Loadable = (Component: ElementType) => (props: any) =>
    (
        <Suspense fallback={<div>Loading....</div>}>
            <Component {...props} />
        </Suspense>
    );
const AppLayout = Loadable(lazy(() => import('@components/layout/app/AppLayout')));
const Account = Loadable(lazy(() => import('@pages/account/account')));
const HomeContent = Loadable(lazy(() => import('@pages/home-page/home-conetnt/home-content')));
const HomePage = Loadable(lazy(() => import('@pages/home-page/home-page')));
const ElgoAbout = Loadable(lazy(() => import('@pages/home-page/about/about')));
const ElgoBlog = Loadable(lazy(() => import('@pages/home-page/blog/blog')));
const AppDownload = Loadable(lazy(() => import('@pages/home-page/app-download/app-download')));
const Signup = Loadable(lazy(() => import('@pages/signup/signup')));
const ProjectCenter = Loadable(lazy(() => import('@pages/project-center/project-center')));
const MyTask = Loadable(lazy(() => import('@pages/my-task/my-task')));

const MyBugs = Loadable(lazy(() => import('@pages/my-bugs/my-bugs')));
const OrgMembers = Loadable(lazy(() => import('@pages/org-members/org-members')));
const PrivateRoute = Loadable(lazy(() => import('@components/common/private-route/private-route')));
const ProjectHome = Loadable(lazy(() => import('@pages/project-home/project-home')));
const PageNotFound = Loadable(lazy(() => import('@components/pages/PageNotFound')));
const Task = Loadable(lazy(() => import('@pages/task/task')));
const Requirement = Loadable(lazy(() => import('@pages/funztion/funztion')));
const Funztion = Loadable(lazy(() => import('@pages/funztion/funztion')));
const Api = Loadable(lazy(() => import('@pages/api/api')));
const Bug = Loadable(lazy(() => import('@pages/bug/bug')));
const TestCase = Loadable(lazy(() => import('@pages/case/test-case')));
const TestPlan = Loadable(lazy(() => import('@pages/test-plan/test-plan')));
const ProjectSetting = Loadable(lazy(() => import('@pages/project-setting/project-setting')));
const MemberSetting = Loadable(lazy(() => import('@pages/project-setting/member-setting/member-setting')));
const TagSetting = Loadable(lazy(() => import('@pages/project-setting/tag-setting/tag-setting')));
const ReqSourceSetting = Loadable(lazy(() => import('@pages/project-setting/req-source-setting/pro-req-source-setting')));
const VersionSetting = Loadable(lazy(() => import('@pages/project-setting/version-setting/version-setting')));

export default function ElgoRouters() {
    // 若为桌面端则直接进入登录
    const isElectron = process.env.RUN_ENV === 'pc';
    const homePath = isElectron ? '/account' : '/home';

    return useRoutes([
        { path: '/', children: [{ index: true, element: <Navigate to={homePath} /> }] },
        { path: '/signup', element: <Signup /> },
        { path: '/account', element: <Account status={AccountPageStatus.LOGIN} /> },
        {
            path: '/app',
            element: (
                <PrivateRoute>
                    <AppLayout />
                </PrivateRoute>
            ),
            children: [
                { path: 'project-center', element: <ProjectCenter /> },
                { path: 'my-bug', element: <MyBugs /> },
                { path: 'my-task', element: <MyTask /> },
                { path: 'org-member', element: <OrgMembers /> },
                {
                    path: 'project/:serial',
                    element: <ProjectHome />,
                    children: [
                        { path: 'task', element: <Task /> },
                        { path: 'requirement', element: <Requirement /> },
                        { path: 'funztion', element: <Funztion /> },
                        { path: 'api', element: <Api /> },
                        { path: 'test-case', element: <TestCase /> },
                        { path: 'test-plan', element: <TestPlan /> },
                        { path: 'bug', element: <Bug /> },
                        {
                            path: 'project-setting',
                            element: <ProjectSetting />,
                            children: [
                                { index: true, element: <Navigate to="members" /> },
                                { path: 'members', element: <MemberSetting /> },
                                { path: 'tags', element: <TagSetting /> },
                                { path: 'sources', element: <ReqSourceSetting /> },
                                { path: 'versions', element: <VersionSetting /> },
                            ],
                        },
                    ],
                },
            ],
        },
        {
            path: '/home',
            element: <HomePage />,
            children: [
                { index: true, element: <HomeContent /> },
                { path: 'download', element: <AppDownload /> },
                { path: 'blog', element: <ElgoBlog /> },
                { path: 'about', element: <ElgoAbout /> },
            ],
        },
        { path: '*', element: <PageNotFound /> },
    ]);
}
