using System.Threading.Tasks;
using Application.Interfaces;
using Microsoft.Extensions.Options;
using SendGrid;
using SendGrid.Helpers.Mail;


namespace Infrastructure.Email
{
    public class EmailSender : IEmailSender
    {
        private readonly IOptions<SendGridSettings> _settings;

        
        public EmailSender(IOptions<SendGridSettings> settings)
        {
            _settings = settings;
        }
        
        
        public async Task SendEmailAsync(string recipient, string subject, string body)
        {
            var client = new SendGridClient(_settings.Value.ApiKey);
            var msg = new SendGridMessage
            {
                From = new EmailAddress(_settings.Value.Sender, _settings.Value.Username),
                Subject = subject,
                PlainTextContent = body,
                HtmlContent = body
            };
            msg.AddTo(new EmailAddress(recipient));
            msg.SetClickTracking(false, false);

            await client.SendEmailAsync(msg);
        }
    }
}