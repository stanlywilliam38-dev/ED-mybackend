const User = require("../models/User");

exports.getStates = async function (req, res) {
  try {
    const students_count = await getStudentsCount();
    const experts_count = await getExpertsCount();
    const recommand_students = await getRecommandStudents();
    const recommand_experts = await getRecommandExperts();

    const reviews = await User.find({
      review: { $exists: true, $gt: 0 },
    }).select("review");

    let total_review = 0;
    let total_count = 0;

    reviews.forEach((item) => {
      const reviewNumber = Number(item.review);

      if (!isNaN(reviewNumber) && reviewNumber > 0) {
        total_count++;
        total_review += reviewNumber;
      }
    });

    const average_review =
      total_count > 0 ? total_review / total_count : 0;

    return res.status(200).json({
      count: {
        student: students_count,
        expert: experts_count,
      },
      recommand: {
        students: recommand_students,
        experts: recommand_experts,
      },
      average_review: average_review,
    });
  } catch (err) {
    console.error("getStates error:", err);

    return res.status(500).json({
      message: "Server error in getStates",
      error: err.message,
    });
  }
};

async function getStudentsCount() {
  return await User.countDocuments({ type: "student" });
}

async function getExpertsCount() {
  return await User.countDocuments({ type: "expert" });
}

async function getRecommandStudents() {
  return await User.find({ type: "student" }).limit(4);
}

async function getRecommandExperts() {
  return await User.find({ type: "expert" }).limit(4);
}