import { hooks } from '@bigcommerce/stencil-utils';
import CatalogPage from './catalog';
import compareProducts from './global/compare-products';
import FacetedSearch from './common/faceted-search';
import CartService from './common/services/cart';

var $el_testBanner = $('#testAddThree'),
    promoItems = {
        "lineItems":[
            {
                "productId": 93,
                "variantId": 54,
                "quantity": 1
            },
            {
                "productId": 86,
                "quantity": 1,
            },
            {
                "productId": 88,
                "quantity": 1,
            }
        ]
      };

export default class Category extends CatalogPage {
    onReady() {
        compareProducts(this.context.urls);

        if ($('#facetedSearch').length > 0) {
            this.initFacetedSearch();
        } else {
            this.onSortBySubmit = this.onSortBySubmit.bind(this);
            hooks.on('sortBy-submitted', this.onSortBySubmit);
        }

        $el_testBanner.bind('click', this.testBannerAddToCart);
    }

    initFacetedSearch() {
        const $productListingContainer = $('#product-listing-container');
        const $facetedSearchContainer = $('#faceted-search-container');
        const productsPerPage = this.context.categoryProductsPerPage;
        const requestOptions = {
            config: {
                category: {
                    shop_by_price: true,
                    products: {
                        limit: productsPerPage,
                    },
                },
            },
            template: {
                productListing: 'category/product-listing',
                sidebar: 'category/sidebar',
            },
            showMore: 'category/show-more',
        };

        this.facetedSearch = new FacetedSearch(requestOptions, (content) => {
            $productListingContainer.html(content.productListing);
            $facetedSearchContainer.html(content.sidebar);

            $('body').triggerHandler('compareReset');

            $('html, body').animate({
                scrollTop: 0,
            }, 100);
        });
    }

    testBannerAddToCart(){
      $el_testBanner.html("Adding to cart. Click again to add 3 more.");

      CartService.easyAddToCart(promoItems)
          .then((cartData)=>{
              var newQty = 0;

              for(var itemType of Object.keys(cartData.lineItems)){
                  for(var i = 0; i < cartData.lineItems[itemType].length; i++){
                      newQty += cartData.lineItems[itemType][i].quantity;
                  }
              }

              $('body').trigger("cart-quantity-update", newQty);

              setTimeout(()=>{
                  $el_testBanner.html("Added to cart. Click again to add 3 more.")
              }, 2000);
          })
          .catch(()=>{
              $el_testBanner.html("Error: did not add to cart. Please contact support.");
          });
    }
}
