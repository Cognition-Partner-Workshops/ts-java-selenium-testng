import smtplib
from datetime import datetime
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText

from example.example.util.logger_util import get_logger, log
from example.example.util.test_properties import get_property


def send_mail(total: int, passed: int, failed: int, skipped: int) -> bool:
    send_mail_flag = get_property("mail.sendmail")

    if send_mail_flag and send_mail_flag.lower() == "true":
        try:
            tos = get_property("mail.to").split(",")
            from_addr = get_property("mail.from")
            mail_host = get_property("mail.host")
            port = int(get_property("mail.port"))
            username = get_property("mail.user")
            pwd = get_property("mail.password")
            mail_subject = get_property("mail.subject")

            msg = MIMEMultipart("alternative")
            msg["Subject"] = f"{mail_subject} | {datetime.now().strftime('%m-%d-%Y')}"
            msg["From"] = f"Automation Execution <{from_addr}>"
            msg["To"] = ", ".join(tos)

            html_body = _get_mail_body(total, passed, failed, skipped)
            msg.attach(MIMEText(html_body, "html"))

            with smtplib.SMTP(mail_host, port) as server:
                server.starttls()
                server.login(username, pwd)
                server.sendmail(from_addr, tos, msg.as_string())

            return True
        except Exception as e:
            get_logger().fatal("Could not send mail : %s", str(e))
            return False
    else:
        log("Mail sending toggle is set to false")
        return False


def _get_mail_body(total: int, passed: int, failed: int, skipped: int) -> str:
    return (
        "<!DOCTYPE html>\r\n"
        "<html>\r\n"
        "<body>\r\n"
        "<h1>Automation Execution report...</h1>\r\n"
        '<table border="1" style="width:100%;text-align:center;">\r\n'
        "  <tr>\r\n"
        '    <th style="color:blue">Total</th>\r\n'
        '    <th style="color:green">Passed</th>\r\n'
        '    <th style="color:red">Failed</th>\r\n'
        '    <th style="color:yellow">Skipped</th>\r\n'
        "  </tr>\r\n"
        "  <tr>\r\n"
        f"    <td>{total}</td>\r\n"
        f"    <td>{passed}</td>\r\n"
        f"    <td>{failed}</td>\r\n"
        f"    <td>{skipped}</td>\r\n"
        "  </tr>\r\n"
        "</table>\r\n"
        "</body>\r\n"
        "</html>\r\n"
    )
