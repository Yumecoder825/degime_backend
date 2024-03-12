from django.core.paginator import Paginator
from rest_framework import status, generics
from rest_framework.response import Response
from rest_framework.decorators import permission_classes
from rest_framework.permissions import IsAuthenticated

from shop_app.models import Product
from shop_app.serializers import ProductSerializer


# Product apis
@permission_classes([IsAuthenticated])
class ProductView(generics.GenericAPIView):
    serializer_class = ProductSerializer

    def get(self, request):
        product_id = request.query_params.get('id', None)

        if product_id is None:
            # Get list
            product_list = Product.objects.all()
            try:
                page = request.query_params.get('page', 1)
                per_page = request.query_params.get('per_page', 50)
                paginator = Paginator(product_list, per_page)
                page_obj = paginator.page(page)

                product_serializer = self.get_serializer(page_obj, many=True)

                return Response({
                    'page': page,
                    'per_page': per_page,
                    'total': len(product_list),
                    'items': product_serializer.data,
                },
                    status=status.HTTP_200_OK)
            except:
                pass

            return Response({'error': 'Invalid request'}, status=status.HTTP_400_BAD_REQUEST)

        else:
            # fetch single product
            try:
                product_obj = Product.objects.get(id=product_id)
                print(product_obj)
                product_serializer = self.get_serializer(product_obj)

                return Response(product_serializer.data, status=status.HTTP_200_OK)
            except:
                pass

            return Response({'error': 'Invalid request'}, status=status.HTTP_400_BAD_REQUEST)

    def post(self, request):
        code = request.data.get('code', '')
        try:
            Product.objects.get(code=code)
            return Response({'error': 'Product code is using. Please input another code.'},
                            status=status.HTTP_400_BAD_REQUEST)
        except:
            pass

        product_data = request.data
        product = Product(
            code=product_data['code'],
            title=product_data['title'],
            image_urls=product_data['image_urls'],
            back_image_urls=product_data['back_image_urls'],
            price_without_fee=product_data['price_without_fee'],
            price=product_data['price'],
            stock=product_data['stock'],
            logo_color=product_data['logo_color'],
            description=product_data['description'],
        )
        product.save()

        return Response({'success': True}, status=status.HTTP_201_CREATED)

    def put(self, request):
        code = request.data.get('code', '')
        try:
            product = Product.objects.get(code=code)

            product_id = request.data.get('id', None)
            if product.id == product_id:
                product_data = request.data
                product.code = product_data['code']
                product.title = product_data['title']
                product.image_urls = product_data['image_urls']
                product.back_image_urls = product_data['back_image_urls']
                product.price_without_fee = product_data['price_without_fee']
                product.price = product_data['price']
                product.stock = product_data['stock']
                product.is_new = product_data['is_new']
                product.is_recommended = product_data['is_recommended']
                product.logo_color = product_data['logo_color']
                product.description = product_data['description']

                product.save()

                return Response({'success': True}, status=status.HTTP_200_OK)
        except Exception as e:
            print(e)
            pass
        return Response({'error': 'Invalid input'},
                        status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request):

        product_id = request.query_params.get('id', None)

        try:
            product_obj = Product.objects.get(id=product_id)

            product_obj.delete()

            return Response(status=status.HTTP_204_NO_CONTENT)
        except:
            pass

        return Response({'error': 'Invalid request'}, status=status.HTTP_400_BAD_REQUEST)
