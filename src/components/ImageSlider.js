import React, {useState} from 'react'
import styled from "styled-components";
import * as s from "../styles/globalStyles";
import { SliderData } from './SliderData'
import { ArrowLeftCircle } from '@styled-icons/bootstrap'
import { ArrowRightCircle } from '@styled-icons/bootstrap'

const LeftArrow = styled(ArrowLeftCircle)`
  width: 40px;
  height: 40px;
  color: white;
  transition: fill 0.25s;

  &:hover {
    fill: orange;
  }
`;

const RightArrow = styled(ArrowRightCircle)`
  width: 40px;
  height: 40px;
  transition: fill 0.25s;
  color: white;

  &:hover {
    fill: orange;
  }

`;

const ImageSlider = ({slides}) => {

  const [current, setCurrent] = useState(0)
  const length = slides.length

  const nextSlide = () => {
    setCurrent(current === length-1 ? 0 : current + 1)
  }

  const prevSlide = () => {
    setCurrent(current === 0 ? length - 1 : current - 1)
  }

  if (!Array.isArray(slides) || length <= 0) {
    return null;
  }

  return (
    <div>
      <section className="slider">
        <div>
      <s.HeaderButton className="button">
        Rare
      </s.HeaderButton>
      <s.HeaderButton>
        Mythic
      </s.HeaderButton>
      </div>
        <LeftArrow style={{fontSize: "10px"}}className="left-arrow" onClick={prevSlide}/>
        <RightArrow className="right-arrow" onClick={nextSlide}/>
        {SliderData.map((slide, index) => {
          return (
            <div className={index===current?'slide active' : 'slide'} key={index}>
              {index === current && (
                <img src={slide.image} alt="billie" className="image"/>
              )}
            </div>
          )
        })}
      </section>
    </div>
  )
}

export default ImageSlider
