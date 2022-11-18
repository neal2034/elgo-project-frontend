import React, { useEffect } from 'react';
import { Outlet, useParams, useNavigate } from 'react-router-dom';
import { setBreadcrumbs } from '@slice/breadcrumbSlice';
import { useDispatch, useSelector } from 'react-redux';
import './project-home.less';
import { menuActions } from '@slice/menuSlice';
import umbrella from 'umbrella-storage';
import { IProject, projectActions, projectThunks } from '@slice/projectSlice';
import getProjectImgByKey from '@pages/project-center/project-img';
import { RootState, useAppSelector } from '../../store/store';
import EffMenu from '../../components/common/eff-menu/eff-menu';

/**
 * 项目头部图标&名称
 * @constructor
 */
function ProjectHeader(props: { project: IProject }) {
    const { project } = props;
    const bgColor = project && project.color;
    return (
        <div className="project-head d-flex ml20">
            <div style={{ backgroundColor: bgColor }} className="project-icon d-flex align-center justify-center">
                <img alt="head" src={getProjectImgByKey(project.icon, true)} width={20} />
            </div>
            <div className="ml20 name mt10">{project.name}</div>
        </div>
    );
}

export default function ProjectHome() {
    // 设置项目serial
    const { serial } = useParams();
    if (serial) {
        umbrella.setLocalStorage('pserial', serial);
    }

    const dispatch = useDispatch();
    const navigator = useNavigate();
    const project: IProject = useSelector((state: RootState) => state.project.projectDetail);
    const activeMenuKey = useAppSelector(state => state.project.activeMenuKey);
    useEffect(() => {
        dispatch(menuActions.setActiveMenu(''));
    }, [dispatch]);
    useEffect(() => {
        dispatch(setBreadcrumbs([]));
    }, [dispatch]);
    useEffect(() => {
        dispatch(projectThunks.getProjectDetail());
    }, [dispatch]);

    useEffect(() => {
        if (!activeMenuKey) {
            navigator('task');
            dispatch(projectActions.setActiveMenuKey('task'));
        }
    }, []);

    return (
        <div className="d-flex-column flex-grow-1">
            <ProjectHeader project={project} />
            <EffMenu />
            <div className="d-flex-column flex-grow-1">
                <Outlet />
            </div>
        </div>
    );
}
