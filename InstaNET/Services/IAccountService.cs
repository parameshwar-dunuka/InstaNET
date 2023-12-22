using InstaNET.Models;

namespace InstaNET.Services
{
    public interface IAccountService
    {
        Task<SignInModel> LoginService(SignInModel model);
    }
}
