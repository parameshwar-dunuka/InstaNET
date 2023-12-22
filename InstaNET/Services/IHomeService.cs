using InstaNET.Models;

namespace InstaNET.IServices
{
    public interface IHomeService
    {
        void AddComment(string Userid, int postId, string comment);
        void AddStatusSeen(string id, int statusid);
        Task<List<ChatModel>> ChatService(ChatModel chatModel);
        Task<List<ChatModel>> GetChatMessages(string fromuser, string toUser);
        List<Comment> GetComments(string id, int forPost);
        List<Userprof> GetFollowers(ApplicationUser user,string requestUser);
        List<Userprof> GetFollowing(ApplicationUser user, string requestUser);
        UserOk GetFullFeed(ApplicationUser user);
        UserOk GetFullProfile(ApplicationUser user, string? requestUser);
        Task<List<ChatBoxModel>> GetMyChatsList(string id);
        UserOk GetProfileEdit(ApplicationUser user);
        void LikePost(string Userid, int forPost, string comment);
        void PostData(PostData postData);
        void ProfileComplete(CommonModel commonModel);
        List<UserSearch> SearchUser(ApplicationUser user, string searchtext);
        Task<bool> SetProfile(UserProfile userProfile);
        void StatusData(StatusData statusData);
        bool ToggleFollowing(ApplicationUser user, string requestUser);
    }
}
