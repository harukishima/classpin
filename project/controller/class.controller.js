const Classroom = require('../models/class.model');

module.exports.index = async (req, res) => {
  const allclass = await Classroom.aggregate([
    {
      $lookup:
        {
          from: "users",
          localField: "teacher",
          foreignField: "_id",
          as: "teacher_info"
        }
    }
  ]);
  console.log(allclass);
  res.render('class/index', {
    allClass: allclass
  })

}

module.exports.create = (req, res) => {
  res.render('class/create', {

  });
}

module.exports.enroll = (req, res) => {
  res.render('class/enroll', {

  });
}