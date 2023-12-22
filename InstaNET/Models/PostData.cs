using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace InstaNET.Models
{
    public class PostData
    {
        [Key]
        public int Id { get; set; }
        public string subtitle { get; set; }
        public string Description { get; set; }
        public bool DisableComments { get; set; }=false;
        [Column("FileStream")]
        public string File { get; set; }
        public DateTime CreatedOn { get; set; } = DateTime.Now;
        public string? UserId { get; set; }

    }
    public class StatusData
    {
        [Key]
        public int UnqId { get; set; }
        public string Description { get; set; }

        [Column("FileStream")]
        public string File { get; set; }
        public DateTime CreatedOn { get; set; } = DateTime.Now;
        public string? UserId { get; set; }
    }
}
