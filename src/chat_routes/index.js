const MessageController = require('../controllers/messages/index');
module.exports = (socket, io, users) => {
    socket.on('send_user_advice_message', (data) => MessageController.sendUserAdviceMessage(data, socket, io, users))
    socket.on('send_admin_advice_message', (data) => MessageController.sendAdminAdviceMessage(data, socket, io, users))
    socket.on('get_user_advice_messages', (data) => MessageController.getUserAdviceMessages(data, socket, io, users))
    socket.on('get_advice_users', (data) => MessageController.getAdviceUsers(data, socket, io, users))
    socket.on('get_admin_advice_messages', (data) => MessageController.getAdminAdviceMessages(data, socket, io, users))
    socket.on('get_messages_users', (data) => MessageController.getMessagesUsers(data, socket, io, users))
    socket.on('send_order', (data) => MessageController.sendOrder(data, socket, io, users))
    socket.on('get_messages_data', (data) => MessageController.getMessagesData(data, socket, io, users))
    socket.on('send_message', (data) => MessageController.sendMessage(data, socket, io, users))
    socket.on('accept_order', (data) => MessageController.acceptOrder(data, socket, io, users))
    socket.on('complete_order', (data) => MessageController.completeOrder(data, socket, io, users))
}