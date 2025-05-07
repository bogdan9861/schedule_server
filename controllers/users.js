const { prisma } = require("../prisma/prisma.client");

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const register = async (req, res) => {
  try {
    const { login, password, name, groupId } = req.body;

    if (!login || !password || !name || !groupId) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const isExist = await prisma.user.findFirst({
      where: {
        login,
      },
    });

    if (isExist) {
      return res.status(400).json({
        message: "User already exist ",
      });
    }

    const group = await prisma.group.findFirst({
      where: {
        id: groupId,
      },
    });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await prisma.user.create({
      data: {
        name,
        login,
        password: hashedPassword,
        role: "STUDENT",
        groupId: +groupId,
        course: group.course,
      },
      omit: {
        groupId: true,
      },
      include: {
        group: {
          include: {
            User: false,
            Schedule: false,
          },
        },
      },
    });

    if (!user) {
      return res.status(400).json({ message: "Failed to register user" });
    }

    const token = jwt.sign({ id: user.id }, process.env.SECRET, {
      expiresIn: "30d",
    });

    res.status(201).json({
      ...user,
      token,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({ message: "Unknown server error" });
  }
};

const login = async (req, res) => {
  try {
    const { login, password } = req.body;

    console.log(req.body);

    if (!login || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const user = await prisma.user.findFirst({
      where: {
        login,
      },
      omit: {
        groupId: true,
      },
      include: {
        group: {
          include: {
            User: false,
            Schedule: false,
          },
        },
      },
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);

    const token = jwt.sign({ id: user.id }, process.env.SECRET, {
      expiresIn: "30d",
    });

    if (user && isPasswordCorrect) {
      res.status(200).json({ ...user, token });
    } else {
      res.status(400).json({ message: "Incorrect login data" });
    }
  } catch (error) {
    console.log(error);

    res.status(500).json({ message: "Unknown server error" });
  }
};

const current = async (req, res) => {
  try {
    res.status(200).json({ data: req.user });
  } catch (error) {
    res.status(500).json({ message: "Unknown server error" });
  }
};

const edit = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, login, course, role, groupId } = req.body;

    const data = {};

    Array.from(Object.keys(req.body)).forEach((el) => {
      if (!req.body[el]) return;

      data[el] = req.body[el];
    });

    const user = await prisma.user.update({
      where: {
        id: +id,
      },
      data,
      include: {
        group: {
          include: {
            Schedule: false,
            User: false,
          },
        },
      },
    });

    res.status(200).json(user);
  } catch (error) {
    console.log(error);

    res.status(500).json({ message: "Unknown server error" });
  }
};

module.exports = {
  register,
  login,
  current,
  edit,
};
