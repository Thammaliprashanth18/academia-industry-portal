const pool = require('../config/db');

// Get User Notifications
const getNotifications = async (req, res) => {
  try {
    const userId = req.user.id;
    const [notifications] = await pool.query(`
      SELECT * FROM notifications 
      WHERE user_id = ? 
      ORDER BY created_at DESC 
      LIMIT 20
    `, [userId]);

    const [unreadCount] = await pool.query(
      'SELECT COUNT(*) as count FROM notifications WHERE user_id = ? AND is_read = FALSE',
      [userId]
    );

    return res.json({
      success: true,
      unreadCount: unreadCount[0].count,
      data: notifications
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to fetch notifications.', error: error.message });
  }
};

// Mark Single Notification as Read
const markAsRead = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    await pool.query('UPDATE notifications SET is_read = TRUE WHERE id = ? AND user_id = ?', [id, userId]);
    return res.json({ success: true, message: 'Notification marked as read.' });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to update notification.', error: error.message });
  }
};

// Mark All Notifications as Read
const markAllAsRead = async (req, res) => {
  try {
    const userId = req.user.id;

    await pool.query('UPDATE notifications SET is_read = TRUE WHERE user_id = ?', [userId]);
    return res.json({ success: true, message: 'All notifications marked as read.' });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to mark all notifications.', error: error.message });
  }
};

module.exports = {
  getNotifications,
  markAsRead,
  markAllAsRead
};
