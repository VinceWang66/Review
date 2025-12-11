const API_BASE = 'http://localhost:3000';

export const authFetch = async (url:string, options:RequestInit={})=>{
    const token = localStorage.getItem('token');

    //设置请求头
    const headers = {
        'Content-Type':'application/json',
        ...(token&&{'Authorization':`Bearer${token}`}),
        ...options.headers,
    };

    const response = await fetch(`${API_BASE}${url}`,{
        ...options,
        headers,
    });

    const data = await response.json();

    if(!response.ok){
        //过期或无效
        if(response.status===401){
            localStorage.removeItem('token');
            window.location.href="/login";
        }
        //权限不足
        if (response.status === 403) {
            throw new Error(data.message || '权限不足，无法访问该资源');
        }
        //其他错误
        throw new Error(data.message||`请求失败(${response.status})`);
    }
    return data;
}

export const getProducts = () => authFetch('/products', { method: 'GET' });
export const getProductsById = (id:number) => authFetch(`/products/${id}`, { method: 'GET' });