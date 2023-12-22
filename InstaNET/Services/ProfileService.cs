using InstaNET.IServices;
using InstaNET.Models;
using InstaNET;
using Microsoft.EntityFrameworkCore;
using Microsoft.Data.SqlClient;
using System.Data;
using System.Collections.Generic;
using Microsoft.AspNetCore.Identity;
using System.Data.Common;
using System.Runtime.Intrinsics.X86;

namespace InstaNET.Services
{
    public class ProfileService : IHomeService
    {
        private readonly DbConnect _dbConnection;
        private readonly UserManager<ApplicationUser> userManager;

        public ProfileService(DbConnect connect, UserManager<ApplicationUser> userManager)
        {
            _dbConnection = connect;
            this.userManager = userManager;
        }
        public UserOk GetFullFeed(ApplicationUser user)
        {
            string userids = user.Id;
            UserOk userData=new UserOk();
            userData.Posts = new List<Posts>();
            userData.Status = new List<Status>();
            var userProf = _dbConnection.UserInfo.Where(x => x.User == user.Id).FirstOrDefault();
            userProf.LastLoggedIn = DateTime.Now;
            userData.ProfilePic = userProf.ProfilePic;
            var friends = _dbConnection.Relations.Where(x => x.From == user.Id && x.IsActive == true && x.IsPending == false).Select(y=>y.To).ToList();

            //var postdata =_dbConnection.Relations.Where(x => x.From == user.Id).Join(_dbConnection.Post, x => x.To, y => y.UserId, (x, y) => 
            //                                                            new Posts() { PostId=y.Id,PostData=y.File,PostedUser=y.UserId,Subtitle=y.subtitle})
            //                                                            .OrderByDescending(x=>x.PostId).Take(3).ToList();

            var postdata = friends.Join(_dbConnection.Post, x => x, y => y.UserId, (x, y) =>
                                                                        new Posts() { PostId = y.Id, PostData = y.File, PostedUser = y.UserId, 
                                                                            Subtitle = y.subtitle,PostDescription=y.Description, postCreatedDate=y.CreatedOn })
                                                                        .OrderByDescending(x => x.PostId).ToList();
            if (postdata.Count > 10)
            {
                var tmppostdata= postdata.Where(x=>x.postCreatedDate > userProf.LastLoggedIn).ToList();
                if(postdata.Count>10)
                {
                    postdata = tmppostdata.Where(x => x.postCreatedDate > userProf.LastLoggedIn).Take(10).ToList();
                }
                
            }

            friends.ForEach(x => { userids = userids + "," + x; });

            var UsersIDsandNames = GetUserData(userids,user.Id);

            postdata.ForEach(x =>
            {
                var userpost= _dbConnection.UserInfo.Where(y => y.User == x.PostedUser).FirstOrDefault();
                x.PostedUser = userpost.User;
                x.ProfilePic = userpost.ProfilePic;
                x.PostedUserName = UsersIDsandNames[x.PostedUser];
                var data = _dbConnection.LikePosts.Where(y => y.ForPost == x.PostId).ToList();
                x.NumofLikes= data.Count();
                x.IsLiked= data.Where(y=>y.LikeBy==user.Id).Count()>0?true:false;
                x.NumofComments = _dbConnection.Comments.Where(y => y.ForPost == x.PostId).Count();
                x.IsSaved = _dbConnection.SavePosts.Where(y => y.ForPost == x.PostId.ToString() && y.SavedBy == user.Id).Count()>0?true:false;
                x.TopComment = GetLatestComment(user.Id,x.PostId);
            });
            userData.Posts.AddRange(postdata);

            var StatusesList = _dbConnection.Status.Where(x => (friends.Contains(x.UserId) || x.UserId==user.Id)  && x.CreatedOn.AddHours(24) > DateTime.Now)?.ToList();
            if (StatusesList != null && StatusesList.Count>0)
            {
                var Statuses = StatusesList.Select(data => new Status()
                {
                    Description = data.Description,
                    StatusData = data.File,
                    StatusId = data.UnqId,
                    WhoseStatus = UsersIDsandNames[data.UserId],
                    isSelfStatus = data.UserId == user.Id,
                    seenAgo = ((int)(DateTime.Now - data.CreatedOn).TotalHours).ToString()
                    //IsSeen = _dbConnection.StatusSees.Where(x => x.StatusId == data.UnqId && x.SeenByUser == user.Id).Any()
                }).OrderBy(x=>x.isSelfStatus).ToList();
                userData.Status.AddRange(Statuses);
            }
                
            //var mystatus = _dbConnection.Status.Where(x => x.UserId == user.Id && x.CreatedOn.AddHours(24) > DateTime.Now).FirstOrDefault();
            //if (mystatus != null)
            //{
            //    userData.UhaveStatus = true;
            //    userData.UrStatus = new Status() { StatusData = mystatus.File, Description = mystatus.Description };
            //}

            if (userProf!=null && userProf.IsPending)
            {
                userData.ProfileInPending=true;
            }
            //var UserPosts = _dbConnection.Post.Where(x => friends.Contains(x.UserId)).ToList();

            //userData.Posts = UserPosts.Select(x => new Posts() { PostId = x.Id, PostData = x.File, PostedUser = x.UserId }).OrderByDescending(x=>x.PostId).ToList();            //_dbConnection.SaveChangesAsync();
            _dbConnection.SaveChangesAsync();

            return userData;

        }
        public List<Userprof> GetFollowers(ApplicationUser user, string requestUser)
        {
            
            var FollowersData = (IEnumerable<Relations>)_dbConnection.Relations.Where(x => x.To == user.Id && x.IsActive==true && x.IsPending==false);
            List<Userprof> relations = FollowersData.Join(userManager.Users, rel => rel.From, um => um.Id, (rel, um) => 
                                                            new Userprof() { UserName = um.UserName, DisplayName = um.DisplayName,UserId=um.Id,isFollowing=false }).ToList();

            List<string> followers=relations.Join(_dbConnection.Relations.Where(x=>x.From== requestUser && x.IsPending==false && x.IsActive==true)
                                                    ,u=>u.UserId,rel=>rel.To, (u, rel) => new String(u.UserId)).ToList();

            relations.ForEach(x =>
            {
                x.ProfilePic = _dbConnection.UserInfo.Where(y => y.User == x.UserId).FirstOrDefault()?.ProfilePic;
                if(followers.Contains(x.UserId))
                {
                    x.isFollowing = true;
                }
                if(x.UserId==requestUser) { x.isRequester = true; }
            });
            return relations;
        }

        public List<Userprof> GetFollowing(ApplicationUser user, string requestUser)
        {
            var FollowingData = (IEnumerable<Relations>)_dbConnection.Relations.Where(x => x.From == user.Id && x.IsActive == true && x.IsPending == false);
            List<Userprof> relations = FollowingData.Join(userManager.Users, rel => rel.To, um => um.Id, (rel, um) =>
                                                new Userprof() { UserName = um.UserName, DisplayName = um.DisplayName, isFollowing=false,UserId=um.Id }).ToList();
            List<string> followers = relations.Join(_dbConnection.Relations.Where(x => x.From == requestUser && x.IsPending == false && x.IsActive == true)
                                                    , u => u.UserId, rel => rel.To, (u, rel) => new String(u.UserId)).ToList();

            relations.ForEach(x =>
            {
                x.ProfilePic = _dbConnection.UserInfo.Where(y => y.User == x.UserId).FirstOrDefault()?.ProfilePic;

                if (followers.Contains(x.UserId))
                {
                    x.isFollowing = true;
                }
                if (x.UserId == requestUser) { x.isRequester = true; }
            });

            return relations;
        }
        public bool ToggleFollowing(ApplicationUser user, string requestUser)
        {
            bool pending = false;
            var userprof = _dbConnection.UserInfo.Where(x=>x.User==user.Id).FirstOrDefault(); 
            var rel = _dbConnection.Relations.Where(x => x.From == requestUser && x.To == user.Id).FirstOrDefault();
            if (rel != null && rel?.IsActive == true) 
            {
                rel.IsActive = false;
                if (rel.IsPending == true)
                {
                    rel.IsPending = !rel.IsPending;
                }
                _dbConnection.SaveChanges();
                return true;
            }
            if(rel!=null)
            {
                if (userprof.IsPrivate == true)
                {
                    rel.IsPending = true;
                    pending = true; 
                }
                rel.IsActive= !rel.IsActive;
                
            }
            else
            {
                pending = userprof.IsPrivate == true ? true : false;
                _dbConnection.Relations.Add(new Relations() { From = requestUser , To = user.Id,IsActive=true,IsBlocked=false
                                                ,IsPending= pending                });
            }
            _dbConnection.SaveChanges();
            return pending;
        }

        public UserOk GetFullProfile(ApplicationUser user,string? requestUser)
        {
            string userids = string.Empty;

            UserOk user1 =new UserOk();
            try
            {
                SqlConnection conn = new SqlConnection(_dbConnection.Database.GetConnectionString());
                SqlCommand cmd = new SqlCommand("GetProfileData",conn);
                cmd.CommandType = System.Data.CommandType.StoredProcedure;
                cmd.Parameters.AddWithValue("@userId", user.Id);
                cmd.Parameters.AddWithValue("@requestUserid", requestUser);

                conn.Open();
                SqlDataReader reader = cmd.ExecuteReader();
                DataTable dt = new DataTable();
                dt.Load(reader);
                conn.Close();
                {
                    user1.Email = user.Email;
                    user1.UserName = user.UserName;
                    user1.DisplayName = user.DisplayName;
                    user1.FollowersCount = Convert.ToInt32(dt.Rows[0]["FollowersCount"]);
                    user1.FollowingCount = Convert.ToInt32(dt.Rows[0]["FollowingCount"]);
                    user1.PostCount = Convert.ToInt32(dt.Rows[0]["PostCount"]);
                    user1.Bio = Convert.ToString(dt.Rows[0]["bio"]);
                    user1.isPrivate= Convert.ToBoolean(dt.Rows[0]["isPrivate"]);
                    user1.ProfilePic= Convert.ToString(dt.Rows[0]["ProfilePic"]);
                    user1.isFollowing= Convert.ToBoolean(dt.Rows[0]["isFollowing"]);
                    user1.isFollowingPending= Convert.ToBoolean(dt.Rows[0]["isFollowingPending"]);
                    user1.ProfileInPending = Convert.ToBoolean(dt.Rows[0]["ProfileInPending"]);
                    user1.MyProfilePic = Convert.ToString(dt.Rows[0]["requestedprofilepic"]);

                };

                var UserPosts = _dbConnection.Post.Where(x => x.UserId == user.Id).OrderByDescending(x => x.Id).ToList();
                UserPosts.ForEach(x => 
                { 
                    userids = userids + "," + x.UserId;                    

                });
                var UsersIDsandNames = GetUserData(userids, user.Id);
                user1.Posts=new List<Posts>();

                var userinfo = _dbConnection.UserInfo.Where(y => y.User == user.Id).FirstOrDefault();
                UserPosts.ForEach(z =>
                {
                    Posts x = new Posts();
                    var userpost = _dbConnection.UserInfo.Where(y => y.User == z.UserId).FirstOrDefault();
                    x.PostedUser = z.UserId;
                    x.ProfilePic = userpost.ProfilePic;
                    x.PostedUserName = UsersIDsandNames[z.UserId];
                    var data = _dbConnection.LikePosts.Where(y => y.ForPost == z.Id).ToList();
                    x.NumofLikes = data.Count();
                    x.IsLiked = data.Where(y => y.LikeBy == user.Id).Count() > 0 ? true : false;
                    x.NumofComments = _dbConnection.Comments.Where(y => y.ForPost == z.Id).Count();
                    x.IsSaved = _dbConnection.SavePosts.Where(y => y.ForPost == z.Id.ToString() && y.SavedBy == user.Id).Count() > 0 ? true : false;
                    x.PostData = z.File; x.PostId = z.Id;
                    x.Subtitle = z.subtitle;
                    x.PostDescription = z.Description;
                    x.TopComment = GetLatestComment(user.Id, x.PostId);

                    user1.Posts.Add(x);
                });

                
            }
            catch(Exception ex)
            {

            }


            return user1;
        }



        //public policy GetPolicy(string policynumber)
        //{
        //    var policy=_dbConnection.Policy.Where(x => x.PolicyNumber == policynumber).FirstOrDefault();
        //    return policy;
        //}
        public void PostData(PostData postData)
        {
            _dbConnection.Post.Add(postData);
             _dbConnection.SaveChanges();
        }

        public void ProfileComplete(CommonModel commonModel)
        {
            try
            {
                var user = _dbConnection.UserInfo.Where(x => x.User == commonModel.User).FirstOrDefault();
                if (user != null)
                {
                    user.ProfilePic = commonModel.ProfilePic;
                    user.Location = commonModel.Location;
                    user.IsPrivate = commonModel.IsPrivate;
                    user.Bio = commonModel.Bio;
                    user.IsPending = false;
                }
                else
                {
                    commonModel.IsPending = true;
                    _dbConnection.UserInfo.Add(commonModel);
                }
                _dbConnection.SaveChanges();
            }
            catch(Exception ex) 
            { 

            }
        }

        public void StatusData(StatusData statusData)
        {
            _dbConnection.Status.Add(statusData);
            _dbConnection.SaveChanges();
        }

        public DataTable ExecProc(string user, string requestedUser,string ProcedureName)
        {
            SqlConnection conn = new SqlConnection(_dbConnection.Database.GetConnectionString());
            SqlCommand cmd = new SqlCommand(ProcedureName, conn);
            cmd.CommandType = System.Data.CommandType.StoredProcedure;
            cmd.Parameters.AddWithValue("@users", user);
            cmd.Parameters.AddWithValue("@requestedUser", requestedUser);

            conn.Open();
            DataTable dt=new DataTable();
            SqlDataReader reader = cmd.ExecuteReader();
            dt.Load(reader);
            conn.Close();
            return dt;
        }

        private Dictionary<string, string> GetUserData(string usersstr, string requestedUser)
        {

            var data=ExecProc(usersstr, requestedUser, "FullusersData");

            Dictionary<string,string> dataUsers = new Dictionary<string,string>();
            for (int i = 0; i < data.Rows.Count; i++)
            {
                dataUsers[Convert.ToString(data.Rows[i]["userid"])]= Convert.ToString(data.Rows[i]["username"]);
            }

            return dataUsers;
        }

        private Dictionary<string, string> GetUserDataNames(string usersNamestr, string requestedUser)
        {

            var data = ExecProc(usersNamestr, requestedUser, "FullusersDataIds");

            Dictionary<string, string> dataUsers = new Dictionary<string, string>();
            for (int i = 0; i < data.Rows.Count; i++)
            {
                dataUsers[Convert.ToString(data.Rows[i]["username"])] = Convert.ToString(data.Rows[i]["userid"]);
            }

            return dataUsers;
        }

        public void AddComment(string Userid, int postId, string comment)
        {
            Comments cmt=new Comments();
            cmt.Comment = comment;cmt.ForPost=postId;cmt.CommentByUser = Userid;
            _dbConnection.Comments.Add(cmt);
            _dbConnection.SaveChanges();
        }

        public void LikePost(string Userid, int forPost, string comment)
        {
            if (comment == "unlike")
            {
                var likerecord = _dbConnection.LikePosts.Where(x=>x.ForPost==forPost && x.LikeBy==Userid);
                if(likerecord!=null)
                {
                    _dbConnection.LikePosts.RemoveRange(likerecord);

                    _dbConnection.SaveChanges();
                }
                
            }
            else
            {
                var likerecord = _dbConnection.LikePosts.Where(x=>x.ForPost==forPost && x.LikeBy==Userid).FirstOrDefault();
                if(likerecord == null)
                {
                    LikePosts likedposts = new LikePosts();
                    likedposts.ForPost = forPost; likedposts.LikeBy = Userid;
                    _dbConnection.LikePosts.Add(likedposts);
                    _dbConnection.SaveChanges();
                }
            }
        }

        public List<Comment> GetComments(string id, int forPost)
        {
            string userids = "";
            List<Comment> commentData = new List<Comment>();
            var comments= _dbConnection.Comments.Where(x=>x.ForPost==forPost).ToList();

            comments.ForEach(x =>
            {
                userids = userids + "," + x.CommentByUser;

            });

            var data = ExecProc(userids, id, "FullusersData");

            foreach (var item in comments)
            {
                var row=data.AsEnumerable().Where(x => Convert.ToString(x["userid"]) == item.CommentByUser).FirstOrDefault();
                commentData.Add(new Comment()
                {
                    Id=item.Id,
                    ForPost = item.ForPost,
                    CommentByUser=item.CommentByUser,
                    UserProfilepic = Convert.ToString(row["profilepic"]),
                    UserName = Convert.ToString(row["username"]),
                    CommentStr =item.Comment
                });

            }
            return commentData.OrderByDescending(x=>x.Id).ToList();
        }
        public Comment GetLatestComment(string id, int forPost)
        {
            var comment = _dbConnection.Comments.Where(x => x.ForPost == forPost).OrderByDescending(x=>x.Id).FirstOrDefault();
            string userids = comment?.CommentByUser;

            if(userids != null)
            {
                var data = ExecProc(userids, id, "FullusersData");

                var row = data.AsEnumerable().Where(x => Convert.ToString(x["userid"]) == comment.CommentByUser).FirstOrDefault();
                var commentData = new Comment()
                {
                    Id = comment.Id,
                    ForPost = comment.ForPost,
                    CommentByUser = comment.CommentByUser,
                    UserName = Convert.ToString(row["username"]),
                    CommentStr = comment.Comment
                };
                return commentData;
            }
            return new Comment();
        }
        public List<UserSearch> SearchUser(ApplicationUser user, string searchtext)
        {
            var searchUsers= userManager.Users.Where(x=>x.UserName.Contains(searchtext)).ToList();

            List<UserSearch> usersData= searchUsers.Join(_dbConnection.UserInfo, x => x.Id, y => y.User, (x, y) =>
                                        new UserSearch() { UserName = x.UserName, UserId = x.Id,UserProfilepic=y.ProfilePic,
                                        isFollowing = _dbConnection.Relations.Where(z=>z.To==x.Id && z.From==user.Id).Count()>0?true:false
            }).OrderBy(x => x.isFollowing).ToList();
            return usersData;
        }

        public void AddStatusSeen(string id, int statusid)
        {
            var status = new StatusSeen() { StatusId = statusid, SeenByUser = id };
            _dbConnection.StatusSees.Add(status);
        }

        public UserOk GetProfileEdit(ApplicationUser user)
        {
            var userdata1=_dbConnection.UserInfo.Where(x => x.User == user.Id).FirstOrDefault();
            return new UserOk()
            {
                UserID=userdata1.User,
                ProfilePic=userdata1.ProfilePic,
                DisplayName=user.DisplayName,
                UserName=user.UserName,
                Bio=userdata1.Bio
            };
        }

        public async Task<bool> SetProfile(UserProfile userProfile)
        {
            if(userManager.Users.Where(x => x.UserName == userProfile.ChangedUserName && x.Id != userProfile.UserId).Any())
            {
                return false;
            }
            else
            {
                var user=userManager.Users.Where(x => x.UserName == userProfile.OriginalUserName).FirstOrDefault();
                user.DisplayName=userProfile.DisplayName;
                user.UserName = userProfile.ChangedUserName;
                await userManager.UpdateAsync(user);
                //userManager.SetUserNameAsync(user, userProfile.ChangedUserName);
                var userProf=_dbConnection.UserInfo.Where(x=>x.User==userProfile.UserId).FirstOrDefault();
                userProf.ProfilePic = userProfile.UserProfilepic;
                userProf.Bio = userProfile.Bio;

                _dbConnection.SaveChanges();
                return true;
            }
        }


        public async Task<List<ChatModel>> ChatService(ChatModel chatModel)
        {
            string userNames = chatModel.FromUser + "," + chatModel.ToUser;
            var UsersIDsandNames = GetUserDataNames(userNames, chatModel.FromUser);

            ChatData cd = new ChatData()
            {
                FromUserID = UsersIDsandNames[chatModel.FromUser],
                ToUserID = UsersIDsandNames[chatModel.ToUser],
                Message=chatModel.Message
            };
            var effected = await _dbConnection.Chats.AddAsync(cd);
            _dbConnection.SaveChanges();
            var chatsmsg = await GetChatMessages(cd.FromUserID, cd.ToUserID);
            return chatsmsg;
        }

        public async Task<List<ChatModel>> GetChatMessages(string fromuserid, string toUserid)
        {
            string userids = fromuserid + "," + toUserid;
            var UsersIDsandNames = GetUserData(userids, fromuserid);
            var chats = _dbConnection.Chats.Where(x => (x.FromUserID == fromuserid && x.ToUserID == toUserid) || (x.FromUserID == toUserid && x.ToUserID == fromuserid)
                        ).OrderByDescending(x => x.Id).Take(15).OrderBy(x=>x.Id).Select(x=>new ChatModel()
                        {
                            MsgUser= UsersIDsandNames[x.FromUserID],
                            Message=x.Message,
                            IsSeen=x.IsSeen,
                        }).ToList();


            return chats;
        }

        public async Task<List<ChatBoxModel>> GetMyChatsList(string id)
        {
            List<ChatBoxModel> chatBoxModels = new List<ChatBoxModel>();
            var data=ExecProc("", id, "picg_getchatslist");

            for (int i = 0; i < data.Rows.Count; i++)
            {
                chatBoxModels.Add(new ChatBoxModel()
                {
                    DisplayName= Convert.ToString(data.Rows[i]["displayname"]),
                    UserName= Convert.ToString(data.Rows[i]["username"]),
                    UnSeenCount= Convert.ToInt32(data.Rows[i]["unseencount"]),
                    ProfilePic= Convert.ToString(data.Rows[i]["profilepic"])
                });
            }

            return chatBoxModels;
        }
    }
}
