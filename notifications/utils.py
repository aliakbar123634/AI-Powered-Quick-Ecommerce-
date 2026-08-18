import resend

from django.conf import settings


resend.api_key = settings.RESEND_API_KEY



def send_email_notification(
        to_email,
        subject,
        message
):
    try:
        if not settings.RESEND_API_KEY:
            raise ValueError("RESEND_API_KEY is not configured")

        if not to_email:
            raise ValueError("Recipient email is missing")

        return resend.Emails.send({
            "from": settings.RESEND_FROM_EMAIL,
            "to": [to_email],
            "subject": subject,
            "text": message,
        })
    except Exception as error:
        # Keep the delivery-status API working even if the email provider fails.
        # The exact Resend error is visible in the Django server console.
        print(f"EMAIL ERROR for {to_email}: {error}")
        return None
