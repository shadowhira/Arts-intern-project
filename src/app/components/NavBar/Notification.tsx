import React, { useEffect, useState, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { getAccessToken } from "../../../lib/auth";
import { Badge, Dropdown, Menu, Button, Spin, notification } from 'antd';
import { BellOutlined } from '@ant-design/icons';

interface Notification {
  id: string;
  message: string;
  receiverId: string;
  seen: boolean;
}

const NotificationComponent: React.FC = () => {
  const user = useSelector((state: any) => state.user.user);
  const userId = user?.id;

  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const fetchNotifications = useCallback(async () => {
    setLoading(true);
    try {
      const accessToken = await getAccessToken();
      const response = await fetch(`http://127.0.0.1:8000/notifications/unread/${userId}`, {
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      });
      if (!response.ok) throw new Error('Failed to fetch notifications');
      const data = await response.json();
      setNotifications(data);
    } catch (error) {
      console.error('Error fetching notifications:', error);
      notification.error({ message: 'Error', description: 'Failed to load notifications' });
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    if (userId) {
      fetchNotifications();
    }
  }, [userId, fetchNotifications]);

  const markAsRead = async (notificationId: string) => {
    try {
      const accessToken = await getAccessToken();
      const response = await fetch(`http://127.0.0.1:8000/notifications/mark-as-read/${notificationId}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      });
      if (!response.ok) throw new Error('Failed to mark notification as read');
      setNotifications((prev) => prev.filter(n => n.id !== notificationId));
    } catch (error) {
      console.error('Error marking notification as read:', error);
      notification.error({ message: 'Error', description: 'Could not mark notification as read' });
    }
  };

  const deleteNotification = async (notificationId: string) => {
    try {
      const accessToken = await getAccessToken();
      const response = await fetch(`http://127.0.0.1:8000/notifications/${notificationId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      });
      if (!response.ok) throw new Error('Failed to delete notification');
      setNotifications((prev) => prev.filter(n => n.id !== notificationId));
    } catch (error) {
      console.error('Error deleting notification:', error);
      notification.error({ message: 'Error', description: 'Could not delete notification' });
    }
  };

  const menu = (
    <Menu>
      {notifications.length ? (
        notifications.map(notification => (
          <Menu.Item key={notification.id}>
            <div className="flex justify-between items-center">
              <span>{notification.message}</span>
              <div>
                <Button type="link" onClick={() => markAsRead(notification.id)}>Mark as read</Button>
                <Button type="link" danger onClick={() => deleteNotification(notification.id)}>Delete</Button>
              </div>
            </div>
          </Menu.Item>
        ))
      ) : (
        <Menu.Item disabled>No new notifications</Menu.Item>
      )}
    </Menu>
  );

  return (
    <div className="relative">
      <Dropdown overlay={menu} trigger={['click']} placement="bottomRight">
        <Badge count={notifications.length}>
          <BellOutlined className="text-xl cursor-pointer" />
        </Badge>
      </Dropdown>
      {loading && <Spin className="absolute top-0 right-0 mt-2 mr-2" />}
    </div>
  );
};

export default NotificationComponent;
