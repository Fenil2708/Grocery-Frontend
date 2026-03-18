import axios from "axios";
import Cookies from "js-cookie";

const apiUrl = process.env.NEXT_PUBLIC_APP_API_URL;

export const postData = async (url, formData)=>{
    try {
        const response = await fetch(apiUrl + url, {
            method:'POST',
            headers: {
                'Authorization': `Bearer ${Cookies.get('accessToken')}`,
                'Content-Type': 'application/json'
            },
            body:JSON.stringify(formData)
        })

        if(response.ok){
            const data = await response.json();
            return data;
        } else {
            const errorData = await response.json();
            return errorData;
        }

    } catch (error) {
        console.log('Error', error)
    }
} 

export const fetchDataFromApi = async (url) => {
    try {
        const params={
            headers: {
                'Authorization': `Bearer ${Cookies.get('accessToken')}`,
                'Content-Type': 'application/json',
            },
        }
        const {data} = await axios.get(apiUrl + url,params)
        return data;
    } catch (error) {
        console.log(error);
        return error;
    }
}

export const deleteData = async (url) => {
    try {
        const response = await fetch(apiUrl + url, {
            method:'DELETE',
            headers: {
                'Authorization': `Bearer ${Cookies.get('accessToken')}`,
                'Content-Type': 'application/json'
            }
        })
        return await response.json();
    } catch (error) {
        console.log('Error', error)
        return error;
    }
}

export const putData = async (url, formData) => {
    try {
        const response = await fetch(apiUrl + url, {
            method:'PUT',
            headers: {
                'Authorization': `Bearer ${Cookies.get('accessToken')}`,
                'Content-Type': 'application/json'
            },
            body:JSON.stringify(formData)
        })
        return await response.json();
    } catch (error) {
        console.log('Error', error)
        return error;
    }
}

export const uploadImageData = async (url, formData) => {
    try {
        const response = await axios.post(apiUrl + url, formData, {
            headers: {
                'Authorization': `Bearer ${Cookies.get('accessToken')}`,
                'Content-Type': 'multipart/form-data'
            }
        });
        return response.data;
    } catch (error) {
        console.log('Error', error);
        return error;
    }
}

export const uploadImagePutData = async (url, formData) => {
    try {
        const response = await axios.put(apiUrl + url, formData, {
            headers: {
                'Authorization': `Bearer ${Cookies.get('accessToken')}`,
                'Content-Type': 'multipart/form-data'
            }
        });
        return response.data;
    } catch (error) {
        console.log('Error', error);
        return error;
    }
}