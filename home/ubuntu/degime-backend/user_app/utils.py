import random
import string
from django.core.mail import send_mail
from django.conf import settings
import smtplib
from django.core.mail import EmailMessage
from django.template.loader import render_to_string

def generate_vcode(length=6):
    characters = string.digits
    vcode = ''.join(random.choice(characters) for _ in range(length))
    return vcode


def send_vcode_email(email, vcode):
    subject = 'Email Verification'
    context = {'vcode': vcode}
    html_content = render_to_string('email/verification_email.html', context)
    email = EmailMessage(subject, html_content, settings.EMAIL_HOST_USER, [email])
    email.content_subtype = "html"
    email.send()
    