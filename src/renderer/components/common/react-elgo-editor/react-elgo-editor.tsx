/* eslint import/no-extraneous-dependencies:0 */
import React, { useEffect } from 'react';
import { effToast } from '@components/common/eff-toast/eff-toast';
import ElgoEditor from 'elgoeditor';
import { ConfigType } from 'elgoeditor/dist/config';
import langConfig from 'elgoeditor/dist/config/lang';
import createId from '../../../utils/unique-id';
import { uploadOneFile } from '../../../utils/fileService';

type hookType = Record<
    string,
    Array<unknown> | ((editor: typeof ElgoEditor, ...args: unknown[]) => void)
    >;

export type IProps = {
    style?: StyleSheet;
    className?: string;
    config?: Partial<ConfigType>;
    defaultValue?: string;
    localBlobImg?: boolean;
    placeholder?: string;
    value?: string;
    languages?: typeof langConfig;
    instanceHook?: hookType;
    globalHook?: hookType;
    height?:number,
    linkImgCallback?: (src: string, alt: string, href: string) => void;
    onlineVideoCallback?: (video: unknown) => void;
    onChange?: (html: string) => void;
    onBlur?: (html: string) => void;
    onFocus?: (html: string) => void;
};

export default function ReactElgoEditor(props:IProps) {
    const {
        style, className, defaultValue, config, height = '100%',
    } = props;
    const id = `editor-${createId(8)}`;
    let editor: ElgoEditor | null = null;

    const customUploadImg = async (resultFiles:any, insertImgFn:any) => {
        const file = resultFiles[0];
        const { size } = file;
        if (size / 1000 > 1000) {
            effToast.error('最大只能上传1M的文件')
            return;
        }
        const result = await uploadOneFile(file);
        insertImgFn(result.data.url);
    };

    const defaultConfig: Record<string, unknown> = {
        zIndex: 1,
        menus: [
            'head',
            'bold',
            'fontSize',
            'italic',
            'underline',
            'strikeThrough',
            'foreColor',
            'link',
            'list',
            'justify',
            'table',
            'splitLine',
            'image',
            'undo',
            'redo',
        ],
        height: height as (number|undefined),
        customUploadImg,
    };

    function setConfig(theConfig?:Record<string, unknown>) {
        if (theConfig && editor) {
            editor.config = Object.assign(editor.config, theConfig);
        }
    }

    function setDefaultConfig() {
        const {
            placeholder,
            onChange,
            onFocus,
            onBlur,
            linkImgCallback,
            onlineVideoCallback,
        } = props;

        if (placeholder) defaultConfig.placeholder = placeholder;
        if (onChange) defaultConfig.onchange = onChange;
        if (onFocus) defaultConfig.onfocus = onFocus;
        if (onBlur) defaultConfig.onblur = onBlur;
        if (linkImgCallback) defaultConfig.linkImgCallback = linkImgCallback;
        if (onlineVideoCallback) defaultConfig.onlineVideoCallback = onlineVideoCallback;
    }

    // 初始化 editor
    function init() {
        const elem = document.getElementById(id);
        if (!elem) {
            effToast.error('ElgoEditor dom is not found')
            return;
        }
        editor = new ElgoEditor(`#${id}`);
        setDefaultConfig();
        setConfig(defaultConfig);
    }
    // 创建 editor
    function create() {
        setConfig(config);
        if (editor) {
            editor.create();
            // 设置默认值
            editor.txt.html(defaultValue);
        }
    }

    useEffect(() => {
        init();
        create();

        return () => {
            // 组件销毁时销毁编辑器  注：class写法需要在componentWillUnmount中调用
            if (editor) editor.destroy();
        };
    }, []);

    return (
        <div
            style={style as React.CSSProperties}
            className={className}
            id={id}
        />
    );
}
