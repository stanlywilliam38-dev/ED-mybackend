const User = require('../models/User');

exports.getStates = async function (req, res) {
    const students_count = await getStudentsCount();
    const experts_count = await getExpertsCount();
    const recommand_students = await getRecommandStudents();
    const recommand_experts = await getRecommandExperts();
    const reviews = await User.aggregate([
        {
            $match: {}
        },

        {
            $group: { _id: "$_id", review: { $sum: "$review" } }
        }
    ]);
    let total_review = 0;
    let total_count = 0;
    console.log(reviews);
    reviews.map((item) => {
        if(item.review > 0) {
            total_count++;
            total_review += item.review;
        }
    });

    return res.status(200).json({
        count: {
            student: students_count,
            expert: experts_count
        },
        recommand: {
            students: recommand_students,
            experts: recommand_experts
        },
        average_review: total_review / total_count,
        
       
    });
    
}

async function getStudentsCount() {
    const count = await User.find({ type: "student" }).count();
    return count;
}

async function getExpertsCount() {
    const count = await User.find({ type: "expert" }).count();
    return count;
}

async function getRecommandStudents() {
    return await User.find({ type: "student" }).limit(4);
}

async function getRecommandExperts() {
    return await User.find({ type: "expert" }).limit(4);
}
