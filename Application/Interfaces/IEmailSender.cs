using System.Threading.Tasks;


namespace Application.Interfaces
{
    public interface IEmailSender
    {
        Task SendEmailAsync(string recipient, string subject, string body);
    }
}