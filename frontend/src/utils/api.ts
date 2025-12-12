const API_BASE = 'http://localhost:3000';

export const authFetch = async (url:string, options:RequestInit={})=>{
    const token = localStorage.getItem('token');
    console.log('authFetch token:', token);  // 添加
    console.log('authFetch url:', url);  // 添加
    console.log('authFetch options:', options);  // 添加
    //设置请求头
    const headers = {
        'Content-Type':'application/json',
        ...(token&&{'Authorization':`Bearer ${token}`}),
        ...options.headers,
    };
    console.log('authFetch headers:', headers);  // 添加
    const response = await fetch(`${API_BASE}${url}`,{
        ...options,
        headers,
    });
    console.log('authFetch response status:', response.status);  // 添加
    const data = await response.json();

    if(!response.ok){
    //过期或无效
    if(response.status===401){
        localStorage.removeItem('token');
        throw new Error('请先登录');
    }
    //权限不足
    if (response.status === 403) {
        throw new Error('权限不足，无法访问该资源');
    }
    //其他错误
    throw new Error(data.message||`请求失败(${response.status})`);
}
    return data;
}

export const getProducts = () => authFetch('/products', { method: 'GET' });
export const getProductsById = (id:number) => authFetch(`/products/${id}`, { method: 'GET' });
export const getCategories = () => authFetch('/categories', { method: 'GET' });
export const addProduct = (productData: any) => authFetch('/products',{ method: 'POST', body: JSON.stringify(productData) });
export const deleteProduct = (id: number) => authFetch(`/products/${id}`, { method: 'DELETE' });
export const updateProduct = (id:number, productData: any) => authFetch(`/products/${id}`,{ method: 'PATCH', body: JSON.stringify(productData) })