"use client";
import React, { createContext, useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import toast from 'react-hot-toast';
import axios from 'axios';
import Cookies from 'js-cookie';

const NotificationContext = createContext();
const apiUrl = process.env.NEXT_PUBLIC_APP_API_URL || 'http://localhost:8080';

export const NotificationProvider = ({ children, userId }) => {
    const [notifications, setNotifications] = useState([]);
    const [socket, setSocket] = useState(null);

    useEffect(() => {
        if (userId) {
            console.log("Initializing admin socket for userId:", userId);
            const newSocket = io(apiUrl, {
                withCredentials: true,
                transports: ['polling', 'websocket']
            });
            
            setSocket(newSocket);

            newSocket.on('connect', () => {
                console.log("Admin socket connected:", newSocket.id);
                newSocket.emit('join-admin', userId);
            });

            newSocket.on('new-notification', (notification) => {
                console.log("New admin notification received:", notification);
                setNotifications(prev => {
                    // Check if already exists to avoid duplicates
                    if (prev.find(n => n._id === notification._id)) return prev;
                    return [notification, ...prev];
                });
                
                toast.success(notification.message, {
                    duration: 5000,
                    position: 'top-right',
                    style: {
                        background: '#333',
                        color: '#fff',
                        fontSize: '14px'
                    }
                });
            });

            newSocket.on('connect_error', (error) => {
                console.error("Socket connection error:", error);
            });

            fetchNotifications();

            return () => {
                console.log("Closing admin socket");
                newSocket.close();
            };
        }
    }, [userId]);

    const fetchNotifications = async () => {
        try {
            const token = Cookies.get('adminAccessToken');
            if (!token) return;

            const response = await axios.get(`${apiUrl}/api/notification?isAdmin=true`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                withCredentials: true
            });
            if (response.data.success) {
                setNotifications(response.data.data);
            }
        } catch (error) {
            console.error("Error fetching notifications:", error);
        }
    };

    const markAsRead = async (id) => {
        try {
            const token = Cookies.get('adminAccessToken');
            await axios.put(`${apiUrl}/api/notification/mark-as-read/${id}`, {}, {
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                withCredentials: true
            });
            setNotifications(prev => prev.map(n => n._id === id ? { ...n, isRead: true } : n));
        } catch (error) {
            console.error("Error marking notification as read:", error);
        }
    };

    return (
        <NotificationContext.Provider value={{ notifications, markAsRead, fetchNotifications }}>
            {children}
        </NotificationContext.Provider>
    );
};

export const useNotifications = () => useContext(NotificationContext);
