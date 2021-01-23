from django.urls import path
from . import views

urlpatterns = [
    path('', views.all_products, name='products'),
    path('<int:product_id>/', views.product_details, name='product_details'),
    path('add/', views.add_products, name='add_product'),
    path('edit/<int:product_id>/', views.edit_product, name='edit_product'),
    path(
        'delete/<int:product_id>/',
        views.delete_product, name='delete_product'
        ),
    path('services/', views.services, name='services'),
    path(
        'services/<int:service_id>',
        views.service_details, name='service_details'
        ),
    path('addservice/', views.add_service, name='add_service'),
    path(
        'services/editservice/<int:service_id>/',
        views.edit_service, name='edit_service'
        ),
    path(
        'services/delete/<int:service_id>/',
        views.delete_service, name='delete_service'
        ),
]
