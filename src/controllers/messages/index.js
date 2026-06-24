const Advice = require("../../models/Advice");
const Messages = require("../../models/Messages");
const Order = require("../../models/Order");
const User = require("../../models/User");

exports.sendUserAdviceMessage = async (data, socket, io, users) => {
    console.log(data);
    const sender_email = data.email;
    const { message } = data;
    const admin = await User.findOne({ role: 2 });
    const receiver_email = admin['email'];
    const newAdvice = new Advice({
        sender_email,
        receiver_email,
        message
    });
    newAdvice.save();
    io.sockets.emit('send_advice_message', {
        sender_email,
        receiver_email,
        message,
        create_at: new Date()
    });
}

exports.acceptOrder = async(data, socket,io, users) => {
    const { order_id } = data;
    Order.updateOne(
        {_id: order_id},
        {
            $set: {
                status: 1
            }
        }
    ).then((updated_order) => {
        io.sockets.emit("accept_order", {});
    })
}

exports.completeOrder = async(data, socket,io, users) => {
    const { order_id } = data;
    Order.updateOne(
        {_id: order_id},
        {
            $set: {
                status: 2
            }
        }
    ).then(async(result) => {
        const message = await Messages.findOne({order_id});
        const updated_order = await Order.findOne({_id: order_id})
        const {sender_email, receiver_email} = message;
        
        const user1 = await User.findOne({email: sender_email});
        const user2 = await User.findOne({email: receiver_email});
        
        let expert = {}, student = {};
        if(user1.type == "student") {
            student = user1; expert = user2;
        } else {
            student = user2; expert = user1;
        }
        
        const update1 = await User.updateOne(
            {email: student.email},
            {
                $set: {
                    balance: Number(student.balance) - Number(updated_order.budget)
                }
            }
        );
        const updated2 = await User.updateOne(
            {email: expert.email},
            {
                $set: {
                    balance: Number(expert.balance) + Number(updated_order.budget)
                }
            }
        )

        io.sockets.emit("complete_order", {});
    })
}

exports.sendOrder = async(data, socket, io, users) => {
    const {
        budget,
        message,
        sender_email,
        receiver_email
    } = data.data;
    
    const orders = {};
    const messages = await Messages.find({sender_email, receiver_email});
    for(let k = 0; k < messages.length; k++) {
        const item = messages[k];
        if(!orders[item.order_id]) {
            orders[item.order_id] = item;
        }
    }
    let is_existed_accpeted_order = false;
    for(let key in orders) {
        const order_ = await Order.findOne({_id: key});
        if(order_.status != 2) {
            is_existed_accpeted_order = true;
        }
    }

    if(is_existed_accpeted_order) {
        socket.emit("send_order", "existed_order");
    } else {
        const newOrder = new Order({
            budget,
            message
        });
        newOrder.save().then((order) => {
            const order_id = order._id;
            const newMessage = new Messages({
                sender_email,
                receiver_email,
                message,
                order_id
            });
            newMessage.save().then((message) => {
                socket.emit("send_order", "success");
            }).catch(err => {
                socket.emit("send_order", "failed");
            })
        })
    }
}

exports.getUserAdviceMessages = async (data, socket, io, users) => {
    const sender_email = data.email;
    const admin = await User.findOne({ role: 2 });
    const receiver_email = admin['email'];
    const messages_sender = await Advice.find({
        receiver_email, sender_email
    });
    const messages_receiver = await Advice.find({
        receiver_email: sender_email, sender_email: receiver_email
    });
    messages = messages_sender.concat(messages_receiver);
    socket.emit('get_user_advice_messages', messages);
}

exports.getAdviceUsers = async (data, socket, io, users) => {

    const { email } = data;
    const messages = await Advice.find({ receiver_email: email }); //get all user's messages that chatted with administrator.
    const users_ = {};
    // need to get the unread messages;
    const promises = [];
    messages.map((item) => {
        if (!users_[item.sender_email]) {
            users_[item.sender_email] = { sender_email: item.sender_email, receiver_email: item.receiver_email };
        }
    });
    for (let key in users_) {
        const user = users_[key];
        promises.push(this.getAdviceUserInfo(user.sender_email, user.receiver_email));
    }
    const result = await Promise.all(promises);
    socket.emit('get_advice_users', result);
}

exports.getAdviceUserInfo = async (sender_email, receiver_email) => {
    const user = await User.findOne({ email: sender_email });
    // get the user's name.
    const result = {
        email: sender_email,
        name: user.name
    };
    // get unread user's messages
    const messages = await Advice.find({
        receiver_email,
        sender_email
    });
    let unread_count = 0;
    messages.map((item) => {
        if (item.receiver_read == 0) unread_count++; // if receiver(administrator) didn't read this message;  
    });
    result['unread_count'] = unread_count;
    return result;
}

exports.sendAdminAdviceMessage = async (data, socket, io, users) => {
    const {
        sender_email,
        receiver_email,
        message
    } = data;
    const newAdvice = new Advice({
        sender_email,
        receiver_email,
        message
    });
    newAdvice.save();
    io.sockets.emit('send_advice_message', {
        sender_email,
        receiver_email,
        message,
        create_at: new Date()
    });
}

exports.sendMessage = async (data, socket, io, users) => {
    const {
        sender_email,
        receiver_email,
        message,
        order_id
    } = data;
    const newMessage = new Messages({
        sender_email,
        receiver_email,
        message,
        order_id
    });
    newMessage.save();
    io.sockets.emit('send_message', {
        sender_email,
        receiver_email,
        message,
        create_at: new Date()
    });
}

exports.getMessagesData = async (data, socket, io, users) => {
    const { receiver_email, sender_email } = data;
    const messages_sender = await Messages.find({
        receiver_email, sender_email
    });
    
    const messages_receiver = await Messages.find({
        receiver_email: sender_email, sender_email: receiver_email
    });
    messages = messages_sender.concat(messages_receiver);
    socket.emit('get_messages_data', messages);
}

exports.getAdminAdviceMessages = async (data, socket, io, users) => {
    const { receiver_email, sender_email } = data;
    const messages_sender = await Advice.find({
        receiver_email, sender_email
    });
    
    const messages_receiver = await Advice.find({
        receiver_email: sender_email, sender_email: receiver_email
    });
    messages = messages_sender.concat(messages_receiver);
    socket.emit('get_admin_advice_messages', messages);
}

exports.getMessagesUsers = async(data, socket, io, users) => {
    const { email } = data;
    const messages_receive = await Messages.find({ receiver_email: email });
    const messages_send = await Messages.find({ sender_email: email });
    const messages = messages_receive.concat(messages_send);
    const users_ = {};
    // need to get the unread messages;
    const promises = [];
    messages.map((item) => {
        if (!users_[item.sender_email] && email != item.sender_email) {
            users_[item.sender_email] = { sender_email: item.sender_email, receiver_email: item.receiver_email };
        }
        if (!users_[item.receiver_email] && email != item.receiver_email) {
            users_[item.receiver_email] = { sender_email: item.sender_email, receiver_email: item.receiver_email };
        }
    });
    for (let key in users_) {
        const user = users_[key];
        promises.push(this.getMessagesUserInfo(user.sender_email, user.receiver_email, email));
    }
    const result = await Promise.all(promises);
    io.sockets.emit('get_messages_users', {
        email,
        result
    });
}

exports.getMessagesUserInfo = async (sender_email, receiver_email, email) => {
    if(sender_email == email) email = receiver_email;
    else if(receiver_email == email) email = sender_email;

    const user = await User.findOne({ email });
    // get the user's name.
    let result = {
        email,
        name: user.name,
        birthday: user.birthday,
        gender: user.gender
    };
    // get unread user's messages
    const messages = await Messages.find({
        receiver_email,
        sender_email
    });
    let unread_count = 0;
    for(let k = 0; k < messages.length; k++) {
        const item = messages[k];
        const order = await Order.findOne({_id: item.order_id});
        result = {
            ...result,
            message: order.message,
            order_id: order._id,
            status: order.status,
            budget: order.budget
        };
        if (item.receiver_read == 0) unread_count++; // if receiver(administrator) didn't read this message;          
    }
    result['unread_count'] = unread_count;
    return result;
}
