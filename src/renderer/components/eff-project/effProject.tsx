import React from 'react';
import './effProject.less';
import { useHistory } from 'react-router';
import umbrella from 'umbrella-storage';
import EffUser from '../eff-user/eff-user';

interface ProjectProps{
    project:any,
}

export default function EffProject(props:ProjectProps) {
    const { project } = props;
    const members = project.members.map((member:any, index:number) => {
        if (index < 6) {
            return <EffUser id={member.id} style={{ marginRight: '5px' }} key={member.id} name={member.name} size={24} />;
        } if (index === 6) {
            return <EffUser id={member.id} style={{ marginRight: '5px' }} key={member.id} name={project.members.length} size={24} />;
        }

        return null;
    });
    const history = useHistory();

    const goInProject = () => {
        umbrella.setLocalStorage('pserial', project.serial);
        history.push({ pathname: '/app/api' });
    };

    return (
        <div className="eff-project mr20 d-flex-column justify-between" onClick={goInProject}>
            <div className="font-title mt10 ml10">{project.name}</div>
            <div className="ml10 mb10">{members}</div>
        </div>
    );
}
