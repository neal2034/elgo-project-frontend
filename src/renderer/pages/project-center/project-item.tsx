import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { taskThunks } from '@slice/taskSlice';
import getProjectImgByKey from '@pages/project-center/project-img';
import { IProject } from '@slice/projectSlice';
import { PROJECT_COLOR } from '@config/sysConstant';
import { EllipsisOutlined, FormOutlined, DeleteOutlined } from '@ant-design/icons';
import './project-item.less';
import { Dropdown, Menu } from 'antd';

interface IProps {
    project: IProject;
    onDel: (project: IProject) => void;
    onEdit: (project: IProject) => void;
}

export default function ProjectItem(props: IProps) {
    const dispatch = useDispatch();
    const { project, onEdit, onDel } = props;
    const bgColor = project.color ? project.color : PROJECT_COLOR[0];
    const [showProjectMenu, setShowProjectMenu] = useState(false);
    const navigator = useNavigate();
    // 设置图标样式
    const width = '120px';
    const height = '120px';
    const imgWidth = '50px';
    const borderRadius = '10px';

    const response = {
        goToProject: () => {
            dispatch(taskThunks.resetStore());
            navigator({ pathname: `/app/project/${project.serial}/task` });
        },
        menuChosen: ({ key, domEvent }: { key: any; domEvent: any }) => {
            domEvent.stopPropagation();
            setShowProjectMenu(false);
            switch (key) {
                case 'delete':
                    response.delProject();
                    break;
                case 'edit':
                    response.editProject();
                    break;
                default:
                    break;
            }
        },
        delProject: () => {
            onDel(project);
        },
        editProject: () => {
            onEdit(project);
        },
    };

    const menuItems = [
        { key: 'edit', label: '编辑项目', icon: <FormOutlined className="mr5" />, className: 'menu-item' },
        { key: 'delete', label: '删除项目', icon: <DeleteOutlined className="mr5" />, className: 'menu-item' },
    ];

    return (
        <div
            onMouseLeave={() => setShowProjectMenu(false)}
            onMouseEnter={() => setShowProjectMenu(true)}
            onClick={response.goToProject}
            style={{ width }}
            className="project-item d-flex-column align-center cursor-pointer mr40 mb40"
        >
            <div
                style={{
                    backgroundColor: bgColor,
                    width,
                    height,
                    borderRadius,
                }}
                className="icon d-flex justify-center align-center"
            >
                {showProjectMenu && (
                    <Dropdown menu={{ items: menuItems, onClick: response.menuChosen }} trigger={['click']} placement="bottomLeft">
                        <EllipsisOutlined onClick={e => e.stopPropagation()} className="action" />
                    </Dropdown>
                )}
                <img alt="project" src={getProjectImgByKey(project.icon, true)} width={imgWidth} />
            </div>
            <span
                style={{
                    fontSize: '14px',
                    fontWeight: 'bold',
                }}
                className="mt10"
            >
                {project.name}
            </span>
        </div>
    );
}
