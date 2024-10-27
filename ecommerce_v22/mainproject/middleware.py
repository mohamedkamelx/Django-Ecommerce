# your_app/middleware.py
from django.http import HttpResponseForbidden

class IPWhitelistMiddleware:
    # List of allowed IP addresses (add your server's IP address here)
    ALLOWED_IPS = ['127.0.0.1', '208.67.222.222']

    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        # Get the IP address of the incoming request
        ip = request.META.get('REMOTE_ADDR')

        # Check if the IP is allowed
        if ip not in self.ALLOWED_IPS:
            return HttpResponseForbidden("Forbidden: Your IP is not allowed.")

        return self.get_response(request)
