// Write your code here
import {BsStar} from 'react-icons/bs'
import './index.css'

const SimilarProductItem = props => {
  const {details} = props
  const {imageUrl, title, brand, price, rating} = details
  return (
    <li className="similar-product-item">
      <img
        src={imageUrl}
        alt="similar product"
        className="similar-product-image"
      />
      <p className="similar-products-title-name"> {title}</p>
      <p className="similar-products-brand">by {brand}</p>
      <div className="similar-products-price-container">
        <p className="similar-products-price">Rs {price}/-</p>
        <div className="similar-products-review-container">
          <p className="similar-products-rating-value">{rating}</p>
          <BsStar className="rating-star" />
        </div>
      </div>
    </li>
  )
}

export default SimilarProductItem
