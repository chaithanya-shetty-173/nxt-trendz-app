// Write your code here
import {Component} from 'react'
import Cookies from 'js-cookie'
import {BsStar, BsPlusSquare, BsDashSquare} from 'react-icons/bs'

import Loader from 'react-loader-spinner'
import Header from '../Header'
import SimilarProductItem from '../SimilarProductItem'

import './index.css'

const productItemApiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCEESS',
  failure: 'Failure',
  loading: 'loading',
}

class ProductsItemDetails extends Component {
  state = {
    productItemApiStatus: productItemApiStatusConstants.initial,
    quantity: 1,
    productsItemData: {
      // Initialize the productsItemData with empty properties, including similarProducts
      id: '',
      imageUrl: '',
      title: '',
      price: '',
      description: '',
      availability: '',
      brand: '',
      rating: '',
      similarProducts: [],
      totalReviews: '',
    },
  }

  componentDidMount() {
    this.getProductItemDetailsData()
  }

  snakeToCamel = obj => {
    if (typeof obj !== 'object') {
      return obj // Return as is for non-object types or arrays
    }

    if (Array.isArray(obj)) {
      return obj.map(eachItem => this.snakeToCamel(eachItem))
    }

    const camelObj = {}
    Object.keys(obj).forEach(key => {
      const camelKey = key.replace(/_([a-z])/g, (match, p1) => p1.toUpperCase())
      camelObj[camelKey] = this.snakeToCamel(obj[key])
    })

    return camelObj
  }

  getProductItemDetailsData = async () => {
    this.setState({productItemApiStatus: productItemApiStatusConstants.loading})
    const {match} = this.props
    const {id} = match.params

    const jwtToken = Cookies.get('jwt_token')

    const apiUrl = `https://apis.ccbp.in/products/${id}`
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }
    const response = await fetch(apiUrl, options)

    if (response.ok) {
      const data = await response.json()

      const formatedProductItemDetails = this.snakeToCamel(data)

      this.setState({
        productsItemData: formatedProductItemDetails,
        productItemApiStatus: productItemApiStatusConstants.success,
      })
    } else {
      this.setState({
        productItemApiStatus: productItemApiStatusConstants.failure,
      })
    }
  }

  onHandleDecrease = () => {
    const {quantity} = this.state
    if (quantity === 1) {
      this.setState({quantity: 1})
    } else {
      this.setState(prevState => ({
        quantity: prevState.quantity - 1,
      }))
    }
  }

  onHandleIncrease = () => {
    this.setState(prevState => ({
      quantity: prevState.quantity + 1,
    }))
  }

  renderProductItemDetailsSuccessView = () => {
    const {productsItemData, quantity} = this.state

    const {
      id,
      imageUrl,
      title,
      price,
      description,
      availability,
      brand,
      rating,

      totalReviews,
    } = productsItemData
    const {similarProducts} = productsItemData
    return (
      <div className="extra-container">
        <div className="product-item-details-container">
          <div className="image-container">
            <img src={imageUrl} alt="product" className="product-image" />
          </div>
          <div className="product-info-container">
            <h1 className="product-item-title">{title}</h1>
            <p className="product-price">Rs {price}/-</p>
            <div className="product-rating-review-container">
              <div className="product-review-container">
                <p className="product-rating-value">{rating}</p>
                <BsStar className="rating-star" />
              </div>
              <p className="product-reviews-count"> {totalReviews} Reviews</p>
            </div>
            <p className="product-description">{description}</p>
            <p className="product-item-availability">
              {' '}
              Available:
              <p className="availability-status">{availability}</p>
            </p>
            <p className="product-item-brand">
              Brand:<p className="brand-name">{brand}</p>
            </p>
            <br />
            <div className="product-quantity-container">
              <button
                className="decrease-button"
                type="button"
                onClick={this.onHandleDecrease}
                data-testid="plus"
              >
                <BsDashSquare />
              </button>
              <p className="product-quantity-count">{quantity}</p>
              <button
                className="increase-button"
                type="button"
                onClick={this.onHandleIncrease}
                data-testid="minus"
              >
                <BsPlusSquare />
              </button>
            </div>
            <button className="add-to-cart-button" type="button">
              ADD TO CART
            </button>
          </div>
        </div>
        <div className="similar-products-container">
          <h1 className="similar-products-title">Similar Products</h1>
          <ul className="similar-product-list">
            {similarProducts.map(eachItem => (
              <SimilarProductItem key={eachItem.id} details={eachItem} />
            ))}
          </ul>
        </div>
      </div>
    )
  }

  onClickContinueShopping = () => {
    const {history} = this.props
    history.replace('/products')
  }

  renderProductItemDetailsFailureView = () => (
    <div className="no-product-container">
      <div className="error-view-container">
        <img
          alt="failure view"
          className="error-view-image"
          src="https://assets.ccbp.in/frontend/react-js/nxt-trendz-error-view-img.png "
        />
        <h1 className="error-view-text">Product Not Found</h1>
        <button
          className="continue-shopping-button"
          type="button"
          onClick={this.onClickContinueShopping}
        >
          Continue Shopping
        </button>
      </div>
    </div>
  )

  renderProductItemDetailsLoadingView = () => (
    <div className="product-item-details-loader-container" data-testid="loader">
      <Loader type="ThreeDots" color="#0b69ff" height="50" width="50" />
    </div>
  )

  renderProductItemDetails = () => {
    const {productItemApiStatus} = this.state

    switch (productItemApiStatus) {
      case productItemApiStatusConstants.success:
        return this.renderProductItemDetailsSuccessView()
      case productItemApiStatusConstants.failure:
        return this.renderProductItemDetailsFailureView()
      case productItemApiStatusConstants.loading:
        return this.renderProductItemDetailsLoadingView()
      default:
        return null
    }
  }

  render() {
    return (
      <div className="product-item-details-page">
        <Header />
        {this.renderProductItemDetails()}
      </div>
    )
  }
}
export default ProductsItemDetails
