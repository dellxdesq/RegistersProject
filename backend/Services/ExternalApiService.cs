namespace backend.Services
{
    public class ExternalApiService
    {
        private readonly HttpClient _httpClient;
        private readonly string _apiKey;

        public ExternalApiService(IConfiguration config)
        {
            _httpClient = new HttpClient();
            _apiKey = config["ExternalApi:Key"];
        }

        public async Task<string> FetchDataFromGovApiAsync(string endpoint)
        {
            var response = await _httpClient.GetAsync($"{endpoint}?api_key={_apiKey}");
            return await response.Content.ReadAsStringAsync();
        }
    }
}
