SEND_EMAIL_NOTIFICATION_NEW_USER = '''
Hola {user_fullname}, ha sido registrado como usuario {user_rol} en el Sistema FertiSmart.
A continuación adjuntamos el link del sistema y sus credenciales.

Link: {link_app_fertismart}
Usuario: {username}
Contraseña: {password}

¡Gracias por usar FertiSmart!
Saludos
'''

SEND_EMAIL_NOTIFICATION_RESET_PASSWORD_USER = '''
Hola {user_fullname}, ha sido generado una nueva contraseña para el Sistema FertiSmart.
A continuación adjuntamos el link del sistema y sus nuevas credenciales.

Link: {link_app_fertismart}
Usuario: {username}
Contraseña: {password}

¡Gracias por usar FertiSmart!
Saludos
'''