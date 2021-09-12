import React, {useState} from "react";
import './eff-menu.less'

interface IEffMenuItem{
    children?:JSX.Element | string
    value:string,
    handleClick:(value:string)=>void,
    selectedKey:string,
    [propNames:string]:any
}

interface IEffMenu{
    defaultKey: string,
    children: IEffMenuItem[],
    onClick:(value:any)=>void,
    [propNames:string]:any
}


// 基础Menu组件
export default function EffMenu(props:IEffMenu){
    const {defaultKey, children} = props
    const [selectedKey, setSelectedKey] = useState(defaultKey)


    //遍历children， 复制并添加必要的props
    const menuItems = children.map((item:any, index:number)=>React.cloneElement(item, {
        key:index,
        selectedKey,
        handleClick: (value:string)=>{
            setSelectedKey(value)
            if(props.onClick){
                props.onClick({key:value})
            }
        }
        }))


    return (
        <div className='eff-menu d-flex'>
            {menuItems}
        </div>
    )
}


// 基础EffMenuItem 组件
function EffMenuItem(props:IEffMenuItem){
    const {value,children, handleClick, selectedKey} = props
    const isSelected = (selectedKey == value)

    return (
        <div className={`mr40 eff-menu-item ${isSelected?'eff-menu-item-selected':''}`} onClick={()=>handleClick(value)}>
            <div className="mb10">
                {children}
            </div>
        </div>
    )
}

export {EffMenuItem}
