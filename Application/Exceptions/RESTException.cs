using System;
using System.Net;


namespace Application.Exceptions
{
    public class RESTException: Exception
    {
        public HttpStatusCode Code { get; }
        public object Errors { get; }


        public RESTException(HttpStatusCode code, object errors = null)
        {
            Errors = errors;
            Code = code;
        }
    }
}