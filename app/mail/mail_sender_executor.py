import smtplib, ssl
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from cryptography.fernet import Fernet


class MailSenderExecutor():

    def __init__(self):
        self.load()
    
    def load(self):
        self.port= 587
        self.smtp_server = 'smtp.office365.com'
        self.sender_email = 'connector.communicator@outlook.com'
        key = b'sWRlN54aPzceRZdPMq4NPWBY9k_a9D899nV3hOdNrgg='
        f = Fernet(key)

        with open("./app/keys/outlook_key.env", "rb") as encrypted_file:
            encrypted = encrypted_file.read()

        self.password = f.decrypt(encrypted).decode("utf-8")
        self.server = None
        self.context = ssl.create_default_context()
        self.start_connection_with_email_server()
    
    def start_connection_with_email_server(self):
        self.server = smtplib.SMTP(self.smtp_server, self.port)
        # self.server.ehlo()
        # self.server.starttls(context=self.context)
        # self.server.ehlo()
        # self.server.login(self.sender_email, self.password)

    def quit_connection_with_email_server(self):
        self.server.quit()

    def send_email(self, receiver_email, subject, html_message):
        msg = MIMEMultipart('alternative')
        msg['Subject'] = subject
        msg['From'] = self.sender_email
        msg['To'] = receiver_email
        msg.attach(MIMEText(html_message, 'html'))
        self.server.sendmail(self.sender_email, receiver_email, msg.as_string())
