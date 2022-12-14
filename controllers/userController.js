const { ObjectId } = require("mongoose").Types;
const { User, Thought } = require("../models");

module.exports = {
  // Get all students
  getUsers(req, res) {
    User.find()
      .then((user) => res.json(user))
      .catch((err) => res.status(500).json(err));
  },
  // Get a single student
  getSingleUser(req, res) {
    User.findOne({ _id: req.params.userId })
      .select("-__v")
      .then(async (user) =>
        !user
          ? res.status(404).json({ message: "No user with that ID" })
          : res.json(user)
      )
      .catch((err) => {
        console.log(err);
        return res.status(500).json(err);
      });
  },
  // create a user
  createUser(req, res) {
    User.create(req.body)
      .then((user) => res.json(user))
      .catch((err) => res.status(500).json(err));
  },
  // Delete a user
  async deleteUser(req, res) {
    try {
      const user = await User.findOneAndRemove({ _id: req.params.userId });
      if (!user) {
        res.status(404).json({ message: "No users with that id" });
      } else {
        await Thought.findOneAndUpdate(
          { user: req.params.userId },
          { $pull: { user: req.params.userId } },
          { new: true }
        );
        res.json({ message: "User successfully deleted" });
      }
    } catch (err) {
      console.log(err);
      res.status(500).json(err);
    }
  },

  //Update user by id
  updateUser(req, res) {
    User.findOneAndUpdate(
      { _id: req.params.userId },
      { $set: req.body },
      { runValidators: true, new: true }
    )
      .then((user) =>
        !user
          ? res.status(404).json({ message: "No user found" })
          : res.json(user)
      )
      .catch((err) => res.status(500).json(err));
  },

  //Add a friend to a user
  async addFriend(req, res) {
    try {
      const friend = await User.findOneAndUpdate(
        { _id: req.params.userId },
        { $addToSet: { friends: req.params.friendId } },
        { runValidators: true, new: true }
      );
    } catch (err) {
      console.log(err);
      res.status(500).json(err);
    }
  },

  // Remove friend from a user
  removeFriend(req, res) {
    User.findOneAndUpdate(
      { _id: req.params.userId },
      { $pull: { friends: req.params.friendId } },
      { runValidators: true, new: true }
    )
      .then((user) =>
        !student
          ? res.status(404).json({ message: "No friend found" })
          : res.json(student)
      )
      .catch((err) => res.status(500).json(err));
  },
};
