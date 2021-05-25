const Card = require('../models/card');

module.exports.getCards = (req, res) => {
  Card.find({})
    .then((cards) => {
      res.status(200).send(cards);
    })
    .catch((err) => {
      res.status(500).send({ message: err.message });
    });
};

module.exports.createCard = (req, res) => {
  const { name, link } = req.body;
  const owner = req.user._id;

  Card.create({ name, link, owner })
    .then((card) => {
      res.status(200).send(card);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(400).send({ message: 'Переданы некорректные данные при создании карточки' });
        return;
      }
      res.status(500).send({ message: err.message });
    });
};

module.exports.deleteCard = (req, res) => {
  Card.findByIdAndDelete(req.params.cardId)
    .orFail(() => {
      res.status(404).send({ message: 'Карточка с указанным _id не найдена' });
    })
    .then((deletedCard) => {
      res.status(200).send(deletedCard);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(400).send({ message: 'Переданы некорректные данные при удалении карточки' });
        return;
      }
      res.status(500).send({ message: err.message });
    });
};

module.exports.likeCard = (req, res) => {
  const currentUser = req.user._id;

  Card.findByIdAndUpdate(req.params.cardId, { $addToSet: { likes: currentUser } }, { new: true })
    .orFail(() => {
      res.status(404).send({ message: 'Карточка с указанным _id не найдена' });
    })
    .then((card) => {
      res.status(200).send(card);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(400).send({ message: 'Переданы некорректные данные для постановки лайка' });
        return;
      }
      res.status(500).send({ message: err.message });
    });
};

module.exports.dislikeCard = (req, res) => {
  const currentUser = req.user._id;

  Card.findByIdAndUpdate(req.params.cardId, { $pull: { likes: currentUser } }, { new: true })
    .orFail(() => {
      res.status(404).send({ message: 'Карточка с указанным _id не найдена' });
    })
    .then((card) => {
      res.status(200).send(card);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(400).send({ message: 'Переданы некорректные данные для снятия лайка' });
        return;
      }
      res.status(500).send({ message: err.message });
    });
};
