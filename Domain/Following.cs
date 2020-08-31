using System;

namespace Domain
{
    public class Following
    {
        public string ObserverId { get; set; }
        public string TargetId { get; set; }
        public virtual AppUser Observer { get; set; }
        public virtual AppUser Target { get; set; }
    }
}