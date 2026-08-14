import resend

from django.conf import settings


resend.api_key = settings.RESEND_API_KEY



def send_email_notification(
        to_email,
        subject,
        message
):

    try:

        response = resend.Emails.send({

            "from":
            "Quick Ecommerce <onboarding@resend.dev>",


            "to":
            [
                to_email
            ],


            "subject":
            subject,


            "text":
            message

        })


        return response


    except Exception as e:

        print(
            "EMAIL ERROR:",
            e
        )


        return None
