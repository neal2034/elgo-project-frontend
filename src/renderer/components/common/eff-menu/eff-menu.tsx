import React from 'react';
import './eff-menu.less';
import { projectMenuRoutes, IMenuRoute } from '@config/projectMenus';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { projectActions } from '@slice/projectSlice';
import { RootState, useAppDispatch } from '../../../store/store';

interface IEffMenuItem {
    // eslint-disable-next-line no-undef
    children?: JSX.Element | string;
    value: string;
    handleClick?: (value: string) => void;
    selectedKey?: string;
    [propNames: string]: any;
}

// 基础EffMenuItem 组件
function EffMenuItem(props: IEffMenuItem) {
    const { value, children, handleClick, selectedKey } = props;
    const isSelected = selectedKey === value;
    const response = {
        onClick: () => {
            if (handleClick) {
                handleClick(value);
            }
        },
    };

    return (
        <div className={`mr40 eff-menu-item ${isSelected ? 'eff-menu-item-selected' : ''}`} onClick={response.onClick}>
            <div className="mb10">{children}</div>
        </div>
    );
}

// 基础Menu组件
export default function EffMenu() {
    const activeMenuKey = useSelector((state: RootState) => state.project.activeMenuKey);
    const navigator = useNavigate();
    const dispatch = useAppDispatch();

    const response = {
        menuSelected: (key: string, path: string) => {
            dispatch(projectActions.setActiveMenuKey(key));
            navigator(key);
        },
    };
    const ui = {
        menuItems: projectMenuRoutes.map(
            (menu: IMenuRoute) =>
                !menu.noMenu && (
                    // eslint-disable-next-line max-len
                    <EffMenuItem key={menu.path} handleClick={() => response.menuSelected(menu.menuKey, menu.path)} selectedKey={activeMenuKey} value={menu.menuKey}>
                        {menu.name}
                    </EffMenuItem>
                )
        ),
    };

    return <div className="eff-menu d-flex">{ui.menuItems}</div>;
}
export { EffMenuItem };
