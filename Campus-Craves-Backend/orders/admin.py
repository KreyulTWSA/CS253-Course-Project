from django.contrib import admin
from .models import Order, OrderItem

class OrderItemInline(admin.TabularInline):
    model = OrderItem
    extra = 1

class OrderAdmin(admin.ModelAdmin):
    list_display = ('buyer', 'store', 'total_amount', 'status', 'created_at')
    inlines = [OrderItemInline]

admin.site.register(Order, OrderAdmin)
