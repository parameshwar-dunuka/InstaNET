using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using Microsoft.Extensions.Hosting;

namespace InstaNET.Models
{
    public class User
    {
        [Key]
        public int Id { get; set; }
        [NotMapped]
        public string EncryptedId { get; set; }
        [Required]
        [MaxLength(50, ErrorMessage = "Name cannot exceed 50 characters")]
        public string Name { get; set; }
        [Required]
        [RegularExpression(@"^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$",
            ErrorMessage = "Invalid Email Format")]
        [Display(Name = "Email")]
        public string Email { get; set; }
    }

    public class RegisterModel
    {
        public string UserName { get; set; }
        public string DisplayName { get; set; }
        public string Email { get; set; }
        public string Password { get; set; }

        public List<string>? Errors { get; set; }

    }
    public class SignInModel
    {
        public string UserName { get; set; }
        public string Password { get; set; }
        public string? DisplayName { get; set; }
        public List<string>? Errors { get; set; }
        public string? JwtToken { get; set; }
        public string? ReturnUrl { get; set; }

    }
    public class Userprof
    {
        public string UserName { get; set; }
        public string? ProfilePic { get; set; }

        public string UserId { get; set; }

        public string? DisplayName { get; set; }
        public bool isFollowing { get; set; }
        public bool isRequester { get; set; }


    }
    public class UserOk
    {
        public string UserID { get; set; }

        public string UserName { get; set; }
        public string Email { get; set; }
        public string ProfilePic { get; set; }

        public string DisplayName { get; set; }
        public int FollowersCount { get; set; }
        public int FollowingCount { get; set; }
        public int PostCount { get; set; }

        public bool isSelf { get; set; }
        public bool IsUserProfPending { get; set; }

        public bool isFollowing { get; set; }
        public bool isFollowingPending { get; set; }

        public bool isInBlocked { get; set; }
        public bool isCelebrity { get; set; }=false;
        public bool isPrivate { get; set; }
        public int lastPostdays { get; set; }
        public string Bio { get; set; }
        public string? MyProfilePic { get; set; }

        public List<Posts> Posts { get; set; }
        public List<Status> Status { get; set; }
        public bool UhaveStatus { get; set; }
        public bool ProfileInPending { get; set; }

        public Status UrStatus { get; set; }

    }
}
