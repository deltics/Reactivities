using System.Threading.Tasks;
using Application.User;

namespace Application.Interfaces
{
    public interface IProfileReader
    {
        Task<Profile> ReadProfile(string username);
    }
}