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
            console.log("Initializing user socket for userId:", userId);
            const newSocket = io(apiUrl, {
                withCredentials: true,
                transports: ['polling', 'websocket']
            });
            setSocket(newSocket);

            newSocket.on('connect', () => {
                console.log("User socket connected:", newSocket.id);
                newSocket.emit('join', userId);
            });

            newSocket.on('new-notification', (notification) => {
                console.log("New user notification received:", notification);
                setNotifications(prev => {
                    // Avoid duplicates
                    if (prev.find(n => n._id === notification._id)) return prev;
                    return [notification, ...prev];
                });
                
                toast.success(notification.message, {
                    duration: 4000,
                    position: 'bottom-right',
                    style: {
                        background: '#333',
                        color: '#fff',
                        fontSize: '13px'
                    }
                });
            });

            newSocket.on('connect_error', (error) => {
                console.error("User socket connection error:", error);
            });

            // Fetch existing notifications
            fetchNotifications();

            return () => {
                console.log("Closing user socket");
                newSocket.close();
            };
        }
    }, [userId]);

    const fetchNotifications = async () => {
        try {
            const token = Cookies.get('accessToken');
            if (!token) return;

            const response = await axios.get(`${apiUrl}/api/notification`, {
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
            const token = Cookies.get('accessToken');
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
