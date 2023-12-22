using InstaNET.IServices;
using InstaNET.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Components.Routing;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.ApplicationModels;
using Microsoft.JSInterop;
using System.Runtime.Intrinsics.X86;

namespace InstaNET.Controllers
{
    [Authorize]
    [Route("[controller]")]
    [ApiController]
    public class ProfileController : ControllerBase
    {
        public readonly IHomeService IHomeService=null;
        private readonly UserManager<ApplicationUser> userManager;
        private readonly SignInManager<ApplicationUser> signInManager;

        public ProfileController(IHomeService homeService, UserManager<ApplicationUser> userManager, SignInManager<ApplicationUser> signInManager)
        {
            this.IHomeService = homeService;
            this.userManager = userManager;
            this.signInManager = signInManager;
        }

        [HttpGet]
        [Route("UserData")]
        public async Task<IActionResult> GetUserData(string userName)
        {
            var user = await userManager.FindByNameAsync(userName);
            if (user == null)
            {
                user = await userManager.FindByNameAsync(User.Identity?.Name);
            }
            UserOk userData=IHomeService.GetFullFeed(user);
            userData.Email = user.Email; userData.UserName = user.UserName; userData.DisplayName = user.DisplayName;

            return Ok(userData);
        }


        [HttpGet]
        [Route("Index")]
        public async Task<IActionResult> Index(string userName)
        {
            var user= await userManager.FindByNameAsync(userName);
            if (user == null)
            {
                UserOk user1 = new UserOk();
                return Ok(user1);
            }
            else
            {
                UserOk user1 = new UserOk() { Email=user.Email,UserName=user.UserName,DisplayName=user.DisplayName};
                user1.isSelf = userName == User.Identity?.Name ? true : false;
                return Ok(user1);
            }
        }

        [HttpGet]
        [Route("GetProfile")]
        public async Task<IActionResult> GetProfile(string userName)
        {
            var user = await userManager.FindByNameAsync(userName);
            if (user == null)
            {
                UserOk user1 = new UserOk();
                return Ok(user1);
            }
            else
            {
                UserOk user1 = IHomeService.GetFullProfile(user, User.Identity?.Name);
                user1.isSelf = userName.ToLower() == User.Identity?.Name.ToLower() ? true : false;
                return Ok(user1);
            }
        }

        [HttpGet]
        [Route("AnonymousIndex")]
        [AllowAnonymous]
        public async Task<IActionResult> AnonymousIndex(string userName)
        {
            var user = await userManager.FindByNameAsync(userName);
            if (user == null)
            {
                UserOk user1 = new UserOk();
                return Ok(user1);
            }
            else
            {
                UserOk user1 = IHomeService.GetFullProfile(user,null);
                user1.isSelf = false;
                user1.isInBlocked= false;
                user1.isFollowing=false;
                return Ok(user1);
            }
        }

        [HttpGet]
        [Route("GetFollowers")]
        public async Task<IActionResult> GetFollowers(string userName)
        {
            var user = await userManager.FindByNameAsync(userName);
            var requestUser = await userManager.FindByNameAsync(User.Identity?.Name);
            var users= IHomeService.GetFollowers(user,requestUser?.Id);
            return Ok(users);
        }

        [HttpGet]
        [Route("GetFollowing")]
        public async Task<IActionResult> GetFollowing(string userName)
        {
            var user = await userManager.FindByNameAsync(userName);
            var requestUser = await userManager.FindByNameAsync(User.Identity?.Name);
            var users = IHomeService.GetFollowing(user,requestUser?.Id);
            return Ok(users);
        }

        [HttpGet]
        [Route("ToggleFollowing")]
        public async Task<IActionResult> ToggleFollowing(string userName)
        {
            var userid = await userManager.FindByNameAsync(User.Identity?.Name);
            var user = await userManager.FindByNameAsync(userName);
            bool pending = IHomeService.ToggleFollowing(user,userid.Id);
            return Ok(new {ispending=pending});
        }

        [HttpPost]
        [Route("ProfileComplete")]
        public async Task<IActionResult> ProfileComplete([FromBody] CommonModelInternal commonModel)
        {
            var userid = await userManager.FindByNameAsync(commonModel.User);

            CommonModel model =new CommonModel() { Location=commonModel.Location,ProfilePic=commonModel.ProfilePic,
                                  User=userid.Id,Bio=commonModel.Bio
            };
            IHomeService.ProfileComplete(model);
            return Ok(commonModel);
        }

        [HttpPost]
        [Route("addpost")]
        public async Task<IActionResult> Post([FromBody]PostData postData)
        {
            var user = await userManager.FindByNameAsync(User.Identity?.Name);
            postData.UserId =user.Id;
            IHomeService.PostData(postData);
            return Ok(postData);
        }

        [HttpPost]
        [Route("addstatus")]
        public async Task<IActionResult>AddStatus(StatusData statusData)
        {
            var user = await userManager.FindByNameAsync(User.Identity?.Name);
            statusData.UserId = user.Id;
            IHomeService.StatusData(statusData);
            return Ok(statusData);
        }

        [HttpPost]
        [Route("AddComment")]
        public async Task<IActionResult> AddComment(Comment comment)
        {
            var user = await userManager.FindByNameAsync(User.Identity?.Name);
            
            IHomeService.AddComment(user.Id,comment.ForPost,comment.CommentStr);
            return Ok(true);
        }

        [HttpPost]
        [Route("likedit")]
        public async Task<IActionResult> LikePost(Comment comment)
        {
            var user = await userManager.FindByNameAsync(User.Identity?.Name);

            IHomeService.LikePost(user.Id, comment.ForPost,comment.CommentStr);
            return Ok(true);
        }

        [HttpGet]
        [Route("postcomments")]
        public async Task<IActionResult> Comments(string ForPost)
        {
            var user = await userManager.FindByNameAsync(User.Identity?.Name);

            List<Comment> cmtData = IHomeService.GetComments(user.Id,  Convert.ToInt32(ForPost));
            return Ok(cmtData);
        }

        [HttpGet]
        [Route("search")]
        public async Task<IActionResult> SearchUser(string searchtext)
        {
            var user = await userManager.FindByNameAsync(User.Identity?.Name);

            List<UserSearch> searchData = IHomeService.SearchUser(user,searchtext);
            return Ok(searchData);
        }

        [HttpGet]
        [Route("GetProfileEdit")]
        public async Task<IActionResult> GetProfileEdit(string userName)
        {
            var user = await userManager.FindByNameAsync(User.Identity?.Name);

            UserOk user1 = IHomeService.GetProfileEdit(user);
            return Ok(user1);
        }

        [HttpPost]
        [Route("setprofile")]
        public async Task<IActionResult> SetProfile(UserProfile userProfile)
        {
            var user = await userManager.FindByNameAsync(User.Identity?.Name);
            userProfile.UserId = user.Id;
            var validuserName=await IHomeService.SetProfile( userProfile);
            if (!validuserName) 
            {
                return Ok("Invalid UserName");
            }
            else 
                return Ok(true);
        }

        [HttpPost]
        [Route("AddstatusSeen")]
        public async Task<IActionResult> AddStatusSeen(int statusid)
        {
            var user = await userManager.FindByNameAsync(User.Identity?.Name);

            IHomeService.AddStatusSeen(user.Id, statusid);
            return Ok(true);
        }

        [HttpGet]
        [Route("GetChatMessages")]
        public async Task<IActionResult> GetChatMessages(string toUser)
        {
            List<ChatModel> cm = new List<ChatModel>();
            var user = await userManager.FindByNameAsync(User.Identity?.Name);

            if (toUser== "openchatbox")
            {
                List<ChatBoxModel> cbm=new List<ChatBoxModel>();
                 cbm = await IHomeService.GetMyChatsList(user.Id);
                 return Ok(cbm);
            }
            else
            {
                var touser = await userManager.FindByNameAsync(toUser);

                cm = await IHomeService.GetChatMessages(user.Id, touser.Id);
                return Ok(cm);

            }
        }
    }

}
