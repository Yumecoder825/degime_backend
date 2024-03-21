from rest_framework import generics
from .models import Product
from .serializers import ProductSerializer



class ProductSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = '__all__'

    def create(self, validated_data):
        # Check if all required fields are provided
        required_fields = ['product_code', 'product_name', 'front_image', 'back_image', 'logo_color', 'description', 'stock']
        missing_fields = [field for field in required_fields if field not in validated_data]
        if missing_fields:
            raise serializers.ValidationError(f"Missing required fields: {', '.join(missing_fields)}")

        # If all required fields are provided, create the product
        return super().create(validated_data)
