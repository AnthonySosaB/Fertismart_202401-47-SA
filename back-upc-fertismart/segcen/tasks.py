from django.core.mail import send_mail
from django.conf import settings

from segcen.constants import SEND_EMAIL_NOTIFICATION_NEW_USER, SEND_EMAIL_NOTIFICATION_RESET_PASSWORD_USER


def send_email_notified_new_user(data):
    arr_emails = data['recipient_list']
    send_mail(
        subject=f"{'FertiSmart - Notificación de creación de creación de usuario'}",
        message=SEND_EMAIL_NOTIFICATION_NEW_USER.format(
            user_fullname=data['user_fullname'],
            link_app_fertismart=data['link_app_fertismart'],
            user_rol=data['user_rol'],
            username=data['username'],
            password=data['password'],
        ),
        from_email=settings.EMAIL_HOST_USER,
        recipient_list=[arr_emails]
    )


def send_email_notified_reset_password_user(data):
    arr_emails = data['recipient_list']
    send_mail(
        subject=f"{'FertiSmart - Notificación de reseteo de contraseña de usuario'}",
        message=SEND_EMAIL_NOTIFICATION_RESET_PASSWORD_USER.format(
            user_fullname=data['user_fullname'],
            link_app_fertismart=data['link_app_fertismart'],
            username=data['username'],
            password=data['password'],
        ),
        from_email=settings.EMAIL_HOST_USER,
        recipient_list=[arr_emails]
    )
