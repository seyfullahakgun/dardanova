import { NextResponse } from "next/server";
import sgMail from "@sendgrid/mail";
import fs from "fs";
import path from "path";

// SendGrid API anahtarını environment variable'dan alıyoruz
sgMail.setApiKey(process.env.SENDGRID_API_KEY!);

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { fullName, email, subject, message, phone } = body;

    // Gelen verileri doğrulama
    if (!fullName || !email || !subject || !message) {
      return NextResponse.json(
        { error: "Lütfen tüm alanları doldurun" },
        { status: 400 }
      );
    }

    const template = fs.readFileSync(
      path.join(process.cwd(), "src/app/api/templates/contact.html"),
      "utf8"
    );

    // Mail içeriğini oluşturma
    const msg = {
      to: process.env.CONTACT_EMAIL!, // Alıcı email adresi
      from: process.env.SENDGRID_FROM_EMAIL!, // Gönderen email adresi
      subject: `Yeni İletişim Formu Mesajı - ${fullName}`,
      text: `
        İsim: ${fullName}
        Email: ${email}
        Konu: ${subject}
        Mesaj: ${message}
        Telefon: ${phone}
      `,
      html: template
        .replace(/{{name}}/g, fullName)
        .replace(/{{email}}/g, email)
        .replace(/{{subject}}/g, subject)
        .replace(/{{message}}/g, message)
        .replace(/{{phone}}/g, phone),
    };

    // Maili gönderme
    await sgMail.send(msg);

    return NextResponse.json(
      { message: "Mesajınız başarıyla gönderildi" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Mail gönderme hatası:", error);
    return NextResponse.json(
      { error: "Mesaj gönderilirken bir hata oluştu" },
      { status: 500 }
    );
  }
}
