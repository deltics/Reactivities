using System;
using Microsoft.AspNetCore.Http;

namespace Application.Interfaces
{
    public interface IPhotoStorage
    {
        (string id, string url) AddPhoto(IFormFile imageFile);
        void DeletePhoto(string id);
    }
}