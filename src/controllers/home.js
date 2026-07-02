exports.getStates = async function (req, res) {
  try {
    const User = require("../models/User");

    const students_count = await User.countDocuments({ type: "student" });
    const experts_count = await User.countDocuments({ type: "expert" });

    const recommand_students = await User.find({ type: "student" }).limit(4);
    const recommand_experts = await User.find({ type: "expert" }).limit(4);

    const usersWithReview = await User.find({
      review: { $exists: true }
    }).select("review");

    let total_review = 0;
    let total_count = 0;

    usersWithReview.forEach((user) => {
      const reviewNumber = Number(user.review);

      if (!isNaN(reviewNumber) && reviewNumber > 0) {
        total_review += reviewNumber;
        total_count++;
      }
    });

    return res.status(200).json({
      count: {
        student: students_count,
        expert: experts_count,
      },
      recommand: {
        students: recommand_students,
        experts: recommand_experts,
      },
      average_review: total_count > 0 ? total_review / total_count : 0,
    });
  } catch (err) {
    console.error("getStates error:", err);

    return res.status(500).json({
      message: "getStates failed",
      error: err.message,
    });
  }
};