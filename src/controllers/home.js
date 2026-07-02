exports.getStates = async function (req, res) {
  return res.status(200).json({
    message: "get-states is working",
    count: {
      student: 0,
      expert: 0,
    },
    recommand: {
      students: [],
      experts: [],
    },
    average_review: 0,
  });
};