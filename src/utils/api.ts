import axios from "@/utils/axios.customize"
import AsyncStorage from "@react-native-async-storage/async-storage"

export const registerAPI = (email: string, password: string, name: string) => {
    const url = `/auth/register`
    return axios.post<IBackendRes<IRegister>>(url, { email, password, name })
}

export const verifyCodeAPI = (email: string, code: string) => {
    const url = `/auth/verification`
    return axios.post<IBackendRes<IRegister>>(url, { email, code })
}

export const resendCodeAPI = (email: string, code: string) => {
    const url = `/auth/register`
    return axios.post<IBackendRes<IRegister>>(url, { email, code })
}

export const loginAPI = (email: string, password: string) => {
    const url = `/auth/login`
    return axios.post<IBackendRes<IUserLogin>>(url, { email, password })
}

export const resetPasswordAPI = (email: string) => {
    const url = `/auth/forgotPassword`
    return axios.post<IBackendRes<IRegister>>(url, { email })
}

export const getAccountAPI = () => {
    const url = `/auth/get-account`
    return axios.get<IBackendRes<IRegister>>(url)
}

export const getTopBookStoreAPI = (ref: string) => {
    const url = `/bookStore/${ref}`
    return axios.post<IBackendRes<ITopBookStore[]>>(url)
}

//check async storage
export const printAsyncStorage = () => {
    AsyncStorage.getAllKeys((err, keys) => {
    AsyncStorage.multiGet(keys!, (error, stores) => {
    let asyncStorage: any = {}
    stores?.map((result, i, store) => {
    asyncStorage[store[i][0]] = store[i][1]
});
    console.log(JSON.stringify(asyncStorage, null, 2));
});
 });
};
    