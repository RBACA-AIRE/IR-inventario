import bcrypt from 'bcrypt';

const password = 'prueba123';

bcrypt.hash(password, 10).then(hash => {
  console.log('Hash generado:', hash);
});
