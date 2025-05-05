const { prisma } = require("../prisma/prisma.client");

const create = async (params) => {};

const getAll = async (req, res) => {
  try {
    const groups = await prisma.group.findMany();

    return res.status(200).json(groups);
  } catch (error) {
    console.log(error);

    res.status(500).json({ message: "Unknown server error" });
  }
};

module.exports = {
  create,
  getAll,
};
