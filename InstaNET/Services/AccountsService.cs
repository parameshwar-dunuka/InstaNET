using InstaNET.Controllers;
using InstaNET.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace InstaNET.Services
{
    public class AccountsService:IAccountService
    {

        private readonly UserManager<ApplicationUser> userManager;
        private readonly SignInManager<ApplicationUser> signInManager;
        private readonly IConfiguration _config;

        public AccountsService(UserManager<ApplicationUser> userManager,
            SignInManager<ApplicationUser> signInManager,
            ILogger<AccountController> logger, IConfiguration config)
        {
            this.userManager = userManager;
            this.signInManager = signInManager;
            _config = config;
        }

        public async Task<SignInModel> LoginService(SignInModel model)
        {
            Microsoft.AspNetCore.Identity.SignInResult result;
            model.Errors = new List<string>();

            var user = await userManager.FindByEmailAsync(model.UserName);
            if (user == null)
                user = await userManager.FindByNameAsync(model.UserName);
            if (user != null)
            {
                result = await signInManager.PasswordSignInAsync(user, model.Password, true, false);

                //if (result.Succeeded)
                //{
                //    return Redirect("/profile/index?userName=" + user.UserName);
                //}
                if (result.Succeeded)
                {
                    var authClaims = new List<Claim>
                        {
                            new Claim(ClaimTypes.Name, model.UserName),
                            new Claim(JwtRegisteredClaimNames.Jti,Guid.NewGuid().ToString())
                        };
                    var authSigninKey = new SymmetricSecurityKey(Encoding.ASCII.GetBytes(_config["JWT:Secret"]));
                    var token = new JwtSecurityToken(issuer: "jwtissuer", audience: "jwtaudience", expires: DateTime.Now.AddDays(1),
                        claims: authClaims, signingCredentials: new SigningCredentials(authSigninKey, SecurityAlgorithms.HmacSha256Signature));

                    model.JwtToken= new JwtSecurityTokenHandler().WriteToken(token);
                }
            }

            return model;
        }

    }

}
