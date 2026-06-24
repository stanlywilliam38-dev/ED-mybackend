const Messages = require('../../models/Messages');
const Order = require('../../models/Order');
const User = require('../../models/User');
const Blog = require('../../models/Blogs');
exports.getSearch = async(req, res) => {
    const {email, name} = req.body;
    const data =  await User.find({type: "expert"});
    const promises = [];
    data.map((item) => {
        promises.push(this.getExpertInfo(item));
    })
    const result = await Promise.all(promises);
    return res.status(200).json({
        data: result
    })
}

exports.getExpertInfo = async function(user) {
    const send_messages = await Messages.find({sender_email: user.email});
    const receiver_messages = await Messages.find({receiver_email: user.email})
    const messages = send_messages.concat(receiver_messages);
    const order_ids = {};
    messages.map((item) => {
        if(!order_ids[item.order_id]) order_ids[item.order_id] = item.order_id; 
    });
    const order_cnt = {
        completed: 0,
        accepting: 0,
        accepted: 0
    };
    
    const blog = await Blogs.findOne({_id: user.blog_id});
    try {
        for(let order_id in order_ids) {
            const order = await Order.findOne({_id: order_id});
            if(order.status == 0 ) order_cnt['accepting'] = order_cnt['accepting'] + 1;
            if(order.status == 1 ) order_cnt['accepted'] = order_cnt['accepted'] + 1;
            if(order.status == 2 ) order_cnt['completed'] = order_cnt['completed'] + 1;
        }
    }catch(e) {
        console.log(order_ids);
        // console.log(e);
    }
    return {
        name: user.name,
        email: user.email,
        gender: user.gender,
        completed: order_cnt.completed,
        accepting: order_cnt.accepting,
        accepted: order_cnt.accepted,
        id: user._id,
        blog_name: blog.title,
        avatar_extension: user.avatar_extension
    }
}