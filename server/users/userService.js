// server/users/userService.js
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const eventService = require("../events/eventService");
const reservationService = require("../reservations/reservationService");
const {AppError} = require('../helpers/AppError')

const bcrypt = require('bcrypt');
const createUser = async (userData) => {
    const { username, email, password } = userData;
    const existingUser = await prisma.user.findFirst({
        where: {
          OR: [
            { username: username },
            { email: email }
          ]
        }
      });
    
      if (existingUser) {
        throw new AppError('Username or email already in use');
      }

      const saltRounds = 10;
      userData.password = await bcrypt.hash(userData.password, saltRounds);
    return await prisma.user.create({
        data: userData,
    });
};

const getUser = async(id) => {
    return await prisma.user.findUnique({
        where: { id: parseInt(id) },
    });
}

const getUsers = async() => {
    return await prisma.user.findMany();
}

const editUser = async (id, userData) => {
  const { username, email, password } = userData;

  // Fetch the existing user by ID
  const existingUser = await prisma.user.findUnique({
      where: { id: parseInt(id) },
  });

  // Check if the new username or email is already in use by another user
  const conflictingUser = await prisma.user.findFirst({
      where: {
          OR: [
              { username: username },
              { email: email }
          ],
          NOT: {
              id: parseInt(id)
          }
      }
  });

  if (conflictingUser) {
      throw new AppError('Username or email already in use');
  }

  let hashedPassword = password;
  if (password && password !== existingUser.password) {
      const saltRounds = 10;
      hashedPassword = await bcrypt.hash(password, saltRounds);
  }

  return await prisma.user.update({
      where: { id: parseInt(id) },
      data: {
          username,
          email,
          ...(password ? { password: hashedPassword } : {})
      },
  });
};

const deleteUser = async(id) => {
  const user =  await prisma.user.findUnique({ where: { id: parseInt(id) }});
  if (!user) {
      throw new AppError('User does not exist');
  }
  await eventService.deleteEventCreatedByUser(id)
  await reservationService.deleteAllReservationsForUser(id);
  await prisma.user.delete({
      where: { id: parseInt(id) },
  });
}

module.exports = {
    createUser,
    getUser,
    getUsers,
    editUser,
    deleteUser
};
