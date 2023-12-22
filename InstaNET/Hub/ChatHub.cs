using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;
using InstaNET.IServices;
using InstaNET.Models;

namespace InstaNET.Hubs
{
    [AllowAnonymous]
    public class ChatHub:Hub
    {
        public readonly IHomeService IHomeService = null;

        public ChatHub(IHomeService homeService)
        {
            IHomeService = homeService;
        }
        public async Task SendMessage(string user,string touser,string message)
        {
            ChatModel cm=new ChatModel() { FromUser=user,ToUser=touser,Message=message,CreatedOn=DateTime.Now};
            var chatList = await IHomeService.ChatService(cm);
            await Clients.All.SendAsync("ReceiveMessage_"+touser, chatList, message);
        }
    }
}
