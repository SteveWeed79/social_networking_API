const { User, Thought } = require("../models");

module.exports = {
  // Get all thoughts
  getThoughts(req, res) {
    Thought.find()
      .then((thoughts) => res.json(thoughts))
      .catch((err) => res.status(500).json(err));
  },
  // Get a thought
  getSingleThought(req, res) {
    Thought.findOne({ _id: req.params.thoughtId })
      .select("-__v")
      .then((thought) =>
        !thought
          ? res.status(404).json({ message: "No thought found" })
          : res.json(thought)
      )
      .catch((err) => res.status(500).json(err));
  },

  // Create a thought
  createThought(req, res) {
    Thought.create(req.body)
      .then((thought) => res.json(thought))
      .catch((err) => {
        console.log(err);
        return res.status(500).json(err);
      });
  },

  // Delete a Thought
  async deleteThought(req, res) {
    try {
      const thought = await Thought.findOneAndRemove({
        _id: req.params.thoughtId,
      });
      if (!thought) {
        res.status(404).json({ message: "No thought with that id" });
      } else {
        await User.findOneAndUpdate(
          { user: req.params.userId },
          { $pull: { user: req.params.thoughtId } },
          { new: true }
        );
        res.json({ message: "Thought successfully deleted" });
      }
    } catch (err) {
      console.log(err);
      res.status(500).json(err);
    }
  },

  // Update a thought
  updateThought(req, res) {
    Thought.findOneAndUpdate(
      { _id: req.params.thoughtId },
      { $set: req.body },
      { runValidators: true, new: true }
    )
      .then((thought) =>
        !thought
          ? res.status(404).json({ message: "No thoughts with this id!" })
          : res.json(thought)
      )
      .catch((err) => res.status(500).json(err));
  },

  // Create reaction
  postReaction(req, res) {
    Reaction.create(req.body)
      .then((reaction) => res.json(reaction))
      .catch((err) => {
        console.log(err);
        return res.status(500).json(err);
      });
  },

  // Delete a Thought
  async deleteReaction(req, res) {
    try {
      const reaction = await Reaction.findOneAndRemove({
        _id: req.params.reaction,
      });
      if (!reaction) {
        res.status(404).json({ message: "No reaction with that id" });
      } else {
        await Thought.findOneAndUpdate(
          { thought: req.params.thoughtId },
          { $pull: { user: req.params.reactionId } },
          { new: true }
        );
        res.json({ message: "successfully deleted" });
      }
    } catch (err) {
      console.log(err);
      res.status(500).json(err);
    }
  },
};
