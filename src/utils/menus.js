import {getRequest} from "./api";
import da from "element-ui/src/locale/lang/da";



// 菜单请求工具类

// router 路由； store Vuex
export  const initMenu=(router,store)=>{
    if (store.state.routes.length>0){
        return;
    }
    getRequest('/system/cfg/menu').then(data=>{
        if (data){
            //格式化Router
            let fmtRoutes=formatRouters(data);
            console.log(fmtRoutes);
            //添加到Router
            router.addRoutes(fmtRoutes);
            //将数据存入Vuex
            store.commit('initRoutes',fmtRoutes);

        }
    })
}

export  const initUserMenu=(router,store)=>{
    if (store.state.routes.length>0){
        return;
    }
    getRequest('/system/cfg/user/menu').then(data=>{
        if (data){
            //格式化Router
            let fmtRoutes=formatRouters(data);
            console.log(fmtRoutes);
            //添加到Router
            router.addRoutes(fmtRoutes);
            //将数据存入Vuex
            store.commit('initUserRoutes',fmtRoutes);

        }
    })
}

export const formatRouters=(routes)=>{
    let fmtRoutes=[];
    routes.forEach(router=>{
        let{
            menuPath,
            menuComponent,
            menuName,
            menuIcon,
            children
        }=router;
        if (children && children instanceof Array){
            //递归
            children=formatRouters(children);
        }
        let fmtRouter={
            path:menuPath,
            name:menuName,
            iconCls:menuIcon,
            children:children,
            component(resolve){
                // 判断组件以什么开头，到对应的目录去找
                if (menuComponent.startsWith('Home')){
                    require(['../views/bg/'+menuComponent+'.vue'],resolve);
                }else if (menuComponent.startsWith('Food')){
                    require(['../views/bg/food/'+menuComponent+'.vue'],resolve);
                }else if (menuComponent.startsWith('Ord')){
                    require(['../views/bg/ord/'+menuComponent+'.vue'],resolve);
                }else if (menuComponent.startsWith('Sta')){
                    require(['../views/bg/sta/'+menuComponent+'.vue'],resolve);
                }else if (menuComponent.startsWith('Sys')){
                    require(['../views/bg/sys/'+menuComponent+'.vue'],resolve);
                }
            }
        }
        fmtRoutes.push(fmtRouter)
    });
    return fmtRoutes;
}