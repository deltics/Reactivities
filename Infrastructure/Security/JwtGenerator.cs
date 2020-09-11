using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using Application.Interfaces;
using Domain;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using JwtRegisteredClaimNames = Microsoft.IdentityModel.JsonWebTokens.JwtRegisteredClaimNames;


namespace Infrastructure.Security
{
    public class JwtGenerator : IJwtGenerator
    {
        private IConfiguration Configuration { get; }

        
        public JwtGenerator(IConfiguration configuration)
        {
            Configuration = configuration;
        }
        
        
        public string CreateToken(AppUser user)
        {
            // Setup claims
            var claims = new List<Claim>()
            {
                new Claim(JwtRegisteredClaimNames.NameId, user.UserName)
            };
            
            // Generate signing credentials
            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(Configuration["TokenKey"]));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha512Signature);

            // Setup descriptor
            var tokenDescriptor = new SecurityTokenDescriptor()
            {
                Subject = new ClaimsIdentity(claims),
                Expires = DateTime.UtcNow.AddSeconds(30),
//                Expires = DateTime.UtcNow.AddMinutes(10),
                SigningCredentials = creds
            };

            // Create token from descriptor
            var handler = new JwtSecurityTokenHandler();
            var token = handler.CreateToken(tokenDescriptor);

            // FINALLY!  Return the token!
            return handler.WriteToken(token);
        }

        
        public RefreshToken CreateRefreshToken()
        {
            var randomNumber = new byte[32];

            using var rng = RandomNumberGenerator.Create();
            rng.GetBytes(randomNumber);

            return new RefreshToken
            {
                Token = Convert.ToBase64String(randomNumber)
            };
        }
    }
}