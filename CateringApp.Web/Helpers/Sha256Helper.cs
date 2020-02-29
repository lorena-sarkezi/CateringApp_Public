using System.Security.Cryptography;
using System.Text;

namespace CateringApp.Web.Helpers
{
    public class Sha256Helper
    {
        public static string GetHash(string str)
        {
            using (SHA256 sha256Hash = SHA256.Create())
            {
                byte[] bytes = sha256Hash.ComputeHash(Encoding.UTF8.GetBytes(str));

                StringBuilder builder = new StringBuilder();
                for (int i = 0; i < bytes.Length; i++)
                {
                    builder.Append(bytes[i].ToString("x2"));
                }
                str = builder.ToString();
            }
            return str;
        }
    }
}