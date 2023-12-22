using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace InstaNET.Models
{
    [Table(name:"UserProfile")]
    public class CommonModel
    {
        [Key]
        public int Id { get; set; }
        public string? ProfilePic { get; set; }
        public string? Location { get; set; }
        public string User { get; set; }
        public string? Bio { get; set; }
        public bool IsPrivate { get; set; } = false;
        public bool IsPending { get; set; }
        public DateTime LastLoggedIn { get; set; }

    }
    public class CommonModelInternal
    {
        public string? ProfilePic { get; set; }
        public string? Location { get; set; }
        public string User { get; set; }
        public string? Bio { get; set; }


    }
}
