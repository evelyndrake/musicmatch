import React, { useState, useEffect } from 'react';
import Player from './Player';
import {useSwipeable} from 'react-swipeable';

const Card = ({title, videoId, swipeLeft, swipeRight}) => {
    const [swipeAmount, setSwipeAmount] = useState(0);
    const [swipeAmountY, setSwipeAmountY] = useState(0);
    const [isDragging, setIsDragging] = useState(false);
    const [animateCard, setAnimateCard] = useState(false);
    const swipeThreshold = 200;

    const handlers = useSwipeable({
        onSwiping: (eventData) => {
            setSwipeAmount(eventData.deltaX);
            setSwipeAmountY(eventData.deltaY);
            setIsDragging(true);
        },
        onSwipedLeft: () => {
            if (Math.abs(swipeAmount) > swipeThreshold) { // Check if swipe distance exceeds threshold
                swipeLeft();
            }
            setSwipeAmount(0);
            setSwipeAmountY(0);
            setIsDragging(false);
        },
        onSwipedRight: () => {
            if (Math.abs(swipeAmount) > swipeThreshold) { // Check if swipe distance exceeds threshold
                swipeRight();
            }
            setSwipeAmount(0);
            setSwipeAmountY(0);
            setIsDragging(false);
        },
        onSwiped : () => {
            setSwipeAmount(0);
            setSwipeAmountY(0);
            setIsDragging(false);
            
        },
        preventDefaultTouchmoveEvent: true,
        trackMouse: true
    });

    useEffect(() => {
        setAnimateCard(true);
        console.log('Animating card')
        setTimeout(() => setAnimateCard(false), 500);
    }, [videoId]);


    return (
        <div
            style={{ 
                position: 'relative', 
                pointerEvents: 'auto', 
                cursor: isDragging ? 'grabbing' : 'grab',
                transform: `translateX(${swipeAmount}px) translateY(${swipeAmountY}px) rotate(${swipeAmount / 50}deg)`,
                opacity: Math.max(1 - Math.abs(swipeAmount / (swipeThreshold*4)), 0),
                borderColor: swipeAmount > 0 ? 'green' : 'red',
                borderStyle: (swipeAmount != 0 && Math.abs(swipeAmount) > swipeThreshold) ? 'solid' : 'none',
                transition: isDragging ? 'none' : 'transform 0.2s ease-out' // Smooth transition only when not dragging
            }}
            {...handlers} className={`card ${animateCard ? 'flyIn' : ''}`}>
                <h2 className="title">{title}</h2>
                <Player videoId={videoId} />
                {/* <button onClick={swipeLeft}>Left Swipe</button>
                <button onClick={swipeRight}>Right Swipe</button> */}
        </div>
    );
}

export default Card;