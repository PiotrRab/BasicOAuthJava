import React, {useEffect, useRef, useState} from 'react';
import {Swiper, SwiperSlide} from "swiper/react";
import {Navigation, Pagination} from "swiper/modules";
import "./photoSlider.scss"
import "swiper/scss";
import "swiper/scss/pagination";
import "swiper/scss/navigation";
import {ReactComponent as nextIcon} from "../../../assets/arrow_forward.svg";
import {ReactComponent as prevIcon} from "../../../assets/arrow_back.svg";
import {serverEstatePhoto} from "../../../photos/PhotosAction";
import Icon from "../icon/Icon";
import Button from "../button/Button";
import classNames from "classnames";


const PhotoSlider = ({
                         photoList,
                         estateId
                     }) => {
    const [imageUrls, setImageUrls] = useState([])
    const prevRef = useRef(null);
    const nextRef = useRef(null);
    const [swiperInstance, setSwiperInstance] = useState(null);
    const [isPaginationActive, setIsPaginationActive] = useState(false);


    useEffect(() => {
        if (photoList.length === 0) return;

        const urls = [];
        let remaining = photoList.length;

        photoList.forEach((photo, index) => {
            serverEstatePhoto(estateId, photo.name, (imageUrl) => {
                urls[index] = imageUrl;
                remaining -= 1;
                if (remaining === 0) {
                    setImageUrls(urls)
                }
            })
        })
    }, [photoList, estateId]);

    useEffect(() => {
        if (swiperInstance && swiperInstance.slides.length > 0) {
            setTimeout(()=>{
                const visibleSlides = Math.floor(
                    swiperInstance.el.clientWidth / swiperInstance.slides[0].clientWidth
                );
                const isPaginationNeeded = swiperInstance.slides.length > visibleSlides;
                setIsPaginationActive(isPaginationNeeded);
            },200)
        }
        if (swiperInstance && prevRef.current && nextRef.current) {
            swiperInstance.params.navigation.prevEl = prevRef.current;
            swiperInstance.params.navigation.nextEl = nextRef.current;
            swiperInstance.navigation.destroy();
            swiperInstance.navigation.init();
            swiperInstance.navigation.update();
        }
    }, [imageUrls,swiperInstance, prevRef.current, nextRef.current]);


    return (
        <div className="photo-slider">
            {isPaginationActive &&
                <Button reference={prevRef} variant="icon">
                    <Icon icon={prevIcon}/>
                </Button>}
            <Swiper
                onSwiper={setSwiperInstance}
                slidesPerView="auto"
                spaceBetween={10}
                pagination={{clickable: true}}
                navigation={true}
                modules={[Pagination, Navigation]}
                className={classNames("ImageSlider", {"no-pagination":!isPaginationActive})}
            >
                {imageUrls.map((imageUrl, index) => {
                    return (
                        <SwiperSlide key={index}>
                            <img className="single-img"
                                 src={imageUrl}
                            />
                        </SwiperSlide>
                    )
                })}
            </Swiper>
            {isPaginationActive &&
                <Button reference={nextRef} variant="icon">
                    <Icon icon={nextIcon}/>
                </Button>}
        </div>

    );
};

export default PhotoSlider;