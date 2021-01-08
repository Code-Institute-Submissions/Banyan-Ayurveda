from django.shortcuts import render, get_object_or_404
from django.contrib import messages
from .models import UserProfile
from .forms import  UserProfileForm
from blog.models import Blog
from django.contrib.auth.decorators import login_required
from checkout.models import Order

@login_required
def profile(request):
    """ Display the user's profile. """

    profile = get_object_or_404(UserProfile, user=request.user)

    form = UserProfileForm(instance=profile)
    orders=profile.orders.all().order_by('-purchase_date')
    user_blog = Blog.objects.filter(
            author=request.user).order_by('-publish_date')


    template = 'profiles/profile.html'
    context = {
        'profile': profile,
        'orders': orders,
        'user_blog': user_blog,
    }

    return render(request, template, context)

@login_required
def shipping_info(request):
    """Display User Shipping details"""
    
    template = 'profiles/shipping_info.html'
    profile = get_object_or_404(UserProfile, user=request.user)

    if request.method == 'POST':
        form = UserProfileForm(request.POST, instance=profile)
        if form.is_valid():
            form.save()
            messages.success(
                request, 'Your Shipping details have been updated')

    form = UserProfileForm(instance=profile)

    context = {
        'form': form,
    }

    return render(request, template, context)

@login_required
def order_history(request, order_number):
    order = get_object_or_404(Order, order_number=order_number)

    messages.info(request, (
        f'This is a past confirmation for order number {order_number}. '
        'A confirmation email was sent on the order date.'
    ))

    template = 'checkout/checkout_success.html'
    context = {
        'order': order,
        'from_profile': True,
    }

    return render(request, template, context)

