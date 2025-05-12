const { prisma } = require("../prisma/prisma.client");
const { sendEmail } = require("../utils/sendEmail");

const create = async (req, res) => {
  try {
    const { groupId } = req.body;
    const file = req.file;

    if (!file || !file?.path || !groupId) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const users = await prisma.user.findMany({
      where: {
        groupId: +groupId,
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

    const schedule = await prisma.schedule.create({
      data: {
        groupId: +groupId,
        file: file.path,
        fileName: file.originalname,
        fileExtension: file.mimetype,
      },
      include: {
        group: true,
      },
    });

    users.forEach((user) => {
      sendEmail(
        user?.login,
        "Новое расписание",
        `Для вашей группы ${user.group.name} готово новое рассписание`
      );
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
    res.status(500).json({ message: "Unknown server error" });
  }
};

const getAll = async (req, res) => {
  try {
    const { groupId, name } = req.query;

    console.log(name);

    let where = {};

    if (groupId) {
      where.groupId = +groupId;
    }

    if (name) {
      where.fileName = { contains: name };
    }

    console.log(where);

    const schedules = await prisma.schedule.findMany({
      orderBy: {
        date: "desc",
      },
      where,
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

const remove = async (req, res) => {
  try {
    const { id } = req.params;

    const schedule = await prisma.schedule.delete({
      where: {
        id: +id,
      },
    });

    res.status(204).json({ status: "success" });
  } catch (error) {
    res.status(500).json({ message: "Unknown server error" });
  }
};

module.exports = {
  create,
  getMyChedule,
  getAll,
  remove,
};
