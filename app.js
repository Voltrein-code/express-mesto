const path = require('path');
const express = require('express');
const mongoose = require('mongoose');
const { login, createUser } = require('./controllers/users');
const auth = require('./middlewares/auth');
const ForbiddenError = require('./errors/forbidden-error');
const { validateSignIn, validateSignUp, validateRoutesWithAuth } = require('./middlewares/request-validation');

const { PORT = 3000 } = process.env;
const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
});

app.post('/signin', validateSignIn, login);
app.post('/signup', validateSignUp, createUser);

app.use('/users', validateRoutesWithAuth, auth, require('./routes/users'));
app.use('/cards', validateRoutesWithAuth, auth, require('./routes/cards'));

app.use('*', (req, res, next) => next(new ForbiddenError('Запрашиваемый ресурс не найден')));

app.use((err, req, res, next) => {
  const { statusCode = 500, message } = err;

  res.status(statusCode).send({
    message: statusCode === 500
      ? 'На сервере произошла ошибка'
      : message,
  });
  next();
});

app.use(express.static(path.join(__dirname, 'public')));
app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`App listening on port ${PORT}`);
});
