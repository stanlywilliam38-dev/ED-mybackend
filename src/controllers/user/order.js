
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const keys = require('../../../config/keys');
const Order = require('../../models/Order');
const Messages = require('../../models/Messages');
const User = require('../../models/User');

exports.getOrders = async (req, res) => {
    const {email, status, type } = req.body;
    let orders = [];
    if (status == "all") {
        orders = await Order.find({  });
    } else {
        orders = await Order.find({ status });
    }
    const promises = [];
    orders.map((item) => {
        promises.push(this.getUserInfo(item));
    })
    const result = await Promise.all(promises);
    result.map((item) => {
        if(type) {
            if(type == "expert" && item.expert == email) return item;
            if(type == "student" && item.student == email) return item;
        } else {
            return item;
        }     
    });
    return res.status(200).json(result);
}

exports.getUserInfo = async (order) => {
    const message = await Messages.findOne({ order_id: order._id })
    const { sender_email, receiver_email } = message;
    const sender = await User.findOne({ email: sender_email });
    const receiver = await User.findOne({ email: receiver_email });
    let student = sender, expert = receiver;
    if (sender.type == "expert") {
        student = receiver;
        expert = sender;
    }
    return {
        student: student.email,
        expert: expert.email,
        status: order.status,
        budget: order.budget,
        message: order.message,
        create_at: order.create_at
    };
}
