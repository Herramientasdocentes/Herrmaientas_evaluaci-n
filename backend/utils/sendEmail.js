const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
  // 1. Crear un "transportador" - el servicio que enviará el correo (Gmail en este caso)
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER, // Tu correo desde el .env
      pass: process.env.EMAIL_PASS, // Tu contraseña de aplicación desde el .env
    },
  });

  // 2. Definir las opciones del correo (destinatario, asunto, cuerpo del mensaje)
  const mailOptions = {
    from: `Asistente de Evaluaciones Anluis <${process.env.EMAIL_USER}>`,
    to: options.email,
    subject: options.subject,
    html: options.message, // Usamos HTML para poder incluir enlaces
  };

  // 3. Enviar el correo
  await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;
