import React, { CSSProperties } from 'react';

interface IProps {
    iconImg: string;
    bgColor?: string;
    className?: string;
    onClick: () => void;
}

const style: CSSProperties = {
    width: '40px',
    height: '40px',
    borderRadius: '3px',
    cursor: 'pointer',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
};

const ProjectIcon = (props: IProps): JSX.Element => {
    const { iconImg, bgColor, onClick, className = '' } = props;

    return (
        <div className={`${className}`} onClick={onClick} style={{ ...style, backgroundColor: bgColor || '' }}>
            <img alt="project-icon" src={iconImg} width={bgColor ? 20 : undefined} />
        </div>
    );
};

export default ProjectIcon;
