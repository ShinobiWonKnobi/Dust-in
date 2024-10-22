import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';

interface NotificationSystemProps {
  notifications: string[];
}

const NotificationSystem: React.FC<NotificationSystemProps> = ({ notifications }) => {
  const [visibleNotifications, setVisibleNotifications] = useState<string[]>([]);

  useEffect(() => {
    if (notifications.length > 0) {
      const latestNotification = notifications[notifications.length - 1];
      setVisibleNotifications(prev => [...prev, latestNotification]);

      const timer = setTimeout(() => {
        setVisibleNotifications(prev => prev.filter(n => n !== latestNotification));
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [notifications]);

  const removeNotification = (notification: string) => {
    setVisibleNotifications(prev => prev.filter(n => n !== notification));
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {visibleNotifications.map((notification, index) => (
        <div
          key={index}
          className="bg-red-500 text-white p-4 rounded-lg shadow-lg mb-2 flex items-center justify-between"
        >
          <span>{notification}</span>
          <button onClick={() => removeNotification(notification)} className="ml-4">
            <X size={18} />
          </button>
        </div>
      ))}
    </div>
  );
};

export default NotificationSystem;