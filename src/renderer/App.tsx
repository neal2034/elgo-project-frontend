import React from 'react';
import { HashRouter } from 'react-router-dom';
import { useSnackbar } from 'notistack';
import { effToast } from '@components/common/eff-toast/eff-toast';
import ElgoRouters from '@config/router';

export default function App() {
    // 全局设置 snack bar
    const { enqueueSnackbar, closeSnackbar } = useSnackbar();
    effToast.setSnackBar(enqueueSnackbar, closeSnackbar);

    return (
        <HashRouter>
            <ElgoRouters />
        </HashRouter>
    );
}
