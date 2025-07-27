
const nodemailer = require('nodemailer');

// Utilidad para interpolar variables en la plantilla
function renderTemplate(template, variables = {}) {
  let output = template;
  for (const [key, value] of Object.entries(variables)) {
    const regex = new RegExp(`{{\s*${key}\s*}}`, 'g');
    output = output.replace(regex, value);
  }
  return output;
}

/**
 * options: {
 *   email: string,
 *   subject: string,
 *   template: string, // HTML con {{variable}}
 *   variables: object // { nombre: 'Juan', enlace: '...' }
 * }
 */
const sendEmail = async (options) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  // Renderizar el cuerpo del mensaje usando la plantilla y variables
  const htmlMessage = options.template
    ? renderTemplate(options.template, options.variables)
    : options.message;

  const mailOptions = {
    from: `Asistente de Evaluaciones Anluis <${process.env.EMAIL_USER}>`,
    to: options.email,
    subject: options.subject,
    html: htmlMessage,
  };

  await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;
