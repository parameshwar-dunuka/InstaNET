using Microsoft.EntityFrameworkCore.Storage.ValueConversion.Internal;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace InstaNET.Models
{
    [Table(name:"Chats")]
    public class ChatData
    {
        [Key]
        public int Id { get; set; }
        public string FromUserID { get; set; }
        public string ToUserID { get; set; }
        public DateTime CreatedOn { get; set; }=DateTime.Now;
        public string Message { get; set; }
        public bool IsSeen { get; set; }


    }
    public class ChatModel
    {
        public string MsgUser { get; set; }

        public string FromUser { get; set; }
        public string ToUser { get; set; }
        public string FromUserID { get; set; }
        public string ToUserID { get; set; }
        public DateTime CreatedOn { get; set; }
        public string Message { get; set; }
        public bool IsSeen { get; set; }

    }

    public class ChatBoxModel
    {
        public string MyUser { get; set; }

        public string UserName { get; set; }
        public int UnSeenCount { get; set; }
        public string ProfilePic { get; set; }
        public string DisplayName { get; set; }

    }
}
