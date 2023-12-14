import nodemailer from 'nodemailer'

import { dev } from '../config'

export type EmailDataType = {
  email: string
  subject: string
  html: string
}

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: {
    user: dev.app.stmpUsername,
    pass: dev.app.stmpPassword,
  },
})

export const handleSendEmail = async (emailData: EmailDataType) => {
  try {
    const mailOptions = {
      from: dev.app.stmpUsername,
      to: emailData.email,
      subject: emailData.subject,
      html: emailData.html,
    }

    const info = await transporter.sendMail(mailOptions)
  } catch (error) {
    throw error
  }
}
