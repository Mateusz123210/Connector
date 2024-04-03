# sending email, that works

# import smtplib, ssl
# from email.mime.multipart import MIMEMultipart
# from email.mime.text import MIMEText

# port= 587
# smtp_server = 'smtp.office365.com'
# sender_email = 'connector.communicator@outlook.com'
# password = '6yb-uow^=asl*V5D'
# receiver_email = "252808@student.pwr.edu.pl"
# subject = "Works"
# # msg = "Sa"

# msg = MIMEMultipart('alternative')
# msg['Subject'] = subject
# msg['From'] = sender_email
# msg['To'] = receiver_email
# html = \
# """
# <html>
#         <body style="margin-left: 0; margin-right: 0; margin-top: 0; padding: 0; box-sizing: border-box; font-family: Arial, Helvetica, sans-serif;">
#             <div style="width: 100%; background: #efefef; border-radius: 10px; padding: 10px;">
#                 <div style="margin: 0 auto; width: 90%; text-align: center;">
#                     <h1 style="background-color: rgba(0, 53, 102, 1); padding: 5px 10px; border-radius: 5px; color: #3D2FCF;">Potwierdź zmianę hasła do aplikacji Connector</h1>
#                     <div style="margin: 30px auto; background: white; width: 40%; border-radius: 10px; padding: 50px; text-align: center;">
#                         <h3 style="margin-bottom: 100px; font-size: 24px;">Twój kod autoryzacyjny to: <br />{verification_code}</h3>
#                         <p style="margin-bottom: 30px;">Aby potwierdzić zmianę hasła, skopiuj kod i wpisz w aplikacji.<br />Jeżeli to nie ty chciałeś/aś zmienić hasło, zignoruj tę wiadomość.</p>
#                     </div>
#                 </div>
#             </div>
#         </body>
#     </html>
# """
# msg.attach(MIMEText(html, 'html'))


# # message = \
# # f"""From:{sender_email}
# # To:{receiver_email}
# # Subject:{subject}

# # {msg}"""
# context = ssl.create_default_context()

# with smtplib.SMTP(smtp_server, port) as server:
#     server.ehlo()
#     server.starttls(context=context)
#     server.ehlo()
#     server.login(sender_email, password)
#     server.sendmail(sender_email, receiver_email, msg.as_string())
