using System.Net.Http;
using System.Net.Http.Headers;
using System.Text.Json;
using System.Threading.Tasks;
using Application.Interfaces;
using Application.User;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Options;
using Newtonsoft.Json;

namespace Infrastructure.Security
{
    public class FacebookAccessor : IFacebookAccessor
    {
        private readonly IOptions<FacebookAppSettings> _config;
        private readonly HttpClient _http;


        public FacebookAccessor(IOptions<FacebookAppSettings> config)
        {
            _config = config;

            _http = new HttpClient
            {
                BaseAddress = new System.Uri("https://graph.facebook.com/")
            };

            _http.DefaultRequestHeaders
                .Accept
                .Add(new MediaTypeWithQualityHeaderValue("application/json"));
        }


        public async Task<FacebookUser> FacebookLogin(string userAccessToken)
        {
            // The "inputToken" is the token returned to the user after they authenticate
            //  and authorize access using Facebook.  To VERIFY that token, we pass it to
            //  an Facebook Api endpoint as an INPUT token and we also need to supply
            //  an ACCESS token consisting of our application Id and Secret conjoined with
            //  a pipe (|).
            //
            // This is for ACCESSing the Api to verify the user's access token which is
            //  supplied as an INPUT.

            var apiAccessToken = $"{_config.Value.AppId}|{_config.Value.AppSecret}";

            // Verify token validity with Facebook
            {
                var result =
                    await _http.GetAsync($"debug_token?input_token={userAccessToken}&access_token={apiAccessToken}");

                if (!result.IsSuccessStatusCode)
                    return null;
            }


            // Verify token validity with Facebook
            {
                var result = await GetAsync<FacebookUser>(userAccessToken, "me", "fields=name,email,picture.width(100).height(100)");
                return result;
            }
        }


        public async Task<T> GetAsync<T>(string accessToken, string endPoint, string args)
        {
            var response = await _http.GetAsync($"{endPoint}?access_token={accessToken}&{args}");

            if (!response.IsSuccessStatusCode)
                return default(T);

            var responseJson = await response.Content.ReadAsStringAsync();
            var result = JsonConvert.DeserializeObject<T>(responseJson);
            
            return result;
        }
    }
}