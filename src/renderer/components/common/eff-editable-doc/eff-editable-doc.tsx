import React, {useState} from "react";
import EffEditor from "../eff-editor/eff-editor";
import './eff-editable-doc.less'
import EffButton from "../../eff-button/eff-button";
import {Image} from "antd";


interface IProps{
    content?:string,
    className?:string,
    width?:string|number,
    height?:string|number,
    onSave:(newContent?:string)=>void
}

export default function EffEditableDoc(props:IProps){
    const {content='', className, width='100%', height='100%', onSave} = props
    const [isEditing, setIsEditing] = useState(false)
    const [showImg, setShowImg] = useState(false)
    const [contentImages, setContentImages] = useState<string[]>([])


    let currentContent:any = undefined

    const response = {
        contentClick: (event:any)=>{
            if(event.target.nodeName == 'IMG'){
                const images:string[] = []
                const imgReg = /<img.*?(?:>|\/>)/gi
                const srcReg = /src=['"]?([^'"]*)['"]?/i

                const clickImg =  event.target.src
                images.push(clickImg)
                const arr = content.match(imgReg)
                if(arr){
                    arr.forEach(item=>{
                        const src = item.match(srcReg)
                        if(src && src[1]!=clickImg){
                            images.push(src[1])
                        }

                    })
                }
                setContentImages(images)
                setShowImg(true)

            }else{
                setIsEditing(true)
            }


        },
        cancelEditing: ()=>{
            setIsEditing(false)
        },
        contentChanged: (value?:string)=>{
            currentContent = value
        },
        saveContent: ()=>{
            onSave(currentContent)
            setIsEditing(false)
        }
    }

    return <div className={`${className}`} style={{width, height}}>

        {isEditing?
            <div>
                <div className="d-flex justify-end mb10">
                    <EffButton onClick={response.cancelEditing} text={'取消'} key={'cancel'} round={true} width={80} type={"line"}/>
                    <EffButton className="ml10" onClick={response.saveContent} text={'保存'} key={'save'} round={true} width={80} type={"filled"}/>
                </div>
                <EffEditor content={content} onChange={response.contentChanged}/>
            </div>
            :
            <div onClick={response.contentClick} className="doc-content cursor-pointer" dangerouslySetInnerHTML={{__html: content}}/>}

            <div style={{ display: 'none' }}>
            <Image.PreviewGroup preview={{ visible:showImg, onVisibleChange: vis=>setShowImg(vis)}}>
                {
                    contentImages.map((img,index)=><Image key={index} src={img}/>)
                }
            </Image.PreviewGroup>
        </div>


    </div>

}
