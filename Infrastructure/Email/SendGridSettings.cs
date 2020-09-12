namespace Infrastructure.Email
{
    public class SendGridSettings
    {
        public string Username { get; set; }
        public string ApiKey { get; set; }
        public string Sender { get; set; }
    }
}