export interface IFMenuBase {
    key: string,
    title: string,
    icon?: string,
    component?:string,
    requireAuth?:string,
}

const routes:{
    menus: IFMenuBase[],
} = {
    menus: [
        
    ]
}
