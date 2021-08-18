import React, {useState} from "react";
import './eff-menu.less'

interface IEffMenuItem{
    children?:JSX.Element | string
    [propNames:string]:any
}

interface IEffMenu{
    defaultKey: string,
    children: IEffMenuItem[],
    [propNames:string]:any
}


// 基础Menu组件
export default function EffMenu(props:IEffMenu){
    const {defaultKey, children, ...rest} = props
    const [selectedKey, setSelectedKey] = useState(defaultKey)


    //遍历children， 复制并添加必要的props
    const menuItems = children.map((item:any, index:number)=>React.cloneElement(item, {
        key:index,
        selectedKey,
        handleClick: (value:string)=>setSelectedKey(value)
        }))

    const response = {
        handleClick : ()=>{
            if(props.onClick){
                props.onClick({key:selectedKey})
            }
        }
    }

    return (
        <div className='eff-menu d-flex' onClick={response.handleClick}>
            {menuItems}
        </div>
    )
}


// 基础EffMenuItem 组件
function EffMenuItem(props:IEffMenuItem){
    const {value,children, handleClick, selectedKey} = props
    const isSelected = selectedKey == value

    return (
        <div className={`mr40 eff-menu-item ${isSelected?'eff-menu-item-selected':''}`} onClick={()=>handleClick(value)}>
            <div className="mb10">
                {children}
            </div>
        </div>
    )
}

export {EffMenuItem}
