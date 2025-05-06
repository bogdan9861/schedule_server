const { prisma } = require("../prisma/prisma.client");

const create = async (req, res) => {
  try {
    const { groupId, date } = req.body;
    const file = req.file;

    if (!file || !file?.path || !date) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const schedule = await prisma.schedule.create({
      data: {
        groupId: +groupId,
        file: file.path,
        date: date,
      },
      include: {
        group: {
          include: {
            Schedule: false,
            User: false,
          },
        },
      },
    });

    res.status(201).json(schedule);
  } catch (error) {
    console.log(error);

    res.status(500).json({ message: "Unknown server error" });
  }
};

const getMyChedule = async (req, res) => {
  try {
    if (!req.user.groupId) {
      return res
        .status(400)
        .json({ message: "Failed to get group on this account" });
    }

    const schedules = await prisma.schedule.findMany({
      where: {
        groupId: req.user.groupId,
      },
      include: {
        group: {
          include: {
            Schedule: false,
            User: false,
          },
        },
      },
    });

    res.status(200).json(schedules);
  } catch (error) {
    console.log(error);

    res.status(500).json({ message: "Unknown server error" });
  }
};

module.exports = {
  create,
  getMyChedule,
};
