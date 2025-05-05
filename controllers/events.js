const { prisma } = require("../prisma/prisma.client");

const create = async (req, res) => {
  try {
    const { title, text } = req.body;
    const file = req.file;

    if (!title || !text || !file) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const event = await prisma.event.create({
      data: {
        file: file.path,
        text,
        title,
      },
    });

    res.status(201).json(event);
  } catch (error) {
    console.log(error);

    res.status(500).json({ message: "Unknown server error" });
  }
};

const remove = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ message: "Failed to get ID" });
    }

    const event = await prisma.event.findFirst({
      where: {
        id: +id,
      },
    });

    if (!event) {
      return res.status(404).json({ message: "Failed to find this event" });
    }

    await prisma.event.delete({
      where: {
        id: +id,
      },
    });

    res.status(204).json({ status: "success" });
  } catch (error) {
    console.log(error);

    res.status(500).json({ message: "Unknown server error" });
  }
};

const getAll = async (req, res) => {
  try {
    const events = await prisma.event.findMany();

    res.status(200).json(events);
  } catch (error) {
    res.status(500).json({ message: "Unknown server error" });
  }
};

module.exports = {
  create,
  remove,
  getAll,
};
