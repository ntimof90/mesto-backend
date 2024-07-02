const { Schema, model } = require('mongoose');
const { isEmail, isURL } = require('validator');

const userSchema = new Schema(
  {
    email: {
      type: String,
      validate: {
        validator: isEmail,
        message: 'Требуется email',
      },
      required: true,
    },
    password: {
      type: String,
      required: true,
      select: false,
    },
    name: {
      type: String,
      minlength: 2,
      maxlength: 30,
      default: 'Жак-Ив Кусто',
    },
    about: {
      type: String,
      minlength: 2,
      maxlength: 30,
      default: 'Исследователь',
    },
    avatar: {
      type: String,
      validate: {
        validator: isURL,
        message: 'Требуется ссылка',
      },
      default:
        'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
    },
  },
  { versionKey: false },
);

userSchema.index({ email: 1 }, { unique: true });

module.exports = model('user', userSchema);
