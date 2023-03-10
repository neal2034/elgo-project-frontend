import React from 'react';
import EffWithdraw from '../../business/eff-withdraw/eff-withdraw';

class EffToast {
    #snackBar = {
        enqueueSnackbar: (msg:string, rest:any) => {
            // somecode
        },
        closeSnackbar: (key?:any) => {
            // some code
        },
    };

    setSnackBar(enqueueSnackbar:any, closeSnackbar:any) {
        this.#snackBar.enqueueSnackbar = enqueueSnackbar;
        this.#snackBar.closeSnackbar = closeSnackbar;
    }

    success(msg:string, options = {}) {
        return this.toast(msg, { ...options, variant: 'success' });
    }

    // eslint-disable-next-line camelcase
    success_withdraw(msg:string, callback:()=>void) {
        const withdraw = () => {
            this.#snackBar.closeSnackbar();
            callback();
        };
        return this.toast(msg, {
            action: <EffWithdraw onWithDraw={withdraw} />,
            variant: 'success',
        });
    }

    warning(msg:string, options = {}) {
        return this.toast(msg, { ...options, variant: 'warning' });
    }

    info(msg:string, options = {}) {
        return this.toast(msg, { ...options, variant: 'info' });
    }

    error(msg:string, options = {}) {
        return this.toast(msg, { ...options, variant: 'error' });
    }

    toast(msg:string, options = {}) {
        const finalOptions = {
            variant: 'default',
            ...options,
        };
        return this.#snackBar.enqueueSnackbar(msg, { ...finalOptions });
    }

    closeSnackbar(key?:any) {
        this.#snackBar.closeSnackbar(key);
    }
}

const effToast = new EffToast();
export { effToast };
