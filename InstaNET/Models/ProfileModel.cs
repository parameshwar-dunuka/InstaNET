using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace InstaNET.Models
{
    [Table(name:"Relations")]
    public class Relations
    {
        [Key]
        public int Id { get; set; }
        [Required]
        public string From { get; set; }
        [Required]
        public string To { get; set; }
        public bool IsBlocked { get; set; }=false;
        public bool IsActive { get; set; }
        public bool IsPending{ get; set; }

        public DateTime Createdon { get; set; }=DateTime.Now;
        
    }

    [Table(name: "Comments")]
    public class Comments
    {
        [Key]
        public int Id { get; set; }
        public int ReplyTo { get; set; }
        public int ForPost { get; set; }
        [Required]
        public string Comment { get; set; }
        public string CommentByUser { get; set; }

        public DateTime Createdon { get; set; } = DateTime.Now;

    }

    [Table(name: "SavePosts")]
    public class SavePosts
    {
        [Key]
        public int Id { get; set; }
        public string? ForPost { get; set; }
        public string? SavedBy { get; set; }
        public string? TaggedTo { get; set; }

    }

    [Table(name: "LikePosts")]
    public class LikePosts
    {
        [Key]
        public int Id { get; set; }
        public int ForPost { get; set; }
        public string LikeBy { get; set; }
    }

    [Table(name: "StatusSeen")]
    public class StatusSeen
    {
        [Key]
        public int Id { get; set; }
        public int StatusId { get; set; }
        public string? SeenByUser { get; set; }

    }
    public class Status
    {
        public int Id { get; set; }
        public int StatusId { get; set; }
        public string StatusData { get; set; }
        public bool IsSeen { get; set; }
        public string Description { get; set; }
        public string WhoseStatus { get; set; }
        public bool isSelfStatus { get; set; }
        public string seenAgo { get; set; }


    }

    public class Posts
    {
        public int Id { get; set; }
        public int PostId { get; set; }
        public string PostData { get; set; }
        public string PostedUser { get; set; }
        public string PostedUserName { get; set; }

        public bool IsLiked { get; set; }
        public int NumofLikes { get; set; }
        public int NumofComments { get; set; }
        public Comment TopComment { get; set; }

        public bool IsSaved { get; set; }
        public string ProfilePic { get; set; }
        public string Subtitle { get; set; }
        public DateTime postCreatedDate { get; set; }
        public string PostDescription { get; set; }
    }
    public class Comment
    {
        public int Id { get; set; }
        public int ForPost { get; set; }
        public string CommentStr { get; set; }
        public string CommentByUser { get; set; }
        public string? UserName { get; set; }
        public string? UserProfilepic { get; set; }
        public DateTime Createdon { get; set; } = DateTime.Now;

    }
    public class UserSearch
    {
        public string UserId { get; set; }
        public bool isFollowing { get; set; }
        public string? UserName { get; set; }
        public string? UserProfilepic { get; set; }

    }

    public class UserProfile
    {
        public string? UserId { get; set; }
        public string OriginalUserName { get; set; }

        public string DisplayName { get; set; }
        public string ChangedUserName { get; set; }
        public string UserProfilepic { get; set; }
        public string Bio { get; set; }


    }
}
