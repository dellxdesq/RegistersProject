import React, { createContext, useContext, useState } from 'react';

const ToastContext = createContext();

export const ToastProvider = ({ children }) => {
    const [message, setMessage] = useState('');
    const [visible, setVisible] = useState(false);

    const showToast = (msg, timeout = 6000) => {
        setMessage(msg);
        setVisible(true);
        setTimeout(() => setVisible(false), timeout);
    };

    return (
        <ToastContext.Provider value={{ showToast }}>
            {children}
            {visible && (
                <div style={{
                    position: 'fixed',
                    top: '20px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    backgroundColor: '#333',
                    color: '#fff',
                    padding: '12px 20px',
                    borderRadius: '8px',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                    zIndex: 1000
                }}>
                    {message}
                </div>
            )}
        </ToastContext.Provider>
    );
};

export const useToast = () => useContext(ToastContext);