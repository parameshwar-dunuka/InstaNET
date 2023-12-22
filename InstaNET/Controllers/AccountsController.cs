using InstaNET.IServices;
using InstaNET.Models;
using InstaNET.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace InstaNET.Controllers
{
    public class AccountController : ControllerBase
    {
        private readonly UserManager<ApplicationUser> userManager;
        private readonly SignInManager<ApplicationUser> signInManager;
        private readonly ILogger<AccountController> logger;
        private readonly IConfiguration _config;
        private readonly IAccountService _accountService;
        public readonly IHomeService IHomeService = null;




        public AccountController(UserManager<ApplicationUser> userManager,
            SignInManager<ApplicationUser> signInManager,
            ILogger<AccountController> logger,IConfiguration config,IAccountService accountService,IHomeService homeService)
        {
            this.userManager = userManager;
            this.signInManager = signInManager;
            this.logger = logger;
            _config = config;
            _accountService = accountService;
            IHomeService = homeService;
        }

        [HttpGet]
        public async Task<IActionResult> AddPassword()
        {
            var user = await userManager.GetUserAsync(User);

            var userHasPassword = await userManager.HasPasswordAsync(user);

            if (userHasPassword)
            {
                return RedirectToAction("ChangePassword");
            }

            return Ok();
        }

        //[HttpPost]
        //public async Task<IActionResult> AddPassword(AddPasswordOkModel model)
        //{
        //    if (ModelState.IsValid)
        //    {
        //        var user = await userManager.GetUserAsync(User);

        //        var result = await userManager.AddPasswordAsync(user, model.NewPassword);

        //        if (!result.Succeeded)
        //        {
        //            foreach (var error in result.Errors)
        //            {
        //                ModelState.AddModelError(string.Empty, error.Description);
        //            }
        //            return Ok();
        //        }

        //        await signInManager.RefreshSignInAsync(user);

        //        return Ok("AddPasswordConfirmation");
        //    }

        //    return Ok(model);
        //}

        [HttpGet]
        public async Task<IActionResult> ChangePassword()
        {
            var user = await userManager.GetUserAsync(User);

            var userHasPassword = await userManager.HasPasswordAsync(user);

            if (!userHasPassword)
            {
                return RedirectToAction("AddPassword");
            }

            return Ok();
        }

        //[HttpPost]
        //public async Task<IActionResult> ChangePassword(ChangePasswordOkModel model)
        //{
        //    if (ModelState.IsValid)
        //    {
        //        var user = await userManager.GetUserAsync(User);
        //        if (user == null)
        //        {
        //            return RedirectToAction("Login");
        //        }

        //        var result = await userManager.ChangePasswordAsync(user,
        //            model.CurrentPassword, model.NewPassword);

        //        if (!result.Succeeded)
        //        {
        //            foreach (var error in result.Errors)
        //            {
        //                ModelState.AddModelError(string.Empty, error.Description);
        //            }
        //            return Ok();
        //        }

        //        await signInManager.RefreshSignInAsync(user);
        //        return Ok("ChangePasswordConfirmation");
        //    }

        //    return Ok(model);
        //}

        [HttpGet]
        [AllowAnonymous]
        public IActionResult ResetPassword(string token, string email)
        {
            if (token == null || email == null)
            {
                ModelState.AddModelError("", "Invalid password reset token");
            }
            return Ok();
        }

        //[HttpPost]
        //[AllowAnonymous]
        //public async Task<IActionResult> ResetPassword(ResetPasswordOkModel model)
        //{
        //    if (ModelState.IsValid)
        //    {
        //        var user = await userManager.FindByEmailAsync(model.Email);

        //        if (user != null)
        //        {
        //            var result = await userManager.ResetPasswordAsync(user, model.Token, model.Password);
        //            if (result.Succeeded)
        //            {
        //                if (await userManager.IsLockedOutAsync(user))
        //                {
        //                    await userManager.SetLockoutEndDateAsync(user, DateTimeOffset.UtcNow);
        //                }

        //                return Ok("ResetPasswordConfirmation");
        //            }

        //            foreach (var error in result.Errors)
        //            {
        //                ModelState.AddModelError("", error.Description);
        //            }
        //            return Ok(model);
        //        }

        //        return Ok("ResetPasswordConfirmation");
        //    }

        //    return Ok(model);
        //}

        [HttpGet]
        [AllowAnonymous]
        public IActionResult ForgotPassword()
        {
            return Ok();
        }

        //[HttpPost]
        //[AllowAnonymous]
        //public async Task<IActionResult> ForgotPassword(ForgotPasswordOkModel model)
        //{
        //    if (ModelState.IsValid)
        //    {
        //        var user = await userManager.FindByEmailAsync(model.Email);

        //        if (user != null && await userManager.IsEmailConfirmedAsync(user))
        //        {
        //            var token = await userManager.GeneratePasswordResetTokenAsync(user);

        //            var passwordResetLink = Url.Action("ResetPassword", "Account",
        //                    new { email = model.Email, token = token }, Request.Scheme);

        //            logger.Log(LogLevel.Warning, passwordResetLink);

        //            return Ok("ForgotPasswordConfirmation");
        //        }

        //        return Ok("ForgotPasswordConfirmation");
        //    }

        //    return Ok(model);
        //}

        [HttpGet]
        [Route("Accounts/Logout")]
        public async Task<IActionResult> Logout()
        {
            await signInManager.SignOutAsync();

            return Ok("Logout Success");

        }


        [AcceptVerbs("Get", "Post")]
        [AllowAnonymous]
        public async Task<IActionResult> IsEmailInUse(string email)
        {
            var user = await userManager.FindByEmailAsync(email);

            if (user == null)
            {
                return Ok(true);
            }
            else
            {
                return Ok($"Email {email} is already in use");
            }
        }

        [AcceptVerbs("Get", "Post")]
        [AllowAnonymous]
        public async Task<IActionResult> IsUserNameInUse(string userName)
        {
            var user = await userManager.FindByNameAsync(userName);

            if (user == null)
            {
                return Ok(true);
            }
            else
            {
                return Ok($"Email {userName} is already in use");
            }
        }

        [HttpPost]
        [AllowAnonymous]
        [Route("Accounts/Register")]

        public async Task<IActionResult> Register([FromBody]RegisterModel model)
        {
            if (ModelState.IsValid)
            {
                model.Errors = new List<string>();

                var user = new ApplicationUser
                {
                    UserName = model.UserName,
                    Email = model.Email,
                    DisplayName = model.DisplayName
                };

                var result = await userManager.CreateAsync(user, model.Password);

                if (result.Succeeded)
                {
                    var token = await userManager.GenerateEmailConfirmationTokenAsync(user);

                    var confirmationLink = Url.Action("ConfirmEmail", "Account",
                                            new { userId = user.Id, token = token }, Request.Scheme);

                    logger.Log(LogLevel.Warning, confirmationLink);

                    if (signInManager.IsSignedIn(User) && User.IsInRole("Admin"))
                    {
                        return RedirectToAction("ListUsers", "Administration");
                    }
                    var role=await userManager.AddToRoleAsync(user, "User");

                    //return Ok(model);
                    return Redirect("/Accounts/UrlLogin/" + user.UserName+"/"+model.Password);
                }

                foreach (var error in result.Errors)
                {
                    model.Errors.Add(error.Description);
                }
            }

            return Ok(model);
        }

        //[HttpGet]
        //[AllowAnonymous]
        //public async Task<IActionResult> ConfirmEmail(string userId, string token)
        //{
        //    if (userId == null || token == null)
        //    {
        //        return RedirectToAction("index", "home");
        //    }

        //    var user = await userManager.FindByIdAsync(userId);

        //    if (user == null)
        //    {
        //        OkBag.ErrorMessage = $"The User ID {userId} is invalid";
        //        return Ok("NotFound");
        //    }

        //    var result = await userManager.ConfirmEmailAsync(user, token);

        //    if (result.Succeeded)
        //    {
        //        return Ok();
        //    }

        //    OkBag.ErrorTitle = "Email cannot be confirmed";
        //    return Ok("Error");
        //}

        //[HttpGet]
        //[AllowAnonymous]
        //public async Task<IActionResult> Login(string returnUrl)
        //{
        //    LoginOkModel model = new LoginOkModel
        //    {
        //        ReturnUrl = returnUrl,
        //        ExternalLogins = (await signInManager.GetExternalAuthenticationSchemesAsync()).ToList()
        //    };

        //    return Ok(model);
        //}

        [HttpPost]
        [AllowAnonymous]
        [Route("Accounts/Login")]
        public async Task<IActionResult> Login([FromBody] SignInModel model)
        {
            //model.ExternalLogins = (await signInManager.GetExternalAuthenticationSchemesAsync()).ToList();

            
            if (ModelState.IsValid)
            {
                model = await _accountService.LoginService(model);

                if(string.IsNullOrEmpty(model.JwtToken))
                {
                    model.Errors.Add("Invalid Login Attempt");
                }
            }
            return Ok(model);
        }

        [HttpGet]
        [AllowAnonymous]
        [Route("Accounts/UrlLogin/{userName}/{Password}")]
        public async Task<IActionResult> UrlLogin(string userName,string Password)
        {
            var user = userManager.Users.Where(x => x.UserName == userName).FirstOrDefault();
            CommonModel cm = new CommonModel() { User = user?.Id};
            IHomeService.ProfileComplete(cm);

            SignInModel model=new SignInModel() { UserName=userName,Password=Password};
            model = await _accountService.LoginService(model);

            if (string.IsNullOrEmpty(model.JwtToken))
            {
                model.Errors.Add("Invalid Login Attempt");
            }
            return Ok(model);
        }

        [AllowAnonymous]
        [HttpPost]
        public IActionResult ExternalLogin(string provider, string returnUrl)
        {
            var redirectUrl = Url.Action("ExternalLoginCallback", "Account",
                                    new { ReturnUrl = returnUrl });

            var properties =
                signInManager.ConfigureExternalAuthenticationProperties(provider, redirectUrl);

            return new ChallengeResult(provider, properties);
        }

        
    }
}
