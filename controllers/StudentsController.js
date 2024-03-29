const Student = require("../models/StudentModel");

class StudentsController {
  // [GET] /students
  async getAllStudents(req, res) {
    try {
      const page = parseInt(req.query.page) - 1 || 0;
      const limit = parseInt(req.query.limit) || 6;
      const search = req.query.search || "";

      const students = await Student.find({
        fullname: { $regex: search, $options: "i" },
      })
        .skip(page * limit)
        .limit(limit);

      const total = await Student.countDocuments({
        fullname: { $regex: search, $options: "i" },
      });

      const studentsRes = students.map((student) => {
        const { _id, fullname, email, createdAt } = student;
        return {
          _id,
          fullname,
          email,
          createdAt,
          password: undefined,
        };
      });

      const response = {
        error: false,
        total,
        page: page + 1,
        limit,
        data: studentsRes,
      };
      res.status(200).json(response);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  // [GET] /students/:id
  async getStudentDetail(req, res) {
    try {
      const student = await Student.findById(req.params.id);
      res.json(student);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  // [DELETE] /students/:id
  async deleleStudent(req, res) {
    try {
      await Student.deleteOne({ _id: req.params.id });
      res.status(200).json({ message: "Delete Student Successful" });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }
}

module.exports = new StudentsController();
