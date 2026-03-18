import axios from "axios";
import Cookies from "js-cookie";

const apiUrl = process.env.NEXT_PUBLIC_APP_API_URL;

export const postData = async (url, formData)=>{
    try {
        const response = await fetch(apiUrl + url, {
            method:'POST',
            headers: {
                'Authorization': `Bearer ${Cookies.get('adminAccessToken')}`,
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
                'Authorization': `Bearer ${Cookies.get('adminAccessToken')}`,
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

export const uploadImage = async (url, updatedData) => {
    try {
        const params = {
            headers: {
                'Authorization': `Bearer ${Cookies.get('adminAccessToken')}`, 
                'Content-Type': 'multipart/form-data',
            },
        }

        // Remove any duplicate slashes in the URL
        const fullUrl = apiUrl + url;
        const cleanUrl = fullUrl.replace(/([^:])\/\/+/g, "$1/");
        
        console.log("Uploading to URL:", cleanUrl);
        console.log("Form data entries:", [...updatedData.entries()]);
        
        const response = await axios.post(cleanUrl, updatedData, {
            ...params,
            timeout: 120000 // 2 minutes timeout for multiple image uploads
        });
        console.log("Upload response:", response.data);
        return response;
        
    } catch (error) {
        console.error("Upload error details:", {
            message: error.message,
            response: error.response?.data,
            status: error.response?.status
        });
        throw error;
    }
}

export const deleteImages = async (url) => {
    try {
        const params = {
            headers: {
                'Authorization': `Bearer ${Cookies.get('adminAccessToken')}`,
                'Content-Type': 'application/json',
            },
        }
        const response = await axios.delete(apiUrl + url, params);
        return response;
    } catch (error) {
        console.error("Delete error:", error);
        throw error;
    }
}

export const putData = async (url, formData) => {
    try {
        const params = {
            headers: {
                'Authorization': `Bearer ${Cookies.get('adminAccessToken')}`,
                'Content-Type': 'application/json',
            },
        }
        const { data } = await axios.put(apiUrl + url, formData, params);
        return data;
    } catch (error) {
        console.error("Put error:", error);
        throw error;
    }
}

export const deleteData = async (url) => {
    try {
        const params = {
            headers: {
                'Authorization': `Bearer ${Cookies.get('adminAccessToken')}`,
                'Content-Type': 'application/json',
            },
        }
        const { data } = await axios.delete(apiUrl + url, params);
        return data;
    } catch (error) {
        console.error("Delete error:", error);
        throw error;
    }
}

export const uploadImagePutData = async (url, formData) => {
    try {
        const response = await axios.put(apiUrl + url, formData, {
            headers: {
                'Authorization': `Bearer ${Cookies.get('adminAccessToken')}`,
                'Content-Type': 'multipart/form-data'
            }
        });
        return response.data;
    } catch (error) {
        console.error("Upload PUT error:", error);
        return error;
    }
}