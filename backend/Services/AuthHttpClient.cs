//Клиент для AuthService
namespace backend.Services
{
    public class AuthHttpClient
    {
        private readonly HttpClient _httpClient;

        public AuthHttpClient(HttpClient httpClient)
        {
            _httpClient = httpClient;
        }

        public async Task<bool> ValidateTokenAsync(string token)
        {
            try
            {
                var response = await _httpClient.GetAsync($"/api/v1/auth/validate?token={Uri.EscapeDataString(token)}");
                if (!response.IsSuccessStatusCode)
                    return false;

                var content = await response.Content.ReadFromJsonAsync<dynamic>();
                return content?.IsValid == true;
            }
            catch
            {
                return false;
            }
        }

        public bool ValidateToken(string token)
        {
            return ValidateTokenAsync(token).GetAwaiter().GetResult();
        }
    }
}
