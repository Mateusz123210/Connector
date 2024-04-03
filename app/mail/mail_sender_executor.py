import smtplib, ssl
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText


class MailSenderExecutor():

    def __init__(self):
        self.port= 587
        self.smtp_server = 'smtp.office365.com'
        self.sender_email = 'connector.communicator@outlook.com'
        self.password = '6yb-uow^=asl*V5D'
        self.server = None
        self.context = ssl.create_default_context()
        self.start_connection_with_email_server()
    
    def start_connection_with_email_server(self):
        self.server = smtplib.SMTP(self.smtp_server, self.port)
        self.server.ehlo()
        self.server.starttls(context=self.context)
        self.server.ehlo()
        self.server.login(self.sender_email, self.password)

    def quit_connection_with_email_server(self):
        self.server.quit()

    def send_email(self, receiver_email, subject, html_message):
        msg = MIMEMultipart('alternative')
        msg['Subject'] = subject
        msg['From'] = self.sender_email
        msg['To'] = receiver_email
        msg.attach(MIMEText(html_message, 'html'))
        self.server.sendmail(self.sender_email, receiver_email, msg.as_string())
