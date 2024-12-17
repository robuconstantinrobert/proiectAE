import React from "react";
import Slider from "react-slick";  // Install react-slick and slick-carousel

const ProductCarousel = ({ images }) => {
    const settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
    };

    return (
        <div className="carousel-container">
            <Slider {...settings}>
                {images.map((image, index) => (
                    <div key={index}>
                        <img src={`http://localhost:5000/${image}`} alt={`Product Image ${index + 1}`} />
                    </div>
                ))}
            </Slider>
        </div>
    );
};

export default ProductCarousel;
