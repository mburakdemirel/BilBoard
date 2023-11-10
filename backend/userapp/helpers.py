from django.core.mail import send_mail

from django.conf import settings 

def send_forget_password_mail(user, reset_url):
    subject = 'Your forget password link'
    message = f'Hi {user.name},\n\n' \
              f'Click on the link to reset your password:\n{reset_url}\n\n' \
              f'Best regards,\nBilboard team'
    email_from = settings.EMAIL_HOST_USER
    recipient_list = [user.email]
    send_mail(subject, message, email_from, recipient_list)
    return True