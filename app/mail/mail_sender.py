from mail.mail_sender_executor import MailSenderExecutor

def send_email_with_registration_confirmation(executor: MailSenderExecutor, recipient: str):
    subject = 'Potwierdzenie rejestracji w aplikacji Connector'
    html_message = f"""
    <html>
        <body style="margin-left: 0; margin-right: 0; margin-top: 0; padding: 0; box-sizing: border-box; font-family: Arial, Helvetica, sans-serif;">
            <div style="width: 100%; background: #efefef; border-radius: 10px; padding: 10px;">
                <div style="margin: 0 auto; width: 90%; text-align: center;">
                    <h1 style="background-color: rgba(35, 23, 160, 1); padding: 5px 10px; border-radius: 5px; color: #0DA2F2;">Potwierdzenie rejestracji w aplikacji connector</h1>
                    <div style="margin: 30px auto; background: white; width: 40%; border-radius: 10px; padding: 50px; text-align: center;">
                        
                        <p style="margin-bottom: 30px;">Na Twój adres email {recipient} zostało utworzone konto w Aplikacji Connector. Możesz zacząć czatować ze znajomymi. </p>
                    </div>
                </div>
            </div>
        </body>
    </html>"""

    executor.send_email(recipient, subject, html_message)

    