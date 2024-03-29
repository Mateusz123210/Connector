from fastapi import BackgroundTasks
import win32com.client as win32

def send_email_with_verification_code_for_registration(background_tasks: BackgroundTasks, recipient: str, verification_code: str):
    subject = 'Kod autoryzacyjny - potwierdzenie rejestracji w aplikacji Connector'
    mailItem = initialize_mail_sending(subject)

    mailItem.HTMLBody = f"""
    <html>
        <body style="margin-left: 0; margin-right: 0; margin-top: 0; padding: 0; box-sizing: border-box; font-family: Arial, Helvetica, sans-serif;">
            <div style="width: 100%; background: #efefef; border-radius: 10px; padding: 10px;">
                <div style="margin: 0 auto; width: 90%; text-align: center;">
                    <h1 style="background-color: rgba(0, 53, 102, 1); padding: 5px 10px; border-radius: 5px; color: #3D2FCF;">Potwierdź swoją rejestrację w aplikacji Connector</h1>
                    <div style="margin: 30px auto; background: white; width: 40%; border-radius: 10px; padding: 50px; text-align: center;">
                        <h3 style="margin-bottom: 100px; font-size: 24px;">Twój kod autoryzacyjny to: <br />{verification_code}</h3>
                        <p style="margin-bottom: 30px;">Aby dokończyć rejestrację, skopiuj kod i wpisz w aplikacji.<br />Jeżeli to nie ty chciałeś/aś założyć konto, zignoruj tę wiadomość.</p>
                    </div>
                </div>
            </div>
        </body>
    </html>
    """
    send_message(mailItem, background_tasks, recipient)

def send_email_with_verification_code_for_login(background_tasks: BackgroundTasks, recipient: str, verification_code: str):
    subject = 'Kod autoryzacyjny - potwierdzenie logowania do aplikacji Connector'
    mailItem = initialize_mail_sending(subject)

    mailItem.HTMLBody = f"""
    <html>
        <body style="margin-left: 0; margin-right: 0; margin-top: 0; padding: 0; box-sizing: border-box; font-family: Arial, Helvetica, sans-serif;">
            <div style="width: 100%; background: #efefef; border-radius: 10px; padding: 10px;">
                <div style="margin: 0 auto; width: 90%; text-align: center;">
                    <h1 style="background-color: rgba(0, 53, 102, 1); padding: 5px 10px; border-radius: 5px; color: #3D2FCF;">Potwierdź logowanie do aplikacji Connector</h1>
                    <div style="margin: 30px auto; background: white; width: 40%; border-radius: 10px; padding: 50px; text-align: center;">
                        <h3 style="margin-bottom: 100px; font-size: 24px;">Twój kod autoryzacyjny to: <br />{verification_code}</h3>
                        <p style="margin-bottom: 30px;">Aby potwierdzić logowanie, skopiuj kod i wpisz w aplikacji.<br />Jeżeli to nie ty chciałeś/aś się zalogować, zignoruj tę wiadomość.</p>
                    </div>
                </div>
            </div>
        </body>
    </html>
    """
    send_message(mailItem, background_tasks, recipient)

def send_email_with_verification_code_for_password_reset(background_tasks: BackgroundTasks, recipient: str, verification_code: str):
    subject = 'Kod autoryzacyjny - potwierdzenie zmiany hasła do aplikacji Connector'
    mailItem = initialize_mail_sending(subject)

    mailItem.HTMLBody = f"""
    <html>
        <body style="margin-left: 0; margin-right: 0; margin-top: 0; padding: 0; box-sizing: border-box; font-family: Arial, Helvetica, sans-serif;">
            <div style="width: 100%; background: #efefef; border-radius: 10px; padding: 10px;">
                <div style="margin: 0 auto; width: 90%; text-align: center;">
                    <h1 style="background-color: rgba(0, 53, 102, 1); padding: 5px 10px; border-radius: 5px; color: #3D2FCF;">Potwierdź zmianę hasła do aplikacji Connector</h1>
                    <div style="margin: 30px auto; background: white; width: 40%; border-radius: 10px; padding: 50px; text-align: center;">
                        <h3 style="margin-bottom: 100px; font-size: 24px;">Twój kod autoryzacyjny to: <br />{verification_code}</h3>
                        <p style="margin-bottom: 30px;">Aby potwierdzić zmianę hasła, skopiuj kod i wpisz w aplikacji.<br />Jeżeli to nie ty chciałeś/aś zmienić hasło, zignoruj tę wiadomość.</p>
                    </div>
                </div>
            </div>
        </body>
    </html>
    """
    send_message(mailItem, background_tasks, recipient)
    

def initialize_mail_sending(subject):
    # construct Outlook application instance
    olApp = win32.Dispatch('Outlook.Application')
    olNS = olApp.GetNameSpace('MAPI')

    # construct the email item object
    mailItem = olApp.CreateItem(0)
    mailItem.Subject = subject
    mailItem.BodyFormat = 1
    # mailItem.Body = "Hello World"
    return mailItem

def send_message(mailItem, background_tasks, recipient):
    mailItem.To = recipient 

    mailItem.Display()

    # mailItem.Save()
    mailItem.Send()

    background_tasks.add_task(mailItem.Send)