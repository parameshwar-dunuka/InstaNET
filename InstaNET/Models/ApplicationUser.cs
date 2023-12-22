using Microsoft.AspNetCore.Identity;

namespace InstaNET.Models
{
    public class ApplicationUser:IdentityUser
    {
        public string DisplayName { get; set; }
    }
}