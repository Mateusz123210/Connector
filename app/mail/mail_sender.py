from app.mail.mail_sender_executor import MailSenderExecutor

def send_email_with_verification_code_for_registration(executor: MailSenderExecutor, recipient: str, verification_code: str):
    subject = 'Kod autoryzacyjny - potwierdzenie rejestracji w aplikacji Connector'
    html_message = f"""
    <html>
        <body style="margin-left: 0; margin-right: 0; margin-top: 0; padding: 0; box-sizing: border-box; font-family: Arial, Helvetica, sans-serif;">
            <div style="width: 100%; background: #efefef; border-radius: 10px; padding: 10px;">
                <div style="margin: 0 auto; width: 90%; text-align: center;">
                    <h1 style="background-color: rgba(35, 23, 160, 1); padding: 5px 10px; border-radius: 5px; color: #0DA2F2;">Potwierdź swoją rejestrację w aplikacji Connector</h1>
                    <div style="margin: 30px auto; background: white; width: 40%; border-radius: 10px; padding: 50px; text-align: center;">
                        <h3 style="margin-bottom: 50px; font-size: 24px;">Twój kod autoryzacyjny to: <br /><br /><b><span style="color:#0DA2F2">{verification_code}<span /><b /></h3>
                        <p style="margin-bottom: 30px;">Aby dokończyć rejestrację, skopiuj kod i wpisz w aplikacji.<br />Jeżeli to nie ty chciałeś/aś założyć konto, zignoruj tę wiadomość.</p>
                    </div>
                </div>
            </div>
        </body>
    </html>"""
    executor.send_email(recipient, subject, html_message)

def send_email_with_verification_code_for_login(executor: MailSenderExecutor, recipient: str, verification_code: str):
    subject = 'Kod autoryzacyjny - potwierdzenie logowania do aplikacji Connector'
    html_message = f"""
    <html>
        <body style="margin-left: 0; margin-right: 0; margin-top: 0; padding: 0; box-sizing: border-box; font-family: Arial, Helvetica, sans-serif;">
            <div style="width: 100%; background: #efefef; border-radius: 10px; padding: 10px;">
                <div style="margin: 0 auto; width: 90%; text-align: center;">
                    <h1 style="background-color: rgba(35, 23, 160, 1); padding: 5px 10px; border-radius: 5px; color: #0DA2F2;">Potwierdź logowanie do aplikacji Connector</h1>
                    <div style="margin: 30px auto; background: white; width: 40%; border-radius: 10px; padding: 50px; text-align: center;">
                        <h3 style="margin-bottom: 50px; font-size: 24px;">Twój kod autoryzacyjny to: <br /><br /><b><span style="color:#0DA2F2">{verification_code}<span /><b /></h3>
                        <p style="margin-bottom: 30px;">Aby potwierdzić logowanie, skopiuj kod i wpisz w aplikacji.<br />Jeżeli to nie ty chciałeś/aś się zalogować, zignoruj tę wiadomość.</p>
                    </div>
                </div>
            </div>
        </body>
    </html>
    """
    executor.send_email(recipient, subject, html_message)

def send_email_with_verification_code_for_password_reset(executor: MailSenderExecutor, recipient: str, verification_code: str):
    subject = 'Kod autoryzacyjny - potwierdzenie zmiany hasła do aplikacji Connector'
    html_message = f"""
    <html>
        <body style="margin-left: 0; margin-right: 0; margin-top: 0; padding: 0; box-sizing: border-box; font-family: Arial, Helvetica, sans-serif;">
            <div style="width: 100%; background: #efefef; border-radius: 10px; padding: 10px;">
                <div style="margin: 0 auto; width: 90%; text-align: center;">
                    <h1 style="background-color: rgba(35, 23, 160, 1); padding: 5px 10px; border-radius: 5px; color: #0DA2F2;">Potwierdź zmianę hasła do aplikacji Connector</h1>
                    <div style="margin: 30px auto; background: white; width: 40%; border-radius: 10px; padding: 50px; text-align: center;">
                        <h3 style="margin-bottom: 50px; font-size: 24px;">Twój kod autoryzacyjny to: <br /><br /><b><span style="color:#0DA2F2">{verification_code}<span /><b /></h3>
                        <p style="margin-bottom: 30px;">Aby potwierdzić zmianę hasła, skopiuj kod i wpisz w aplikacji.<br />Jeżeli to nie ty chciałeś/aś zmienić hasło, zignoruj tę wiadomość.</p>
                    </div>
                </div>
            </div>
        </body>
    </html>
    """
    executor.send_email(recipient, subject, html_message)
    