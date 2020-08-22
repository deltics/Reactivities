using System;
using System.Net;
using Application.Exceptions;
using Application.Interfaces;
using CloudinaryDotNet;
using CloudinaryDotNet.Actions;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Options;


namespace Infrastructure.PhotoStorage
{
    public class CloudinaryPhotoStorage : IPhotoStorage
    {
        private readonly Cloudinary _cloudinary;


        public CloudinaryPhotoStorage(IOptions<CloudinarySettings> config)
        {
            var account = new Account(
                config.Value.CloudName,
                config.Value.ApiKey,
                config.Value.ApiSecret
            );
            _cloudinary = new Cloudinary(account);
        }


        public (string id, string url) AddPhoto(IFormFile imageFile)
        {
            if (imageFile == null)
                throw new RESTException(HttpStatusCode.BadRequest, new {file = "No file supplied"});
            
            if (imageFile.Length == 0)
                throw new RESTException(HttpStatusCode.BadRequest, new {file = "File does not contain an image"});

            var result = new ImageUploadResult();

            using (var stream = imageFile.OpenReadStream())
            {
                var uploadParams = new ImageUploadParams
                {
                    File = new FileDescription(imageFile.FileName, stream),
                    Transformation = new Transformation().Height(500).Width(500).Crop("fill").Gravity("face")
                };
                result = _cloudinary.Upload(uploadParams);
            }

            if (result.Error != null)
                throw new RESTException(HttpStatusCode.InternalServerError,
                    new {CloudinaryError = result.Error.Message});

            return (result.PublicId, result.SecureUrl.AbsoluteUri);
        }


        public void DeletePhoto(string id)
        {
            var deleteParams = new DeletionParams(id);

            var result = _cloudinary.Destroy(deleteParams);
            
            if (result.Error != null)
                throw new RESTException(HttpStatusCode.InternalServerError,
                    new {CloudinaryError = result.Error.Message});
        }
    }
}